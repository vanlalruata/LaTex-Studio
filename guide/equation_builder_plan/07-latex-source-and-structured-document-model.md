# 7. LaTeX Source and Structured Document Model

## 7.1 Canonical representation
The stored LaTeX source is the final portable representation. For visual-native equations, maintain a structured model to enable editing. For arbitrary source, preserve the raw string.

## 7.2 Model design
Use a versioned model with:
- equation ID and schema version
- content mode
- math mode (inline/display)
- environment type
- AST or structured expression tree when supported
- raw LaTeX source
- protected source segments
- macros/context references
- equation metadata
- package requirements
- source hash
- source revision ID
- diagnostics

## 7.3 AST node types
At minimum:
- Symbol
- Identifier
- Number
- Text
- Operator
- Relation
- Fraction
- Root
- Superscript
- Subscript
- Accent
- Delimiter
- Function
- Binomial
- Matrix
- MatrixRow
- MatrixCell
- Cases
- AlignedGroup
- EquationRow
- Environment
- Label
- Tag
- Spacing
- ProtectedLatex

## 7.4 Parser
- Tokenizer and recursive parser for supported grammar.
- Correct handling of nested braces and command arguments.
- Environment stack validation.
- Source spans for AST nodes.
- Do not use regex as a complete LaTeX parser.
- Preserve comments and unknown constructs.
- Report parse confidence and unsupported nodes.

## 7.5 Serialization
- Deterministic LaTeX output.
- Configurable style conventions.
- Preserve user formatting when editing existing source where feasible.
- Avoid gratuitous normalization.
- Round-trip tests for supported syntax.
