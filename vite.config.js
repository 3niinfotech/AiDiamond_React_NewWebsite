import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const fixNestedCssPlugin = () => ({
  name: 'fix-nested-css-syntax',
  enforce: 'pre',
  transform(code, id) {
    if (id.includes('.css') && code.includes('button&')) {
      return {
        code: code.replace(/button&/g, ':is(button)&'),
        map: null,
      };
    }
    return null;
  },
});

export default defineConfig({
  plugins: [fixNestedCssPlugin(), react()],
  server: {
    port: 3002,
    open: true,
  },
});