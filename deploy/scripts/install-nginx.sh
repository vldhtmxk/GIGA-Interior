#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./deploy/scripts/install-nginx.sh /path/to/repo
# Then edit server_name and enable site.

REPO_DIR="${1:-$PWD}"

sudo cp "${REPO_DIR}/deploy/nginx/giga.conf" /etc/nginx/sites-available/giga.conf
sudo ln -sf /etc/nginx/sites-available/giga.conf /etc/nginx/sites-enabled/giga.conf
sudo nginx -t
sudo systemctl reload nginx

echo "Installed nginx site template: /etc/nginx/sites-available/giga.conf"
echo "Edit domain names and enable HTTPS (Certbot or ACM/ALB) next."
