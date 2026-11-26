# 9. Rendering, Export and Main Editor Integration

## 9.1 Preview layers
- Canvas preview: immediate interactive representation.
- TikZ source preview: generated source.
- TeX render preview: authoritative compiled output.

Do not confuse the canvas preview with actual TeX rendering.

## 9.2 Rendering pipeline
1. Save immutable figure revision.
2. Generate standalone TeX wrapper or project-integrated source.
3. Resolve approved package/library requirements.
4. Submit to isolated TeX worker.
5. Compile using pinned toolchain.
6. Collect PDF, SVG conversion if configured, logs and diagnostics.
7. Store artifact metadata and checksum.
8. Display rendered output and source revision.

## 9.3 Export formats
- `.tex` TikZ source.
- Standalone `.tex`.
- PDF.
- SVG via validated PDF-to-SVG conversion pipeline.
- PNG via controlled rasterization.
- Optional EPS only if toolchain and workflow require it.
- JSON scene document for re-editing in the platform.

Preserve editable source in every export workflow where possible. PNG/SVG/PDF alone are not substitutes for the source project.

## 9.4 Main editor integration
- Insert `tikzpicture` at cursor.
- Insert `\input{figures/name.tex}`.
- Create external figure source file.
- Generate figure environment with caption and label.
- Configure width/scale/placement.
- Show package requirements.
- Add approved package declarations to preamble.
- Avoid duplicate packages.
- Create source revision before modification.
- Compile manuscript and show diagnostics.

## 9.5 Figure library
- Project-level figure assets.
- Search and tags.
- Preview thumbnails.
- Reuse figure in multiple manuscripts.
- Duplicate and version.
- Store source, scene model and rendered artifacts.
