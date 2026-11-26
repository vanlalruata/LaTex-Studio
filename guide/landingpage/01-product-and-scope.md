# 1. Product, Goals and Scope

## 1.1 Objective

Build a polished public website that explains the platform, demonstrates its research-writing workflow, converts interested visitors into sign-ups or enquiries, and gives administrators control over public content and pricing visibility.

The public website is a product-marketing and information layer. It is not the authenticated writing application.

## 1.2 Primary audiences

- Researchers and academic authors writing journal and conference papers.
- Postgraduate students preparing theses and dissertations.
- Faculty members and research groups collaborating on manuscripts.
- Technical authors who need LaTeX, bibliography, figures, tables, and reproducible source projects.
- Institutions evaluating a controlled research-writing environment.
- Existing LaTeX users considering migration from another platform.

## 1.3 Product value proposition

Communicate four central benefits:

1. **Write with control:** a structured project workspace, source editor, templates, and file management.
2. **See what you build:** compilation workflow and PDF preview in one environment.
3. **Work together:** review, comments, version history, and collaboration capabilities as they become available.
4. **Work smarter:** optional AI assistance, conversion, OCR, and visual academic tools with human review.

Do not position AI as an autonomous author or imply that generated research results or citations are guaranteed to be correct.

## 1.4 Website goals

- Explain the product in the first screen.
- Show a believable visual product preview.
- Make core capabilities easy to scan.
- Explain the writing-to-PDF workflow.
- Provide a low-friction route to register, sign in, request a demo, or contact the team.
- Present pricing only when configured and publishable.
- Support future launch announcements, documentation and institutional enquiries.

## 1.5 Scope

### In scope

- Public home page.
- Features overview and feature-detail sections.
- Product workflow / how-it-works section.
- Interactive demo preview.
- Use cases and supported document types.
- Templates showcase.
- Pricing page/section with dynamic visibility.
- About page.
- Contact page and contact submission handling.
- FAQ.
- Documentation/help links (may point to a later documentation portal).
- Privacy policy and terms pages, using approved legal copy.
- Public navigation, footer, responsive menu and CTAs.
- Admin-managed marketing settings, pricing plans and contact enquiries.
- SEO metadata, social preview metadata, sitemap and robots policy.
- Analytics hooks that respect the configured consent/privacy approach.

### Out of scope

- Rebuilding the authenticated editor.
- Implementing compiler workers or a TeX engine.
- Building a full billing/subscription engine if one does not already exist.
- Creating fabricated customer logos, testimonials, ratings, usage statistics or security certifications.
- Publishing unapproved legal statements.
- A full CMS unless the existing project already includes one.
- Creating a fake live compiler in the public demo.

## 1.6 Product capability truthfulness

Before publishing each feature, classify it as:
- `available`: implemented, tested and enabled for users.
- `beta`: implemented but explicitly marked beta.
- `planned`: roadmap item, clearly labelled as planned.
- `disabled`: not shown publicly.

The landing page must not advertise planned features as currently available. Admins should be able to control visibility and status for feature cards.

## 1.7 Conversion goals

Primary CTA should be one of:
- “Get started” if registration is open.
- “Join the waitlist” if registration is closed and waitlist exists.
- “Request access” if access is invitation-only.

Secondary CTA:
- “Explore the demo” or “See how it works”.

Institutional CTA:
- “Contact us” / “Discuss institutional deployment”.

Do not show a CTA that leads to a 404, inactive registration flow, or unconfigured sales inbox.
