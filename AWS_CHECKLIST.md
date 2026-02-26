# AWS Deployment Checklist (EC2 + RDS)

## Networking
- Create VPC/subnets (or use default for MVP)
- Security Group for EC2:
  - `80` (HTTP)
  - `443` (HTTPS)
  - `22` (SSH, restricted IP)
- Security Group for RDS:
  - `3306` only from EC2 security group

## Compute (EC2)
- Install Java 17
- Install Node.js (for Next build/runtime if same host)
- Install Nginx
- Create app directories:
  - `/var/app/backend`
  - `/var/app/frontend`
  - `/var/app/uploads`
- Set `APP_UPLOAD_DIR=/var/app/uploads`

## Database (RDS MySQL)
- Create DB `giga`
- Create app user with least privilege
- Set timezone / charset (`utf8mb4`)
- Backups enabled
- Snapshot before major updates

## Secrets / Config
- Store secrets in SSM Parameter Store or Secrets Manager
- Required secrets:
  - `DB_PASSWORD`
  - `APP_ADMIN_JWT_SECRET`
  - `MAIL_PASSWORD` (if used)
- Disable mock admin login:
  - `NEXT_PUBLIC_ENABLE_MOCK_ADMIN_LOGIN=false`

## TLS / Domain
- Route53 records:
  - `your-domain.com` -> EC2
  - `api.your-domain.com` -> EC2 (or ALB)
- Use Certbot or ACM (if ALB/CloudFront)
- Redirect HTTP -> HTTPS

## App Runtime
- Spring Boot:
  - `SPRING_PROFILES_ACTIVE=prod`
  - `JPA_DDL_AUTO=validate`
- Next.js:
  - `next build`
  - `next start -p 3000`

## Logging / Monitoring (Minimum)
- Nginx access/error logs enabled
- Spring logs to file or journald
- CloudWatch Agent (recommended)
- Disk usage alert for uploads volume

## Backup / Recovery
- RDS automated backups ON
- EBS snapshot plan for uploads (if local file uploads remain)
- Document restore steps (DB + uploads)

## Security Hardening (Minimum)
- Restrict SSH source IP
- Fail2ban or equivalent (optional but recommended)
- OS security updates applied
- Admin initial password stored as bcrypt in DB
- CORS origin locked to real front-end domain only

## Go-Live Smoke Tests
- Admin login
- Portfolio image upload/display
- Recruit image upload/display
- Clients/대표/홈 캐러셀 admin changes reflected on public pages
- Inquiry submit + admin reply email
- 404/500 pages return properly behind Nginx
