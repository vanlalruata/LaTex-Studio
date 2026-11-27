# 10. Manuscript Integration and Collaboration

## 10.1 Insertion modes
- Inline: `\( ... \)` or `$...$` according to project convention.
- Display: `\[ ... \]` or `$$...$$` according to project convention.
- Numbered equation.
- Unnumbered equation.
- Align/aligned/gather/cases/matrix environment.
- Replace selected equation only after confirmation.

Respect the manuscript's existing delimiter and environment conventions where detectable.

## 10.2 Cursor-safe insertion
1. Capture active file ID and revision.
2. Capture selection/cursor range.
3. Build equation source.
4. Validate source and package requirements.
5. Show insertion preview and diff.
6. Confirm package changes if needed.
7. Check source revision has not changed.
8. Insert at captured range or request conflict resolution.
9. Create immutable revision.
10. Trigger compilation according to user preference.

Never overwrite the entire document when inserting a formula.

## 10.3 Existing equation editing
- Detect selected math region.
- Parse supported expression.
- Open structured mode if confidence is adequate.
- Otherwise open source mode.
- Preserve surrounding delimiters, labels, tags and comments.
- Show diff before replacement.

## 10.4 Equation numbering and references
- Equation labels.
- Tags.
- Number suppression.
- Subequations.
- Cross-reference insertion.
- Duplicate label checks.
- Detect references to missing labels.

## 10.5 Collaboration
- Formula comments linked to equation ID and revision.
- Review notes.
- Version history.
- Restore prior equation revision.
- Project permissions.
- Optional collaborative editing through existing platform collaboration infrastructure.
