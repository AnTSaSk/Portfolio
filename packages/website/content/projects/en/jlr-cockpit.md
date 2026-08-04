---
title: 'Cockpit'
year: 2019
stack:
    - Vue 3
    - TypeScript
    - Vite
    - Storybook
shortDescription: 'Internal reporting application for Jaguar Land Rover, from POC to Europe-wide rollout.'
description: 'Designed the front-end POC of an internal reporting application for Jaguar Land Rover, which grew to equip most French dealerships, then all of Europe. Several dozen filterable dashboards on fresh CRM data, and a Vue 2 to Vue 3 migration.'
period: '2019-2026'
role: 'Lead Front-end'
client: 'Jaguar Land Rover'
cover:
    src: /img/Projects/JLR_Cover.jpg
    width: 2560
    height: 1440
gallery:
    - src: /img/Projects/JLR_Gallery_Hero.jpg
      width: 2560
      height: 1440
    - src: /img/Projects/JLR_Gallery_Tile-1.jpg
      width: 1600
      height: 1200
    - src: /img/Projects/JLR_Gallery_Tile-2.jpg
      width: 1600
      height: 1200
---

## Context

Jaguar Land Rover was running its sales activity without any centralized tool: every dealership reported its figures by hand, by fax or spreadsheet, with no overall view. The Cockpit project came out of that gap: bring all of this data into a single application to give the teams a clear picture of their sales, leads and after-sales.

## Role

As Lead Developer, I supported the early scoping of the need before building a Vue 2 POC, an early, testable version that let the client see for themselves the time and coordination gains on the table. The POC won them over, and the project moved to a V1: I led a team of front-end developers who started from the POC, while keeping ownership of the architecture and code reviews. All senior, they gradually took over the development. I later came back on occasion, for major evolutions and to drive the Vue 2 to Vue 3 migration.

## Delivery

With the client won over by the application, the requests followed: new dashboards, new data to integrate, year after year. The application ended up covering the whole sales cycle, from lead tracking to vehicle portfolio, through to after-sales and margins. Every dashboard filters down to a fine grain, by region, group, dealership, brand or model, with access rights tailored to each role, from regional manager to after-sales director. Adopted by most French dealerships, the tool was then rolled out across Europe.

The real challenge was never displaying the data or handling those dozens of dashboards, but designing the layer that feeds them, filters included, to cut screen wait time to a minimum. The Python back end processes millions of rows and needs a few seconds to fetch, crunch and return the data. So the whole job was to absorb that wait on the front end. Preloading content before it appears, controlled transitions from one screen to the next, animated loaders: an interface that keeps the user waiting gracefully rather than staring at a frozen screen.

## Results

From a simple POC, Cockpit became Jaguar Land Rover's reference reporting tool, adopted both in the offices and in the dealerships, which feed in their own data to keep it alive. Rolled out across Europe, it is still in place and used by JLR today.

---

_The screenshots shown are mockups of the application: all the data displayed (dealerships, figures, metrics) is fictitious._
