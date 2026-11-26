# 11. Security and Privacy

## 11.1 Public form security

- CSRF protection.
- Server-side validation.
- Rate limiting.
- Honeypot and/or approved CAPTCHA.
- Length limits for all fields.
- Normalize and safely render content; never render submitted HTML.
- Escape output in admin views.
- Restrict uploaded attachments; preferably do not support attachments in first release.
- Avoid logging message bodies.
- Protect admin enquiry access with policies and permissions.

## 11.2 URL and CTA safety

- Validate external URLs.
- Allow only expected schemes (`https` and optionally `mailto`).
- Prevent open redirects.
- Avoid accepting arbitrary redirect destinations from query parameters.
- Validate social links and pricing CTA targets.

## 11.3 Privacy

- Collect only information needed to respond.
- Publish a reviewed privacy notice.
- Define retention/deletion process for enquiries.
- Do not add marketing newsletter opt-in by default.
- If a mailing list is added, use explicit separate consent and unsubscribe support.
- Do not state that the platform is end-to-end encrypted or certified unless independently verified.

## 11.4 Public exposure

- Public Inertia props must be allowlisted.
- Hidden pricing must not be accessible through JSON props or direct endpoints.
- Admin endpoints must be authenticated and authorized.
- Avoid leaking internal IDs and configuration.
- Keep debug mode disabled in production.
