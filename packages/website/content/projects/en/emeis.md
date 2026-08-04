---
title: 'Emeis'
year: 2025
stack:
    - Vanilla JS
    - Twig
    - Drupal
    - Storybook
shortDescription: "Multi-theme front-end architecture and store locator for a healthcare group's country sites, with strong SEO stakes."
description: 'Reworked the front-end architecture, as front-end lead and primary developer, of the country sites of a healthcare group present in more than twenty countries: a multi-theme Drupal foundation built on CSS variables, a styleguide decoupled from the parent theme, conditional asynchronous JS loading, and full front-end development of the store locator (Google Maps, cumulative filters by activity and by geographic scope).'
period: '2025-2026'
links:
    - label: 'Website'
      href: 'https://www.emeis.fr/fr'
role: 'Lead Front-end'
client: 'Emeis'
cover:
    src: /img/Projects/EMEIS_Cover.jpg
    width: 2560
    height: 1440
gallery:
    - src: /img/Projects/EMEIS_Gallery_Hero.jpg
      width: 2560
      height: 1440
    - src: /img/Projects/EMEIS_Gallery_Tile-1.jpg
      width: 1600
      height: 1200
    - src: /img/Projects/EMEIS_Gallery_Tile-2.jpg
      width: 1600
      height: 1200
---

## Context

Emeis is a healthcare group present in more than twenty countries, with over a thousand facilities, from nursing homes to clinics. After rebranding, the group launched country sites to support its international growth, separate from the corporate site. These country sites are where I stepped in: each has its own structure, content and URL, yet all rest on a shared foundation.

## Role

As front-end lead and primary developer on the project, my core contribution was to rethink the front-end architecture to absorb the multi-theme setup, one Emeis activity mapping to one theme. I decoupled the styleguide from the Drupal structure to make it independent of the parent theme, built the missing components and reworked the existing ones so they hold up across every theme. In parallel, I developed the entire front end of the store locator, in coordination with the back-end developer who built the Drupal module.

## Delivery

The multi-theme architecture is the centerpiece of the project. It follows Drupal's parent/child theme principle: a parent theme, Emeis, carries all the components and assets; each child theme depends on it and overrides only what is strictly needed. The whole visual identity rests on CSS variables, which a child theme redefines to apply its own colors, without ever touching the component itself. The groundwork was substantial: inventorying and mapping every variable up front, to build the system on solid foundations.

JavaScript loading follows the same spirit. A global script checks, through the CSS classes present in the page, which component scripts need to load, then loads them asynchronously through dynamic imports. The goal: cut each page's JS payload to a minimum, on a project where performance and SEO come first.

The store locator is the most significant piece of application logic. The front end reads the URL parameters to build the filters and fire the API calls: one for the facility listing, paginated, another for the markers on the Google Maps map, with its cluster handling. No framework: on a Drupal site served through Twig, a JavaScript framework would have added an unnecessary extra load.

The tricky part is the filters, specific to each activity. When users reach the store locator of a given activity, they see only that activity's filters; on the multi-activity store locator, they first pick an activity before getting to its filters. On top of that comes a geographic logic, from country down to city, recentering the map and surfacing only the facilities in the relevant area. That many cases to handle one by one in the code.

## Results

The first country site is live, and the foundation now serves as the base for rolling out the next ones, country by country. For an editorial site of this scale, performance scores hold up well, and the client is satisfied with the result. The project is still active, with new countries currently opening.
