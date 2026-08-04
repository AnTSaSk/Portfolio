import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const cssDir = path.resolve(dirname, '..');
const packageJsonPath = path.resolve(dirname, '../../../../package.json');

function readCss(fileName: string): string {
  const filePath = path.join(cssDir, fileName);

  if (!fs.existsSync(filePath)) {
    return '';
  }

  return fs.readFileSync(filePath, 'utf-8');
}

const SPACING_SCALE = [
  '0',
  '4px',
  '6px',
  '8px',
  '16px',
  '20px',
  '24px',
  '30px',
  '32px',
  '36px',
  '40px',
  '48px',
  '60px',
  '64px',
  '72px',
  '80px',
  '88px',
  '96px',
  '104px',
  '112px',
  '120px',
  '124px',
  '132px',
  '140px',
];

const tokensCss = readCss('tokens.css');
const appCss = readCss('app.css');
const baseCss = readCss('base.css');
const utilitiesCss = readCss('utilities.css');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as {
  exports?: Record<string, string>;
};

describe('tokens.css : generic tokens', () => {
  it('declares :root without any @layer wrapper', () => {
    expect(tokensCss).not.toMatch(/@layer/);
    expect(tokensCss).toMatch(/:root\s*{/);
  });

  it('defines brand color tokens verbatim', () => {
    expect(tokensCss).toContain('--color-jungle-green: #30bf75;');
    expect(tokensCss).toContain('--color-elm: #1e9782;');
    expect(tokensCss).toContain('--color-shadow: #30bf8c;');
    expect(tokensCss).toContain(
      '--gradient-brand: linear-gradient(109.14deg, #30bf75 -1.67%, #1e9782 115.85%);',
    );
    expect(tokensCss).toContain(
      '--gradient-brand-reverse: linear-gradient(109.14deg, #1e9782 -1.67%, #30bf75 115.85%);',
    );
  });

  it('defines functional color tokens verbatim', () => {
    expect(tokensCss).toContain('--color-info: #1dbf6a;');
    expect(tokensCss).toContain('--color-warning: #f2660c;');
    expect(tokensCss).toContain('--color-error: #bf2d1d;');
  });

  it('defines all 6 neutral color tokens verbatim', () => {
    expect(tokensCss).toContain('--color-woodsmoke: #111315;');
    expect(tokensCss).toContain('--color-shark: #313335;');
    expect(tokensCss).toContain('--color-shuttle-gray: #616365;');
    expect(tokensCss).toContain('--color-iron: #d9dcdf;');
    expect(tokensCss).toContain('--color-athens-gray: #f2f5f7;');
    expect(tokensCss).toContain('--color-white: #ffffff;');
  });

  it('defines 5 fluid heading tokens (--fs-h1..--fs-h5) via clamp(), with mobile/desktop unitless bounds', () => {
    const headingBounds: Record<string, [number, number]> = {
      h1: [32, 48],
      h2: [28, 36],
      h3: [24, 28],
      h4: [20, 24],
      h5: [16, 20],
    };

    for (const [level, [min, max]] of Object.entries(headingBounds)) {
      expect(tokensCss).toMatch(new RegExp(`--fs-${level}-min:\\s*${min};`));
      expect(tokensCss).toMatch(new RegExp(`--fs-${level}-max:\\s*${max};`));
      const tokenMatch = tokensCss.match(
        new RegExp(`--fs-${level}:\\s*([^;]+);`),
      );

      expect(tokenMatch).not.toBeNull();
      expect(tokenMatch?.[1]).toMatch(/clamp\(/);
      expect(tokenMatch?.[1]).not.toMatch(/^\d+px$/);
    }
  });

  it('defines 3 fixed body-role type tokens (--fs-body/--fs-caption/--fs-eyebrow), no --fs-bN', () => {
    expect(tokensCss).toContain('--fs-body: 14px;');
    expect(tokensCss).toContain('--fs-caption: 12px;');
    expect(tokensCss).toContain('--fs-eyebrow: 12px;');
    expect(tokensCss).not.toMatch(/--fs-b[123]:/);
  });

  it('defines the full spacing scale (--space-0..--space-23)', () => {
    for (const [index, value] of SPACING_SCALE.entries()) {
      expect(tokensCss).toContain(`--space-${index}: ${value};`);
    }

    expect(tokensCss).not.toMatch(/--space-24:/);
  });

  it('defines radii and breakpoint tokens verbatim', () => {
    expect(tokensCss).toContain('--radius-sm: 2px;');
    expect(tokensCss).toContain('--radius-md: 4px;');
    expect(tokensCss).toContain('--radius-lg: 8px;');
    expect(tokensCss).toContain('--bp-tablet: 768px;');
    expect(tokensCss).toContain('--bp-desktop: 1280px;');
    expect(tokensCss).toContain('--bp-large: 1440px;');
  });
});

describe('tokens.css : theming', () => {
  it(':root declares color-scheme: light dark', () => {
    expect(tokensCss).toMatch(/:root\s*{[^}]*color-scheme:\s*light dark;/s);
  });

  it('semantic tokens use light-dark() referencing generic var() tokens, not raw hex', () => {
    expect(tokensCss).toContain(
      '--bg-page: light-dark(var(--color-athens-gray), var(--color-woodsmoke));',
    );
    expect(tokensCss).toContain(
      '--fg-1: light-dark(var(--color-woodsmoke), var(--color-athens-gray));',
    );
    expect(tokensCss).toContain(
      '--link: light-dark(var(--color-elm), var(--color-jungle-green));',
    );
  });

  it("[data-theme='light'|'dark'] override color-scheme accordingly", () => {
    expect(tokensCss).toMatch(
      /\[data-theme=['"]light['"]\]\s*{[^}]*color-scheme:\s*light;/s,
    );
    expect(tokensCss).toMatch(
      /\[data-theme=['"]dark['"]\]\s*{[^}]*color-scheme:\s*dark;/s,
    );
  });

  it('theme overrides only reassign color-scheme, never redeclare a semantic token', () => {
    const lightBlockMatch = tokensCss.match(
      /\[data-theme=['"]light['"]\]\s*{([^}]*)}/s,
    );
    const darkBlockMatch = tokensCss.match(
      /\[data-theme=['"]dark['"]\]\s*{([^}]*)}/s,
    );

    expect(lightBlockMatch).not.toBeNull();
    expect(darkBlockMatch).not.toBeNull();
    expect(lightBlockMatch?.[1]).not.toMatch(/--bg-page|--fg-1|--link/);
    expect(darkBlockMatch?.[1]).not.toMatch(/--bg-page|--fg-1|--link/);
  });
});

describe('app.css : cascade layers', () => {
  it('declares the full layer order including fonts', () => {
    expect(appCss).toMatch(
      /@layer reset, tokens, fonts, base, components, utilities;/,
    );
  });

  it('assigns each import to its declared layer', () => {
    expect(appCss).toMatch(/@import ['"]\.\/tokens\.css['"] layer\(tokens\);/);
    expect(appCss).toMatch(/@import ['"]\.\/base\.css['"] layer\(base\);/);
    expect(appCss).toMatch(
      /@import ['"]\.\/utilities\.css['"] layer\(utilities\);/,
    );
  });
});

describe('base.css : fonts and base element styles', () => {
  it('declares @font-face for Montserrat and Noto Sans with font-display: swap', () => {
    const fontFaceBlocks = baseCss.match(/@font-face\s*{[^}]*}/gs) ?? [];

    expect(fontFaceBlocks.length).toBeGreaterThan(0);
    expect(baseCss).toMatch(/font-family:\s*['"]Montserrat['"]/);
    expect(baseCss).toMatch(/font-family:\s*['"]Noto Sans['"]/);

    for (const block of fontFaceBlocks) {
      expect(block).toMatch(/font-display:\s*swap;/);
    }
  });

  it('h1 base style matches the verbatim spec (size, weight, letter-spacing, uppercase)', () => {
    const h1Match = baseCss.match(/h1\s*{([^}]*)}/s);

    expect(h1Match).not.toBeNull();
    const h1Body = h1Match?.[1] ?? '';

    expect(h1Body).toMatch(/font-size:\s*var\(--fs-h1\);/);
    expect(h1Body).toMatch(/font-weight:\s*var\(--fw-regular\)|400/);
    expect(h1Body).toMatch(/letter-spacing:\s*0\.02em;/);
    expect(h1Body).toMatch(/text-transform:\s*uppercase;/);
  });

  it('.overline base style matches the verbatim spec and uses var(--fs-eyebrow)', () => {
    const overlineMatch = baseCss.match(/\.overline\s*{([^}]*)}/s);

    expect(overlineMatch).not.toBeNull();
    const overlineBody = overlineMatch?.[1] ?? '';

    expect(overlineBody).toMatch(/font-size:\s*var\(--fs-eyebrow\);/);
    expect(overlineBody).toMatch(/letter-spacing:\s*0\.18em;/);
    expect(overlineBody).toMatch(/text-transform:\s*uppercase;/);
    expect(overlineBody).toMatch(/font-weight:\s*var\(--fw-semibold\)|600/);
  });

  it('h2..h5 font-size use their fluid token; p uses var(--fs-body)', () => {
    for (const level of ['h2', 'h3', 'h4', 'h5']) {
      const match = baseCss.match(new RegExp(`${level}\\s*{([^}]*)}`, 's'));

      expect(match).not.toBeNull();
      expect(match?.[1]).toMatch(
        new RegExp(`font-size:\\s*var\\(--fs-${level}\\);`),
      );
    }

    const pMatch = baseCss.match(/(?:^|\s)p\s*{([^}]*)}/s);

    expect(pMatch).not.toBeNull();
    expect(pMatch?.[1]).toMatch(/font-size:\s*var\(--fs-body\);/);
  });

  it('base.css contains no kebab-case component class selector', () => {
    const kebabClassSelector = /\.[a-z][a-z0-9]*-[a-z][a-z0-9-]*\s*[,{]/;

    expect(baseCss).not.toMatch(kebabClassSelector);
  });
});

describe('utilities.css : u-noise (verbatim from atom-noise-overlay.html)', () => {
  it('u-noise base declares the decorative overlay geometry', () => {
    const noiseMatch = utilitiesCss.match(/\.u-noise\s*{([^}]*)}/s);

    expect(noiseMatch).not.toBeNull();
    const body = noiseMatch?.[1] ?? '';

    expect(body).toMatch(/position:\s*absolute;/);
    expect(body).toMatch(/inset:\s*0;/);
    expect(body).toMatch(/pointer-events:\s*none;/);
  });

  it('u-noise coarse variant uses the verbatim fractalNoise SVG at 220px with multiply blend', () => {
    expect(utilitiesCss).toContain("baseFrequency='0.9' numOctaves='2'");
    expect(utilitiesCss).toMatch(/background-size:\s*220px 220px;/);
    expect(utilitiesCss).toMatch(/mix-blend-mode:\s*multiply;/);
  });

  it('-fine modifier uses the verbatim fractalNoise SVG at 160px', () => {
    expect(utilitiesCss).toMatch(/\.u-noise\.-fine/);
    expect(utilitiesCss).toContain("baseFrequency='1.7' numOctaves='1'");
    expect(utilitiesCss).toMatch(/background-size:\s*160px 160px;/);
  });

  it("dark theme switches u-noise blend mode to screen via [data-theme='dark']", () => {
    expect(utilitiesCss).toMatch(
      /\[data-theme=['"]dark['"]\][^{]*\.u-noise[^{]*{[^}]*mix-blend-mode:\s*screen;/s,
    );
  });

  it('u-placeholder base class is defined in utilities.css', () => {
    expect(utilitiesCss).toMatch(/\.u-placeholder\s*{/);
  });

  it('u-radial base class is defined in utilities.css', () => {
    expect(utilitiesCss).toMatch(/\.u-radial\s*{/);
  });
});

describe('tokens.css : z-index scale', () => {
  it('defines the 5 z-index tokens verbatim', () => {
    expect(tokensCss).toContain('--z-base: 0;');
    expect(tokensCss).toContain('--z-content: 2;');
    expect(tokensCss).toContain('--z-footer: 30;');
    expect(tokensCss).toContain('--z-header: 40;');
    expect(tokensCss).toContain('--z-noise: 50;');
  });
});

describe('package.json : exports', () => {
  it('exposes tokens.css, app.css, base.css and utilities.css', () => {
    expect(packageJson.exports?.['./tokens.css']).toBe(
      './src/assets/css/tokens.css',
    );
    expect(packageJson.exports?.['./app.css']).toBe('./src/assets/css/app.css');
    expect(packageJson.exports?.['./base.css']).toBe(
      './src/assets/css/base.css',
    );
    expect(packageJson.exports?.['./utilities.css']).toBe(
      './src/assets/css/utilities.css',
    );
  });
});

describe('spacing scale : no effective px drift on existing usages', () => {
  const scaleFromTokens = new Map<string, string>();

  for (const [, index, value] of tokensCss.matchAll(
    /--space-(\d+):\s*([^;]+);/g,
  )) {
    scaleFromTokens.set(index, value.trim());
  }

  // px values the pre-renumbering usages resolved to, in source order.
  // Asserted as a subsequence: later passes may add new tokenized usages,
  // but none of these historical ones may shift.
  const EXPECTED_USAGES: Array<[string, string[]]> = [
    ['components/Atoms/Button/style.css', ['4px', '8px', '16px']],
    ['components/Atoms/Link/style.css', ['8px']],
    [
      'components/Atoms/Prose/style.css',
      ['40px', '40px', '24px', '24px', '60px'],
    ],
    ['components/Organisms/Header/style.css', ['24px', '24px', '24px', '64px']],
    ['components/Organisms/Hero/style.css', ['16px']],
    ['components/Organisms/MainNav/style.css', ['16px', '24px']],
  ];

  const srcDir = path.resolve(dirname, '../../..');

  it.each(EXPECTED_USAGES)(
    '%s keeps its effective px values',
    (file, sizes) => {
      const css = fs.readFileSync(path.join(srcDir, file), 'utf-8');
      const resolved = [...css.matchAll(/var\(\s*--space-(\d+)\s*\)/g)].map(
        ([, index]) => scaleFromTokens.get(index),
      );

      let cursor = 0;

      for (const size of sizes) {
        cursor = resolved.indexOf(size, cursor) + 1;

        expect(cursor, `missing ${size} in ${file}`).toBeGreaterThan(0);
      }
    },
  );
});
