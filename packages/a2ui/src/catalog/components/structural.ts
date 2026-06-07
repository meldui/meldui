import { common } from '../common'
import type { ComponentDefs } from '../../types'

/**
 * MeldUI structural & display components, added to the same catalog as the
 * Basic primitives. Mostly display-only, which makes them reliable for LLMs to
 * emit. Authored in the same A2UI v0.9 style (shared `$defs` via `common()`).
 */
export const structuralComponents: ComponentDefs = {
  Avatar: {
    description: 'A user/entity avatar showing an image with a text fallback (e.g. initials).',
    properties: {
      src: { ...common('DynamicString'), description: 'URL of the avatar image.' },
      alt: { ...common('DynamicString'), description: 'Accessibility text for the avatar.' },
      fallback: {
        ...common('DynamicString'),
        description: 'Text shown when no image is available (e.g. initials).',
      },
      size: {
        type: 'string',
        description: 'A hint for the avatar size.',
        enum: ['sm', 'md', 'lg'],
        default: 'md',
      },
    },
  },

  AvatarGroup: {
    description: 'A horizontally overlapping group of Avatar components.',
    properties: {
      children: {
        ...common('ChildList'),
        description: 'The Avatar components to group, referenced by ID.',
      },
      max: {
        type: 'number',
        description: 'Maximum avatars to show before collapsing the rest into a "+N" badge.',
      },
      size: {
        enum: ['sm', 'md', 'lg'],
        description:
          'Uniform size for every avatar and the "+N" badge, so the whole group scales together. Defaults to the base avatar size.',
      },
    },
    required: ['children'],
  },

  Kbd: {
    description: 'Renders one or more keyboard keys (e.g. ["Ctrl", "K"]).',
    properties: {
      keys: {
        ...common('DynamicStringList'),
        description: 'The keyboard keys to display, in order.',
      },
    },
    required: ['keys'],
  },

  Alert: {
    description: 'A callout banner conveying status or an important message.',
    properties: {
      title: { ...common('DynamicString'), description: 'The alert title.' },
      description: { ...common('DynamicString'), description: 'The alert body text.' },
      variant: {
        type: 'string',
        description: 'The severity/intent of the alert.',
        enum: ['info', 'success', 'warning', 'destructive'],
        default: 'info',
      },
    },
  },

  Badge: {
    description: 'A small status/label chip.',
    properties: {
      label: { ...common('DynamicString'), description: 'The badge text.' },
      variant: {
        type: 'string',
        description: 'A hint for the badge style.',
        enum: ['default', 'secondary', 'destructive', 'success', 'warning', 'info', 'neutral'],
        default: 'default',
      },
    },
    required: ['label'],
  },

  Stepper: {
    description: 'A sequence of ordered steps with a current active step.',
    properties: {
      steps: {
        type: 'array',
        description: 'The ordered steps.',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            title: { ...common('DynamicString'), description: 'The step title.' },
            description: { ...common('DynamicString'), description: 'Optional step description.' },
          },
          required: ['title'],
          additionalProperties: false,
        },
      },
      value: {
        ...common('DynamicNumber'),
        description: 'The zero-based index of the current active step.',
      },
      orientation: {
        type: 'string',
        description: 'The layout orientation of the stepper.',
        enum: ['horizontal', 'vertical'],
        default: 'horizontal',
      },
    },
    required: ['steps'],
  },

  ButtonGroup: {
    description: 'A set of related Button components grouped together.',
    properties: {
      children: {
        ...common('ChildList'),
        description: 'The Button components to group, referenced by ID.',
      },
      orientation: {
        type: 'string',
        description: 'The layout orientation of the group.',
        enum: ['horizontal', 'vertical'],
        default: 'horizontal',
      },
    },
    required: ['children'],
  },

  Carousel: {
    description: 'A horizontally swipeable set of slides.',
    properties: {
      children: {
        ...common('ChildList'),
        description: 'The slide components, referenced by ID.',
      },
      orientation: {
        type: 'string',
        description: 'The scroll orientation.',
        enum: ['horizontal', 'vertical'],
        default: 'horizontal',
      },
      loop: {
        type: 'boolean',
        description: 'If true, the carousel loops back to the start after the last slide.',
        default: false,
      },
    },
    required: ['children'],
  },

  ToggleGroup: {
    checkable: true,
    description: 'A group of toggle buttons supporting single or multiple selection.',
    properties: {
      options: {
        type: 'array',
        description: 'The toggle options.',
        items: {
          type: 'object',
          properties: {
            label: { ...common('DynamicString'), description: 'The option label.' },
            value: { type: 'string', description: 'The stable value for this option.' },
          },
          required: ['label', 'value'],
          additionalProperties: false,
        },
      },
      value: {
        ...common('DynamicStringList'),
        description: 'The currently selected value(s), bound to a string array.',
      },
      variant: {
        type: 'string',
        description: 'Whether one or multiple options may be selected at once.',
        enum: ['single', 'multiple'],
        default: 'single',
      },
    },
    required: ['options', 'value'],
  },

  Accordion: {
    description: 'A vertically stacked set of collapsible sections.',
    properties: {
      items: {
        type: 'array',
        description: 'The collapsible sections.',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            title: { ...common('DynamicString'), description: 'The section header.' },
            child: {
              ...common('ComponentId'),
              description: 'The ID of the section content component. Do NOT define it inline.',
            },
          },
          required: ['title', 'child'],
          additionalProperties: false,
        },
      },
      type: {
        type: 'string',
        description: 'Whether one or multiple sections may be open at once.',
        enum: ['single', 'multiple'],
        default: 'single',
      },
    },
    required: ['items'],
  },

  ScrollArea: {
    description: 'A scrollable viewport wrapping a single child component.',
    properties: {
      child: {
        ...common('ComponentId'),
        description: 'The ID of the child component to make scrollable. Do NOT define it inline.',
      },
      maxHeight: {
        type: 'string',
        description: "Maximum height before scrolling (CSS length, e.g. '320px').",
      },
      orientation: {
        type: 'string',
        description: 'The scroll orientation.',
        enum: ['vertical', 'horizontal', 'both'],
        default: 'vertical',
      },
    },
    required: ['child'],
  },

  Separator: {
    description: 'A visual separator line with an optional label.',
    properties: {
      axis: {
        type: 'string',
        description: 'The orientation of the separator.',
        enum: ['horizontal', 'vertical'],
        default: 'horizontal',
      },
      label: {
        ...common('DynamicString'),
        description: 'Optional text centered on the separator.',
      },
    },
  },

  Table: {
    description:
      'A simple tabular display. Columns are declared statically; rows are bound to an array in the data model.',
    properties: {
      columns: {
        type: 'array',
        description: 'The column definitions, in display order.',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            key: { type: 'string', description: 'The row-object key this column reads.' },
            header: { ...common('DynamicString'), description: 'The column header text.' },
          },
          required: ['key', 'header'],
          additionalProperties: false,
        },
      },
      rows: {
        ...common('DataBinding'),
        description:
          'A data binding to an array of row objects. Each object is keyed by the column `key`s.',
      },
      caption: { ...common('DynamicString'), description: 'Optional table caption.' },
    },
    required: ['columns', 'rows'],
  },
}
