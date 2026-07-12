import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import vuePlugin from 'eslint-plugin-vue';
import vueA11yPlugin from 'eslint-plugin-vuejs-accessibility';
import vueParser from 'vue-eslint-parser';
import globals from 'globals';

const stylisticRules = {
  '@stylistic/array-bracket-newline': ['error', { multiline: true }],
  '@stylistic/array-element-newline': ['error', 'consistent'],
  '@stylistic/comma-dangle': ['error', 'always-multiline'],
  '@stylistic/curly-newline': ['error', 'always'],
  '@stylistic/indent': ['error', 2],
  '@stylistic/indent-binary-ops': ['error', 2],
  '@stylistic/lines-between-class-members': ['error', 'always'],
  '@stylistic/member-delimiter-style': 'error',
  '@stylistic/multiline-ternary': ['error', 'always-multiline'],
  '@stylistic/new-parens': 'error',
  '@stylistic/no-floating-decimal': 'error',
  '@stylistic/no-multi-spaces': 'error',
  '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
  '@stylistic/no-tabs': 'error',
  '@stylistic/no-trailing-spaces': 'error',
  '@stylistic/no-whitespace-before-property': 'error',
  '@stylistic/operator-linebreak': ['error', 'after'],
  '@stylistic/padded-blocks': ['error', 'never'],
  '@stylistic/quote-props': ['error', 'as-needed'],
  '@stylistic/quotes': ['error', 'single'],
  '@stylistic/semi': ['error', 'always'],
  '@stylistic/type-generic-spacing': ['error'],
  '@stylistic/wrap-regex': 'error',
  '@stylistic/padding-line-between-statements': [
    'error',
    { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
    {
      blankLine: 'any',
      prev: ['const', 'let', 'var'],
      next: ['const', 'let', 'var'],
    },
    {
      blankLine: 'always',
      prev: '*',
      next: ['if', 'for', 'while', 'switch', 'try', 'do'],
    },
    {
      blankLine: 'always',
      prev: ['if', 'for', 'while', 'switch', 'try', 'do'],
      next: '*',
    },
    { blankLine: 'always', prev: '*', next: 'return' },
  ],
};

const typescriptStrictRules = {
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-non-null-assertion': 'warn',
  '@typescript-eslint/consistent-type-imports': [
    'error',
    {
      prefer: 'type-imports',
      fixStyle: 'inline-type-imports',
    },
  ],
  '@typescript-eslint/naming-convention': [
    'error',
    { selector: 'default', format: ['camelCase'], leadingUnderscore: 'allow' },
    {
      selector: 'variable',
      format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      leadingUnderscore: 'allow',
    },
    { selector: 'function', format: ['camelCase', 'PascalCase'] },
    { selector: 'typeLike', format: ['PascalCase'] },
    { selector: 'enumMember', format: ['PascalCase', 'UPPER_CASE'] },
    { selector: 'objectLiteralProperty', format: null },
    { selector: 'import', format: null },
  ],
  '@typescript-eslint/explicit-function-return-type': [
    'error',
    {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
    },
  ],
};

// Type-aware rules: kept off until projectService is wired to the final tsconfigs (phase 4).
const typeAwareRules = {
  '@typescript-eslint/prefer-optional-chain': 'off',
  '@typescript-eslint/prefer-nullish-coalescing': 'off',
  '@typescript-eslint/consistent-type-exports': 'off',
  '@typescript-eslint/no-floating-promises': 'off',
  '@typescript-eslint/await-thenable': 'off',
  '@typescript-eslint/no-misused-promises': 'off',
  '@typescript-eslint/require-await': 'off',
  '@typescript-eslint/strict-boolean-expressions': 'off',
};

const bestPracticesRules = {
  'no-console': 'warn',
  'no-debugger': 'error',
  'no-alert': 'error',
  eqeqeq: ['error', 'always'],
  curly: ['error', 'all'],
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-var': 'error',
  'prefer-const': 'error',
  'prefer-arrow-callback': 'error',
  'arrow-body-style': ['error', 'as-needed'],
  'object-shorthand': ['error', 'always'],
  'no-duplicate-imports': 'error',
  'no-useless-rename': 'error',
  'no-restricted-globals': ['error', 'event', 'fdescribe'],
};

const importOrderRule = {
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
        { pattern: 'vue*', group: 'external' },
        { pattern: '@/i18n', group: 'external', position: 'after' },
        { pattern: '#app', group: 'external', position: 'after' },
        { pattern: '#imports', group: 'external', position: 'after' },
        { pattern: '**/*.d', group: 'type' },
        { pattern: './*.d', group: 'type' },
        { pattern: '**/composables/*', group: 'internal', position: 'before' },
        { pattern: '**/constants/**', group: 'internal', position: 'before' },
        { pattern: '**/utils/*', group: 'internal', position: 'before' },
        { pattern: '@antsask/styleguide', group: 'internal' },
        { pattern: '**/layouts/**', group: 'internal' },
        { pattern: '**/components/**', group: 'internal' },
      ],
      pathGroupsExcludedImportTypes: ['@antsask/styleguide'],
    },
  ],
};

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/dist-ssr/**',
      '**/*.tsbuildinfo',
      '**/.nuxt/**',
      '**/.output/**',
      '**/storybook-static/**',
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

  js.configs.recommended,

  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  ...vuePlugin.configs['flat/recommended'],

  {
    files: ['**/*.ts', '**/*.vue'],
    ignores: ['packages/cv/**'],
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
      '@stylistic': stylistic,
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
      'vuejs-accessibility': vueA11yPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...vueA11yPlugin.configs['flat/recommended'].reduce((acc, config) => {
        if (config.rules) {
          Object.assign(acc, config.rules);
        }

        return acc;
      }, {}),
      ...stylisticRules,
      ...prettierConfig.rules,
      ...bestPracticesRules,
      ...typescriptStrictRules,
      ...typeAwareRules,
      ...importOrderRule,
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-expect-error': 'allow-with-description' },
      ],
      'vue/no-v-html': 'warn',
      'vue/no-v-text-v-html-on-component': 'warn',
      'vue/script-indent': ['error', 2, { baseIndent: 1, switchCase: 1 }],
    },
  },

  {
    files: ['**/*.vue'],
    rules: {
      '@stylistic/padding-line-between-statements': 'off',
    },
  },

  {
    files: ['packages/website/**/*.ts', 'packages/website/**/*.vue'],
    languageOptions: {
      globals: {
        computed: 'readonly',
        onBeforeMount: 'readonly',
        onBeforeUnmount: 'readonly',
        onMounted: 'readonly',
        onUnmounted: 'readonly',
        reactive: 'readonly',
        ref: 'readonly',
        toRef: 'readonly',
        toRefs: 'readonly',
        watch: 'readonly',
        watchEffect: 'readonly',
        defineEventHandler: 'readonly',
        getQuery: 'readonly',
        readBody: 'readonly',
        defineNuxtConfig: 'readonly',
        defineNuxtPlugin: 'readonly',
        defineNuxtRouteMiddleware: 'readonly',
        defineOrganization: 'readonly',
        definePageMeta: 'readonly',
        definePerson: 'readonly',
        defineWebPage: 'readonly',
        defineWebSite: 'readonly',
        clearError: 'readonly',
        navigateTo: 'readonly',
        useAppConfig: 'readonly',
        useAsyncData: 'readonly',
        useFetch: 'readonly',
        useHead: 'readonly',
        useI18n: 'readonly',
        useLocaleHead: 'readonly',
        useNuxtApp: 'readonly',
        useRoute: 'readonly',
        useRouter: 'readonly',
        useRuntimeConfig: 'readonly',
        useSchemaOrg: 'readonly',
        useSeo: 'readonly',
        useSeoMeta: 'readonly',
      },
    },
  },

  {
    files: ['packages/website/src/utils/**'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  {
    files: ['packages/cv/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
];
