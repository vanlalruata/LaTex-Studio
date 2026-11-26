# 9. Data Model and Administration

## 9.1 Inspect before adding tables

Check whether the application already has:
- Settings model/table.
- Pricing/subscription plans.
- Contact/support tickets.
- Feature flags.
- Media library.
- Admin roles/permissions.

Reuse existing models where appropriate. Only create new schema when the repository has no suitable equivalent.

## 9.2 Suggested entities

### Contact enquiries

Fields:
- id
- name
- email
- organization nullable
- role nullable
- category
- subject
- message
- status
- source_page nullable
- privacy_consent_at nullable (only if consent is required)
- handled_by nullable
- handled_at nullable
- timestamps

Consider soft deletion or retention policies consistent with the privacy policy. Do not store unnecessary IP/user-agent data indefinitely.

### Marketing features

Fields:
- id
- title
- slug
- summary
- description
- category
- availability_status (`available`, `beta`, `planned`, `disabled`)
- icon_key from an allowlist
- image_path nullable
- is_featured
- is_public
- sort_order
- timestamps

### Pricing plans

See pricing specification. Reuse billing tables if present.

## 9.3 Admin screens

- Public site settings.
- Feature content/status manager.
- Pricing mode and plan manager.
- Contact enquiries inbox.
- Optional FAQ/template content manager if a CMS is justified.

Admin controls should be simple and auditable. Protect all mutations with server-side authorization.

## 9.4 Audit

Log significant admin changes:
- Pricing mode changed.
- Plan activated/deactivated/published.
- Public feature status changed.
- Public registration mode changed.
- Contact destination changed.
- Marketing content published.

Do not log full contact message bodies in audit metadata.
