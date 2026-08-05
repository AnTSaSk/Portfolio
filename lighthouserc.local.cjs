// Mobile form factor (Lighthouse default). Desktop lives in the companion file.
// Size ceilings are UX-derived per page type, not measured-weight snapshots.
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
        chromeFlags: '--headless=new --no-sandbox',
      },
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: 'http://localhost:3000/$',
          assertions: {
            'categories:performance': ['warn', { minScore: 0.85 }],
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
            'categories:performance': ['warn', { minScore: 0.75 }],
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
            'categories:performance': ['warn', { minScore: 0.75 }],
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
            'categories:performance': ['warn', { minScore: 0.85 }],
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
      outputDir: '.lighthouseci-local',
    },
  },
};
