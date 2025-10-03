import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'


const TS = tseslint.plugin.meta.name

export default defineConfig([
  {
    languageOptions: {
      parser: tseslint.parser,
    },
    files: ['src/**/*.{ts,tsx}'],
    plugins: { [TS]: tseslint.plugin },
    rules: {
      'no-console': 'error',
      [`${TS}/no-non-null-assertion`]: 'error',
      [`${TS}/consistent-type-assertions`]: ['error', {
        assertionStyle: 'never',
      }],
    },
  },
])
