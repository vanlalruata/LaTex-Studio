# 14. Testing and Acceptance

## 14.1 Symbol catalogue
- Search by glyph, command, alias and spoken name.
- Verify command metadata.
- Check package requirement labels.
- Verify insertion at cursor.
- Test favorites and recent symbols.
- Ensure variant symbols are discoverable.

## 14.2 Structured editor
- Fractions and nested fractions.
- Roots and indexed roots.
- Nested scripts.
- Delimiters.
- Matrices and dynamic row/column editing.
- Cases.
- Aligned equations.
- Multiple environments.
- Text/math mode transitions.
- Undo/redo and selection.

## 14.3 Source round-trip
- Parse supported expressions.
- Serialize deterministically.
- Preserve unknown macros.
- Preserve comments and labels where supported.
- Detect source conflicts.
- Never silently discard unsupported constructs.

## 14.4 Preview tests
- Common math commands.
- Configured MathJax extensions.
- Unsupported commands.
- Undefined macros.
- Malformed input.
- Very large expressions.
- Preview timeout and recovery.
- MathML/accessibility output.

## 14.5 TeX Live integration
Compile a representative test corpus:
- algebra
- calculus
- matrices
- aligned derivations
- cases
- probability/statistics
- physics
- chemistry
- custom macros
- configured package profiles

Check actual compiler output, logs and PDF. Browser preview success is not sufficient.

## 14.6 Manuscript integration
- Inline insertion.
- Display insertion.
- Numbered and unnumbered equations.
- Labels and references.
- Existing selection replacement.
- Revision conflict.
- Package approval.
- Failed build does not damage manuscript or last successful PDF.

## 14.7 Accessibility and performance
- Keyboard-only use.
- Screen-reader symbol descriptions.
- Focus management.
- Touch virtual keyboard.
- Large catalogue search performance.
- Large equation rendering.
