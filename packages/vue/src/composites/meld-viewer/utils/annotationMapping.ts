/**
 * Annotation mapping — convert between MeldViewer's public
 * {@link MeldAnnotation} discriminated union and EmbedPDF's
 * {@link PdfAnnotationObject} family.
 *
 * MeldViewer's types are designed to be stable in `@meldui/vue`'s public API
 * (consumers serialize/persist them). EmbedPDF's types use a numeric
 * `PdfAnnotationSubtype` enum and slightly different field names. The
 * mappers below keep that boundary clean — if upstream renames a field, we
 * absorb it here rather than in every consumer.
 */
import { type PdfAnnotationObject, PdfAnnotationSubtype } from '@embedpdf/models'
import type { MeldAnnotation, MeldAnnotationType, PdfRect } from '../types'

function toPdfSubtype(type: MeldAnnotationType): PdfAnnotationSubtype {
  switch (type) {
    case 'highlight':
      return PdfAnnotationSubtype.HIGHLIGHT
    case 'underline':
      return PdfAnnotationSubtype.UNDERLINE
    case 'strikeout':
      return PdfAnnotationSubtype.STRIKEOUT
    case 'squiggly':
      return PdfAnnotationSubtype.SQUIGGLY
    case 'free-text':
      return PdfAnnotationSubtype.FREETEXT
    case 'ink':
      return PdfAnnotationSubtype.INK
    case 'comment':
      return PdfAnnotationSubtype.TEXT
    case 'stamp':
      return PdfAnnotationSubtype.STAMP
    case 'signature':
      return PdfAnnotationSubtype.STAMP // EmbedPDF treats signatures as STAMP
    case 'redaction':
      return PdfAnnotationSubtype.REDACT
    case 'square':
      return PdfAnnotationSubtype.SQUARE
    case 'circle':
      return PdfAnnotationSubtype.CIRCLE
    case 'polygon':
      return PdfAnnotationSubtype.POLYGON
    case 'polyline':
      return PdfAnnotationSubtype.POLYLINE
    case 'line':
      return PdfAnnotationSubtype.LINE
  }
}

function fromPdfSubtype(subtype: PdfAnnotationSubtype): MeldAnnotationType | null {
  switch (subtype) {
    case PdfAnnotationSubtype.HIGHLIGHT:
      return 'highlight'
    case PdfAnnotationSubtype.UNDERLINE:
      return 'underline'
    case PdfAnnotationSubtype.STRIKEOUT:
      return 'strikeout'
    case PdfAnnotationSubtype.SQUIGGLY:
      return 'squiggly'
    case PdfAnnotationSubtype.FREETEXT:
      return 'free-text'
    case PdfAnnotationSubtype.INK:
      return 'ink'
    case PdfAnnotationSubtype.TEXT:
      return 'comment'
    case PdfAnnotationSubtype.STAMP:
      return 'stamp'
    case PdfAnnotationSubtype.REDACT:
      return 'redaction'
    case PdfAnnotationSubtype.SQUARE:
      return 'square'
    case PdfAnnotationSubtype.CIRCLE:
      return 'circle'
    case PdfAnnotationSubtype.POLYGON:
      return 'polygon'
    case PdfAnnotationSubtype.POLYLINE:
      return 'polyline'
    case PdfAnnotationSubtype.LINE:
      return 'line'
    default:
      return null
  }
}

function rectToMeld(rect: {
  origin: { x: number; y: number }
  size: { width: number; height: number }
}): PdfRect {
  return {
    origin: { x: rect.origin.x, y: rect.origin.y },
    size: { width: rect.size.width, height: rect.size.height },
  }
}

function toIso(date: Date | undefined): string | undefined {
  return date ? date.toISOString() : undefined
}

function fromIso(iso: string | undefined): Date | undefined {
  return iso ? new Date(iso) : undefined
}

/**
 * Convert a MeldAnnotation to an EmbedPDF PdfAnnotationObject.
 *
 * Used when persisting consumer-supplied annotations or when MeldViewer's
 * programmatic API receives a `createAnnotation` call.
 */
export function meldToPdf(meld: MeldAnnotation): PdfAnnotationObject {
  const base = {
    id: meld.id,
    pageIndex: meld.pageIndex,
    rect: meld.rect,
    author: meld.author,
    created: fromIso(meld.createdAt),
    modified: fromIso(meld.modifiedAt),
    custom: meld.metadata,
  }

  switch (meld.type) {
    case 'highlight':
      return {
        ...base,
        type: PdfAnnotationSubtype.HIGHLIGHT,
        strokeColor: meld.color,
        opacity: meld.opacity,
        segmentRects: meld.segmentRects,
        contents: meld.selectedText,
      } as PdfAnnotationObject

    case 'comment':
      return {
        ...base,
        type: PdfAnnotationSubtype.TEXT,
        contents: meld.contents,
        strokeColor: meld.color,
      } as PdfAnnotationObject

    case 'free-text':
      return {
        ...base,
        type: PdfAnnotationSubtype.FREETEXT,
        contents: meld.contents,
        fontSize: meld.fontSize,
        fontColor: meld.fontColor,
        fontFamily: meld.fontFamily,
        backgroundColor: meld.backgroundColor,
        opacity: meld.opacity,
      } as unknown as PdfAnnotationObject

    case 'ink':
      return {
        ...base,
        type: PdfAnnotationSubtype.INK,
        inkList: meld.inkList,
        strokeColor: meld.color,
        opacity: meld.opacity,
        strokeWidth: meld.strokeWidth,
      } as unknown as PdfAnnotationObject

    case 'stamp':
    case 'signature':
      return {
        ...base,
        type: PdfAnnotationSubtype.STAMP,
        subject: meld.type === 'stamp' ? meld.subject : 'Signature',
      } as unknown as PdfAnnotationObject

    case 'redaction':
      return {
        ...base,
        type: PdfAnnotationSubtype.REDACT,
        fillColor: meld.fillColor,
      } as unknown as PdfAnnotationObject

    default:
      return {
        ...base,
        type: toPdfSubtype((meld as MeldAnnotation).type),
      } as unknown as PdfAnnotationObject
  }
}

/**
 * Convert an EmbedPDF PdfAnnotationObject to a MeldAnnotation.
 *
 * Returns `null` for subtypes MeldViewer does not model (e.g., LINK,
 * SOUND, MOVIE) so callers can skip them silently.
 */
export function pdfToMeld(pdf: PdfAnnotationObject): MeldAnnotation | null {
  const type = fromPdfSubtype(pdf.type)
  if (!type) return null

  const base = {
    id: pdf.id,
    pageIndex: pdf.pageIndex,
    rect: rectToMeld(pdf.rect),
    author: pdf.author,
    createdAt: toIso(pdf.created),
    modifiedAt: toIso(pdf.modified),
    metadata: pdf.custom,
  }

  const anyPdf = pdf as unknown as Record<string, unknown>

  switch (type) {
    case 'highlight':
      return {
        ...base,
        type: 'highlight',
        color: (anyPdf.strokeColor as string) ?? (anyPdf.color as string) ?? '#FFEB3B',
        opacity: (anyPdf.opacity as number) ?? 0.4,
        segmentRects: (anyPdf.segmentRects as PdfRect[]) ?? [base.rect],
        selectedText: anyPdf.contents as string | undefined,
      }

    case 'comment':
      return {
        ...base,
        type: 'comment',
        contents: (anyPdf.contents as string) ?? '',
        color: anyPdf.strokeColor as string | undefined,
      }

    case 'free-text':
      return {
        ...base,
        type: 'free-text',
        contents: (anyPdf.contents as string) ?? '',
        fontSize: (anyPdf.fontSize as number) ?? 12,
        fontColor: (anyPdf.fontColor as string) ?? '#000000',
        fontFamily: anyPdf.fontFamily as string | undefined,
        backgroundColor: anyPdf.backgroundColor as string | undefined,
        opacity: (anyPdf.opacity as number) ?? 1,
      }

    case 'ink':
      return {
        ...base,
        type: 'ink',
        inkList: (anyPdf.inkList as { points: { x: number; y: number }[] }[]) ?? [],
        color: (anyPdf.strokeColor as string) ?? (anyPdf.color as string) ?? '#000000',
        opacity: (anyPdf.opacity as number) ?? 1,
        strokeWidth: (anyPdf.strokeWidth as number) ?? 2,
      }

    case 'stamp':
      return {
        ...base,
        type: 'stamp',
        name: anyPdf.name as string | undefined,
        subject: anyPdf.subject as string | undefined,
      }

    case 'redaction':
      return {
        ...base,
        type: 'redaction',
        pending: true,
        fillColor: anyPdf.fillColor as string | undefined,
      }

    default:
      // Subtypes recognised by EmbedPDF but not yet modelled as a specific
      // MeldAnnotation shape (underline, strikeout, squiggly, square, circle,
      // polygon, polyline, line, signature). Surface them with the base
      // fields only — consumers can still receive them via getAnnotations.
      return null
  }
}
