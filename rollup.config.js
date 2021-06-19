export default {
  input: "src/minicomps",
  output: [
    {
      file: `dist/minicomps.js`,
      format: 'iife',
      name: "mc",
    },
    {
      file: `dist/minicomps.mjs`,
      format: 'es',
    },
  ],
};
