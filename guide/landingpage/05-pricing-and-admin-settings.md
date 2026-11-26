# 5. Pricing Visibility and Administration

## 5.1 Business rule

Pricing is visible only if all conditions are true:

```text
pricing_visible =
    pricing_mode != "free"
    AND at_least_one_active_public_plan_exists
    AND pricing_page_enabled == true
```

If the admin sets the product to **completely free**, hide:
- Pricing navigation item.
- Pricing footer link.
- Pricing section on home.
- Pricing page from public sitemap.
- Public pricing cards and plan CTAs.

If no active public plans exist, apply the same hiding behaviour even when pricing mode is not free.

The server must be the source of truth. Do not rely on CSS-only hiding.

## 5.2 Suggested settings

- `pricing_mode`: `free` | `paid` | `contact_sales`
- `pricing_page_enabled`: boolean
- `pricing_currency`: ISO 4217 code
- `pricing_tax_note`: optional approved public text
- `pricing_contact_cta_enabled`: boolean
- `pricing_contact_route`: configured route or URL, validated
- `registration_mode`: `open` | `waitlist` | `invite_only` | `closed`
- `public_site_enabled`: boolean
- `contact_form_enabled`: boolean
- `contact_notification_email`: nullable validated address
- `public_brand_name`
- `public_tagline`
- `public_logo_path`
- `public_support_email`: nullable validated address
- `public_social_links`: validated allowlisted URLs
- `public_announcement`: optional text and visibility flag

Store settings in the existing settings mechanism if present. Avoid creating a second competing settings system.

## 5.3 Plan fields

Suggested pricing plan fields:
- `id`
- `name`
- `slug`
- `summary`
- `price_amount` stored in integer minor units (e.g. paise), not floating point
- `currency`
- `billing_interval`: `month`, `year`, `one_time`, `custom`
- `features` JSON with validated structure
- `cta_label`
- `cta_type`: `register`, `contact`, `external`, `none`
- `cta_target` nullable and validated
- `is_active`
- `is_public`
- `sort_order`
- `created_at`, `updated_at`

Use an existing billing model if available; do not duplicate subscription-plan entities without inspecting the codebase.

## 5.4 Visibility query

Create a single domain service or query object, e.g. `PublicPricingVisibility`, that returns:
- `visible`
- `mode`
- `plans`
- optional explanatory mode for frontend rendering

The service must enforce the complete rule in one place. Use it in:
- Public shared Inertia props.
- Home page.
- Pricing page controller.
- Sitemap generation.
- Navigation/footer rendering.

Avoid inconsistent duplicated conditionals.

## 5.5 Admin interface

Authorized administrators should be able to:
- Set free/paid/contact-sales mode.
- Enable/disable public pricing page.
- Create/edit/archive plans.
- Set plan public visibility.
- Reorder plans.
- Preview public presentation.
- Validate currency, amount, billing interval and CTA.
- See a warning when paid mode is selected but no active public plans exist.

Use Laravel Policies and existing role/permission conventions. Never trust a frontend role check; enforce authorization server-side.

## 5.6 Required edge cases

- Free mode with active plans → hidden.
- Paid mode with zero active public plans → hidden.
- Paid mode with inactive plans only → hidden.
- Paid mode with active but private plans only → hidden.
- Paid mode with at least one active public plan and page enabled → visible.
- Contact-sales mode with no plan records → hidden unless an explicit contact-sales pricing presentation is configured. Do not show an empty plan grid.
- Admin changes mode while visitor has cached page → invalidate cache or use correctly versioned cache.
- Direct request to hidden pricing route → deliberate 404/redirect, never leak plan details.

## 5.7 Caching

Cache public plans/settings carefully. Invalidate relevant cache keys on admin updates. Do not cache admin-specific state into public shared props. Ensure free-mode changes take effect promptly.
