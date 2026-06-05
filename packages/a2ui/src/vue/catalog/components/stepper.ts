import { defineComponent, h, type PropType } from 'vue'
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@meldui/vue'
import { defineVueComponent } from '../../define'
import { a2, meldApi, z } from '../schemas'
import type { A2uiRenderProps } from '../../types'

interface Step {
  title: string
  description?: string
}

const StepperApi = meldApi('Stepper', {
  steps: z.array(z.object({ title: a2.str, description: a2.str.optional() })),
  value: a2.num.optional(),
  orientation: z.enum(['horizontal', 'vertical']).optional(),
})

const MeldStepper = defineComponent({
  name: 'MeldStepper',
  props: { p: { type: Object as PropType<A2uiRenderProps['p']>, required: true } },
  setup(props) {
    return () => {
      const steps = (props.p.steps as Step[] | undefined) ?? []
      // A2UI `value` is the zero-based active index; MeldUI Stepper steps are 1-based.
      const active = Number(props.p.value ?? 0) + 1
      const orientation = (props.p.orientation as 'horizontal' | 'vertical') ?? 'horizontal'
      return h(
        Stepper,
        { defaultValue: active, orientation, class: 'w-full', 'data-a2ui': 'Stepper' },
        () =>
          steps.map((step, i) =>
            h(StepperItem, { key: i, step: i + 1 }, () => [
              h(StepperTrigger, () => [
                h(StepperIndicator, () => String(i + 1)),
                h('div', { class: 'text-left' }, [
                  h(StepperTitle, () => step.title),
                  step.description ? h(StepperDescription, () => step.description) : null,
                ]),
              ]),
              i < steps.length - 1 ? h(StepperSeparator) : null,
            ]),
          ),
      )
    }
  },
})

export const stepperEntry = defineVueComponent(StepperApi, MeldStepper)
