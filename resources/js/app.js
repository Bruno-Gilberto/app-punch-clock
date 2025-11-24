import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { ThemeProvider } from '@/components/theme/themeContext';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import './bootstrap';
import '../css/app.css';

createInertiaApp({
  resolve: (name) =>
    resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        createRoot(el).render(<ThemeProvider><App {...props} /></ThemeProvider>);
    },
});
