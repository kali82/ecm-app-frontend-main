const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

const {
  schaefflerTailwindPreset,
} = require('@schaeffler/styles/src/lib/tailwind/preset');

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, '../../node_modules/@schaeffler/**/*'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  presets: [schaefflerTailwindPreset],
  safelist: [],
  theme: {
    extend: {},
  },
  plugins: [],
};
