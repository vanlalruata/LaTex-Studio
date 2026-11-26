# 2. Information Architecture and Routes

## 2.1 Sitemap

```text
/
├── /features
│   └── feature detail anchors or optional /features/{slug}
├── /how-it-works
├── /demo
├── /templates
├── /pricing                 (only when pricing is publishable)
├── /about
├── /contact
├── /faq
├── /documentation           (external or internal, if available)
├── /privacy
└── /terms

Application routes:
├── /register                (if public registration is enabled)
├── /login
└── authenticated app routes (outside this public-site scope)
```

## 2.2 Navigation

Desktop header:
- Product logo/name.
- Features.
- How it works.
- Templates.
- Pricing — only if `pricing_visible` is true.
- About.
- Sign in.
- Primary CTA.

Mobile:
- Logo and menu trigger.
- Accessible disclosure navigation.
- Close on navigation.
- Focus remains managed and escape closes the menu.
- Pricing item omitted when hidden.

## 2.3 Footer

Columns:
- Product: Features, Demo, Templates, Pricing (conditional).
- Resources: FAQ, Documentation, Getting started.
- Company: About, Contact.
- Legal: Privacy, Terms.
- Social links only when configured and validated.

Include copyright year dynamically. Do not expose private email addresses or internal admin URLs.

## 2.4 Route implementation

Use named Laravel routes and Inertia pages. Prefer explicit controllers or invokable actions over complex route closures for production logic.

Suggested route names:
- `public.home`
- `public.features`
- `public.how-it-works`
- `public.demo`
- `public.templates`
- `public.pricing`
- `public.about`
- `public.contact`
- `public.contact.store`
- `public.faq`
- `public.privacy`
- `public.terms`

If pricing is not publishable, the pricing route should not render a public pricing page. Return a deliberate 404 or redirect to the home page; choose one policy and test it. The header/footer links must also be omitted.

## 2.5 Shared layout

Suggested component hierarchy:
- `PublicLayout.vue`
  - `PublicHeader.vue`
  - page slot
  - `PublicFooter.vue`
  - `CookieConsent.vue` only if required by the analytics/cookie policy
- `SeoHead.vue` or shared Inertia head metadata helper.
- Reusable `SectionHeading`, `FeatureCard`, `Button`, `Container`, `Badge`, `FAQAccordion`, `PricingCard`, `ContactField`.

Use the project's existing component conventions if already established.
