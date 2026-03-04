# Deploy Assets

This folder contains Linux (EC2) deployment templates for:
- `systemd` service units
- `nginx` reverse proxy config
- deploy scripts (backend/frontend)
- smoke test script

## Expected Layout on Server
- `/var/app/backend` : Spring Boot jar + backend env
- `/var/app/frontend` : Next.js app source/build + frontend env
- `/var/app/uploads` : uploaded files (persistent path)

## Before Use
- Replace placeholder domains in `nginx/`
- Replace environment file paths in `systemd/`
- Make scripts executable: `chmod +x deploy/scripts/*.sh`

## Quick Setup (Ubuntu EC2 + local MySQL)
Run once on EC2 to:
- create DB/user
- upsert admin account with bcrypt hash
- write `/var/app/backend/.env.backend`
- restart `giga-backend` service (if installed)

```bash
chmod +x deploy/scripts/setup-ec2-backend-db.sh
./deploy/scripts/setup-ec2-backend-db.sh \
  --db-name giga \
  --db-user giga \
  --db-pass 'change-this-db-password' \
  --admin-user admin \
  --admin-pass 'change-this-admin-password' \
  --admin-name '관리자' \
  --admin-role SUPER_ADMIN \
  --cors-origin https://your-app.vercel.app \
  --jwt-secret 'replace-with-32-bytes-or-more-secret'
```

Env template reference:
- `deploy/env/backend.env.example`

No-plaintext alternative (recommended):
```bash
chmod +x deploy/scripts/setup-ec2-backend-db.sh deploy/scripts/run-setup-interactive.sh
./deploy/scripts/run-setup-interactive.sh
```

