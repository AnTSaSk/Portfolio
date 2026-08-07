import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(dirname, '../../..');

const readComponentCss = (relative: string): string =>
  fs.readFileSync(path.join(srcDir, 'components', relative), 'utf-8');

const ruleOf = (css: string, selector: string): string => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return new RegExp(`${escaped}\\s*\\{[^}]*\\}`).exec(css)?.[0] ?? '';
};

describe('spacing derogations preserved', () => {
  const tagCss = readComponentCss('Atoms/Tag/style.css');

  it('keeps the Tag optical padding untouched', () => {
    expect(tagCss).toContain('padding: 4px 9px 2px 11px;');
    expect(tagCss).toContain('padding: 3px 9px;');
  });

  it('does not tokenize border widths', () => {
    expect(tagCss).toContain('border: 1px solid var(--border);');
  });
});

describe('arbitrated spacing values consume the scale', () => {
  const cases: Array<[string, string, string, string]> = [
    [
      'Header scrolled halves the resting padding',
      'Organisms/Header/style.css',
      '.o-header.-scrolled',
      'padding-block: calc(var(--space-6) / 2);',
    ],
    [
      'Header group gap',
      'Organisms/Header/style.css',
      '.o-header__group',
      'gap: var(--space-3);',
    ],
    [
      'Header actions group gap',
      'Organisms/Header/style.css',
      '.o-header__group.-actions',
      'gap: var(--space-5);',
    ],
    [
      'CardProject meta rhythm',
      'Molecules/CardProject/style.css',
      '.m-cardProject__meta',
      'margin-block-end: var(--space-3);',
    ],
    [
      'CardProject title rhythm',
      'Molecules/CardProject/style.css',
      '.m-cardProject__title',
      'margin-block-end: var(--space-3);',
    ],
    [
      'TOC head rhythm',
      'Molecules/TOC/style.css',
      '.m-toc__head',
      'margin-block-end: var(--space-4);',
    ],
    [
      'LangSwitcher gap',
      'Atoms/LangSwitcher/style.css',
      '.a-langSwitcher',
      'gap: var(--space-3);',
    ],
    [
      'CardArticle date rhythm',
      'Molecules/CardArticle/style.css',
      '.m-cardArticle__date',
      'margin-block-end: var(--space-3);',
    ],
    [
      'MainNav minified padding',
      'Organisms/MainNav/style.css',
      '.o-mainNav.-min',
      'padding: var(--space-3);',
    ],
    [
      'MetaList links gap',
      'Molecules/MetaList/style.css',
      '.m-metaList__links',
      'gap: var(--space-3);',
    ],
    [
      'Feature meta rhythm',
      'Organisms/Feature/style.css',
      '.o-feature__meta',
      'margin-block-end: var(--space-3);',
    ],
  ];

  it.each(cases)('%s', (_label, file, selector, declaration) => {
    expect(ruleOf(readComponentCss(file), selector)).toContain(declaration);
  });

  it('Button ghost padding consumes the scale', () => {
    const rule = ruleOf(
      readComponentCss('Atoms/Button/style.css'),
      '.a-button.-ghost',
    );

    expect(rule).toContain('padding: var(--space-2) var(--space-3);');
  });

  it('Header mobile padding consumes the scale', () => {
    const css = readComponentCss('Organisms/Header/style.css');

    expect(css).not.toMatch(/padding-block:\s*14px/);
    expect(css).toMatch(/padding-block:\s*var\(--space-4\)/);
  });

  it('Head listing title uses the arbitrated 16px/4px rhythm', () => {
    const rule = ruleOf(
      readComponentCss('Organisms/Head/style.css'),
      '.o-head.-listing .o-head__title',
    );

    expect(rule).toContain('margin-block: var(--space-4) var(--space-1);');
  });

  it('CardArticle title rhythm consumes the scale', () => {
    const rule = ruleOf(
      readComponentCss('Molecules/CardArticle/style.css'),
      '.m-cardArticle .m-cardArticle__title',
    );

    expect(rule).toContain('margin-block-end: var(--space-3);');
  });
});
