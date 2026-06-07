// oxlint-disable no-thenable -- `then` below is the JSON Schema conditional keyword, not a Promise.
import { common } from '../common'
import type { ComponentDefs } from '../../types'

/**
 * A2UI Basic-catalog primitives, kept under their exact spec names and
 * property shapes so agents already targeting the A2UI "basic" catalog render
 * against MeldUI with no changes. Definitions mirror
 * `specification/v0_9/catalogs/basic/catalog.json` from google/A2UI
 * (Apache-2.0); see README "Attribution".
 */
export const basicComponents: ComponentDefs = {
  Text: {
    properties: {
      text: {
        ...common('DynamicString'),
        description:
          'The text content to display. While simple Markdown formatting is supported (i.e. without HTML, images, or links), utilizing dedicated UI components is generally preferred for a richer and more structured presentation.',
      },
      variant: {
        type: 'string',
        description: 'A hint for the base text style.',
        enum: ['h1', 'h2', 'h3', 'h4', 'h5', 'caption', 'body'],
        default: 'body',
      },
    },
    required: ['text'],
  },

  Image: {
    properties: {
      url: { ...common('DynamicString'), description: 'The URL of the image to display.' },
      description: {
        ...common('DynamicString'),
        description: 'Accessibility text for the image.',
      },
      fit: {
        type: 'string',
        description:
          "Specifies how the image should be resized to fit its container. This corresponds to the CSS 'object-fit' property.",
        enum: ['contain', 'cover', 'fill', 'none', 'scaleDown'],
        default: 'fill',
      },
      variant: {
        type: 'string',
        description: 'A hint for the image size and style.',
        enum: ['icon', 'avatar', 'smallFeature', 'mediumFeature', 'largeFeature', 'header'],
        default: 'mediumFeature',
      },
    },
    required: ['url'],
  },

  Icon: {
    properties: {
      name: {
        description: 'The name of the icon to display.',
        oneOf: [
          {
            type: 'string',
            enum: [
              'accountCircle',
              'add',
              'arrowBack',
              'arrowForward',
              'attachFile',
              'calendarToday',
              'call',
              'camera',
              'check',
              'close',
              'delete',
              'download',
              'edit',
              'event',
              'error',
              'fastForward',
              'favorite',
              'favoriteOff',
              'folder',
              'help',
              'home',
              'info',
              'locationOn',
              'lock',
              'lockOpen',
              'mail',
              'menu',
              'moreVert',
              'moreHoriz',
              'notificationsOff',
              'notifications',
              'pause',
              'payment',
              'person',
              'phone',
              'photo',
              'play',
              'print',
              'refresh',
              'rewind',
              'search',
              'send',
              'settings',
              'share',
              'shoppingCart',
              'skipNext',
              'skipPrevious',
              'star',
              'starHalf',
              'starOff',
              'stop',
              'upload',
              'visibility',
              'visibilityOff',
              'volumeDown',
              'volumeMute',
              'volumeOff',
              'volumeUp',
              'warning',
            ],
          },
          {
            type: 'object',
            properties: { svgPath: { type: 'string' } },
            required: ['svgPath'],
            additionalProperties: false,
          },
          common('DataBinding'),
        ],
      },
    },
    required: ['name'],
  },

  Row: {
    description:
      'A layout component that arranges its children horizontally. To create a grid layout, nest Columns within this Row.',
    properties: {
      children: {
        ...common('ChildList'),
        description:
          'Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID.',
      },
      justify: {
        type: 'string',
        description:
          "Defines the arrangement of children along the main axis (horizontally). Use 'spaceBetween' to push items to the edges, or 'start'/'end'/'center' to pack them together.",
        enum: ['center', 'end', 'spaceAround', 'spaceBetween', 'spaceEvenly', 'start', 'stretch'],
        default: 'start',
      },
      align: {
        type: 'string',
        description:
          "Defines the alignment of children along the cross axis (vertically). This is similar to the CSS 'align-items' property, but uses camelCase values (e.g., 'start').",
        enum: ['start', 'center', 'end', 'stretch'],
        default: 'stretch',
      },
    },
    required: ['children'],
  },

  Column: {
    description:
      'A layout component that arranges its children vertically. To create a grid layout, nest Rows within this Column.',
    properties: {
      children: {
        ...common('ChildList'),
        description:
          'Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list. Children cannot be defined inline, they must be referred to by ID.',
      },
      justify: {
        type: 'string',
        description:
          "Defines the arrangement of children along the main axis (vertically). Use 'spaceBetween' to push items to the edges (e.g. header at top, footer at bottom), or 'start'/'end'/'center' to pack them together.",
        enum: ['start', 'center', 'end', 'spaceBetween', 'spaceAround', 'spaceEvenly', 'stretch'],
        default: 'start',
      },
      align: {
        type: 'string',
        description:
          "Defines the alignment of children along the cross axis (horizontally). This is similar to the CSS 'align-items' property.",
        enum: ['center', 'end', 'start', 'stretch'],
        default: 'stretch',
      },
    },
    required: ['children'],
  },

  List: {
    properties: {
      children: {
        ...common('ChildList'),
        description:
          'Defines the children. Use an array of strings for a fixed set of children, or a template object to generate children from a data list.',
      },
      direction: {
        type: 'string',
        description: 'The direction in which the list items are laid out.',
        enum: ['vertical', 'horizontal'],
        default: 'vertical',
      },
      align: {
        type: 'string',
        description: 'Defines the alignment of children along the cross axis.',
        enum: ['start', 'center', 'end', 'stretch'],
        default: 'stretch',
      },
    },
    required: ['children'],
  },

  Card: {
    properties: {
      child: {
        ...common('ComponentId'),
        description:
          "The ID of the single child component to be rendered inside the card. To display multiple elements, you MUST wrap them in a layout component (like Column or Row) and pass that container's ID here. Do NOT pass multiple IDs or a non-existent ID. Do NOT define the child component inline.",
      },
    },
    required: ['child'],
  },

  Tabs: {
    properties: {
      tabs: {
        type: 'array',
        description:
          'An array of objects, where each object defines a tab with a title and a child component.',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            title: { ...common('DynamicString'), description: 'The tab title.' },
            child: {
              ...common('ComponentId'),
              description: 'The ID of the child component. Do NOT define the component inline.',
            },
          },
          required: ['title', 'child'],
          additionalProperties: false,
        },
      },
    },
    required: ['tabs'],
  },

  Modal: {
    properties: {
      trigger: {
        ...common('ComponentId'),
        description:
          'The ID of the component that opens the modal when interacted with (e.g., a button). Do NOT define the component inline.',
      },
      content: {
        ...common('ComponentId'),
        description:
          'The ID of the component to be displayed inside the modal. Do NOT define the component inline.',
      },
    },
    required: ['trigger', 'content'],
  },

  Divider: {
    properties: {
      axis: {
        type: 'string',
        description: 'The orientation of the divider.',
        enum: ['horizontal', 'vertical'],
        default: 'horizontal',
      },
    },
  },

  Button: {
    checkable: true,
    properties: {
      child: {
        ...common('ComponentId'),
        description:
          "The ID of the child component. Use a 'Text' component for a labeled button. Only use an 'Icon' if the requirements explicitly ask for an icon-only button. Do NOT define the child component inline.",
      },
      variant: {
        type: 'string',
        description:
          "A hint for the button style. If omitted, a default button style is used. 'primary' indicates this is the main call-to-action button. 'borderless' means the button has no visual border or background, making its child content appear like a clickable link.",
        enum: ['default', 'primary', 'borderless'],
        default: 'default',
      },
      action: common('Action'),
    },
    required: ['child', 'action'],
  },

  TextField: {
    checkable: true,
    properties: {
      label: { ...common('DynamicString'), description: 'The text label for the input field.' },
      value: { ...common('DynamicString'), description: 'The value of the text field.' },
      variant: {
        type: 'string',
        description: 'The type of input field to display.',
        enum: ['longText', 'number', 'shortText', 'obscured'],
        default: 'shortText',
      },
      validationRegexp: {
        type: 'string',
        description: 'A regular expression used for client-side validation of the input.',
      },
    },
    required: ['label'],
  },

  CheckBox: {
    checkable: true,
    properties: {
      label: {
        ...common('DynamicString'),
        description: 'The text to display next to the checkbox.',
      },
      value: {
        ...common('DynamicBoolean'),
        description: 'The current state of the checkbox (true for checked, false for unchecked).',
      },
    },
    required: ['label', 'value'],
  },

  ChoicePicker: {
    checkable: true,
    description: 'A component that allows selecting one or more options from a list.',
    properties: {
      label: { ...common('DynamicString'), description: 'The label for the group of options.' },
      variant: {
        type: 'string',
        description: 'A hint for how the choice picker should be displayed and behave.',
        enum: ['multipleSelection', 'mutuallyExclusive'],
        default: 'mutuallyExclusive',
      },
      options: {
        type: 'array',
        description: 'The list of available options to choose from.',
        items: {
          type: 'object',
          properties: {
            label: {
              ...common('DynamicString'),
              description: 'The text to display for this option.',
            },
            value: { type: 'string', description: 'The stable value associated with this option.' },
          },
          required: ['label', 'value'],
          additionalProperties: false,
        },
      },
      value: {
        ...common('DynamicStringList'),
        description:
          'The list of currently selected values. This should be bound to a string array in the data model.',
      },
      displayStyle: {
        type: 'string',
        description: 'The display style of the component.',
        enum: ['checkbox', 'chips'],
        default: 'checkbox',
      },
      filterable: {
        type: 'boolean',
        description: 'If true, displays a search input to filter the options.',
        default: false,
      },
    },
    required: ['options', 'value'],
  },

  Slider: {
    checkable: true,
    properties: {
      label: { ...common('DynamicString'), description: 'The label for the slider.' },
      min: { type: 'number', description: 'The minimum value of the slider.', default: 0 },
      max: { type: 'number', description: 'The maximum value of the slider.' },
      value: { ...common('DynamicNumber'), description: 'The current value of the slider.' },
    },
    required: ['value', 'max'],
  },

  DateTimeInput: {
    checkable: true,
    properties: {
      value: {
        ...common('DynamicString'),
        description:
          'The selected date and/or time value in ISO 8601 format. If not yet set, initialize with an empty string.',
      },
      enableDate: {
        type: 'boolean',
        description: 'If true, allows the user to select a date.',
        default: false,
      },
      enableTime: {
        type: 'boolean',
        description: 'If true, allows the user to select a time.',
        default: false,
      },
      min: {
        allOf: [
          common('DynamicString'),
          {
            if: { type: 'string' },
            then: { oneOf: [{ format: 'date' }, { format: 'time' }, { format: 'date-time' }] },
          },
        ],
        description: 'The minimum allowed date/time in ISO 8601 format.',
      },
      max: {
        allOf: [
          common('DynamicString'),
          {
            if: { type: 'string' },
            then: { oneOf: [{ format: 'date' }, { format: 'time' }, { format: 'date-time' }] },
          },
        ],
        description: 'The maximum allowed date/time in ISO 8601 format.',
      },
      label: { ...common('DynamicString'), description: 'The text label for the input field.' },
    },
    required: ['value'],
  },
}
