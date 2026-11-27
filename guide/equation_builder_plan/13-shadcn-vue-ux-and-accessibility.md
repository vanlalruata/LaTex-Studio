# 13. shadcn-vue UX and Accessibility

## 13.1 Exclusive component system
Use shadcn-vue as the only UI component system across public website, editor, portal and admin. Do not add another component library.

Native semantic HTML is allowed for document structure and content. Tailwind CSS 4.1 is used for layout, spacing, responsive behaviour and theming.

## 13.2 Component mapping
- Button: symbol insert, template insert, actions.
- Card: preview and template panels.
- Alert: parse/preview errors and package warnings.
- AlertDialog: replace/delete/restore confirmation.
- Dialog: quick equation builder.
- Sheet: mobile symbol palette and inspector.
- Input: search and equation metadata.
- Textarea: raw LaTeX source where Monaco is not needed.
- Tabs: Symbols, Structures, Templates, Recent, Source, Preview.
- Accordion: symbol categories and inspector groups.
- DropdownMenu: equation environment and export actions.
- Tooltip: symbol names and keyboard shortcuts.
- Popover: symbol variants and quick settings.
- Badge: renderer status and content mode.
- ScrollArea: symbol catalogue.
- Command: searchable command/symbol palette.
- Sonner: save and insertion feedback.
- Skeleton/Progress: preview loading.
- Separator: category and panel separation.

The mathfield and Monaco are specialized editor components, not competing UI libraries. Inspect compatibility and accessibility before integration.

## 13.3 Interaction standards
- Search is keyboard accessible.
- Symbol buttons have spoken names and command descriptions.
- Focus returns to mathfield after symbol insertion.
- Virtual keyboard is optional and configurable.
- All dialog focus is managed.
- No destructive replacement without confirmation.
- Provide keyboard shortcut help.
- Test dark and light themes.
