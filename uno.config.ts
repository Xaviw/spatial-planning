import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTagify,
  presetUno,
  transformerVariantGroup,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTagify(),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
})
