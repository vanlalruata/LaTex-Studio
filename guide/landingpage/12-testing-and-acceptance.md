# 12. Testing and Acceptance Criteria

## 12.1 Backend tests

- Public routes return correct Inertia components.
- Public shared props contain only approved fields.
- Feature filtering honours `available`, `beta`, `planned`, `disabled`.
- Pricing visibility follows all required combinations.
- Hidden pricing route returns configured 404/redirect and leaks no plan data.
- Contact validation rejects invalid email, empty/oversized message and invalid category.
- Contact submission persists correctly.
- Rate limit is enforced.
- Notification is queued only when configured.
- Admin endpoints reject unauthorized users.
- Admin can manage settings/plans/features/enquiries according to permissions.

## 12.2 Pricing test matrix

| Pricing mode | Page enabled | Active public plans | Expected |
|---|---:|---:|---|
| free | yes | yes | Hidden |
| free | no | yes | Hidden |
| paid | no | yes | Hidden |
| paid | yes | no | Hidden |
| paid | yes | inactive only | Hidden |
| paid | yes | private only | Hidden |
| paid | yes | at least one | Visible |
| contact_sales | yes | none | Hidden unless explicit configured contact-sales presentation exists |

Also test direct URL access, sitemap, header, footer, home preview and cache invalidation.

## 12.3 Frontend tests

- Navigation links and active states.
- Mobile menu open/close/escape/focus.
- Demo file/tab selection and reset.
- Demo compile simulation is clearly labelled.
- Pricing omitted when hidden.
- Contact form loading, validation, error and success states.
- FAQ keyboard interaction.
- Responsive layout.

## 12.4 Visual QA

Review at:
- 320×640
- 390×844
- 768×1024
- 1024×768
- 1440×900
- 1920×1080

Check:
- No horizontal page overflow.
- No clipped headings or CTA.
- Product mockup remains legible.
- Pricing hidden state leaves no awkward gap.
- Footer and mobile nav are usable.
- Images have stable dimensions.

## 12.5 Accessibility QA

- Keyboard-only walkthrough.
- Screen reader spot-check.
- Contrast checks.
- Reduced-motion check.
- Focus visibility.
- Form error announcements.
- Heading and landmark inspection.

## 12.6 Definition of done

- All public routes implemented and tested.
- Pricing logic centralized and tested.
- Contact workflow complete.
- Responsive design checked at target viewports.
- SEO metadata and sitemap implemented.
- No fabricated claims or dead links.
- Build and tests pass.
- No secrets in client props.
- Admin controls use existing authorization.
- README documents configuration and operational requirements.
