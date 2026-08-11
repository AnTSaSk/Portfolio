---
title: "Portfolio v1: the launch, and what's behind it"
description: "The launch of my portfolio, a project I'd had in mind since 2023: what you'll find on it, why the design system is public, and the choices behind the site."
date: 2026-08-11
tags:
    - Nuxt
    - Storybook
    - Open-source
    - Design System
cover:
    src: /img/Blog/N0_Cover.jpg
    width: 2560
    height: 1440
    caption: "I put a photo of my cat here to boost this article's traffic."
author: Alexis Besson
draft: false
---

There's a page that's been sitting online since 2023. A plain "coming soon" landing page, put there while I built something better (spoiler: the wait lasted three years). I already had that something better in mind, and had even started it in Figma. Then plenty of other topics took priority, and the portfolio stayed on standby.

![The old "coming soon" landing page from 2023](/img/Blog/N0_OldLanding.png){width=1732 height=1000}

## Back to 2023

The 2023 Figma file still exists, and it tells you pretty well where I left off. A Moodboard page, filled with portfolio screenshots, photos, illustrations: everything that spoke to me, that I liked, or that felt like me. A Mockups page, where I had started designing the homepage based on my personal visual identity, created quite a few years ago and one I still like just as much.

While mocking up that homepage, I realized a design system would be needed to do things properly. I'm not a designer, I don't have the trade's processes, and I didn't go about it in the best order, but I had foundations that helped. I started with the first components (Heading, Text, CTA), and the work stopped there (we all know how it ends, a side project without a deadline).

![The 2023 Figma: moodboard and homepage mockups](/img/Blog/N0_Figma2023.png){width=1919 height=1051}

## Three years later

The comeback happened through a path I hadn't planned: generative AI. I started using it in early 2026 in a professional context, then made it my own through lots of experimentation, with homemade skills reworked over and over again. It eventually found its way into my side projects: a Discord bot, an economy-tracking platform for a game where the economy is central, a Vite plugin, a Figma plugin. And little by little, the urge to pick the portfolio back up returned, starting from the original idea: the 2023 design, the other pages to mock up, the foundations to revisit.

What changed the most between 2023 and today, with the help of AI I think, is my ambition for this project. Originally, it was meant to be a "simple" portfolio to show my projects, with a public repository to show how I architect, how I design, the choices I make. Today it also includes a blog, whose first article you happen to be reading, and a design methodology that has evolved with AI, without ever losing quality or bypassing the important steps.

The blog is the idea that had been on my mind the longest. I've always loved sharing what I'm working on, putting it in front of other developers. I just couldn't find the time: doing it seriously takes a lot, and I could never carve it out between work, personal life, and the projects running on the side. Social media may come later, if the urge is there and it interests people. But I'd rather start with a single place: here. One article a month, no more: that pace isn't a constraint I'm setting for myself, it's the time it takes. Time to pick a topic close to my heart, dig deep enough to cover it fully, and turn it into something complete.

## The guided tour

The result is the website you're reading. A showcase in the full sense: what I can do, my experience, the projects I've carried as a Lead as well as a developer, and the things I discover along the way. On the project side, you'll find among others [Breitling × Aston Martin](/projects/valhalla-breitling-aston-martin), [Jaguar Land Rover](/projects/jlr-cockpit), [Paper.club](/projects/paper-club) and [Emeis](/projects/emeis). What makes me all the more proud is that every one of these projects is still in production today, without a rebuild (so far... knock on wood). The oldest ones, like Jaguar Land Rover or Paper.club, have been running for years: proof that the front-end choices made back then were the "right" ones, and that they hold up over time. Maintenance happens without piling up technical debt, the products keep evolving with new features, and Paper.club even went through a Vue 2 to Vue 3 migration without a rebuild.

## Everything is public

If there's one decision close to my heart on this project, it's the choice to make everything public. The repository has been public from the start, out of a taste for sharing and open source, and because it's a double showcase, a full exposure even: the visible side, the website, and the hidden side, the code. It's not a constraint, quite the opposite. I stand behind my choices, my workflows and the quality of what I produce, so I might as well show them.

Concretely, the monorepo is available to everyone on [GitHub](https://github.com/AnTSaSk/Portfolio){target="_blank" rel="noopener"}, with its two packages: the website and the design system. The latter can also be browsed directly online, via [Storybook](https://storybook.js.org){target="_blank" rel="noopener"}.

![The portfolio design system in Storybook](/img/Blog/N0_Storybook.png){width=1730 height=995}

Open source is, by the way, a conviction I've held for a very long time and one I find to be an important part of our craft. We exchange, we share, and that's how we discover new approaches, learn, and widen our vision of development. So if anyone wants to take inspiration from my work, reuse a piece of it, or just have a look: it's on the house!

## Under the hood

On the technical side, every choice would deserve its own article, and some will get one. But I can already walk you through the decisions that shape this website, and above all the why behind each one.

Let's start with the foundation: SSR, with [Nuxt](https://nuxt.com){target="_blank" rel="noopener"}. I've enjoyed the [Vue](https://vuejs.org){target="_blank" rel="noopener"} ecosystem for over eight years (over [React](https://react.dev){target="_blank" rel="noopener"}, let's be honest), and a portfolio is a personal project above all, where you're allowed to have some fun. But the choice goes beyond fun: for several years now there's been barely any reason to start a SPA, and React itself systematically steers newcomers towards its SSR meta-frameworks. There are still cases where a SPA holds its ground, the internal app with no SEO stakes, or the small app where spinning up a Node server would be overkill. And SSR is far from being only about SEO anyway.

I had also tried [Astro](https://astro.build){target="_blank" rel="noopener"}, back in 2023. I really like the framework-agnostic idea and the [islands](https://docs.astro.build/en/concepts/islands/){target="_blank" rel="noopener"}, but it was my first experience with it, and it didn't click (I absolutely need to give it another try today). As for SSG, I didn't even consider it: in all my experience, the only case where I find it appropriate is the landing page. As soon as there's regular content and multiple languages, it gets more complicated than SSR. So I stayed on the 2023 Nuxt (updated since, I promise).

The monorepo was a given. It keeps the design system and the website cleanly separated, each in its own package, and lets me reuse that design system elsewhere the day I need it.

That design system is where everything starts. On this project as on any other, I always begin with the components ([Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/){target="_blank" rel="noopener"}, [ABEM](https://css-tricks.com/abem-useful-adaptation-bem/){target="_blank" rel="noopener"} classes) before tackling the rest. At launch it counts 12 atoms, 9 molecules and 7 organisms, and behind those numbers there are choices. Heading and Text, for instance, are full components rather than simple CSS classes. They are the most used elements of the site (by far), and making them components makes maintenance much simpler. Another one: the variant prop. When several elements share the same behavior and the same logic but with strong design variations, I group them into a single component declined in variants, rather than several components that would half look alike.

For content, I picked [@nuxt/content](https://content.nuxt.com){target="_blank" rel="noopener"} over a CMS. With an editorial team of exactly one, at one article a month, a full CMS would have served one purpose only: spending more time administering it than writing. I didn't run a benchmark: staying within Nuxt, this solution came naturally, and I had only heard good things about it. Without a comparison I won't claim it's the best, but it does exactly what I need: my articles are plain markdown files, versioned with the rest of the code. One article, one commit: simple, and it suits me just fine.

For styling, no [Sass](https://sass-lang.com){target="_blank" rel="noopener"}: native CSS. Sass and I go way back: it established itself as the way to write styles when I started in web development, and for many years that was deserved. But with modern CSS ([@layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer){target="_blank" rel="noopener"}, @container, and everything that has landed these past few years), I don't think that's the case anymore. The only thing I haven't found again is selector concatenation (the famous `&__element` that made ABEM nesting feel natural... that one, I'll admit, I miss). It was also a good opportunity to dive back in: CSS has evolved so much that I'm still discovering properties today, having stepped back from integration work these past years to focus on JS/TS/Node. The topic deserves far more than a paragraph: it will be the next article on this blog (a little teasing)!

A word on performance, in full transparency: the Lighthouse scores I can give today are measured locally, not on the live site (the real numbers may fluctuate, for better or for worse... we'll see!). As I write this, the homepage shows a performance score of 100 on desktop and 90 on mobile, and the other pages sit between 98 and 99 on desktop, between 77 and 84 on mobile. Yes, there's a gap: only desktop is optimized for now. Mobile isn't my priority for the launch, its optimization will come later (more on that at the end of this article).

What won't move, though, is the safety net. The CI runs Lighthouse tests on the site's key pages, with thresholds to meet before a deployment is validated. On the menu: a performance score of at least 90, an LCP under 2.5 s, a CLS under 0.1, and a weight budget per page (set about 15 % above measured weight). Miss one threshold, and the deployment fails. These tests come on top of the other CI steps (lint, type-check, unit tests, dependency audit): I simply refuse to deploy to production a project that brings regressions, whether qualitative, functional or performance-related.

## A word on the method

One last thing about how I built all of this. Once the project structure was set and the technologies chosen, I brought in [Claude Code](https://claude.com/claude-code){target="_blank" rel="noopener"} for the dev part, with my own homemade skills: my conventions, my linters. The time saved is precious, and I concede nothing on my standards. This is far from vibe coding: I read every single line that gets produced, and the finishing work remains real work (I sometimes rewrite entire pieces, despite the skills and my instructions). It's actually my current conviction, and I don't think it will change in six months (fine, maybe in seven). AI is very good at executing, but it will always fall short on the architect part of the job: taking a step back, anticipating, imagining what will be useful tomorrow (a reusable generic function, the scalability of an architecture). Because it always reasons from the concrete.

And to keep my hands on the wheel the whole way, I built my own orchestration agent, Orchestra: it drives specialized sub-agents, each equipped with the right skills, following an extremely precise workflow, in five steps:

- an exhaustive scoping interview, the need first, the solution second;
- specifications written down in black and white, acceptance criteria included, before a single line of code;
- a plan cut into atomic phases;
- phases executed in TDD: the failing tests first, the minimal implementation to turn them green, then the quality gates (lint, type-check, tests);
- an adversarial review by a fresh-context sub-agent, whose only job is to poke holes in what was just produced.

At every key step, a STOP: I'm the one who approves (or not). Nothing gets bypassed, no step is skipped, and the state of the work lives on disk rather than in memory, so even a session crash loses nothing. Here too, the topic deserves far more than a bullet list: it will be the article right after the CSS one (yes, more teasing!).

## Before you go

What's next? I don't really have a roadmap, but two projects are already identified for a v1.1.0. The optimization of the mobile version (as promised above), and the integration of a CV package: a CV in HTML, exportable to PDF and ATS-proof (translation: optimized for recruiters' tools). On the blog side, you already know the next two topics, unless you've been reading diagonally.

Before we part, a small confession: this is my first article, and writing isn't the exercise I'm most comfortable with. So if you have feedback, on substance as well as on style, I'll gladly take it.

One last thing before letting you explore my portfolio. The styleguide: you'll only find the direct link here, and only here, in this article (fine, it's also in the repo's READMEs, but on the website this is the only place). I like the idea that it has to be earned a little, and that the rest reveals itself along the visit. Enjoy the tour!

[Right this way →](https://styleguide.alexisbesson.fr){target="_blank" rel="noopener"}
