# GIGA Interior Deployment Guide

## 1. Architecture (Current)
- Front-end: Next.js (`front-end`)
- Back-end: Spring Boot + MySQL (`demo`)
- File uploads: local filesystem (`APP_UPLOAD_DIR`) served via `/uploads/**`

## 2. Pre-Deployment Checklist
- Set Spring profile to `prod`
- Set `APP_ADMIN_JWT_SECRET` (32+ bytes)
- Verify admin account password is bcrypt-hashed
- Set DB credentials (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`)
- Set CORS origin (`APP_CORS_ALLOWED_ORIGINS`) to actual domain
- Set `NEXT_PUBLIC_API_BASE_URL` to public API origin
- Confirm upload directory persistence strategy (EBS or S3 migration)
- Confirm SMTP settings if inquiry reply email is used

## 3. Local Production-like Build Test

### Back-end
```powershell
cd demo
.\gradlew.bat clean build
```

### Front-end
```powershell
cd front-end
npm ci
npm run build
```

## 4. Runtime Environment Variables

### Back-end (required in production)
- `SPRING_PROFILES_ACTIVE=prod`
- `SERVER_PORT=8080`
- `DB_URL=jdbc:mysql://...`
- `DB_USERNAME=...`
- `DB_PASSWORD=...`
- `APP_CORS_ALLOWED_ORIGINS=https://your-domain.com`
- `APP_ADMIN_JWT_SECRET=<strong-secret>`

### Back-end (recommended)
- `APP_UPLOAD_DIR=/var/app/uploads`
- `JPA_DDL_AUTO=validate`
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`
- `MAIL_SMTP_AUTH=true`
- `MAIL_SMTP_STARTTLS_ENABLE=true`

### Front-end (required)
- `NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com`
- `NEXT_PUBLIC_ADMIN_AUTH_STORAGE_KEY=giga.admin.auth`
- `NEXT_PUBLIC_ENABLE_MOCK_ADMIN_LOGIN=false`

## 5. Suggested AWS Deployment (Minimum)

### Option A (Fastest / Low Ops)
- EC2 (Spring Boot + Next.js + Nginx)
- RDS MySQL
- EBS for uploads (`APP_UPLOAD_DIR`)

### Option B (Better uploads)
- EC2 (Spring Boot + Next.js + Nginx)
- RDS MySQL
- S3 for uploads (future migration)
- CloudFront for static/upload delivery

## 6. Nginx Reverse Proxy (Example)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name api.your-domain.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 7. Process Management (Recommended)
- Use `systemd` for Spring Boot jar
- Use `systemd` for `next start` (or PM2)
- Ensure restart policy enabled

## 8. Uploads Persistence Warning
- Current uploads are local filesystem based.
- If app is redeployed to a new instance or disk is replaced, uploads can be lost.
- For production durability, either:
  - mount persistent EBS volume and back it up
  - migrate upload storage to S3

## 9. Smoke Test After Deployment
- Public pages: `/`, `/about`, `/portfolio`, `/clients`, `/contact`
- Admin login and `/api/admin/auth/me`
- Portfolio create/edit + image upload
- Recruit create + image upload
- Applicant submission + admin review
- Inquiry submission + admin reply email (if SMTP enabled)
- Uploaded images load from public URLs (`/uploads/...`)

## 10. Rollback Basics
- Keep previous back-end jar and front-end build
- Version environment files separately
- Back up database before schema changes
