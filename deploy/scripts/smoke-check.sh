#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./deploy/scripts/smoke-check.sh https://your-domain.com https://api.your-domain.com

WEB_BASE="${1:-http://localhost}"
API_BASE="${2:-http://localhost:8080}"

check() {
  local name="$1"
  local url="$2"
  echo "[check] ${name} -> ${url}"
  curl -fsS -o /dev/null "${url}"
}

check "web home" "${WEB_BASE}/"
check "web about" "${WEB_BASE}/about"
check "web portfolio" "${WEB_BASE}/portfolio"
check "web clients" "${WEB_BASE}/clients"

check "api portfolios" "${API_BASE}/api/portfolios"
check "api recruits" "${API_BASE}/api/recruits"
check "api clients" "${API_BASE}/api/clients"
check "api about" "${API_BASE}/api/about"
check "api home-content" "${API_BASE}/api/home-content"

echo "[check] smoke checks passed"

