import React from 'react';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
  title: (title) => `${title}`,
  resolve: async (name) => {
    try {
      return (await import(`./Pages/${name}.jsx`)).default;
    } catch (e) {
      const [moduleName, ...pageParts] = name.split('/');
      const pageName = pageParts.join('/');

      if (!pageName) {
        throw e;
      }

      return (await import(`../../Modules/${moduleName}/resources/assets/js/Pages/${pageName}.jsx`)).default;
    }
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
