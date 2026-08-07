// Verifies the sitemap actually served by a production build. A unit test on the filtering
// logic would not catch the failure modes seen while building this: a missing `sitemap` field
// in the @nuxt/content manifest, and callbacks broken by serialisation, both of which empty
// the sitemap without any function being at fault.
// Contract: `.output` must already be built. Assertions map to AC-SMAP-* in
// docs/reference/sitemap-content-urls-acceptance-criteria.md.
import { spawn } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const websiteRoot = fileURLToPath(new URL('..', import.meta.url));
const contentRoot = join(websiteRoot, 'content');
const serverEntry = join(websiteRoot, '.output/server/index.mjs');

const KINDS = ['blog', 'projects'] as const;
const FR_SEGMENT: Record<(typeof KINDS)[number], string> = {
  blog: 'blog',
  projects: 'projets',
};

type ContentItem = {
  kind: (typeof KINDS)[number];
  locale: 'en' | 'fr';
  slug: string;
  draft: boolean;
  url: string;
};

const readContent = (): ContentItem[] => {
  const items: ContentItem[] = [];

  for (const kind of KINDS) {
    for (const locale of ['en', 'fr'] as const) {
      const dir = join(contentRoot, kind, locale);

      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        // Detail pages resolve a flat `[slug]`, so a nested file would 404 on the site while
        // still reaching the sitemap — and a non-recursive read would hide it from these
        // assertions. Fail loudly rather than skip silently.
        if (entry.isDirectory()) {
          throw new Error(
            `nested content is not supported: ${join(kind, locale, entry.name)}`,
          );
        }

        if (!entry.name.endsWith('.md')) {
          continue;
        }

        const slug = entry.name.replace(/\.md$/, '');
        const body = readFileSync(join(dir, entry.name), 'utf-8');
        const draft = /^draft:\s*(?:true|"true"|'true')\s*$/im.test(
          body.split('---')[1] ?? '',
        );

        items.push({
          kind,
          locale,
          slug,
          draft,
          url:
            locale === 'en'
              ? `/${kind}/${slug}`
              : `/fr/${FR_SEGMENT[kind]}/${slug}`,
        });
      }
    }
  }

  return items;
};

const freePort = async (): Promise<number> =>
  new Promise((resolve, reject) => {
    const srv = createServer();

    srv.once('error', reject);
    srv.listen(0, () => {
      const addr = srv.address();
      const port = typeof addr === 'object' && addr ? addr.port : 0;

      srv.close(() => resolve(port));
    });
  });

const startServer = async (
  port: number,
): Promise<{ stop: () => Promise<void> }> => {
  const proc = spawn('node', [serverEntry], {
    env: { ...process.env, PORT: String(port), NITRO_PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const stop = async (): Promise<void> => {
    proc.kill('SIGTERM');
    await new Promise((r) => setTimeout(r, 300));

    if (!proc.killed) {
      proc.kill('SIGKILL');
    }
  };

  const ready = new Promise<void>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('server did not report "Listening on" in 60s')),
      60_000,
    );

    proc.stdout.on('data', (chunk: Buffer) => {
      if (chunk.toString().includes('Listening on')) {
        clearTimeout(timer);
        resolve();
      }
    });
    proc.once('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`server exited early with code ${code}`));
    });
  });

  await ready;

  return { stop };
};

type SitemapEntry = {
  loc: string;
  alternates: string[];
  hasLastmod: boolean;
};

const parseSitemap = (xml: string): SitemapEntry[] =>
  [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
    loc: decodeURIComponent(
      (/<loc>(.*?)<\/loc>/.exec(block)?.[1] ?? '').replace(
        /^https?:\/\/[^/]+/,
        '',
      ),
    ),
    alternates: [...block.matchAll(/href="(.*?)"/g)].map(([, href]) =>
      decodeURIComponent(href.replace(/^https?:\/\/[^/]+/, '')),
    ),
    hasLastmod: block.includes('<lastmod>'),
  }));

const main = async (): Promise<void> => {
  const content = readContent();
  const port = await freePort();
  const base = `http://localhost:${port}`;
  const { stop } = await startServer(port);
  const failures: string[] = [];

  try {
    const sitemaps: Record<string, SitemapEntry[]> = {};

    for (const locale of ['en-US', 'fr-FR']) {
      const res = await fetch(`${base}/__sitemap__/${locale}.xml`);

      if (!res.ok) {
        failures.push(`${locale}.xml responded ${res.status}`);
        continue;
      }

      sitemaps[locale] = parseSitemap(await res.text());
    }

    const all = Object.values(sitemaps).flat();
    const locs = new Set(all.map((e) => e.loc || '/'));

    // AC-SMAP-1: no draft URL anywhere.
    for (const item of content.filter((c) => c.draft)) {
      if (locs.has(item.url)) {
        failures.push(`AC-SMAP-1: draft exposed — ${item.url}`);
      }
    }

    // AC-SMAP-3 / AC-SMAP-5: every published item is present.
    for (const item of content.filter((c) => !c.draft)) {
      if (!locs.has(item.url)) {
        failures.push(`AC-SMAP-5: published content missing — ${item.url}`);
      }
    }

    // AC-SMAP-7: FR home and FR blog listing.
    for (const required of ['/fr', '/fr/blog']) {
      if (!locs.has(required)) {
        failures.push(`AC-SMAP-7: missing FR route — ${required}`);
      }
    }

    // AC-SMAP-8: no untranslated FR URL.
    for (const loc of locs) {
      if (/^\/fr\/(projects|about|legal)(\/|$)/.test(loc)) {
        failures.push(`AC-SMAP-8: untranslated FR URL — ${loc}`);
      }
    }

    // AC-SMAP-6 + AC-SMAP-9: every URL and every alternate resolves.
    const toCheck = new Set<string>();

    for (const entry of all) {
      toCheck.add(entry.loc || '/');
      entry.alternates.forEach((a) => toCheck.add(a || '/'));
    }

    for (const path of toCheck) {
      const res = await fetch(`${base}${encodeURI(path)}`, {
        redirect: 'manual',
      });

      if (res.status !== 200) {
        failures.push(`AC-SMAP-6/9: ${path} responded ${res.status}`);
      }
    }

    // AC-SMAP-9: content URLs carry all three alternates.
    const contentLocs = new Set(
      content.filter((c) => !c.draft).map((c) => c.url),
    );

    for (const entry of all.filter((e) => contentLocs.has(e.loc))) {
      if (entry.alternates.length !== 3) {
        failures.push(
          `AC-SMAP-9: ${entry.loc} carries ${entry.alternates.length} alternates, expected 3`,
        );
      }
    }

    // AC-SMAP-10: no lastmod on content URLs.
    for (const entry of all.filter((e) => contentLocs.has(e.loc))) {
      if (entry.hasLastmod) {
        failures.push(`AC-SMAP-10: ${entry.loc} carries a lastmod`);
      }
    }

    const published = content.filter((c) => !c.draft).length;
    const drafts = content.length - published;

    console.log(
      `sitemap: ${all.length} URLs across 2 locales, ${published} published content files, ${drafts} drafts excluded`,
    );
  } finally {
    await stop();
  }

  if (failures.length) {
    console.error(`\n${failures.length} failure(s):`);
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }

  console.log('sitemap verification passed');
};

await main();
