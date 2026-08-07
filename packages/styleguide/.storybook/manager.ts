import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

// Mirrors Storybook's default scheme detection (read once at load), which a
// custom theme otherwise disables; the logo mark follows the same scheme.
// Logo assets come from website/public, served at root via staticDirs.
const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;

addons.setConfig({
  theme: create({
    base: dark ? 'dark' : 'light',
    brandTitle: 'Styleguide | Alexis Besson',
    brandImage: dark ? '/favicon-dark.svg' : '/favicon-light.svg',
    brandUrl: 'https://alexisbesson.fr',
    brandTarget: '_self',
  }),
});
