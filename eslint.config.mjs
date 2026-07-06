// Root ESLint flat config for the whole monorepo.
// WHY: a single, repo-wide lint pass (`eslint .`) keeps rules consistent across
// the shared package and the NestJS apps, and catches unused/broken imports.
// Source is all TypeScript; generated JS configs and build output are ignored.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/next-env.d.ts',
      '**/.angular/**',
      '**/coverage/**',
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
      '**/*.spec.ts',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      // Allow intentionally unused args/vars when prefixed with an underscore.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
);
