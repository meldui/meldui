import type {
  EmblaCarouselType,
  EmblaOptionsType,
  EmblaPluginType,
} from 'embla-carousel'
import type useEmblaCarousel from 'embla-carousel-vue'
import type { EmblaCarouselVueType } from 'embla-carousel-vue'
import type { HTMLAttributes, UnwrapRef } from 'vue'

type CarouselApi = EmblaCarouselVueType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

export type UnwrapRefCarouselApi = UnwrapRef<CarouselApi>

// Re-export embla-carousel types for portable type declarations
export type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType }

export interface CarouselProps {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
}

export type CarouselEmits = (e: 'init-api', payload: UnwrapRefCarouselApi) => void

export interface WithClassAsProps {
  class?: HTMLAttributes['class']
}
