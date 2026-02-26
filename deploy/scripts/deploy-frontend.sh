#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./deploy/scripts/deploy-frontend.sh /path/to/repo /var/app/frontend

REPO_DIR="${1:-$PWD}"
TARGET_DIR="${2:-/var/app/frontend}"
SERVICE_NAME="giga-frontend"

echo "[frontend] repo:   ${REPO_DIR}"
echo "[frontend] target: ${TARGET_DIR}"

mkdir -p "${TARGET_DIR}"

rsync -av --delete \
  --exclude node_modules \
  --exclude .next \
  --exclude .git \
  "${REPO_DIR}/front-end/" "${TARGET_DIR}/"

cd "${TARGET_DIR}"
npm ci
npm run build

echo "[frontend] restarting systemd service: ${SERVICE_NAME}"
sudo systemctl daemon-reload
sudo systemctl restart "${SERVICE_NAME}"
sudo systemctl status "${SERVICE_NAME}" --no-pager -l || true

