# 8. TikZ Code Engine and Round-Tripping

## 8.1 Code editor
Use Monaco with:
- TikZ syntax highlighting.
- Bracket matching.
- Environment folding.
- Search/replace.
- Snippets.
- Command/environment completion from a curated metadata registry.
- Package/library completion.
- Diagnostics from parser and compiler.
- Go to generated object mapping where available.

## 8.2 Typed intermediate representation
Create a versioned scene graph and a TikZ intermediate representation (IR). Keep these separate:
- scene graph: visual objects and geometry
- TikZ IR: representable TikZ commands/scopes/styles
- source map: relation between generated code ranges and object IDs

## 8.3 Generation
- Deterministic source generation.
- Stable object IDs and naming.
- Reusable styles.
- Named coordinates.
- Scope grouping.
- Package/library declarations.
- Configurable indentation.
- Comments for generated sections.
- Source map output.

## 8.4 Import and parsing
Implement a deliberately limited parser for a documented subset:
- `\begin{tikzpicture}` options.
- `\node`.
- `\coordinate`.
- `\draw`, `\fill`, `\filldraw`.
- common paths and edges.
- basic styles.
- common anchors.
- common transformations.
- selected libraries and constructs.

Unsupported macros, custom commands, complex scopes and unknown constructs must be retained as protected source segments.

## 8.5 Synchronization modes
- Visual-native: visual model generates source.
- Hybrid: parsed supported nodes plus protected source blocks.
- Source-only: source editor owns content; visual canvas displays compiled preview or supported read-only representation.

When source is manually changed:
1. Parse into candidate IR.
2. Show changes and unsupported constructs.
3. Ask to apply visual synchronization.
4. Preserve original source and create revision.
5. Never silently discard source.

## 8.6 Parser strategy
Do not use regex as the complete parser. TikZ syntax has nested braces, options, paths and macro expansion. Use a tokenizer and recursive parser for the supported grammar. Document limitations. TeX compilation remains authoritative.
