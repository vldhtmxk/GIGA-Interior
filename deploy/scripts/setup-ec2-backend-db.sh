#!/usr/bin/env bash
set -euo pipefail

# Ubuntu EC2 helper:
# - Creates MySQL database/user
# - Upserts admin_user with bcrypt password
# - Writes /var/app/backend/.env.backend
# - Restarts giga-backend systemd service (if installed)
#
# Example:
#   ./deploy/scripts/setup-ec2-backend-db.sh \
#     --db-name giga \
#     --db-user giga \
#     --db-pass 'StrongDbPass!' \
#     --admin-user admin \
#     --admin-pass 'StrongAdminPass!' \
#     --admin-name '관리자' \
#     --admin-role SUPER_ADMIN \
#     --cors-origin https://your-app.vercel.app \
#     --jwt-secret 'at-least-32-bytes-secret-string'

DB_NAME=""
DB_USER=""
DB_PASS=""
ADMIN_USER=""
ADMIN_PASS=""
ADMIN_NAME="관리자"
ADMIN_ROLE="SUPER_ADMIN"
CORS_ORIGIN=""
JWT_SECRET=""
DB_HOST="127.0.0.1"
DB_PORT="3306"
UPLOAD_DIR="/var/app/uploads"
MYSQL_ROOT_PASSWORD=""

usage() {
  cat <<'EOF'
Usage:
  setup-ec2-backend-db.sh --db-name NAME --db-user USER --db-pass PASS \
    --admin-user USER --admin-pass PASS --cors-origin ORIGIN --jwt-secret SECRET [options]

Required:
  --db-name         MySQL database name
  --db-user         MySQL app user
  --db-pass         MySQL app user password
  --admin-user      admin_user.username
  --admin-pass      plain password to hash as bcrypt
  --cors-origin     APP_CORS_ALLOWED_ORIGINS value (ex: https://xxx.vercel.app)
  --jwt-secret      APP_ADMIN_JWT_SECRET (32+ bytes)

Optional:
  --admin-name      admin_user.name (default: 관리자)
  --admin-role      admin_user.role (default: SUPER_ADMIN)
  --db-host         DB host for Spring (default: 127.0.0.1)
  --db-port         DB port for Spring (default: 3306)
  --upload-dir      APP_UPLOAD_DIR (default: /var/app/uploads)
  --mysql-root-password ROOT_PASS
                   If omitted, script uses sudo mysql (auth_socket)
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --db-name) DB_NAME="$2"; shift 2 ;;
    --db-user) DB_USER="$2"; shift 2 ;;
    --db-pass) DB_PASS="$2"; shift 2 ;;
    --admin-user) ADMIN_USER="$2"; shift 2 ;;
    --admin-pass) ADMIN_PASS="$2"; shift 2 ;;
    --admin-name) ADMIN_NAME="$2"; shift 2 ;;
    --admin-role) ADMIN_ROLE="$2"; shift 2 ;;
    --cors-origin) CORS_ORIGIN="$2"; shift 2 ;;
    --jwt-secret) JWT_SECRET="$2"; shift 2 ;;
    --db-host) DB_HOST="$2"; shift 2 ;;
    --db-port) DB_PORT="$2"; shift 2 ;;
    --upload-dir) UPLOAD_DIR="$2"; shift 2 ;;
    --mysql-root-password) MYSQL_ROOT_PASSWORD="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1"; usage; exit 1 ;;
  esac
done

required_values=("$DB_NAME" "$DB_USER" "$DB_PASS" "$ADMIN_USER" "$ADMIN_PASS" "$CORS_ORIGIN" "$JWT_SECRET")
for v in "${required_values[@]}"; do
  if [[ -z "$v" ]]; then
    usage
    exit 1
  fi
done

if [[ ${#JWT_SECRET} -lt 32 ]]; then
  echo "[error] --jwt-secret must be at least 32 characters."
  exit 1
fi

sql_escape() {
  local s="$1"
  s="${s//\\/\\\\}"
  s="${s//\'/\'\'}"
  printf "%s" "$s"
}

if ! command -v htpasswd >/dev/null 2>&1; then
  echo "[setup] Installing apache2-utils for bcrypt hash generation..."
  sudo apt-get update
  sudo apt-get install -y apache2-utils
fi

if ! command -v mysql >/dev/null 2>&1; then
  echo "[error] mysql client not found. Install mysql-server/mysql-client first."
  exit 1
fi

ADMIN_HASH="$(htpasswd -bnBC 12 "" "$ADMIN_PASS" | tr -d ':\n')"
echo "[setup] Generated bcrypt hash for admin password."

DB_NAME_ESC="$(sql_escape "$DB_NAME")"
DB_USER_ESC="$(sql_escape "$DB_USER")"
DB_PASS_ESC="$(sql_escape "$DB_PASS")"
ADMIN_USER_ESC="$(sql_escape "$ADMIN_USER")"
ADMIN_HASH_ESC="$(sql_escape "$ADMIN_HASH")"
ADMIN_NAME_ESC="$(sql_escape "$ADMIN_NAME")"
ADMIN_ROLE_ESC="$(sql_escape "$ADMIN_ROLE")"

SQL_BOOTSTRAP="
CREATE DATABASE IF NOT EXISTS \`${DB_NAME_ESC}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER_ESC}'@'localhost' IDENTIFIED BY '${DB_PASS_ESC}';
ALTER USER '${DB_USER_ESC}'@'localhost' IDENTIFIED BY '${DB_PASS_ESC}';
GRANT ALL PRIVILEGES ON \`${DB_NAME_ESC}\`.* TO '${DB_USER_ESC}'@'localhost';
FLUSH PRIVILEGES;
"

if [[ -n "$MYSQL_ROOT_PASSWORD" ]]; then
  mysql -u root "-p${MYSQL_ROOT_PASSWORD}" -e "$SQL_BOOTSTRAP"
else
  echo "[setup] Using sudo mysql (auth_socket) for DB/user bootstrap..."
  echo "$SQL_BOOTSTRAP" | sudo mysql
fi

SQL_ADMIN_UPSERT="
INSERT INTO admin_user
(username, password_hash, name, role, is_active, created_at, updated_at)
VALUES
('${ADMIN_USER_ESC}', '${ADMIN_HASH_ESC}', '${ADMIN_NAME_ESC}', '${ADMIN_ROLE_ESC}', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE
password_hash=VALUES(password_hash),
name=VALUES(name),
role=VALUES(role),
is_active=1,
updated_at=NOW();
"

if [[ -n "$MYSQL_ROOT_PASSWORD" ]]; then
  mysql -u root "-p${MYSQL_ROOT_PASSWORD}" "$DB_NAME" -e "$SQL_ADMIN_UPSERT"
else
  echo "$SQL_ADMIN_UPSERT" | sudo mysql "$DB_NAME"
fi

echo "[setup] Admin upsert complete in table: ${DB_NAME}.admin_user"

sudo mkdir -p /var/app/backend "$UPLOAD_DIR"
sudo tee /var/app/backend/.env.backend >/dev/null <<EOF
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080

DB_URL=jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Seoul&characterEncoding=UTF-8
DB_USERNAME=${DB_USER}
DB_PASSWORD=${DB_PASS}

APP_CORS_ALLOWED_ORIGINS=${CORS_ORIGIN}
APP_ADMIN_JWT_SECRET=${JWT_SECRET}
APP_UPLOAD_DIR=${UPLOAD_DIR}

JPA_DDL_AUTO=validate
JPA_SHOW_SQL=false
JPA_FORMAT_SQL=false
EOF

sudo chown ubuntu:ubuntu /var/app/backend/.env.backend
echo "[setup] Wrote /var/app/backend/.env.backend"

if systemctl list-unit-files | grep -q '^giga-backend\.service'; then
  echo "[setup] Restarting giga-backend..."
  sudo systemctl daemon-reload
  sudo systemctl restart giga-backend
  sudo systemctl status giga-backend --no-pager -l || true
else
  echo "[warn] giga-backend.service not found. Install unit first:"
  echo "       ./deploy/scripts/install-systemd.sh /path/to/repo"
fi

echo "[done] EC2 backend+DB setup complete."
