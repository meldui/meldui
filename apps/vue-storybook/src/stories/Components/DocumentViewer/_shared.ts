/**
 * Shared fixtures for DocumentViewer stories.
 *
 * Storybook is statically served, so PDF demos reference assets in `public/`
 * (copied by the `prepare-assets` script defined in `package.json`).
 */
import { HIGHLIGHT_COLORS, type Annotation, type CommentThread } from '@meldui/vue'

/**
 * Mozilla's classic tracemonkey paper — small (~1 MB), license-clear, perfect
 * for demo purposes. Most EmbedPDF examples use the same URL.
 */
export const SAMPLE_PDF_URL =
  'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'

/**
 * Public path for the bundled PDFium WASM (copied by `pnpm prepare-assets`).
 * Resolved against `document.baseURI` so the asset is fetched relative to the
 * Storybook iframe — works both at the dev root (`localhost:6007`) and under
 * the GitHub Pages subpath (`meldui.github.io/meldui/`). Passing a
 * fully-qualified URL also bypasses PdfViewer's origin-based resolver, which
 * would otherwise strip the subpath.
 */
export const WASM_URL = new URL('pdfium.wasm', document.baseURI).href

/** A short markdown sample for the multi-format demo. */
export const SAMPLE_MARKDOWN = `# DocumentViewer

A reusable document viewer composite for **@meldui/vue**.

## Features

- PDF rendering via EmbedPDF (PDFium WASM)
- Image, plain-text, and markdown rendering
- Native PDF annotations with a programmatic API
- Threaded comments overlay
- Search, outline, thumbnails, print, download, fullscreen
- Keyboard shortcuts and touch gestures

> Phase 1 of the DocumentViewer change in OpenSpec.

## Programmatic API

\`\`\`ts
const viewer = ref<DocumentViewerInstance | null>(null)
await viewer.value?.loadAnnotations(saved)
const exported = await viewer.value?.exportAnnotations()
const buf = await viewer.value?.saveAsCopy()
\`\`\`
`

/**
 * Comprehensive GFM markdown sample covering every node type the markdown
 * renderer should support. Used by the "MarkdownGallery" story to visually
 * verify headings, emphasis, lists, tables, code fences, blockquotes,
 * task lists, images, links, autolinks, strikethrough, inline HTML, and
 * horizontal rules.
 */
export const SAMPLE_MARKDOWN_FULL = `# Heading 1 — Markdown Node Gallery

A comprehensive showcase of every GitHub-Flavored Markdown node the
\`MarkdownViewer\` supports, rendered via \`@incremark/vue\`.

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

---

## Paragraphs and emphasis

A regular paragraph with **bold text**, *italic text*, ***bold italic***,
~~strikethrough~~, and \`inline code\`. You can also combine **bold with
*nested italic*** inside the same span. Trailing spaces force a
hard line break
like this one, which starts a new line without a new paragraph.

A second paragraph follows a blank line. Escaped characters: \\*not italic\\*,
\\\`not code\\\`, and \\# not a heading.

---

## Blockquotes

> A single-level blockquote. Markdown inside a quote still renders:
> **bold**, *italic*, and [a link](https://meldui.dev) all work.

> Nested blockquotes are also supported.
>
> > Second-level quote — note the indentation.
> >
> > > Third-level quote with a \`code span\`.

---

## Lists

### Unordered list

- First item
- Second item
  - Nested item (circle bullet)
    - Deeply nested item (square bullet)
- Third item with **bold** and a [link](https://example.com)

### Ordered list

1. Apples
2. Oranges
   1. Navel
   2. Blood
3. Pears

### Task list (GFM)

- [x] Set up project
- [x] Wire incremark renderer
- [ ] Write more tests
- [ ] Ship to production

### Mixed nesting

1. Outer ordered item
   - Inner unordered
     1. Deeper ordered
        - Even deeper
2. Another outer item

---

## Code

Inline code: \`const x: number = 42\`.

A fenced block with a language hint:

\`\`\`ts
import { ref } from 'vue'
import { DocumentViewer } from '@meldui/vue'

interface Doc { id: string; title: string }

const docs = ref<Doc[]>([])
async function load(): Promise<void> {
  const res = await fetch('/api/docs')
  docs.value = (await res.json()) as Doc[]
}
\`\`\`

A fenced block without a language hint:

\`\`\`
plain text
preformatted
  with leading spaces preserved
\`\`\`

A shell example:

\`\`\`bash
pnpm install
pnpm --filter @meldui/vue build
\`\`\`

An indented (4-space) code block:

    const indented = true
    // also a valid code block

---

## Links and autolinks

Inline link: [MeldUI docs](https://meldui.dev "MeldUI Documentation").

Reference link: [Vue 3][vue-ref].

Autolink: <https://vuejs.org>.

Email autolink: <hello@example.com>.

[vue-ref]: https://vuejs.org "Vue.js — The Progressive JavaScript Framework"

---

## Images

Inline image:

![MeldUI logo placeholder](https://picsum.photos/seed/meldui-md/720/240)

Reference-style image:

![A second placeholder][placeholder-img]

[placeholder-img]: https://picsum.photos/seed/meldui-md-2/720/200 "Reference image"

Linked image (image wrapped in a link):

[![Click to open Vue.js](https://picsum.photos/seed/meldui-md-3/240/120)](https://vuejs.org)

---

## Tables (GFM)

| Feature        | Status | Notes                          |
| -------------- | :----: | ------------------------------ |
| Headings       |   ✅   | All six levels                 |
| Lists          |   ✅   | Ordered, unordered, task lists |
| Tables         |   ✅   | GFM with alignment             |
| Strikethrough  |   ✅   | \`~~text~~\`                     |
| Footnotes      |   ⚠️   | Depends on parser              |

Alignment demo:

| Left aligned | Center aligned | Right aligned |
| :----------- | :------------: | ------------: |
| 100          |      200       |           300 |
| short        |     medium     |      longest  |

---

## Horizontal rules

Three different syntaxes for horizontal rules — all should render as a
single horizontal line:

---

***

___

---

## Inline HTML

Some renderers allow raw HTML:

<sub>subscript</sub>, <sup>superscript</sup>, and a
<kbd>Ctrl</kbd> + <kbd>K</kbd> keyboard shortcut.

<details>
<summary>Click to expand a collapsible section</summary>

This block is inside a \`<details>\` element. It can contain **markdown**
and nested lists:

- One
- Two
- Three

</details>

---

## Footnotes (GFM extension)

Here is a sentence with a footnote reference.[^1] You can also have
named footnotes.[^named]

[^1]: This is the first footnote body.
[^named]: A footnote with a longer body, including \`code\` and **bold**.

---

## Final paragraph

That's every GFM markdown node — headings (H1–H6), paragraphs, emphasis,
blockquotes (nested), lists (ordered, unordered, task, mixed), code
(inline, fenced, indented), links (inline, reference, autolink, email),
images (inline, reference, linked), tables (with alignment),
horizontal rules, inline HTML, and footnotes.
`

export const SAMPLE_TEXT = `EPISODE 1 — "PILOT"

COLD OPEN

[INT. SMITH HOUSE — KITCHEN — NIGHT]

MORTY: Summer, next time we're hiding in a Colorkian echo nest, can you do me a favor and turn your ringer off?
SUMMER: It's called "carpe diem", Morty. Look it up.
MORTY: You look it up! Y-Y-You don't even-You don't even know what it means!
SUMMER: That's because losers look stuff up while the rest of us are carpin' all them diems.
[SUMMER HI-FIVES RICK]
RICK: Listen to your sister, Morty. To live is to risk it all. Otherwise, you're just an inert chunk of randomly assembled molecules drifting wherever the universe blows you. Oh, I'm sorry, Jerry, I didn't see you there. H-How much of that did you hear?
JERRY: All of it. You were looking right at me. I just wanted to say goodbye to the kids.
RICK: Cool. Just stay in the driveway. The killbots are live, and I took you off the whitelist.
[RICK BEGINS USING A SCREWDRIVER ON A GUN]
MORTY: W-We'll see you every other weekend, though, right?
RICK: Absolutely, Morty. A-And your mom's lawyer says if I can get enough in the settlement, he can help me sue for full custody.
MORTY: Th-That'll be nice. Uh, Summer, Dad's leaving!
SUMMER: Bye, Dad. Rick, didn't you say you needed my help on an adventure immediately somewhere else I don't care even if it might kill us?
RICK: I did not, but if you're really that alienated, I'm as willing to exploit it as the next guy, church, army, or Olympic gymnastics trainer.
[RICK SHOOTS OPEN A PORTAL IN THE GROUND]
SUMMER: I'm ready when you a--
[SUMMER JUMPS INTO THE PORTAL AND EXITS]
RICK: Bitch, I was ready yest--
[RICK JUMPS INTO THE PORTAL AND EXITS]
JERRY: Bye, sweetie.
MORTY: Well, I-I better--
JERRY: Sure. Sounds important.
[MORTY JUMPS INTO THE PORTAL AND EXITS] [BETH ENTERS THE GARAGE]
JERRY: If you're looking for our kids, your father did a-a portal, uh--
BETH: Okay.
[BETH EXITS. JERRY BEGINS TO WALK OUT OF THE GARAGE BUT STOPS. SOME LEAVES BLOW IN THE WIND]
WIND: (faint) Loser...
JERRY: What? Hello?

CUT TO:

[EXT. ALIEN DESERT — DAY — CONTINUOUS]

[TRANSITION TO RICK DRIVING SUMMER AND MORTY IN A TURQUOISE CAR THROUGH THE DESERT, BEING CHASED BY OTHER CARS]
RICK: Morty, shoot the mohawk guy!
MORTY: They all have mohawks!
RICK: High fade, chartreuse with cyan highlights, layered on top. Shoot him!
[MORTY LOADS A SHOTGUN AND SHOOTS AT THE VEHICLE BEHIND THEM, BUT MISSES, WHILE MOHAWK GUY JUMPS ONTO THE BACK OF THEIR CAR]
MORTY: Ah, geez, Rick, he's on the car now!
RICK: Just lean back and aim through the sunroof, Morty. We've practiced this. We did a whole drill.
MORTY: That was for the moon people, Rick! You said the moon people!
RICK: Moon people, mohawk people, Morty — it's all the same physics. The bullets don't care about the haircut.

ACT ONE

[INT. SMITH HOUSE — KITCHEN — MORNING — THE NEXT DAY]

BETH: Morty. Honey. Pass the maple syrup.
MORTY: Y-Yeah. Sure, Mom.
JERRY: I was thinking we could all do something as a family this weekend. Like, a real family. Just the four of us.
SUMMER: Four? Did you forget Rick?
JERRY: I did not forget Rick. That is the point.
RICK: (entering) Did somebody say "fun family activity"? Because I have a device in the garage that turns disappointments into hydrogen. You'd love it, Jerry. Real cathartic.
JERRY: I would like one breakfast. ONE breakfast where my contributions are recognized in this house.
BETH: Sweetie, your contributions ARE recognized. We just — we recognize them differently than you do.
JERRY: That's not — that's not a real recognition, Beth.

[CUT TO: MORTY'S BEDROOM — LATER]

MORTY: Geez, Rick. I-I-I can't keep skipping school like this. Mr. Goldenfold is gonna fail me.
RICK: Mr. Goldenfold is a piece of fabric in a meat suit, Morty. His opinion of you is as relevant as a Yelp review of a black hole.
MORTY: Th-That's not — t-that doesn't even make sense, Rick.
RICK: Sense is a societal construct, Morty. It's something stupid people invented to feel smart. Now grab your jacket. We've got a problem on Gazorpazorp Prime and I need someone with a small enough conscience to hold the camera.

[EXT. GAZORPAZORP PRIME — A MARKETPLACE — LATER]

VENDOR: Fresh memory-eels! Get your memory-eels! Forget your worst day for just twelve glorbos!
MORTY: Whoa. R-Rick, is that — is that legal?
RICK: On Gazorpazorp Prime, the legal system is decided by the third loudest guy in any given room. So yes, conditionally, between 4 and 6 PM local time.

[A FIGURE IN A LONG COAT APPROACHES]

FIGURE: Sanchez. You have something that belongs to me.
RICK: Carl. Buddy. I told you, the crystal was a gift. From your wife. Who also gave me a gift, which was--
FIGURE: Don't.
RICK: --a vivid demonstration of why you and her aren't talking anymore.
[CARL DRAWS A WEAPON. RICK DRAWS FASTER]
MORTY: Oh, geez, oh, geez, oh, geez--
RICK: Morty, hold the camera steady. This is the cool part.

ACT TWO

[INT. RICK'S GARAGE — NIGHT]

RICK: All right, Morty. We have eighteen minutes before the embassy figures out we were the ones who set the ambassador's hovercraft on fire. So I'm gonna need you to focus.
MORTY: Y-You set the hovercraft on fire, Rick. I-I was just standing there.
RICK: Morty, "standing there" is the most dangerous thing you can do in this universe. People who stand there are the reason we have things like jury duty, and Belgium, and the concept of an "open mic night."
MORTY: I-I don't think Belgium is — Belgium is a real country, Rick.
RICK: Real is a strong word, Morty. Belgium exists on a technicality. Like a coupon you forgot you had.

[A DOORBELL RINGS]

JERRY: (offscreen) I'll get it!
RICK: Don't get it, Jerry! That's the embassy!
JERRY: (offscreen) It's the embassy, Rick! They say it's urgent!
RICK: (sighing) Morty. Go out the back. Take the suitcase. Don't open the suitcase. Don't talk to anyone wearing a hat. If a child asks you what time it is, lie.

ACT THREE

[EXT. INTERDIMENSIONAL CUSTOMS CHECKPOINT — DAWN]

OFFICER: Purpose of your visit?
RICK: Tourism. We're here to see the famous Tessellated Plains.
OFFICER: There are no Tessellated Plains in this dimension, sir.
RICK: Right. That's what's so famous about them.
OFFICER: ... Move along.

[INT. RICK'S SHIP — MOMENTS LATER]

MORTY: That worked?
RICK: Customs officers, Morty. The most underpaid, overworked, philosophically defeated workforce in any galaxy. They will accept literally any explanation that lets them go home five seconds sooner.
MORTY: Th-That's kind of sad, Rick.
RICK: That's not sad, Morty. That's efficient. Sadness is an inefficiency we agreed to feel because the alternative was admitting we don't have to.

[BEAT]

MORTY: ... I don't get it.
RICK: Yeah. You wouldn't.

END OF EPISODE 1
`

/**
 * Pre-seeded highlight + sticky-note annotations for the "load on open" demo.
 *
 * The highlight rect (`origin` + `size`) and `segmentRects` were captured from
 * the live tracemonkey PDF by running an in-document search for the target
 * phrase and reading back EmbedPDF's text-rect output. That makes the highlight
 * align exactly with the rendered text rather than overshooting onto adjacent
 * lines. Update these coordinates if the demo PDF is ever swapped out.
 */
export const SEEDED_ANNOTATIONS: Annotation[] = [
  {
    id: 'demo-highlight-1',
    type: 'highlight',
    pageIndex: 0,
    rect: { origin: { x: 54.14, y: 351.93 }, size: { width: 142, height: 9 } },
    segmentRects: [{ origin: { x: 54.14, y: 351.93 }, size: { width: 142, height: 9 } }],
    color: HIGHLIGHT_COLORS[0].value,
    opacity: 1,
    selectedText: 'Dynamic languages such as JavaScript',
    author: 'AI Assistant',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-sticky-1',
    type: 'comment',
    pageIndex: 0,
    rect: { origin: { x: 420, y: 560 }, size: { width: 24, height: 24 } },
    contents:
      'This is a pre-seeded comment showing the custom doqo-style pin marker rendered by CommentMarker.',
    author: 'Demo User',
    createdAt: new Date().toISOString(),
  },
]

export const SEEDED_THREADS: CommentThread[] = [
  {
    annotationId: 'demo-highlight-1',
    isResolved: false,
    replies: [
      {
        id: 'reply-1',
        annotationId: 'demo-highlight-1',
        authorUserId: 'demo-user',
        authorName: 'Demo User',
        content: 'This is a pre-seeded reply showing the thread overlay.',
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    annotationId: 'demo-sticky-1',
    isResolved: false,
    replies: [
      {
        id: 'reply-2a',
        annotationId: 'demo-sticky-1',
        authorUserId: 'demo-user',
        authorName: 'Demo User',
        content: 'First reply on the sticky-note thread.',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'reply-2b',
        annotationId: 'demo-sticky-1',
        authorUserId: 'demo-user',
        authorName: 'Demo User',
        content: 'Second reply, so the badge shows "2".',
        createdAt: new Date().toISOString(),
      },
    ],
  },
]

/** Demo user passed to DocumentViewer for comment authorship. */
export const DEMO_USER = {
  id: 'demo-user',
  name: 'Demo User',
  email: 'demo@example.com',
}
