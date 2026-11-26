# 12. shadcn-vue UX and Accessibility

## 12.1 Exclusive UI library
Use shadcn-vue as the only UI component system across public site, editor and admin portal. No competing component libraries.

Native semantic HTML is appropriate for page structure. Tailwind CSS 4.1 handles layout and theme styling.

## 12.2 Component mapping
- Button: drawing tools and actions.
- Card: inspector panels and template cards.
- Alert: render/validation messages.
- AlertDialog: delete/replace/overwrite confirmations.
- Dialog: insert figure, rename, template details.
- Sheet: mobile properties/tool panels.
- Input/Textarea/Form: object properties, labels, metadata.
- Select: line style, shape, units, arrow type.
- Checkbox/Switch: grid, snap, visibility, lock.
- Tabs: canvas/source/preview/log.
- Accordion: inspector sections.
- DropdownMenu/ContextMenu: object operations.
- Tooltip: icon-only tools.
- Popover: colour picker, symbol picker, quick settings.
- Badge: render status and source mode.
- ScrollArea: libraries and layer panels.
- Command: command palette.
- Sonner: save/render feedback.
- Skeleton/Progress: loading and render progress.

Inspect installed shadcn-vue components and APIs before use. Do not assume all components are installed.

## 12.3 Accessibility
- Keyboard selection and movement.
- Accessible tool names.
- Visible focus.
- Keyboard-accessible menus and dialogs.
- Screen-reader description of selected object and properties.
- High contrast selection outlines.
- Do not rely on colour alone for object type/status.
- Reduced-motion support.
- Provide source editing as an alternative to pointer-only drawing.

## 12.4 UX details
- Context-sensitive properties.
- Compact/comfortable density.
- Customizable keyboard shortcuts.
- Command palette.
- Clear source mode indicators.
- Explain unsupported TikZ constructs.
- Avoid destructive synchronization without confirmation.
