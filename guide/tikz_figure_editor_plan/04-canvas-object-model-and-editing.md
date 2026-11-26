# 4. Canvas Object Model and Editing

## 4.1 Scene graph
Use a typed, versioned scene graph. Do not use raw SVG DOM as the canonical document model.

Each object should have:
- stable ID
- object type
- parent/group ID
- z-index/order
- position and transform
- style references
- geometry data
- text/math content if applicable
- TikZ source mapping metadata
- lock/visibility flags
- accessibility description where relevant

## 4.2 Coordinate systems
Define a clear mapping between:
- canvas screen coordinates
- scene coordinates
- TikZ coordinate units
- document/page units

Support configurable units such as cm, mm, pt and TikZ coordinate scaling. Store canonical geometry in a consistent internal unit and convert deterministically.

## 4.3 Selection
- Single selection.
- Multi-selection.
- Marquee.
- Select by layer.
- Select all.
- Select same type/style.
- Lock and hide.
- Selection outline and resize handles.
- Keyboard navigation.

## 4.4 Transformations
- Move.
- Resize proportionally or freely.
- Rotate by angle.
- Flip horizontally/vertically.
- Scale around center or chosen anchor.
- Set exact coordinates/dimensions in inspector.

## 4.5 Alignment
- Left/center/right.
- Top/middle/bottom.
- Horizontal/vertical distribution.
- Align to page, selection or key object.
- Equal spacing.
- Snap to grid and guides.

## 4.6 Layers and groups
- Nested groups.
- Named layers.
- Reorder layers.
- Hide/lock.
- Background and foreground layers.
- Group transforms.
- Ungroup while preserving positions.

## 4.7 History
Use command-based undo/redo or a well-defined transactional state history. Coalesce continuous drag operations into one history item. Persist checkpoints and revisions without saving every pointer movement.
