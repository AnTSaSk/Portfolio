module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'es2022',
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-case-declarations': 'off',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: [
          // Node "builtin" modules like "fs"
          'builtin',
          // Node_modules
          'external',
          // TS Types
          'type',
          // Include "Composables", "Services", "Constants", "Utils", "Components"
          'internal',
          // From a "parent" directory or same/"sibling's" directory or curent directory
          ['parent', 'sibling', 'index'],
        ],
        pathGroups: [
          // External - Vue related
          {
            pattern: 'vue*',
            group: 'external',
          },
          // "External" - I18n
          {
            pattern: '@/i18n',
            group: 'external',
            position: 'after',
          },
          // "External" - Router
          {
            pattern: '@/router/**',
            group: 'external',
            position: 'after',
          },
          // Types
          {
            pattern: '**/*.d',
            group: 'type',
          },
          {
            pattern: './*.d',
            group: 'type',
          },
          // Composables
          {
            pattern: '**/composables/*',
            group: 'internal',
            position: 'before',
          },
          // Constants
          {
            pattern: '**/constants/**',
            group: 'internal',
            position: 'before',
          },
          // Utils
          {
            pattern: '**/utils/*',
            group: 'internal',
            position: 'before',
          },
          // Components - @antsask/styleguide
          {
            pattern: '@antsask/styleguide',
            group: 'internal',
          },
          // Components - Layouts
          {
            pattern: '**/layouts/**',
            group: 'internal',
          },
          // Components
          {
            pattern: '**/components/**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['@antsask/styleguide'],
      },
    ],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'vue/no-v-html': 'off',
    'vue/no-v-text-v-html-on-component': 'off',
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 1,
        switchCase: 1,
      },
    ],
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
};
