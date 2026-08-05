import { readFileSync } from 'node:fs';
import path from 'node:path';

import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

const read = (relPath: string): string =>
  readFileSync(path.resolve(process.cwd(), relPath), 'utf-8');

const parseDoc = (relPath: string): Document =>
  new JSDOM(read(relPath)).window.document;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getLogo(doc: Document): Element {
  const svg = doc.querySelector('.t-cv__logo svg');
  expect(svg, '<svg> inside .t-cv__logo must be present').not.toBeNull();
  return svg!;
}

// ---------------------------------------------------------------------------
// Semantic regression guard, shared across both locales
// ---------------------------------------------------------------------------

function assertLandmarksRegression(doc: Document, locale: string): void {
  // Exactly 1 <h1>
  expect(doc.querySelectorAll('h1'), `[${locale}] exactly 1 <h1>`).toHaveLength(
    1,
  );

  // <header> and <main> present
  expect(
    doc.querySelector('header'),
    `[${locale}] <header> present`,
  ).not.toBeNull();
  expect(
    doc.querySelector('main'),
    `[${locale}] <main> present`,
  ).not.toBeNull();

  // At least 4 <section>, each with an <h2>
  const sections = Array.from(doc.querySelectorAll('section'));
  expect(
    sections.length,
    `[${locale}] at least 4 <section>`,
  ).toBeGreaterThanOrEqual(4);
  for (const section of sections) {
    expect(
      section.querySelector('h2'),
      `[${locale}] every <section> must have an <h2>`,
    ).not.toBeNull();
  }
}

// ---------------------------------------------------------------------------
// No text content inside <svg> elements
// ---------------------------------------------------------------------------

function assertNoSvgText(doc: Document, locale: string): void {
  // The SVG is purely decorative, no <text> tags (ATS text must never
  // live inside SVG paths or text nodes)
  const svgTextTags = doc.querySelectorAll('svg text');
  expect(
    svgTextTags,
    `[${locale}] no <text> element inside any <svg>`,
  ).toHaveLength(0);
}

// ---------------------------------------------------------------------------
// Logo bicolor invariants
// ---------------------------------------------------------------------------

function assertLogoBicolor(doc: Document, locale: string): void {
  const svg = getLogo(doc);

  // <svg> must carry aria-hidden="true" (decorative, ATS reads real text)
  expect(
    svg.getAttribute('aria-hidden'),
    `[${locale}] logo svg must have aria-hidden="true"`,
  ).toBe('true');

  // The "A" path must use fill="currentColor" (driven by CSS color property)
  const currentColorPath = svg.querySelector('path[fill="currentColor"]');
  expect(
    currentColorPath,
    `[${locale}] logo must have a path with fill="currentColor" (the "A" glyph)`,
  ).not.toBeNull();

  // At least one path must reference a gradient fill (the green bars)
  const paths = Array.from(svg.querySelectorAll('path'));
  const gradientPath = paths.find((p) => {
    const fill = p.getAttribute('fill') ?? '';
    return fill.startsWith('url(#') && fill.toLowerCase().includes('gradient');
  });
  expect(
    gradientPath,
    `[${locale}] logo must have at least one path with fill="url(#...gradient...)"`,
  ).toBeDefined();

  // The gradient definition(s) must exist inside the <svg>
  const defs = svg.querySelector('defs');
  expect(
    defs,
    `[${locale}] logo <svg> must contain a <defs> block`,
  ).not.toBeNull();
  const linearGradients = svg.querySelectorAll('defs linearGradient');
  expect(
    linearGradients.length,
    `[${locale}] logo must define at least one <linearGradient>`,
  ).toBeGreaterThanOrEqual(1);

  // No width/height attribute on the <svg> (sizing via CSS only)
  expect(
    svg.hasAttribute('width'),
    `[${locale}] logo svg must NOT have a width attribute`,
  ).toBe(false);
  expect(
    svg.hasAttribute('height'),
    `[${locale}] logo svg must NOT have a height attribute`,
  ).toBe(false);

  // viewBox must be present (geometry preservation)
  expect(
    svg.getAttribute('viewBox'),
    `[${locale}] logo svg must have a viewBox`,
  ).not.toBeNull();
}

// ---------------------------------------------------------------------------
// Gradient titles print guard (ADR-0042): letter spans + intact textContent
// ---------------------------------------------------------------------------

const GRADIENT_TITLES = {
  EN: {
    name: 'Alexis Besson',
    sections: [
      'Skills',
      'Contact Information',
      'Work Experience',
      'Education',
      'Interests',
    ],
  },
  FR: {
    name: 'Alexis Besson',
    sections: [
      'Compétences',
      'Contact',
      'Expérience',
      'Formation',
      'Centres d’intérêt',
    ],
  },
} as const;

// Collapses formatting whitespace the way inline rendering (and PDF text
// extraction) does, so the guard survives HTML reformatting
const collapse = (text: string | null): string =>
  (text ?? '').replace(/\s+/g, ' ').trim();

function assertLetterSpans(el: Element, label: string, locale: string): void {
  // Every non-space character wrapped in its own <span>, whitespace kept as
  // plain text nodes so PDF text extraction preserves word boundaries
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === 3) {
      expect(
        node.textContent,
        `[${locale}] ${label}: text nodes between spans must be whitespace only`,
      ).toMatch(/^\s+$/);
    } else {
      expect(
        (node as Element).tagName,
        `[${locale}] ${label}: only <span> children allowed`,
      ).toBe('SPAN');
      expect(
        node.textContent,
        `[${locale}] ${label}: exactly one non-space character per span`,
      ).toMatch(/^\S$/);
    }
  }

  const expectedSpanCount = (el.textContent ?? '').replace(/\s/g, '').length;
  expect(
    el.querySelectorAll('span'),
    `[${locale}] ${label}: one span per non-space character`,
  ).toHaveLength(expectedSpanCount);
  expect(
    expectedSpanCount,
    `[${locale}] ${label}: gradient title must contain spans`,
  ).toBeGreaterThan(0);
}

function assertGradientTitles(doc: Document, locale: 'EN' | 'FR'): void {
  const expected = GRADIENT_TITLES[locale];

  const name = doc.querySelector('.t-cv__name');
  expect(name, `[${locale}] .t-cv__name present`).not.toBeNull();
  expect(
    collapse(name!.textContent),
    `[${locale}] name textContent must stay intact`,
  ).toBe(expected.name);
  assertLetterSpans(name!, '.t-cv__name', locale);

  const titles = Array.from(doc.querySelectorAll('.t-cv__section-title'));
  expect(
    titles.map((title) => collapse(title.textContent)),
    `[${locale}] section titles textContent must stay intact`,
  ).toEqual([...expected.sections]);
  for (const [index, title] of titles.entries()) {
    assertLetterSpans(
      title,
      `.t-cv__section-title "${expected.sections[index]}"`,
      locale,
    );
  }
}

describe('CV gradient titles print guard (ADR-0042)', () => {
  it('EN: name and section titles are letter-spanned with intact textContent', () => {
    assertGradientTitles(parseDoc('index.html'), 'EN');
  });

  it('FR: name and section titles are letter-spanned with intact textContent', () => {
    assertGradientTitles(parseDoc('fr/index.html'), 'FR');
  });
});

// ---------------------------------------------------------------------------
// Isomorphism: structural parity between EN and FR
// ---------------------------------------------------------------------------

interface StructureCounts {
  sections: number;
  articles: number;
  cvHeaderPresent: boolean;
  cvSectionClasses: number;
  cvExperienceClasses: number;
}

function extractStructure(doc: Document): StructureCounts {
  return {
    sections: doc.querySelectorAll('section').length,
    articles: doc.querySelectorAll('article').length,
    cvHeaderPresent: doc.querySelector('.t-cv__header') !== null,
    cvSectionClasses: doc.querySelectorAll('.t-cv__section').length,
    cvExperienceClasses: doc.querySelectorAll('.t-cv__experience').length,
  };
}

// ---------------------------------------------------------------------------
// EN index.html
// ---------------------------------------------------------------------------

describe('CV EN (index.html) : visual guards', () => {
  let doc: Document;
  const getDoc = (): Document => {
    if (!doc) doc = parseDoc('index.html');
    return doc;
  };

  it('regression guard : landmarks structure unchanged, 1 h1, header, main, au moins 4 sections avec h2', () => {
    assertLandmarksRegression(getDoc(), 'EN');
  });

  it('no <text> element inside any <svg> (CV text never lives in SVG)', () => {
    assertNoSvgText(getDoc(), 'EN');
  });

  it('logo svg is aria-hidden="true"', () => {
    expect(getLogo(getDoc()).getAttribute('aria-hidden')).toBe('true');
  });

  it('logo has path with fill="currentColor" (the "A" glyph, CSS-driven color)', () => {
    const svg = getLogo(getDoc());
    expect(svg.querySelector('path[fill="currentColor"]')).not.toBeNull();
  });

  it('logo has at least one gradient-fill path (the green bars)', () => {
    const paths = Array.from(getLogo(getDoc()).querySelectorAll('path'));
    const gradientPath = paths.find((p) => {
      const fill = p.getAttribute('fill') ?? '';
      return (
        fill.startsWith('url(#') && fill.toLowerCase().includes('gradient')
      );
    });
    expect(gradientPath).toBeDefined();
  });

  it('logo svg has no width/height attributes (CSS-only sizing)', () => {
    const svg = getLogo(getDoc());
    expect(svg.hasAttribute('width')).toBe(false);
    expect(svg.hasAttribute('height')).toBe(false);
  });

  it('logo svg has viewBox (geometry preserved)', () => {
    expect(getLogo(getDoc()).getAttribute('viewBox')).not.toBeNull();
  });

  it('logo bicolor full invariant (currentColor + gradient + no width/height + viewBox)', () => {
    assertLogoBicolor(getDoc(), 'EN');
  });
});

// ---------------------------------------------------------------------------
// FR fr/index.html
// ---------------------------------------------------------------------------

describe('CV FR (fr/index.html) : visual guards', () => {
  let doc: Document;
  const getDoc = (): Document => {
    if (!doc) doc = parseDoc('fr/index.html');
    return doc;
  };

  it('regression guard : landmarks structure unchanged, 1 h1, header, main, au moins 4 sections avec h2', () => {
    assertLandmarksRegression(getDoc(), 'FR');
  });

  it('no <text> element inside any <svg> (CV text never lives in SVG)', () => {
    assertNoSvgText(getDoc(), 'FR');
  });

  it('logo svg is aria-hidden="true"', () => {
    expect(getLogo(getDoc()).getAttribute('aria-hidden')).toBe('true');
  });

  it('logo has path with fill="currentColor" (the "A" glyph, CSS-driven color)', () => {
    const svg = getLogo(getDoc());
    expect(svg.querySelector('path[fill="currentColor"]')).not.toBeNull();
  });

  it('logo has at least one gradient-fill path (the green bars)', () => {
    const paths = Array.from(getLogo(getDoc()).querySelectorAll('path'));
    const gradientPath = paths.find((p) => {
      const fill = p.getAttribute('fill') ?? '';
      return (
        fill.startsWith('url(#') && fill.toLowerCase().includes('gradient')
      );
    });
    expect(gradientPath).toBeDefined();
  });

  it('logo svg has no width/height attributes (CSS-only sizing)', () => {
    const svg = getLogo(getDoc());
    expect(svg.hasAttribute('width')).toBe(false);
    expect(svg.hasAttribute('height')).toBe(false);
  });

  it('logo svg has viewBox (geometry preserved)', () => {
    expect(getLogo(getDoc()).getAttribute('viewBox')).not.toBeNull();
  });

  it('logo bicolor full invariant (currentColor + gradient + no width/height + viewBox)', () => {
    assertLogoBicolor(getDoc(), 'FR');
  });
});

// ---------------------------------------------------------------------------
// Isomorphism : EN vs FR structural parity
// ---------------------------------------------------------------------------

describe('CV isomorphism EN/FR (DOM order invariant)', () => {
  it('section count, article count, and main ABEM classes identical in EN and FR', () => {
    const enStructure = extractStructure(parseDoc('index.html'));
    const frStructure = extractStructure(parseDoc('fr/index.html'));

    expect(frStructure.sections, 'section count must match').toBe(
      enStructure.sections,
    );
    expect(frStructure.articles, 'article count must match').toBe(
      enStructure.articles,
    );
    expect(frStructure.cvHeaderPresent, '.t-cv__header present in both').toBe(
      enStructure.cvHeaderPresent,
    );
    expect(
      frStructure.cvSectionClasses,
      '.t-cv__section count must match',
    ).toBe(enStructure.cvSectionClasses);
    expect(
      frStructure.cvExperienceClasses,
      '.t-cv__experience count must match',
    ).toBe(enStructure.cvExperienceClasses);
  });
});
