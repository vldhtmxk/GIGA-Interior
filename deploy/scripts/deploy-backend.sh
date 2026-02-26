#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./deploy/scripts/deploy-backend.sh /path/to/repo /var/app/backend

REPO_DIR="${1:-$PWD}"
TARGET_DIR="${2:-/var/app/backend}"
JAR_NAME="app.jar"
SERVICE_NAME="giga-backend"

echo "[backend] repo:   ${REPO_DIR}"
echo "[backend] target: ${TARGET_DIR}"

cd "${REPO_DIR}/demo"
./gradlew clean build -x test

mkdir -p "${TARGET_DIR}"

LATEST_JAR="$(ls -1 build/libs/*.jar | grep -v 'plain' | head -n 1)"
if [[ -z "${LATEST_JAR}" ]]; then
  echo "[backend] error: built jar not found"
  exit 1
fi

cp "${LATEST_JAR}" "${TARGET_DIR}/${JAR_NAME}"

echo "[backend] deployed jar -> ${TARGET_DIR}/${JAR_NAME}"
echo "[backend] restarting systemd service: ${SERVICE_NAME}"
sudo systemctl daemon-reload
sudo systemctl restart "${SERVICE_NAME}"
sudo systemctl status "${SERVICE_NAME}" --no-pager -l || true

