module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-essential',
    'plugin:import/recommended',
    'plugin:import/typescript',
    '@unocss',
    './.eslintrc-auto-import.json',
    'prettier',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.*rc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    jsx: true,
  },
  plugins: ['@typescript-eslint', 'vue', 'import'],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'no-inner-declarations': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
    'vue/multi-word-component-names': 'off',
    'no-undef': 'off',
    'import/no-unresolved': 'off',
    'import/namespace': 'off',
    'import/no-empty-named-blocks': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
          'type',
        ],
        alphabetize: {
          order: 'asc',
          orderImportKind: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
}
