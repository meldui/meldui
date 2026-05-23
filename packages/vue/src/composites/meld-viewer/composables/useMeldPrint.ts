/**
 * useMeldPrint — document-only printing for non-PDF renderers.
 *
 * Architecture: instead of `window.print()` (which prints the entire page
 * including app chrome), we create a hidden iframe, load the document into
 * it, and call `iframe.contentWindow.print()`. The browser scopes the print
 * job to the iframe's document only.
 *
 * PDFs go through `@embedpdf/plugin-print` (which auto-injects its own
 * `<PrintFrame>` and bakes annotations into the print job). These helpers
 * only cover the image / text / markdown arms.
 *
 * `cleanupDelay` is a safety pad — once `print()` returns, we wait this long
 * before removing the iframe so the browser has time to finalise the dialog.
 */
import type { DocumentSource } from '../types'

const PRINT_CSS = `
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: white; color: black; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .print-text { font-family: 'SF Mono', Menlo, Consolas, monospace; white-space: pre-wrap; padding: 1.5rem; font-size: 12px; line-height: 1.6; }
  .print-markdown { padding: 2rem; max-width: 70ch; margin: 0 auto; font-size: 12px; line-height: 1.7; }
  .print-image-container { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
  .print-image-container img { max-width: 100%; max-height: 100vh; object-fit: contain; }
  @page { margin: 1cm; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`

const CLEANUP_DELAY_MS = 1000

function createHiddenIframe(): HTMLIFrameElement {
  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;top:-10000px;left:-10000px;width:0;height:0;border:none;'
  iframe.setAttribute('aria-hidden', 'true')
  return iframe
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function buildHtmlDoc(title: string, body: string, extraStyles = ''): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <style>${PRINT_CSS}${extraStyles}</style>
</head>
<body>${body}</body>
</html>`
}

async function waitForIframeLoad(iframe: HTMLIFrameElement, timeoutMs = 5000): Promise<void> {
  return new Promise((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve()
    }
    iframe.addEventListener('load', finish, { once: true })
    setTimeout(finish, timeoutMs)
  })
}

async function printIframe(
  iframe: HTMLIFrameElement,
  cleanup: () => void = () => {},
): Promise<void> {
  try {
    iframe.contentWindow?.focus()
    iframe.contentWindow?.print()
  } finally {
    setTimeout(() => {
      iframe.remove()
      cleanup()
    }, CLEANUP_DELAY_MS)
  }
}

/**
 * Print a same-origin image URL.
 */
export async function printImage(src: string, title = 'Image'): Promise<void> {
  const html = buildHtmlDoc(
    title,
    `<div class="print-image-container"><img src="${escapeHtml(src)}" /></div>`,
  )

  const iframe = createHiddenIframe()
  document.body.appendChild(iframe)
  const doc = iframe.contentDocument || iframe.contentWindow?.document
  if (!doc) {
    iframe.remove()
    throw new Error('Failed to access iframe document')
  }
  doc.open()
  doc.write(html)
  doc.close()
  await waitForIframeLoad(iframe)
  const img = doc.querySelector('img')
  if (img && !img.complete) {
    await new Promise<void>((resolve) => {
      img.onload = () => resolve()
      img.onerror = () => resolve()
      setTimeout(resolve, 3000)
    })
  }
  await printIframe(iframe)
}

/**
 * Print a plain-text source.
 */
export async function printText(content: string, title = 'Document'): Promise<void> {
  const html = buildHtmlDoc(title, `<pre class="print-text">${escapeHtml(content)}</pre>`)
  const iframe = createHiddenIframe()
  document.body.appendChild(iframe)
  const doc = iframe.contentDocument || iframe.contentWindow?.document
  if (!doc) {
    iframe.remove()
    throw new Error('Failed to access iframe document')
  }
  doc.open()
  doc.write(html)
  doc.close()
  await waitForIframeLoad(iframe)
  await printIframe(iframe)
}

/**
 * Print styles applied to the cloned markdown DOM — covers the incremark-
 * rendered output (headings, lists, code fences, tables, blockquotes,
 * links). Adapted from doqo's `print.css`.
 */
const MARKDOWN_PRINT_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 12pt;
    line-height: 1.6;
    color: #000;
    background: #fff;
    padding: 1cm;
  }
  h1, h2, h3, h4, h5, h6 { margin: 1em 0 0.5em; font-weight: 600; line-height: 1.3; }
  h1 { font-size: 24pt; }
  h2 { font-size: 20pt; }
  h3 { font-size: 16pt; }
  h4 { font-size: 14pt; }
  h5 { font-size: 12pt; }
  h6 { font-size: 11pt; }
  p { margin-bottom: 0.75em; }
  pre {
    background: #f5f5f5;
    padding: 12pt;
    border-radius: 4pt;
    overflow-x: auto;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 10pt;
    line-height: 1.5;
    margin: 1em 0;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  code { font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; font-size: 10pt; }
  code:not(pre code) { background: #f0f0f0; padding: 2pt 4pt; border-radius: 2pt; }
  table { width: 100%; border-collapse: collapse; margin: 1em 0; }
  th, td { border: 1px solid #ccc; padding: 8pt; text-align: left; }
  th { background: #f5f5f5; font-weight: 600; }
  ul, ol { margin: 0.5em 0 0.5em 1.5em; }
  ul { list-style: disc; }
  ul ul { list-style: circle; }
  ul ul ul { list-style: square; }
  ol { list-style: decimal; }
  li { margin-bottom: 0.25em; }
  blockquote { border-left: 4px solid #ddd; padding-left: 1em; margin: 1em 0; color: #666; }
  a { color: #000; text-decoration: underline; }
  a[href]:after { content: ' (' attr(href) ')'; font-size: 9pt; color: #666; }
  a[href^="#"]:after, a[href^="javascript"]:after { content: ''; }
  a:has(img):after { content: '' !important; }
  img { max-width: 100%; height: auto; }
  hr { border: none; border-top: 1px solid #ccc; margin: 2em 0; }
  .code-header {
    background: #e8e8e8 !important;
    padding: 6pt 12pt !important;
    border-radius: 4pt 4pt 0 0 !important;
    font-size: 9pt !important;
    font-weight: 600 !important;
    color: #555 !important;
    border-bottom: 1px solid #ccc !important;
  }
  .code-header button, .code-header svg, .code-header img { display: none !important; }
  .code-header + .shiki-wrapper pre,
  .incremark-code pre {
    border-radius: 0 0 4pt 4pt !important;
    margin-top: 0 !important;
  }
  /* Shiki / incremark render code blocks with a dark background + light
     syntax-highlight colors. In print, the dark background is dropped by
     most browsers (background-graphics off by default), leaving light
     pastel text on a near-white page — unreadable. Strip the inline
     token colors so code prints as plain dark text on the light gray
     code-block background. */
  .incremark-code, .incremark-code pre, .incremark-code code {
    background: #f5f5f5 !important;
    color: #1a1a1a !important;
  }
  .incremark-code [style*="color"],
  .incremark-code pre [style*="color"] {
    color: inherit !important;
  }
  .incremark-footnotes-list {
    list-style: none;
    padding-left: 0;
    margin-left: 0;
  }
  .incremark-footnote-item {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5em;
    margin: 0.25em 0;
  }
  .incremark-footnote-content {
    display: flex;
    gap: 0.5em;
    align-items: baseline;
    flex: 1;
  }
  .incremark-footnote-number { font-weight: 600; flex-shrink: 0; }
  .incremark-footnote-body p { margin: 0; }
  .incremark-footnote-backref {
    font-size: 0.9em;
    text-decoration: none;
    color: #666;
    flex-shrink: 0;
  }
  .incremark-footnote-ref a:after,
  .incremark-footnote-backref:after { content: '' !important; }
  @page { margin: 2cm; size: auto; }
  pre, table { page-break-inside: avoid; }
`

/**
 * Print the markdown renderer's rendered DOM. Clones the element into a
 * hidden iframe with a print-friendly stylesheet so the printed output
 * mirrors what the user sees on screen — headings, lists, tables, code
 * fences, links — rather than the raw markdown source.
 */
export async function printMarkdown(element: HTMLElement, title = 'Document'): Promise<void> {
  const clone = element.cloneNode(true) as HTMLElement
  clone
    .querySelectorAll('[data-no-print], .code-header button, .code-header svg')
    .forEach((el) => el.remove())
  const html = buildHtmlDoc(title, clone.outerHTML, MARKDOWN_PRINT_CSS)
  const iframe = createHiddenIframe()
  document.body.appendChild(iframe)
  const doc = iframe.contentDocument || iframe.contentWindow?.document
  if (!doc) {
    iframe.remove()
    throw new Error('Failed to access iframe document')
  }
  doc.open()
  doc.write(html)
  doc.close()
  await waitForIframeLoad(iframe)
  await printIframe(iframe)
}

/**
 * Resolve a {@link DocumentSource} to text content for `printText` / `printMarkdown`.
 */
export async function resolveSourceToText(source: DocumentSource): Promise<string> {
  if (typeof source === 'string') {
    const response = await fetch(source)
    if (!response.ok) throw new Error(`Failed to load source: HTTP ${response.status}`)
    return response.text()
  }
  if (typeof Blob !== 'undefined' && source instanceof Blob) return source.text()
  return new TextDecoder().decode(source as ArrayBuffer)
}
