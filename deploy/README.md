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

