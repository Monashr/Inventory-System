import React from 'react';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
  resolve: async (name) => {
    try {
      // Try loading from root resources/js/Pages
      return (await import(`./Pages/${name}.jsx`)).default;
    } catch (e) {
      // If not found, try to load from modules
      // Extract module name from the page name if you use 'ModuleName/PageName' format
      const [moduleName, ...pageParts] = name.split('/');
      const pageName = pageParts.join('/');

      if (!pageName) {
        // If no page specified (like only 'Dashboard'), fallback or throw
        throw e;
      }

      // Attempt to import from the module's Pages folder
      return (await import(`../../Modules/${moduleName}/resources/assets/js/Pages/${pageName}.jsx`)).default;
    }
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
