import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    languageOptions: { globals: { ...globals.node, ...globals.jest } },
    files: ['**/*.ts'],
    languageOptions: {
      globals: globals.node,
      parser: tsEslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
    },
  },
  ...tsEslint.config(
    eslint.configs.recommended,
    ...tsEslint.configs.recommendedTypeChecked,
    {
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { argsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/consistent-type-exports': 'warn',
        '@typescript-eslint/consistent-type-imports': 'warn',
        '@typescript-eslint/no-confusing-void-expression': 'warn',
        '@typescript-eslint/no-duplicate-enum-values': 'warn',
        '@typescript-eslint/no-duplicate-type-constituents': 'warn',
        '@typescript-eslint/no-extraneous-class': 'off',
        '@typescript-eslint/no-import-type-side-effects': 'warn',
        '@typescript-eslint/no-redundant-type-constituents': 'warn',
        '@typescript-eslint/no-require-imports': 'warn',
        '@typescript-eslint/no-unnecessary-condition': 'warn',
        '@typescript-eslint/no-unnecessary-qualifier': 'warn',
        '@typescript-eslint/no-useless-empty-export': 'warn',
        '@typescript-eslint/prefer-readonly': 'warn',
        '@typescript-eslint/prefer-regexp-exec': 'warn',
        '@typescript-eslint/require-array-sort-compare': 'warn',
        '@typescript-eslint/switch-exhaustiveness-check': 'warn',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        'prettier/prettier': 'warn',
      },
    },
  ),
  {
    files: ['**/*.{js,ts}'],
    plugins: {
      prettier: prettierPlugin,
      '@typescript-eslint': tsEslint.plugin,
    },
    rules: { ...prettierConfig.rules },
  },
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '*.config.ts'],
  },
];
