# 04 — First-Party Engine Design

## 1. Engine strategy

Build first-party application engines in layers. Keep compatibility tools behind adapters and avoid premature reimplementation of the TeX ecosystem.

## 2. Compilation orchestration engine

Responsibilities:
- Resolve project/root document/compiler/profile.
- Create immutable snapshot.
- Validate paths and source limits.
- Select compiler adapter and pinned worker image.
- Queue, deduplicate, cancel or supersede jobs safely.
- Collect logs, PDF, SyncTeX, auxiliary outputs and metrics.
- Normalize diagnostics.
- Validate and publish artifacts.
- Preserve last successful output.

Illustrative PHP contract:

```php
interface LatexCompilerInterface
{
    public function capabilities(): CompilerCapabilities;

    public function compile(
        CompilationRequest $request
    ): CompilationResult;
}
```

Worker request must be versioned and schema-validated. Never pass a user-controlled shell command. Arguments are constructed from allow-listed compiler options.

## 3. LaTeX language engine

### Initial parser scope
- Control sequences and comments.
- Braces/groups and optional arguments.
- Environment begin/end pairing.
- Math delimiters.
- `\input`, `\include`, `\includegraphics`, bibliography resources.
- `\label`, `\ref`, `\eqref`, `\cite` families.
- `\newcommand` and common macro declarations as metadata, not full expansion.
- Source spans for every token/node.

### Initial diagnostics
- Unmatched braces.
- Unmatched environments.
- Duplicate labels.
- Unresolved labels/citations.
- Missing included files/images/Bib files.
- Likely misspelled commands based on a limited registry.
- Unsupported syntax warning only when confidence is adequate.

### Monaco providers
- CompletionProvider.
- HoverProvider.
- DefinitionProvider.
- ReferenceProvider.
- DocumentSymbolProvider.
- FoldingRangeProvider.
- Diagnostic collection.
- Code actions for safe deterministic fixes.

Do not state that the parser fully understands arbitrary packages, catcodes or macro expansion.

## 4. Mathematical engine

Pipeline:
1. Detect math regions in LaTeX source.
2. Tokenize math commands and operators.
3. Parse expressions into AST.
4. Validate grouping, scripts and environment structure.
5. Normalize nodes.
6. Render through an adapter.
7. Cache by source hash and renderer version.

AST node families:
- Identifier, Number, Text, Operator, Relation.
- Group, Fraction, Radical, Script, Accent.
- Delimiter, Matrix, Cases, AlignedRows.
- Function, LargeOperator, Integral, Sum, Product.
- UnknownCommand / RawMathNode.

Hover preview must be non-blocking, cached and non-destructive. Support inline/display math and common AMS environments first.

## 5. Document intermediate model

The platform-owned IDM should represent:
- Metadata: title, authors, affiliations, abstract, keywords.
- Section hierarchy.
- Paragraphs and inline marks.
- Links, footnotes, citations and references.
- Equations, numbering, labels and cross-references.
- Figures, captions and alt text.
- Tables, merged cells, alignment and captions.
- Algorithms, code blocks and appendices.
- Bibliography entries and citation style metadata.
- RawLaTeX/opaque nodes for unsupported constructs.

A conversion report must classify each structure as preserved, transformed, unsupported or omitted. Do not claim lossless conversion of arbitrary TeX.

## 6. Dependency and package analysis

Index:
- `\input`, `\include`, `\includegraphics`.
- `\documentclass`, `\usepackage`.
- `.bib`, `.bst`, `.sty`, `.cls`.
- Fonts and external assets.
- External tool dependencies.

Initial goal is analysis and deterministic build manifests, not a general CTAN package manager. Avoid runtime package downloads based on untrusted document source.

## 7. Typesetting engine research track

A complete TeX-compatible engine would require:
- TeX tokenization and category-code semantics.
- Macro expansion and conditionals.
- Registers and primitive behavior.
- Box/glue/penalty and list models.
- Paragraph and page breaking.
- Hyphenation.
- Font loading, shaping, metrics and encodings.
- Math atom classes, spacing and layout.
- PDF generation, embedding, links, images and annotations.
- Broad format/package compatibility.

Treat this as a long-term research track. Define a small language subset, test corpus, differential tests and performance criteria before claiming compatibility.

## 8. Typst engine adapter

Typst support should be a separate document-engine family:
- `.typ` files and Typst project model.
- Typst compiler adapter and PDF export.
- Typst language services and diagnostics.
- Shared project dashboard, asset manager, template gallery and collaboration layer.
- Optional conversion between supported LaTeX/IDM/Typst subsets.
- Clearly label conversion limitations.

Do not force LaTeX and Typst into one syntax tree. Share common document abstractions only where semantics genuinely overlap.
