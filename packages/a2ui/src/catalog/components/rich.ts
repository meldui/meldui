import { common } from '../common'
import type { ComponentDefs } from '../../types'

/**
 * MeldUI rich / higher-complexity components. These have tighter schemas and
 * are the hardest for an LLM to emit correctly — lead agent docs with
 * `Markdown` and the display-only components. Authored in A2UI v0.9 style.
 */
export const richComponents: ComponentDefs = {
  Markdown: {
    description:
      'Renders Markdown content. Tolerates incomplete/streamed Markdown (e.g. an unterminated emphasis or code fence mid-stream); bind `content` to a data path that the agent appends to. This is the preferred component for rich textual answers.',
    properties: {
      content: {
        ...common('DynamicString'),
        description: 'The Markdown source to render. May be streamed/partial.',
      },
    },
    required: ['content'],
  },

  Timeline: {
    description: 'A vertical sequence of time-ordered events.',
    properties: {
      items: {
        type: 'array',
        description: 'The timeline entries, in order.',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            title: { ...common('DynamicString'), description: 'The entry title.' },
            description: { ...common('DynamicString'), description: 'Optional entry detail.' },
            timestamp: {
              ...common('DynamicString'),
              description: 'Optional ISO 8601 timestamp for the entry.',
            },
          },
          required: ['title'],
          additionalProperties: false,
        },
      },
    },
    required: ['items'],
  },

  Sidebar: {
    description:
      'An app-like layout shell with a collapsible side panel and a main content area, for surfaces that drive a fuller UI.',
    properties: {
      content: {
        ...common('ComponentId'),
        description: 'The ID of the main content component. Do NOT define it inline.',
      },
      header: {
        ...common('ComponentId'),
        description: 'Optional ID of a component rendered at the top of the side panel.',
      },
      footer: {
        ...common('ComponentId'),
        description: 'Optional ID of a component rendered at the bottom of the side panel.',
      },
      side: {
        type: 'string',
        description: 'Which side the panel is anchored to.',
        enum: ['left', 'right'],
        default: 'left',
      },
    },
    required: ['content'],
  },

  Combobox: {
    checkable: true,
    description: 'A single-select input with a searchable dropdown of options.',
    properties: {
      label: { ...common('DynamicString'), description: 'The input label.' },
      placeholder: { ...common('DynamicString'), description: 'Placeholder text when empty.' },
      options: {
        type: 'array',
        description: 'The selectable options.',
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
        ...common('DynamicString'),
        description: 'The currently selected value, bound to a string in the data model.',
      },
    },
    required: ['options', 'value'],
  },

  MultiSelect: {
    checkable: true,
    description: 'A multi-select input with a searchable dropdown of options.',
    properties: {
      label: { ...common('DynamicString'), description: 'The input label.' },
      placeholder: { ...common('DynamicString'), description: 'Placeholder text when empty.' },
      options: {
        type: 'array',
        description: 'The selectable options.',
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
        description: 'The currently selected values, bound to a string array in the data model.',
      },
      maxSelected: {
        type: 'number',
        description: 'Optional maximum number of selectable options.',
      },
    },
    required: ['options', 'value'],
  },

  Chart: {
    description: 'A data visualization rendered via @meldui/charts-vue.',
    properties: {
      chartType: {
        type: 'string',
        description: 'The kind of chart to render.',
        enum: ['line', 'bar', 'area', 'pie', 'scatter'],
      },
      data: {
        ...common('DataBinding'),
        description: 'A data binding to the series/array the chart visualizes.',
      },
      title: { ...common('DynamicString'), description: 'Optional chart title.' },
    },
    required: ['chartType', 'data'],
  },
}
