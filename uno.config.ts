import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTagify,
  presetUno,
  transformerVariantGroup,
  transformerDirectives,
  UserConfig,
} from 'unocss'

const config: UserConfig = defineConfig({
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

export default config
