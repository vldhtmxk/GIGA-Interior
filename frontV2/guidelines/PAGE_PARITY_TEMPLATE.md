# Page Parity Checklist Template

Copy this file per migrated page and fill all sections.

---

## 0) Meta
- Route: 
- Source page (`front-end`): 
- Target page (`frontV2`): 
- Reviewer: 
- Date: 

## 1) Route & Navigation
- [ ] Path is identical.
- [ ] Route params are identical.
- [ ] Entry links and back navigation are identical.
- [ ] Redirect behavior is identical.

Notes:

## 2) Data/API
- [ ] Endpoint path/method unchanged.
- [ ] Query/body keys unchanged.
- [ ] Multipart field names unchanged (if upload exists).
- [ ] Auth header behavior unchanged (if admin page).
- [ ] Success response handling identical.
- [ ] Error response handling identical.

Captured calls:
- Success sample:
- Error sample:
- Edge sample:

## 3) User Actions
- [ ] Primary CTA behavior identical.
- [ ] Secondary actions behavior identical.
- [ ] Create/update/delete side effects identical.
- [ ] Toast/alert/modal behavior identical.

## 4) State Handling
- [ ] Loading state identical.
- [ ] Empty state identical.
- [ ] Error state identical.
- [ ] Disabled/validation-blocked state identical.

## 5) Validation Rules
- [ ] Required fields identical.
- [ ] Length/type/format rules identical.
- [ ] Submit blocking conditions identical.
- [ ] Error text timing/location identical.

## 6) Responsive & Accessibility
- [ ] Mobile flow keeps same functional behavior.
- [ ] Keyboard interaction remains functional.
- [ ] Focus order and dismiss interactions remain functional.

## 7) Evidence
- Baseline screenshots (desktop/mobile):
- `frontV2` screenshots (desktop/mobile):
- Interaction recording:
- Network logs:

## 8) Final Verdict
- [ ] PASS
- [ ] FAIL

Blocking issues:
