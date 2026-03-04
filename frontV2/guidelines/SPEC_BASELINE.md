# Spec Baseline (Step 2)

## Goal
`frontV2` must match `front-end` behavior exactly. This document defines what to capture and compare on every page migration.

## A. Baseline Evidence Pack (from `front-end`)

For each route, collect these 4 artifacts before redesign:
- View capture: desktop (1440px) + mobile (390px) screenshots.
- Interaction capture: short screen recording of critical flow.
- Network capture: request list and payload/response samples for the flow.
- State capture: loading, success, empty, and error UI snapshots.

Store per-route artifacts under:
- `frontV2/guidelines/baseline/<route-key>/`

Suggested `<route-key>` naming:
- `home`, `about`, `portfolio-list`, `portfolio-detail`, `process`, `contact`, `clients`, `recruit-list`, `recruit-detail`, `recruit-apply`, `board`, `pdf-tools`
- `admin-login`, `admin-dashboard`, `admin-home`, `admin-about`, `admin-portfolio`, `admin-clients`, `admin-recruit`, `admin-applicants`, `admin-applicant-detail`, `admin-board`

## B. Route Parity Contract

Public routes expected in `frontV2`:
- `/`
- `/about`
- `/portfolio`
- `/portfolio/:id`
- `/process`
- `/contact`
- `/clients`
- `/recruit`
- `/recruit/:id`
- `/recruit/apply`
- `/board`
- `/pdf-tools`

Admin routes expected in `frontV2`:
- `/admin/login`
- `/admin`
- `/admin/home`
- `/admin/about`
- `/admin/portfolio`
- `/admin/clients`
- `/admin/recruit`
- `/admin/recruit/:id/applicants`
- `/admin/recruit/:id/applicants/:applicantId`
- `/admin/board`

## C. Behavior Parity Checks

For every route, verify:
- Same entry/exit routes and redirects.
- Same action results (create/update/delete).
- Same form validation constraints and blocked states.
- Same loading timing/indicator behavior.
- Same error handling and messages.
- Same empty-state behavior.
- Same pagination/filter/sort behavior (if applicable).
- Same auth guard and token handling (admin).

## D. API Parity Checks

Do not change:
- endpoint path
- HTTP method
- query/body key names
- multipart field names
- auth header contract
- success/error parsing behavior

Minimum compare rule per feature:
- one success call sample
- one failure call sample (4xx/5xx)
- one edge-state sample (empty or boundary)

## E. Smoke Test Matrix (manual now, automate next)

Public smoke:
- Home data render
- About content render
- Portfolio list -> detail navigation
- Contact inquiry submit
- Recruit list -> detail -> apply submit

Admin smoke:
- Login success/fail
- Dashboard load
- Recruit CRUD + image upload
- Portfolio CRUD + image upload/delete
- Clients CRUD + logo upload
- About CEO/history update
- Inquiry list/detail/update/reply/csv

## F. Merge Gate (per PR)

A `frontV2` migration PR is mergeable only when:
- Route parity for target page is complete.
- Baseline evidence pack exists for that page.
- Page parity checklist is attached and all required items pass.
- No API contract drift confirmed.
