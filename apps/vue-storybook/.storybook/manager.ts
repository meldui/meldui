// @ts-nocheck
import { addons } from 'storybook/internal/manager-api'
import { create } from 'storybook/internal/theming'

const theme = create({
  base: 'light',
  brandTitle: 'MeldUI - Design System',
  brandUrl: 'https://github.com/meldui',
  brandTarget: '_self',
})

addons.setConfig({
  theme,
})
