import openmrs from '@openmrs/eslint-config';

export default [
  { ignores: ['dist/**', 'coverage/**'] },
  ...openmrs,
  {
    rules: {
      // Rules this repo enforces where the shared config turns them off.
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/triple-slash-reference': 'error',
      'no-extra-boolean-cast': 'error',
      'no-prototype-builtins': 'error',
      'no-unsafe-optional-chaining': 'error',
      'no-useless-escape': 'error',
      'prefer-const': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    // consistent-type-exports needs type information, which the old config
    // supplied through parserOptions.project.
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-exports': 'error',
    },
  },
];
