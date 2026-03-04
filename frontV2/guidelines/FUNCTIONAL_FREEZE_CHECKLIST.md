# Functional Freeze Checklist (front-end -> frontV2)

## 1) Non-Negotiables (Design-only Migration)
- Keep all user-facing behaviors identical to `front-end`.
- Keep API endpoints, HTTP methods, request/response shapes identical.
- Keep auth flow and storage key behavior identical.
- Keep route paths identical (including dynamic routes).
- Keep validation, error message timing/location, and loading states identical.
- Allow only visual changes: layout, typography, color, spacing, motion.

## 2) Route Parity Baseline

### Public routes from `front-end`
- `/`
- `/about`
- `/portfolio`
- `/portfolio/[id]`
- `/process`
- `/contact`
- `/clients`
- `/recruit`
- `/recruit/[id]`
- `/recruit/apply`
- `/board`
- `/pdf-tools`

### Admin routes from `front-end`
- `/admin/login`
- `/admin`
- `/admin/home`
- `/admin/about`
- `/admin/portfolio`
- `/admin/clients`
- `/admin/recruit`
- `/admin/recruit/[id]/applicants`
- `/admin/recruit/[id]/applicants/[applicantId]`
- `/admin/board`

### Current `frontV2` routes (observed)
- `/`
- `/about`
- `/portfolio`
- `/careers` (path differs from `front-end` recruit paths)
- `/contact`

## 3) API Contract Freeze Baseline

### Public API groups
- Inquiry: `POST /api/inquiries`
- Recruit: `GET /api/recruits`, `GET /api/recruits/:id`
- Applicant: `POST /api/recruits/:recruitId/applicants` (multipart)
- Portfolio: `GET /api/portfolios`, `GET /api/portfolios/:id`
- Clients/Partners: `GET /api/clients`
- About: `GET /api/about`
- Home content: `GET /api/home-content`

### Admin API groups
- Auth: `POST /api/admin/auth/login`, `GET /api/admin/auth/me`, `POST /api/admin/auth/logout`
- Recruits: CRUD + image upload
- Portfolios: CRUD + image upload/delete
- Clients: CRUD + logo upload
- About: CEO update/image, history CRUD
- Home: carousel CRUD/image upload, featured projects update
- Applicants: list/detail/update
- Inquiries: list/detail/update/reply/csv export

## 4) Behavior Freeze Baseline
- Public layout: navbar/footer hidden only on admin paths.
- Admin guard: if token missing/invalid, redirect to `/admin/login`.
- Token storage key usage must stay identical (`env.adminAuthStorageKey`).
- Upload workflows remain multipart and field names unchanged.
- List/detail actions keep current empty/loading/error behavior.

## 5) Immediate Gap Summary (to close before design work scales)
- Missing route parity in `frontV2` for:
  - `/process`, `/clients`, `/board`, `/pdf-tools`
  - `/portfolio/:id`, `/recruit`, `/recruit/:id`, `/recruit/apply`
  - All `/admin/*` routes
- `frontV2` has static placeholder data in major pages; API-bound behavior parity not yet present.
- `frontV2` has route naming mismatch (`/careers` vs recruit route set).

## 6) Step-1 Exit Criteria
- Route table is agreed and frozen.
- API contract list is agreed as immutable.
- A parity checklist is used on every migrated page before merge.
