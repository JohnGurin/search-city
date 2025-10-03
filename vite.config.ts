import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { viteSingleFile } from 'vite-plugin-singlefile'

import UnoCSS from 'unocss/vite'
import transformerCompileClass from '@unocss/transformer-compile-class'

/* https://vite.dev/config/ */
export default defineConfig(({ mode }) => {
  const IS_PROD = mode === 'production'

  return {
    base: '/search-city/',
    plugins: [
      tsconfigPaths(),
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      UnoCSS({
        transformers: [transformerCompileClass({
          classPrefix: IS_PROD ? '' : undefined,
          alwaysHash: true,
          trigger: /(["'`]):uno-?(?<name>\S+)?:\s+?(\S[\s\S]*?)\1/g,
        })],
      }),
      viteSingleFile({
        removeViteModuleLoader: true,
        inlinePattern: ['*.css'],
      }),
    ],
  }
})
