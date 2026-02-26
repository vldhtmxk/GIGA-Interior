#!/usr/bin/env bash
set -euo pipefail

# Installs systemd unit templates from repository into /etc/systemd/system.

REPO_DIR="${1:-$PWD}"

sudo cp "${REPO_DIR}/deploy/systemd/giga-backend.service" /etc/systemd/system/giga-backend.service
sudo cp "${REPO_DIR}/deploy/systemd/giga-frontend.service" /etc/systemd/system/giga-frontend.service
sudo systemctl daemon-reload

echo "Installed:"
echo " - /etc/systemd/system/giga-backend.service"
echo " - /etc/systemd/system/giga-frontend.service"
echo
echo "Edit User/Group/EnvironmentFile/WorkingDirectory/ExecStart if needed, then run:"
echo "  sudo systemctl enable --now giga-backend"
echo "  sudo systemctl enable --now giga-frontend"

