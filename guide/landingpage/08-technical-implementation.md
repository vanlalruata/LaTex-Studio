# 8. Technical Implementation

## 8.1 Repository-first rule

Before implementation:
1. Inspect the existing Laravel project and branch.
2. Read `composer.json`, `package.json`, route files, Inertia setup, Tailwind configuration, auth, settings, permissions and existing UI components.
3. Confirm installed versions rather than blindly upgrading.
4. Identify existing public routes and layouts.
5. Inspect current test conventions and CI.
6. Produce a short repository assessment and list of files to add/change.

Do not overwrite existing project architecture or introduce duplicate settings/auth systems.

## 8.2 Suggested structure

Adapt to existing conventions. Illustrative structure:

```text
app/
  Http/Controllers/PublicSite/
    HomeController.php
    FeatureController.php
    DemoController.php
    PricingController.php
    ContactController.php
  Http/Requests/PublicSite/
    StoreContactEnquiryRequest.php
  Models/
    ContactEnquiry.php
    MarketingFeature.php
    PricingPlan.php
  Services/PublicSite/
    PublicPricingVisibility.php
    PublicSiteSettings.php
resources/
  js/
    layouts/PublicLayout.vue
    components/public/
      PublicHeader.vue
      PublicFooter.vue
      HeroProductPreview.vue
      FeatureCard.vue
      InteractiveDemo.vue
      PricingCard.vue
      ContactForm.vue
    pages/Public/
      Home.vue
      Features.vue
      HowItWorks.vue
      Demo.vue
      Templates.vue
      Pricing.vue
      About.vue
      Contact.vue
      Faq.vue
      Privacy.vue
      Terms.vue
routes/
  web.php (or existing route grouping)
```

## 8.3 Laravel responsibilities

- Public route/controller responses.
- Shared public settings props.
- Pricing visibility policy/service.
- Feature status filtering.
- Contact form validation and storage.
- Rate limiting and optional CAPTCHA integration.
- Admin CRUD through existing admin area.
- SEO metadata and sitemap.
- Cache invalidation after admin content changes.

## 8.4 Inertia/Vue responsibilities

- Shared public layout and navigation.
- Responsive page sections.
- Reusable UI components.
- Demo state and client-side interactions.
- Accessible forms and validation rendering.
- SEO `<Head>` metadata using Inertia's supported API.
- Do not duplicate backend business rules in client-only conditions.

## 8.5 Tailwind CSS 4.1

- Follow Tailwind CSS 4 conventions and the project's existing Vite integration.
- Do not add obsolete Tailwind 3 configuration patterns unless required by existing project setup.
- Centralize theme tokens in the current CSS-first theme approach.
- Prefer semantic component classes and reusable Vue components over long repeated class strings.
- Avoid `@apply` overuse.
- Ensure production build purges unused CSS as expected.

## 8.6 TypeScript

- Type page props and shared public-site data.
- Define explicit types for pricing plans, feature cards, FAQ items and contact form state.
- Avoid `any` where types can be defined.
- Validate server data regardless of TypeScript declarations.

## 8.7 Data delivery

Pass only public fields to Inertia:
- Brand name, tagline, logo URL.
- Registration mode and allowed CTA state.
- Feature cards approved for public display.
- Public plans only if pricing is visible.
- Public social links.
- Contact form availability.
- Public support contact only if configured.

Never pass:
- SMTP credentials.
- OAuth secrets.
- private pricing plans.
- internal admin settings.
- database identifiers not needed by the client.
- private email routing configuration.
- infrastructure details or worker configuration.

## 8.8 Contact flow

1. Visitor submits form.
2. Request validation and normalization.
3. Apply IP/email-based rate limits with privacy-conscious retention.
4. Spam detection / honeypot / CAPTCHA where configured.
5. Persist enquiry.
6. Dispatch notification job only when destination is configured.
7. Show a clear success message.
8. Admin reviews enquiry and changes status.

Suggested statuses: `new`, `in_progress`, `resolved`, `spam`.

## 8.9 Errors and empty states

- Friendly 404 page.
- Contact form unavailable state if disabled.
- Registration unavailable state if closed.
- No empty pricing section.
- No blank templates grid.
- Graceful missing-image fallback.
- Avoid exposing stack traces to visitors.

## 8.10 Integration constraints

- Use named routes and route helpers consistent with the existing application.
- Reuse current authentication registration/login routes.
- Use existing permission middleware/policies for admin.
- Do not introduce a new billing provider as part of this landing page task.
- Avoid external dependencies for simple interactions.
