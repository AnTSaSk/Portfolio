---
title: 'Arneo'
year: 2025
stack:
    - Next.js
    - TypeScript
    - Drupal headless
    - Storybook
shortDescription: "Rebuild of the Arneo agency's editorial site in Next.js (SSR) on a headless Drupal, with strong visual and performance stakes."
description: 'Full rebuild of the Arneo agency website, as front-end lead: an editorial site with a strong visual identity, server-rendered in Next.js on a headless Drupal, with a block system for content editors, a caching strategy for performance, and animations across much of the site.'
period: '2025'
links:
    - label: 'Website'
      href: 'https://arneo.io/fr'
role: 'Lead Front-end'
client: 'Arneo'
cover:
    src: /img/Projects/Arneo_Cover.jpg
    width: 2560
    height: 1440
gallery:
    - src: /img/Projects/Arneo_Gallery_Hero.jpg
      width: 2560
      height: 1440
    - src: /img/Projects/Arneo_Gallery_Tile-1.jpg
      width: 1600
      height: 1200
    - src: /img/Projects/Arneo_Gallery_Tile-2.jpg
      width: 1600
      height: 1200
---

## Context

Arneo rebuilt its agency website, a rich editorial site with a strong visual identity. Three demands drove the project: bold animations, solid performance and good search ranking, all on content that changes continuously. I was front-end lead on it.

## Role

I led the front-end team while developing alongside it. The site runs on a headless Drupal, whose API the Next.js front end consumes. My work centered on the front-end architecture, around two priorities: performance and the freedom left to content editors.

## Delivery

The front end is Next.js, server-rendered. On an editorial site whose content changes constantly, SSG was out: the render has to reflect the latest version on every visit, without giving up any speed or search ranking. Each page is built from blocks defined in Drupal, which a single component, the BlockManager, renders in the chosen order. Content editors compose their pages freely, with no limit on blocks and without touching the code.

Performance rests on a multi-level cache, from the front end with Next.js to the back end with Drupal. I built the entire front-end cache with Next.js; then, to invalidate a specific piece of content, I created an API reserved for the back end, letting it trigger that invalidation as soon as content is edited. Data shows almost instantly, without ever serving a stale version. That was the stake: on a site this loaded, with its visual layer and its third-party libraries, performance collapses without the cache.

The experience comes through in a committed art direction and in the animations, present across much of the site. Movements triggered on scroll, refined micro-interactions, with plenty of elements appearing on hover, down to animated SVGs. They give the site its rhythm, without ever overdoing it. Images load lazily, a placeholder giving way to the real visual once it is ready. CSS was favored over JavaScript wherever possible, to keep pages light and preserve real smoothness in the browser.

## Results

The site has been live since mid-2025. The bet was to hold high performance despite a heavy visual load and many third-party libraries: Lighthouse measures, on desktop, 97 in performance, 96 in accessibility, 92 in best practices and 92 in SEO. The cache keeps them at that level despite everything the page carries.
