# 08 — Testing, Quality and Compatibility Corpus

## 1. Test pyramid

### Unit
- LaTeX lexer/parser.
- Math parser and AST.
- Path normalization and archive validation.
- Build state machine.
- Diagnostic normalization.
- Revision hashing.
- Conversion mapping.
- Permission policies.
- Provider token handling.

### Feature/integration
- Project CRUD and authorization.
- File upload/move/rename/download.
- Autosave and revision creation.
- Build request and worker dispatch.
- Artifact publishing.
- Last successful PDF retention.
- Git sync and conflict handling.
- Comments and suggestions.
- Conversion and OCR jobs.

### Browser end-to-end
- Create project → edit → save → compile → view PDF.
- Upload ZIP → import → compile.
- Change compiler → compile.
- Invalid source → diagnostic → fix → compile.
- Failed build → verify previous PDF remains.
- Two users edit/comment/review.
- AI proposal → inspect diff → reject/accept.
- Conversion → report → save separate output.

### Security
- Path traversal.
- ZIP bomb.
- Symlink escape.
- Shell escape attempts.
- Network access attempts.
- Environment secret access.
- PID/memory/CPU/time exhaustion.
- IDOR and cross-tenant artifact access.
- OAuth CSRF/state replay.
- Webhook spoofing.
- AI prompt injection/tool abuse.

## 2. Compiler compatibility corpus

Maintain version-controlled test fixtures:
1. Basic article.
2. Multi-file article with `\input` and `\include`.
3. Springer-like journal template.
4. Elsevier-like template.
5. IEEE conference paper.
6. ACM article.
7. Thesis with front matter and appendices.
8. Beamer slides.
9. BibTeX project.
10. BibLaTeX+Biber project.
11. Complex tables (booktabs, multirow, longtable, tabularx).
12. Subfigures and graphicx.
13. TikZ diagrams.
14. PGFPlots charts.
15. Algorithms and listings/minted.
16. Glossaries and nomenclature.
17. MakeIndex.
18. Unicode/multilingual content with XeLaTeX/LuaLaTeX.
19. SVG and EPS image handling.
20. Missing image/reference failure.
21. Malformed environment.
22. Huge image and resource-limit failure.
23. Malicious archive and path traversal.
24. Shell-escape request rejection.

Do not use publisher templates in public distribution unless their licence permits it. Tests can use licensed or synthetic fixtures.

## 3. Conversion test corpus

- DOCX headings/paragraphs/styles.
- Tables and merged cells.
- Images and captions.
- Footnotes/endnotes.
- Inline and display equations.
- Citations and bibliography.
- Headers/footers/page breaks.
- Custom styles and fields.
- LaTeX custom macros and publisher classes.
- Markdown tables/code/math/citations.
- Typst basic structures.

Record preservation and loss explicitly. Never label a conversion lossless unless proven.

## 4. OCR evaluation

Build a held-out test set with:
- Printed textbook formulas.
- Handwritten equations.
- Low-resolution photos.
- Skewed scans.
- Multi-line derivations.
- Matrices and aligned equations.
- Fractions, roots, subscripts/superscripts.
- Greek symbols and unusual operators.

Metrics:
- Exact-match LaTeX rate.
- Normalized expression equivalence where possible.
- Symbol-level error rate.
- Rendered semantic equivalence.
- Latency and peak memory.
- Human correction time.

## 5. Release criteria

Every phase requires:
- Acceptance criteria passed.
- Automated tests.
- Security review.
- Failure/recovery test.
- Performance/resource result if applicable.
- Documentation updated.
- No unresolved critical/high severity defect.
