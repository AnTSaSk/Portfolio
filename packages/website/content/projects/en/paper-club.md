---
title: 'Paper.club'
year: 2019
stack:
    - Vue 2
    - Vue 3
    - TypeScript
    - Vite
shortDescription: 'SaaS netlinking platform built from scratch and maintained for several years.'
description: 'Designed and built the front end, as front-end lead and primary developer, of a leading European SaaS netlinking platform for the Ydylle group (Eskimoz): advertiser/publisher marketplace, order and payment flow, wallet, collaborative writing tool. Drove the Vue 2 to Vue 3 migration on a production codebase.'
period: '2019-2025'
links:
    - label: 'Application'
      href: 'https://app.paper.club/'
role: 'Lead Front-end'
client: 'Ydylle (Eskimoz)'
cover:
    src: /img/Projects/PPC_Cover.jpg
    width: 2560
    height: 1440
gallery:
    - src: /img/Projects/PPC_Gallery_Hero.jpg
      width: 2560
      height: 1440
    - src: /img/Projects/PPC_Gallery_Tile-1.jpg
      width: 1600
      height: 1200
    - src: /img/Projects/PPC_Gallery_Tile-2.jpg
      width: 1600
      height: 1200
---

## Context

Paper.club is a netlinking marketplace: advertisers buy sponsored articles to boost the ranking of their own sites, while publishers sell visibility on theirs. An advertiser browses a directory of sites, each described by its topic, its audiences and its SEO metrics, then orders an article from the publisher of their choice. The platform is a brand of the Ydylle group (Eskimoz), one of the leading European players in the field. Development started in mid-2019.

## Role

I designed and built the entire front end, as front-end lead and primary developer. On my own at first, then with the help of several developers through the most intense phase up to the V1, before taking the front end back over for maintenance and further work. A back-end lead built the API in parallel throughout the project. When a feature came in without a mockup, my creative background took over: designing the missing screens using nothing but the existing design system, for an interface that stays consistent.

## Delivery

The front end covers a broad application: an admin back office, onboarding for new clients, a search engine with cumulative filters to explore the directory, order tracking. Three pieces stand out: the order and payment flow together with the wallet system, the article writing tool, and the Vue 2 to Vue 3 migration.

The whole ordering mechanism lives in the platform: the advertiser fills a cart, a payment flow handles the transaction, and the application orchestrates the exchanges between advertiser and publisher through to the article going live. Alongside it, every profile has a full wallet, with a transaction history, payment methods and top-ups, across roles with very different rights, from advertiser to publisher and on to the agencies and their consultants.

The trickiest part is the article writing tool. It covers the whole path, from writing the content, formatting included, through to its validation. Comments are placed directly on the article text, which opens up back-and-forth between advertiser and publisher to refine it passage by passage until the final version.

The last major stage was the migration from Vue 2 to Vue 3, on an already sizeable production codebase. The project was never put on hold: the migration moved forward on a separate branch, kept in sync with day-to-day changes, while ongoing development continued in Vue 2. A round of client advisory work helped push the big projects back until after the switch, to avoid shipping them twice, once per framework. It was a demanding exercise, between dependencies that had not yet made the jump to Vue 3 and the daily workload to keep up in parallel.

## Results

Launched in mid-2021, after more than a year of development, the platform was then maintained and expanded over four years. What was meant as a first version turned into a long-term engagement, with trust renewed year after year until 2025. Paper.club is still online today and gives access to more than 120 000 media outlets, one of the largest catalogs on the market.

_The screenshots shown are mockups of the application: all the data displayed is fictitious._
{.l-page__disclaimer}
