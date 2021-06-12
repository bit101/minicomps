export default {
  input: "src/minicomps",
  output: [
    {
      file: `dist/minicomps.js`,
      format: 'iife',
      name: "minicomps",
    },
    {
      file: `dist/minicomps.mjs`,
      format: 'es',
    },
  ],
};
