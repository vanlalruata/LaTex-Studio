# 10. SEO, Performance and Accessibility

## 10.1 SEO

- Unique title and meta description per public page.
- Canonical URL.
- Open Graph and social card metadata.
- Semantic heading structure.
- Descriptive image alt text.
- XML sitemap includes only public, indexable pages.
- Exclude hidden pricing page and private/authenticated routes from sitemap.
- `robots.txt` must not be used as a substitute for authorization.
- Structured data only when accurate (Organization, SoftwareApplication, FAQPage where eligible and valid).
- Do not claim ratings, reviews, price or availability structured data unless factual.

## 10.2 Performance budgets

Targets to validate on representative mobile and desktop:
- Minimize initial JavaScript.
- Lazy-load below-the-fold imagery.
- Use responsive AVIF/WebP images with fallbacks where supported.
- Avoid loading Monaco, PDF.js or full editor dependencies on every public page.
- Defer demo-only heavy dependencies until demo interaction or route.
- Avoid autoplay video.
- Avoid layout shifts from images/fonts.
- Aim for strong Core Web Vitals; measure rather than claim.

## 10.3 Accessibility

Target WCAG 2.2 AA:
- Keyboard navigation.
- Skip-to-content link.
- Focus-visible styles.
- Semantic header/nav/main/footer.
- Form labels, descriptions and validation announcements.
- Accessible mobile navigation.
- Accordions with correct button semantics and expanded state.
- Contrast validation.
- Reduced motion.
- Touch target sizing.
- Screen-reader announcements for demo state changes.

## 10.4 Analytics

If analytics is used:
- Document what is collected and why.
- Respect consent requirements applicable to deployment jurisdictions.
- Do not collect editor source or contact message content as analytics events.
- Use minimal events: CTA click, demo interaction, contact submit, registration start.
- Keep server-side secrets private.
