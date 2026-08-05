// Desktop form factor. Companion of lighthouserc.local.cjs (one form factor per file).
// Size ceilings are UX-derived per page type (see lighthouserc.local.cjs).
// CPU-bound metrics stay at warn: a shared 2-vCPU CI runner scores structurally
// lower than a dev machine, so an absolute score threshold is not portable.
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'node packages/website/.output/server/index.mjs',
      startServerReadyPattern: 'Listening on',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/projects',
        'http://localhost:3000/projects/emeis',
        'http://localhost:3000/blog/portfolio-v1',
      ],
      // Single run: only deterministic assertions block, repeating them changes nothing.
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
        chromeFlags: '--headless=new --no-sandbox',
      },
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: 'http://localhost:3000/$',
          assertions: {
            'categories:performance': ['warn', { minScore: 0.9 }],
            'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['warn', { maxNumericValue: 300 }],
            'resource-summary:total:size': [
              'error',
              { maxNumericValue: 500000 },
            ],
          },
        },
        {
          matchingUrlPattern: 'http://localhost:3000/projects$',
          assertions: {
            'categories:performance': ['warn', { minScore: 0.9 }],
            'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['warn', { maxNumericValue: 300 }],
            'resource-summary:total:size': [
              'error',
              { maxNumericValue: 1000000 },
            ],
          },
        },
        {
          matchingUrlPattern: 'http://localhost:3000/projects/emeis$',
          assertions: {
            'categories:performance': ['warn', { minScore: 0.9 }],
            'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['warn', { maxNumericValue: 300 }],
            'resource-summary:total:size': [
              'error',
              { maxNumericValue: 1000000 },
            ],
          },
        },
        {
          matchingUrlPattern: 'http://localhost:3000/blog/portfolio-v1$',
          assertions: {
            'categories:performance': ['warn', { minScore: 0.9 }],
            'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['warn', { maxNumericValue: 300 }],
            'resource-summary:total:size': [
              'error',
              { maxNumericValue: 700000 },
            ],
          },
        },
      ],
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci-desktop',
    },
  },
};
