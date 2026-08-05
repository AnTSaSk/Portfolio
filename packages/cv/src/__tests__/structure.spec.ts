import { readFileSync } from 'node:fs';
import path from 'node:path';

import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

const read = (relPath: string): string =>
  readFileSync(path.resolve(process.cwd(), relPath), 'utf-8');

const parseDoc = (relPath: string): Document =>
  new JSDOM(read(relPath)).window.document;

// ---------------------------------------------------------------------------
// Shared assertions
// ---------------------------------------------------------------------------

function assertLandmarks(doc: Document): void {
  // Exactly 1 <h1>
  expect(doc.querySelectorAll('h1')).toHaveLength(1);

  // <header> and <main> present
  expect(doc.querySelector('header')).not.toBeNull();
  expect(doc.querySelector('main')).not.toBeNull();

  // At least 4 <section> elements, each with an <h2>
  const sections = Array.from(doc.querySelectorAll('section'));
  expect(sections.length).toBeGreaterThanOrEqual(4);
  for (const section of sections) {
    expect(section.querySelector('h2')).not.toBeNull();
  }
}

function assertContactLinks(doc: Document): void {
  // At least one mailto: link
  const mailtoLink = doc.querySelector('a[href^="mailto:"]');
  expect(mailtoLink).not.toBeNull();

  // At least one Linkedin link
  const links = Array.from(doc.querySelectorAll('a[href]'));
  const linkedinLink = links.find((a) => {
    const href = a.getAttribute('href') ?? '';
    return href.includes('linkedin.com') || href.includes('/in/alexis-besson');
  });
  expect(linkedinLink).toBeDefined();
}

// ---------------------------------------------------------------------------
// EN index.html
// ---------------------------------------------------------------------------

describe('CV EN (index.html) : structure sémantique', () => {
  let doc: Document;

  // Lazy init to avoid failing at describe-time if file is missing
  const getDoc = (): Document => {
    if (!doc) doc = parseDoc('index.html');
    return doc;
  };

  it('<html> has lang="en"', () => {
    expect(getDoc().documentElement.getAttribute('lang')).toBe('en');
  });

  it('landmarks présents : <header>, <main>, un seul <h1>, au moins 4 <section> avec <h2>', () => {
    assertLandmarks(getDoc());
  });

  it('liens de contact : mailto et Linkedin présents', () => {
    assertContactLinks(getDoc());
  });

  it('sections attendues EN (skills/competences, contact, experience, education)', () => {
    const h2Texts = Array.from(getDoc().querySelectorAll('h2')).map(
      (h) => h.textContent?.toLowerCase().trim() ?? '',
    );
    const hasSkills = h2Texts.some(
      (t) => t.includes('skill') || t.includes('competence'),
    );
    const hasContact = h2Texts.some((t) => t.includes('contact'));
    const hasExperience = h2Texts.some((t) => t.includes('experience'));
    const hasEducation = h2Texts.some((t) => t.includes('education'));

    expect(hasSkills).toBe(true);
    expect(hasContact).toBe(true);
    expect(hasExperience).toBe(true);
    expect(hasEducation).toBe(true);
  });

  it('au moins 3 blocs expérience et 2 entrées formation', () => {
    const d = getDoc();
    // Work experience: at least 3 repeated blocks under experience section
    const experienceSection = Array.from(d.querySelectorAll('section')).find(
      (s) =>
        s
          .querySelector('h2')
          ?.textContent?.toLowerCase()
          .includes('experience'),
    );
    expect(experienceSection).toBeDefined();
    const experienceEntries = experienceSection?.querySelectorAll('article');
    expect(experienceEntries?.length ?? 0).toBeGreaterThanOrEqual(3);

    // Education: at least 3 entries (grouped layout, items not articles)
    const educationSection = Array.from(d.querySelectorAll('section')).find(
      (s) =>
        s.querySelector('h2')?.textContent?.toLowerCase().includes('education'),
    );
    expect(educationSection).toBeDefined();
    const educationEntries = educationSection?.querySelectorAll(
      '.t-cv__education-item',
    );
    expect(educationEntries?.length ?? 0).toBeGreaterThanOrEqual(2);
  });

  it('le bloc Arneo EN contient "Next.js" (harmonisation FR/EN)', () => {
    const html = read('index.html');
    expect(html).toContain('Next.js');
  });
});

// ---------------------------------------------------------------------------
// FR fr/index.html
// ---------------------------------------------------------------------------

describe('CV FR (fr/index.html) : structure sémantique', () => {
  let doc: Document;

  const getDoc = (): Document => {
    if (!doc) doc = parseDoc('fr/index.html');
    return doc;
  };

  it('<html> has lang="fr"', () => {
    expect(getDoc().documentElement.getAttribute('lang')).toBe('fr');
  });

  it('landmarks présents : <header>, <main>, un seul <h1>, au moins 4 <section> avec <h2>', () => {
    assertLandmarks(getDoc());
  });

  it('liens de contact : mailto et Linkedin présents', () => {
    assertContactLinks(getDoc());
  });

  it('sections attendues FR (compétences, contact, expérience, formation)', () => {
    const h2Texts = Array.from(getDoc().querySelectorAll('h2')).map(
      (h) => h.textContent?.toLowerCase().trim() ?? '',
    );
    const hasCompetences = h2Texts.some(
      (t) => t.includes('compétence') || t.includes('competence'),
    );
    const hasContact = h2Texts.some((t) => t.includes('contact'));
    const hasExperience = h2Texts.some(
      (t) => t.includes('expérience') || t.includes('experience'),
    );
    const hasFormation = h2Texts.some((t) => t.includes('formation'));

    expect(hasCompetences).toBe(true);
    expect(hasContact).toBe(true);
    expect(hasExperience).toBe(true);
    expect(hasFormation).toBe(true);
  });

  it('au moins 3 blocs expérience et 2 entrées formation', () => {
    const d = getDoc();
    const experienceSection = Array.from(d.querySelectorAll('section')).find(
      (s) =>
        s
          .querySelector('h2')
          ?.textContent?.toLowerCase()
          .includes('expérience') ||
        s
          .querySelector('h2')
          ?.textContent?.toLowerCase()
          .includes('experience'),
    );
    expect(experienceSection).toBeDefined();
    const experienceEntries = experienceSection?.querySelectorAll('article');
    expect(experienceEntries?.length ?? 0).toBeGreaterThanOrEqual(3);

    const formationSection = Array.from(d.querySelectorAll('section')).find(
      (s) =>
        s.querySelector('h2')?.textContent?.toLowerCase().includes('formation'),
    );
    expect(formationSection).toBeDefined();
    const formationEntries = formationSection?.querySelectorAll(
      '.t-cv__education-item',
    );
    expect(formationEntries?.length ?? 0).toBeGreaterThanOrEqual(2);
  });
});
