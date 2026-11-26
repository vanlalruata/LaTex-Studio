# 5. Shapes, Connectors and Geometry

## 5.1 Basic shapes
- Rectangle, rounded rectangle, circle, ellipse.
- Triangle, polygon, regular polygon.
- Diamond, trapezoid, parallelogram.
- Cylinder, cloud, document, folder.
- Star, gear, callout, brace.
- Custom path and freeform polygon.

## 5.2 Paths
- Move-to, line-to, curve-to.
- Cubic Bézier control points.
- Closed paths.
- Smooth corners.
- Rounded corners.
- Path editing handles.
- Fill rules and clipping in supported subset.

## 5.3 Connectors
- Straight connector.
- Orthogonal/elbow connector.
- Curved connector.
- Polyline connector.
- Arrow start/end.
- Multiple arrow tips.
- Connector routing around nodes.
- Attach to node anchors/ports.
- Re-route when nodes move.
- Labels on connectors.
- Dashed/dotted connectors.

## 5.4 Anchors and ports
Support standard node anchors:
- center
- north/south/east/west
- north east/north west/south east/south west
- base and text anchors where applicable
- custom ports

Connector endpoints should reference object ID and anchor, not only fixed canvas coordinates, where possible.

## 5.5 Geometry properties
- Exact x/y.
- Width/height.
- Radius.
- Rotation.
- Corner radius.
- Stroke width.
- Dash pattern.
- Opacity.
- Scale.
- Coordinate transform.
- Relative positioning.

## 5.6 Coordinate helpers
- Named coordinates.
- Relative offsets.
- Polar coordinates.
- Midpoint and interpolation.
- Grid intersections.
- Calc expressions where parser/generator supports them.

Do not claim arbitrary TikZ coordinate expressions are visually editable unless parsed and represented safely.
