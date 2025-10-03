import { defineConfig, type CSSOptions } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

import UnoCSS from 'unocss/vite'
import transformerCompileClass from '@unocss/transformer-compile-class'

// @ts-expect-error: no @types for 'postcss-dropunusedvars' package
import postcssDropunusedvar from 'postcss-dropunusedvars'
import postcssVariableCompress from 'postcss-variable-compress'
import { inlineCssVars } from 'postcss-inline-css-vars'


/* https://vite.dev/config/ */
export default defineConfig(({ mode }) => {
  const IS_PROD = mode === 'production'

  const css: CSSOptions = IS_PROD
    ? {
        postcss: {
          plugins: [
            postcssVariableCompress(),
            inlineCssVars(),
            postcssDropunusedvar,
          ],
        } }
    : {}

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
    ],
    css,
  }
})
