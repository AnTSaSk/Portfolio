// Desktop form factor. Companion of lighthouserc.local.cjs (one form factor per file).
// Size ceilings are UX-derived per page type (see lighthouserc.local.cjs).
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
      numberOfRuns: 3,
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
            'categories:performance': ['error', { minScore: 0.9 }],
            'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['error', { maxNumericValue: 300 }],
            'resource-summary:total:size': [
              'error',
              { maxNumericValue: 500000 },
            ],
          },
        },
        {
          matchingUrlPattern: 'http://localhost:3000/projects$',
          assertions: {
            'categories:performance': ['error', { minScore: 0.9 }],
            'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['error', { maxNumericValue: 300 }],
            'resource-summary:total:size': [
              'error',
              { maxNumericValue: 1000000 },
            ],
          },
        },
        {
          matchingUrlPattern: 'http://localhost:3000/projects/emeis$',
          assertions: {
            'categories:performance': ['error', { minScore: 0.9 }],
            'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['error', { maxNumericValue: 300 }],
            'resource-summary:total:size': [
              'error',
              { maxNumericValue: 1000000 },
            ],
          },
        },
        {
          matchingUrlPattern: 'http://localhost:3000/blog/portfolio-v1$',
          assertions: {
            'categories:performance': ['error', { minScore: 0.9 }],
            'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
            'total-blocking-time': ['error', { maxNumericValue: 300 }],
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
