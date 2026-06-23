/**
 * Shared fixtures for the MeldEditor stories.
 */
import type { MentionItem } from '@meldui/editor'

/** A small ProseMirror/TipTap JSON document used to seed editor stories. */
export const SAMPLE_DOC = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'MeldEditor' }] },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'A TipTap-based rich-text editor. Type ' },
        { type: 'text', marks: [{ type: 'code' }], text: '/' },
        {
          type: 'text',
          text: ' to open the slash menu, or select text to reveal the bubble menu.',
        },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Tables and images' }] }],
        },
        {
          type: 'listItem',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Mentions and columns' }] },
          ],
        },
        {
          type: 'listItem',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Charts and a drag handle' }] },
          ],
        },
      ],
    },
  ],
}

/** A static directory used by the mention-search story. */
const PEOPLE: MentionItem[] = [
  { id: 'user-1', label: 'Alice Johnson' },
  { id: 'user-2', label: 'Bob Smith' },
  { id: 'user-3', label: 'Carol Williams' },
  { id: 'user-4', label: 'David Brown' },
  { id: 'user-5', label: 'Eve Davis' },
]

/** Resolves mention candidates from the static directory (case-insensitive). */
export async function searchPeople(query: string): Promise<MentionItem[]> {
  const q = query.toLowerCase()
  return PEOPLE.filter((p) => p.label.toLowerCase().includes(q))
}

/** Image-upload stub — returns a local object URL instead of hitting a server. */
export async function uploadImage(file: File): Promise<string> {
  return URL.createObjectURL(file)
}
