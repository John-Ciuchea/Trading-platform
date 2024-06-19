import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  envPrefix: 'APP_',
  test: {
    watch: false,
    globalSetup: 'tests/global-setup.ts',
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
