import { defineConfig, transformerVariantGroup } from 'unocss'
import preset from 'unocss/preset-wind4'


export default defineConfig({
  transformers: [transformerVariantGroup()],
  presets: [preset({ dark: 'media' })],
})
