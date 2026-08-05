// Mobile form factor (Lighthouse default). Desktop lives in the companion file.
// Size budgets sit ~15% above measured transfer weight as a regression guard.
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
              { maxNumericValue: 335872 },
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
              { maxNumericValue: 876749 },
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
              { maxNumericValue: 795955 },
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
              { maxNumericValue: 424141 },
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
