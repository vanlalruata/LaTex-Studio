# 4. Page-by-Page Specifications

## 4.1 Home page `/`

Order:
1. Header.
2. Hero with product preview and primary CTA.
3. Concise credibility/value strip (capabilities, not fabricated metrics).
4. “Everything around the writing workflow” feature grid.
5. Editor + PDF preview showcase.
6. AI assistance section, explicitly human-reviewed.
7. Collaboration/review section.
8. Visual academic tools and conversion/OCR section.
9. How it works: Create → Write → Compile → Review → Share/export.
10. Templates/use cases showcase.
11. Interactive demo CTA.
12. Pricing preview only when pricing is publishable.
13. FAQ preview.
14. Final CTA.
15. Footer.

## 4.2 Features `/features`

Organize features into categories:
- Writing environment.
- Typesetting and PDF.
- Research workflow.
- Collaboration.
- AI assistance.
- Visual authoring tools.
- Import/export and integrations.
- Administration and deployment (only if relevant to public target audience).

Each feature entry:
- Name.
- Clear benefit statement.
- 1–2 sentence explanation.
- Availability status.
- Supporting product visual or icon.
- CTA if the feature has a meaningful next step.

Do not expose internal implementation details such as worker image names, Redis queues or server topology in consumer marketing copy.

## 4.3 How it works `/how-it-works`

A visual, numbered workflow:
1. Create a project from a blank workspace or template.
2. Organize source files, figures and bibliography.
3. Write in the LaTeX editor.
4. Compile with the supported engine.
5. Inspect the PDF and diagnostics.
6. Review, collaborate and export.

Explain that compilation can take multiple passes for references and bibliography. Avoid promising a fixed compile time.

## 4.4 Demo `/demo`

- Prominent demo frame.
- Preloaded synthetic sample project.
- Sample tabs: article, thesis, bibliography, figure.
- Editor sample content is read-only unless a safe local interaction is implemented.
- Demo interactions may switch source snippets and preview pages.
- Demo must not call arbitrary server-side compiler commands.
- CTA after demo: create an account or contact the team.

## 4.5 Templates `/templates`

Categories:
- Journal/article.
- Conference paper.
- Thesis/dissertation.
- Report.
- Presentation (only if supported).
- Letter/CV (only if supported).

Each template card should show:
- Template name.
- Intended use.
- Supported engine/class information only when verified.
- Preview thumbnail.
- “Use template” CTA only when the template is available and registration/project creation flow is enabled.

Never use publisher logos or imply publisher endorsement without permission.

## 4.6 Pricing `/pricing`

Only render when pricing is publishable under the rules in `05-pricing-and-admin-settings.md`.

Show:
- Plan name.
- Price and billing period.
- Short target audience.
- Included limits/features.
- CTA.
- Notes on taxes, billing and renewal only if approved by the actual billing policy.

No fake “most popular” badge unless configured. No invented discounts, crossed-out prices or urgency timers.

## 4.7 About `/about`

Explain:
- The product mission.
- Who the platform serves.
- The approach: transparent writing workflow, user control, research productivity.
- Team/institution information only if verified.
- No fabricated founder biographies or claims.

## 4.8 Contact `/contact`

Fields:
- Full name.
- Email.
- Subject/category: General, Product enquiry, Institutional deployment, Technical support, Partnership, Other.
- Message.
- Optional organization and role, if useful.
- Consent checkbox only where legally required and accompanied by clear purpose.

Requirements:
- Server-side validation.
- Rate limiting and spam protection.
- Clear success state.
- Preserve non-sensitive fields on validation errors.
- Do not echo message content into public logs.
- Admin-only enquiry management.
- Email notification to a configured destination; if not configured, store enquiry and show successful receipt without falsely claiming an email was sent.
- Do not expose internal support email unless configured for public display.

## 4.9 FAQ `/faq`

Suggested topics:
- What is the platform?
- Do I need to know LaTeX?
- Which compilers are supported?
- Can I preview a PDF while editing?
- Can I collaborate with co-authors?
- Can I import an existing project?
- How does AI assistance work?
- Are AI edits applied automatically?
- Is there a free plan?
- How is pricing determined?
- Can an institution request deployment?
- Where can I get help?

Answers must reflect actual release state and admin configuration.

## 4.10 Privacy and Terms

Use reviewed legal content. Provide draft placeholders only during development. Do not publish placeholder legal text as final policy. Ensure footer links are present once approved.
