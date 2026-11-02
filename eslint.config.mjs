import next from 'next/eslint-plugin-next';

export default [
  {
    ignores: [
      ".next/*",
      "out/*",
      "build/*",
      "next-env.d.ts"
    ],
  },
  {
    plugins: {
      '@next/next': next,
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
    },
  },
];
