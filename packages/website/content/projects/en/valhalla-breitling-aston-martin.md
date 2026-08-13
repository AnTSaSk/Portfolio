---
title: Valhalla
year: 2026
stack:
    - Nuxt
    - TypeScript
    - Pinia
    - i18n
shortDescription: Event site with a watch configurator for the Breitling × Aston Martin collaboration.
description: 'Designed and built the front end of a luxury event site end to end: a watch configurator with live preview, a scroll-free experience tailored to a high-end audience, delivered on a tight timeline. Lighthouse Performance 100/100 desktop (LCP 0.7s) and 91/100 mobile, CLS 0, despite high-resolution visuals.'
role: Lead Front-end Developer
client: Breitling × Aston Martin
draft: true
links:
    - label: Website
      href: https://valhalla.breitling.com/fr
cover:
    src: /img/Projects/Valhalla_Cover.jpg
    width: 2560
    height: 1440
gallery:
    - src: /img/Projects/Valhalla_Gallery_Hero.jpg
      width: 2560
      height: 1440
    - src: /img/Projects/Valhalla_Gallery_Tile-1.jpg
      width: 1600
      height: 1200
    - src: /img/Projects/Valhalla_Gallery_Tile-2.jpg
      width: 1600
      height: 1200
---

## Context

Aston Martin and Breitling teamed up on the Valhalla project: a site that lets every buyer of the supercar receive a personalised Breitling watch. On it, the client picks their model, men's or women's, then configures it to their taste. I designed the entire front end of that experience, on a project with demanding standards: high-resolution visuals, smooth navigation, performance, and a flawless result both on screen and in the code.

## Role

On this project I owned the front end, from architecture through to production. A back-end lead handled the back office and the synchronisation with the client's CRM in parallel. The configurator, the form and the page transitions without reloads that the creative team wanted all called for a real client-side application. Templating was ruled out early in favour of **Nuxt**, whose server-side rendering gave the best performance without sacrificing client-side fluidity.

## Delivery

The configurator is the centrepiece of the site. The client personalises their watch and sees the preview update in real time, from one combination to the next, **with no transition or flicker**. To achieve this, each new image is loaded and decoded in the background before it appears: it only replaces the previous one once it is ready to display. Every combination has its own dedicated visual, resolved from the product references supplied by the client.

To round out the experience, I built several features:

- showing or hiding the interface to view the watch in detail;
- restarting the configuration from scratch;
- switching between straps.

All of it without scrolling, and fluid, even on mobile.

On the performance side, the goal was to keep high-resolution visuals without weighing the site down. I built a Node script that reworks the supplied images and outputs them in WebP and AVIF at several sizes, for mobile as well as desktop, adding up to **more than 400 generated visuals**. Mobile responsiveness, not planned at the outset, was added mid-project and refined until the rendering was right, to keep the original experience intact.

## Results

Performance measured, high-resolution visuals included:

- **Desktop**: Lighthouse Performance **100/100**, LCP **0.7s**;
- **Mobile**: Lighthouse Performance **91/100**;
- **CLS of 0** across the board.
