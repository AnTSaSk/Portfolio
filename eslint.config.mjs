import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import vuePlugin from 'eslint-plugin-vue';
import vueA11yPlugin from 'eslint-plugin-vuejs-accessibility';
import vueParser from 'vue-eslint-parser';
import globals from 'globals';

export default [
  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/dist-ssr/**',
      '**/*.tsbuildinfo',
      '**/.nuxt/**',
      '**/.output/**',
      '**/storybook-static/**',
      '**/.eslintrc.*',
      '**/.stylelintrc.*',
      '**/.storybook/**',
      '**/*.vue.d.ts',
      '**/*.vue.js',
      'packages/website/nuxt.config.d.ts',
      'packages/website/src/constants/*.d.ts',
      'packages/website/src/constants/*.js',
      'packages/website/src/utils/*.d.ts',
      'packages/website/src/utils/*.js',
      'packages/website/src/server/**/*.d.ts',
      'packages/website/src/server/**/*.js',
      'packages/website/ecosystem.config.js',
    ],
  },

  // Base JS recommended
  js.configs.recommended,

  // Node.js config files (CJS + ESM)
  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Vue plugin flat configs (includes processor)
  ...vuePlugin.configs['flat/recommended'],

  // TypeScript + Vue files
  {
    files: ['**/*.ts', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2024,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
      'vuejs-accessibility': vueA11yPlugin,
    },
    rules: {
      // TypeScript recommended rules
      ...tsPlugin.configs.recommended.rules,

      // Vuejs accessibility recommended rules
      ...vueA11yPlugin.configs['flat/recommended'].reduce((acc, config) => {
        if (config.rules) Object.assign(acc, config.rules);
        return acc;
      }, {}),

      // Prettier (disable conflicting rules)
      ...prettierConfig.rules,

      // Custom rules
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-case-declarations': 'off',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: [
            'builtin',
            'external',
            'type',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            {
              pattern: 'vue*',
              group: 'external',
            },
            {
              pattern: '@/i18n',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '**/*.d',
              group: 'type',
            },
            {
              pattern: './*.d',
              group: 'type',
            },
            {
              pattern: '**/composables/*',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '**/constants/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '**/utils/*',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@antsask/styleguide',
              group: 'internal',
            },
            {
              pattern: '**/layouts/**',
              group: 'internal',
            },
            {
              pattern: '**/components/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['@antsask/styleguide'],
        },
      ],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-expect-error': 'allow-with-description' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'vue/no-v-html': 'warn',
      'vue/no-v-text-v-html-on-component': 'warn',
      'vue/script-indent': [
        'error',
        2,
        {
          baseIndent: 1,
          switchCase: 1,
        },
      ],
    },
  },

  // Website-specific overrides
  {
    files: ['packages/website/**/*.ts', 'packages/website/**/*.vue'],
    rules: {
      'no-undef': 'off',
    },
  },
];
