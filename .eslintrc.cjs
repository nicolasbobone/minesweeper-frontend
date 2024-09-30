module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@angular-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@angular-eslint'],
  rules: {
    '@angular-eslint/component-class-suffix': 'error',
    '@angular-eslint/directive-class-suffix': 'error',
    '@angular-eslint/no-output-native': 'error',
    '@angular-eslint/no-empty-lifecycle-method': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'prettier/prettier': 'error',
  },
};
