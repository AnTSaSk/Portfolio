import { readFileSync } from 'node:fs';
import path from 'node:path';

import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

const read = (relPath: string): string =>
  readFileSync(path.resolve(process.cwd(), relPath), 'utf-8');

const parseDoc = (relPath: string): Document =>
  new JSDOM(read(relPath)).window.document;

// ---------------------------------------------------------------------------
// ATS guards
// ---------------------------------------------------------------------------

function assertNoImgInBody(doc: Document): void {
  // No <img> in body: CV content is pure HTML text + inline SVG only
  const images = doc.body.querySelectorAll('img');
  expect(images).toHaveLength(0);
}

function assertNoSvgTextElements(doc: Document): void {
  // SVG <text> elements would mean vectorised text: forbidden
  const svgTextNodes = doc.querySelectorAll('svg text');
  expect(svgTextNodes).toHaveLength(0);
}

function assertDomReadingOrder(doc: Document, lang: 'en' | 'fr'): void {
  // Logical reading order in the DOM textContent must be:
  //   "Alexis Besson", Skills/Compétences h2, first employer (Arneo), Education/Formation h2
  const fullText = doc.body.textContent ?? '';

  const nameIdx = fullText.indexOf('Alexis Besson');
  const skillsKeyword = lang === 'en' ? 'Skills' : 'Compétences';
  const skillsIdx = fullText.indexOf(skillsKeyword);
  const educationKeyword = lang === 'en' ? 'Education' : 'Formation';
  const educationIdx = fullText.indexOf(educationKeyword);

  // First employer name in the experience section, present in both languages
  const firstEmployerIdx = fullText.indexOf('Arneo', skillsIdx + 1);

  expect(nameIdx).toBeGreaterThanOrEqual(0);
  expect(skillsIdx).toBeGreaterThan(nameIdx);
  expect(firstEmployerIdx).toBeGreaterThan(skillsIdx);
  expect(educationIdx).toBeGreaterThan(firstEmployerIdx);
}

function assertKeyTextPresent(doc: Document): void {
  // Critical data is real HTML text (not images)
  const text = doc.body.textContent ?? '';
  expect(text).toContain('alexis.bessonweb@protonmail.com');
  expect(text).toContain('Arneo');
  expect(text).toContain('ADFAB');
}

// ---------------------------------------------------------------------------
// EN index.html
// ---------------------------------------------------------------------------

describe('CV EN (index.html) : ATS guards', () => {
  let doc: Document;

  const getDoc = (): Document => {
    if (!doc) doc = parseDoc('index.html');
    return doc;
  };

  it('aucun <img> dans le body (le texte du CV est du HTML pur)', () => {
    assertNoImgInBody(getDoc());
  });

  it("aucun <text> dans les <svg> (le texte n'est pas vectorise)", () => {
    assertNoSvgTextElements(getDoc());
  });

  it('ordre logique DOM : nom, Skills, 1er poste, Education', () => {
    assertDomReadingOrder(getDoc(), 'en');
  });

  it('données clés présentes comme texte réel : email, Arneo, ADFAB', () => {
    assertKeyTextPresent(getDoc());
  });
});

// ---------------------------------------------------------------------------
// FR fr/index.html
// ---------------------------------------------------------------------------

describe('CV FR (fr/index.html) : ATS guards', () => {
  let doc: Document;

  const getDoc = (): Document => {
    if (!doc) doc = parseDoc('fr/index.html');
    return doc;
  };

  it('aucun <img> dans le body (le texte du CV est du HTML pur)', () => {
    assertNoImgInBody(getDoc());
  });

  it("aucun <text> dans les <svg> (le texte n'est pas vectorise)", () => {
    assertNoSvgTextElements(getDoc());
  });

  it('ordre logique DOM : nom, Compétences, 1er poste, Formation', () => {
    assertDomReadingOrder(getDoc(), 'fr');
  });

  it('données clés présentes comme texte réel : email, Arneo, ADFAB', () => {
    assertKeyTextPresent(getDoc());
  });
});
