# 13. Implementation Roadmap

## Phase 0 — Repository assessment and design approval

Deliver:
- Current architecture and dependency audit.
- Existing route/layout/component inventory.
- Reuse-vs-create matrix.
- Public data model proposal.
- Pricing visibility flow.
- Sitemap and low-fidelity wireframes.
- Risk and open-decision list.

Exit gate: user approves architecture and visual direction before broad implementation.

## Phase 1 — Design foundation

Implement:
- Public layout.
- Theme tokens.
- Typography and responsive container.
- Header/footer.
- Buttons, cards, badges, section headings.
- SEO head helper.
- 404 and empty states.

Exit gate: shell works across all target viewports.

## Phase 2 — Home and marketing pages

Implement:
- Home page sections.
- Features page.
- How-it-works page.
- Templates page.
- About and FAQ.
- Approved content only.

Exit gate: all public content pages render with real product capability status.

## Phase 3 — Interactive demo

Implement:
- Static synthetic sample project.
- Responsive editor/PDF presentation.
- Demo interactions.
- Clear simulation disclaimer.
- No server-side compilation.

Exit gate: demo works without exposing compiler services or loading heavy editor dependencies globally.

## Phase 4 — Pricing and administration

Implement:
- Pricing visibility service.
- Admin settings and plans (reuse existing billing model).
- Conditional nav/footer/home/sitemap.
- Pricing page access guard.
- Cache invalidation.
- Full test matrix.

Exit gate: every pricing edge case passes.

## Phase 5 — Contact and lead handling

Implement:
- Contact form.
- Request validation.
- Rate limiting/spam protection.
- Enquiry persistence and admin inbox.
- Optional queued email notification.
- Retention and privacy controls.

Exit gate: end-to-end form tested with mail configured and unconfigured.

## Phase 6 — SEO, performance and launch hardening

Implement:
- Sitemap/robots/canonical/social metadata.
- Image optimization.
- Lazy loading and code splitting.
- Analytics only if approved.
- Accessibility review.
- Security review.
- Production deployment checklist.

Exit gate: test suite/build pass and launch checklist signed off.

## Suggested milestone order

Do not parallelize foundational layout, pricing domain logic and route architecture before Phase 0 is reviewed. After design approval, visual components and content pages can proceed in parallel with backend pricing/contact work, provided interfaces are agreed.
