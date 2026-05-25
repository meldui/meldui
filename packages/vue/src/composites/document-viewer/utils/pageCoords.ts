/**
 * Convert a click captured in a page wrapper's CSS frame into canonical PDF
 * coordinates on the *unrotated* page.
 *
 * Why this exists: the page wrapper rendered by PdfViewer is sized to
 * `page.rotatedWidth × page.rotatedHeight` in CSS pixels and visually rotates
 * its content via the EmbedPDF `<Rotate>` transform. `e.clientX/Y − wrapperRect`
 * therefore lands in *rotated-frame CSS pixels*. EmbedPDF's `PdfAnnotationObject.rect`
 * is in *PDF points on the unrotated page* — that's the document space and
 * what the annotation layer projects through the current viewport, which is
 * why seeded highlight rects survive zoom and rotation cleanly. To make our
 * click-to-pin flow do the same we need to undo both transforms:
 *
 *  1. CSS pixels → PDF points (divide by `scale`).
 *  2. Rotated frame → unrotated frame (standard 2D rotation; for 90° / 270°
 *     the unrotated page's width and height are swapped relative to the
 *     wrapper's CSS dimensions).
 *
 * Inputs:
 *  - `click`: pointer position relative to the page wrapper's top-left,
 *    in CSS pixels.
 *  - `rotatedWrapperCssPx`: the wrapper's bounding box in CSS pixels,
 *    matching `page.rotatedWidth/rotatedHeight` after the current zoom.
 *  - `scale`: the page's effective zoom (1 at 100%, 1.5 at 150%, ...). This
 *    is the `currentScale` value tracked by DocumentViewer.
 *  - `rotation`: the page's current rotation in degrees (0 / 90 / 180 / 270).
 *
 * Output is a point in PDF points on the unrotated page, ready to drop into
 * `PdfAnnotationObject.rect.origin`.
 */
export function pageClickToPdfCoord(
  click: { x: number; y: number },
  rotatedWrapperCssPx: { width: number; height: number },
  scale: number,
  rotation: 0 | 90 | 180 | 270,
): { x: number; y: number } {
  // 1. CSS pixels → PDF points (still in the rotated frame)
  const rx = click.x / scale
  const ry = click.y / scale
  const rW = rotatedWrapperCssPx.width / scale
  const rH = rotatedWrapperCssPx.height / scale
  // 2. Rotated frame → canonical (unrotated) PDF coords
  switch (rotation) {
    case 90:
      return { x: ry, y: rW - rx }
    case 180:
      return { x: rW - rx, y: rH - ry }
    case 270:
      return { x: rH - ry, y: rx }
    default:
      return { x: rx, y: ry }
  }
}
