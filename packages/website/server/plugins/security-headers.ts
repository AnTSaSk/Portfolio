/* global defineNitroPlugin, removeResponseHeader */

// Nitro sets X-Powered-By: Nuxt by default; strip it to avoid stack fingerprinting.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', (event) => {
    removeResponseHeader(event, 'x-powered-by');
  });
});
