---
title: "Portfolio v1 : le lancement, et ce qu'il y a derrière"
description: "Le lancement de mon portfolio, un projet en tête depuis 2023 : ce qu'on y trouve, pourquoi le design system est public, et les choix derrière le site."
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
    caption: "J'ai mis une photo de mon chat pour augmenter le trafic de l'article."
author: Alexis Besson
---

Il y a une page qui traîne en ligne depuis 2023. Une simple landing, « en attendant », posée là le temps de faire mieux (spoiler : l'attente a duré trois ans). Le mieux, je l'avais pourtant déjà en tête, et même déjà commencé sur Figma. Et puis beaucoup d'autres sujets sont devenus prioritaires, et le portfolio est resté en standby.

![L'ancienne landing « en attendant » de 2023](/img/Blog/N0_OldLanding.png){width=1732 height=1000}

## Retour en 2023

Le Figma de 2023 existe toujours, et il raconte assez bien où j'en étais. Une page Moodboard, remplie de screenshots de portfolios, de photos, d'illustrations : tout ce qui me parlait, que j'aimais ou qui me représentait. Une page Maquettes, où j'avais commencé à designer la homepage en me basant sur ma charte graphique personnelle, créée il y a déjà un certain nombre d'années et qui me plaît toujours autant.

En maquettant cette homepage, je me suis fait la remarque qu'un design system serait nécessaire pour faire les choses proprement. Je ne suis pas designer, je n'ai pas les process du métier, et je n'ai pas procédé dans le meilleur ordre, mais j'avais des bases qui m'ont aidé. J'ai commencé par les premiers composants (Heading, Text, CTA), et le chantier s'est arrêté là (on sait tous comment ça finit, un side-project sans deadline).

![Le Figma de 2023 : moodboard et maquettes de la homepage](/img/Blog/N0_Figma2023.png){width=1919 height=1051}

## Trois ans plus tard

La reprise s'est faite par un chemin que je n'avais pas prévu : l'IA générative. J'ai commencé à l'utiliser début 2026 dans un contexte professionnel, puis je me la suis appropriée à force d'expérimentations, avec des skills maison refondus maintes et maintes fois. Elle a fini par s'inviter dans mes side-projects : un bot Discord, une plateforme de suivi d'économie pour un jeu où celle-ci est centrale, un plugin Vite, un plugin Figma. Et petit à petit, l'envie de reprendre le portfolio est revenue, en repartant de l'idée originale : le design de 2023, les autres pages à maquetter, les bases à reprendre.

Ce qui a le plus changé entre 2023 et aujourd'hui, avec l'aide de l'IA je pense, c'est mon ambition dans ce projet. À l'origine, ce devait être un « simple » portfolio pour montrer mes projets, avec un repository public pour montrer ma façon d'architecturer, de concevoir, les choix effectués. Aujourd'hui s'y ajoutent un blog, dont vous lisez d'ailleurs le premier article, et une méthodologie de conception qui a évolué avec l'IA, sans jamais perdre en qualité ni bypasser les étapes importantes.

Le blog, c'est l'idée qui me trottait dans la tête depuis le plus longtemps. J'ai toujours aimé partager ce sur quoi je travaille, le confronter au regard d'autres développeurs. Le temps me manquait : y aller vraiment en réclame beaucoup, et je n'arrivais jamais à le dégager entre le travail, la vie perso et les projets qui tournent en parallèle. Les réseaux sociaux viendront peut-être, plus tard, si l'envie est là et que ça intéresse du monde. Mais je préfère commencer par un seul endroit : ici. Un article par mois, pas plus : ce rythme n'est pas une contrainte que je me fixe, c'est le temps nécessaire. Le temps de choisir un sujet qui me tient à cœur, de creuser assez loin pour en faire le tour, et d'en tirer quelque chose de complet.

## La visite guidée

Le résultat, c'est le site que vous lisez. Une vitrine, au sens complet : ce que je sais faire, mon expérience, les projets que j'ai portés en tant que Lead comme en tant que développeur, et les choses que je découvre en chemin. Côté projets, vous y trouverez entre autres [Breitling × Aston Martin](/fr/projets/valhalla-breitling-aston-martin), [Jaguar Land Rover](/fr/projets/jlr-cockpit), [Paper.club](/fr/projets/paper-club) ou encore [Emeis](/fr/projets/emeis). J'en suis d'autant plus fier que tous ces projets sont encore en production aujourd'hui, sans refonte (pour l'instant... je touche du bois). Les plus anciens, comme Jaguar Land Rover ou Paper.club, tournent depuis des années : la preuve que les choix front de l'époque étaient les « bons », et qu'ils tiennent dans la durée. La maintenance se fait sans accumuler de dette technique, les produits continuent d'évoluer avec de nouvelles features, et Paper.club a même traversé une migration de Vue 2 vers Vue 3 sans refonte.

## Tout est public

S'il y a une décision qui me tient à cœur sur ce projet, c'est le choix de tout rendre public. Le repository l'est depuis le début, par envie de partage et d'open source, et parce que c'est une double vitrine, voire une mise à nu : la face visible, le site, et la face cachée, le code. Ce n'est pas une contrainte, au contraire. J'assume mes choix, mes workflows et la qualité de ce que je produis, alors autant les montrer.

Concrètement, le monorepo est accessible à tous sur [GitHub](https://github.com/AnTSaSk/Portfolio){target="_blank" rel="noopener"}, avec ses deux packages : le site et le design system. Ce dernier se consulte aussi directement en ligne, via [Storybook](https://storybook.js.org){target="_blank" rel="noopener"}.

![Le design system du portfolio dans Storybook](/img/Blog/N0_Storybook.png){width=1730 height=995}

L'open source, c'est d'ailleurs une conviction que j'ai depuis très longtemps et qui, je trouve, est une part importante de notre métier. On échange, on partage, et c'est comme ça qu'on découvre de nouvelles approches, qu'on apprend et qu'on élargit notre vision du développement. Donc si quelqu'un veut s'inspirer de mon travail, en reprendre un bout ou juste y jeter un œil, c'est cadeau !

## Les coulisses techniques

Côté technique, chaque choix mériterait son propre article, et certains l'auront. Mais je peux déjà raconter les décisions qui structurent le site, et surtout le pourquoi derrière chacune.

Commençons par la base : du SSR, avec [Nuxt](https://nuxt.com){target="_blank" rel="noopener"}. J'apprécie l'écosystème [Vue](https://vuejs.org){target="_blank" rel="noopener"} depuis plus de huit ans (préférence à [React](https://react.dev){target="_blank" rel="noopener"}, soyons honnête), et un portfolio est un projet personnel avant tout, où l'on a le droit de se faire plaisir. Mais le choix va au-delà du plaisir : cela fait déjà plusieurs années qu'il n'y a quasiment plus d'intérêt à partir sur une SPA, et React lui-même pousse systématiquement les nouveaux venus vers ses meta-frameworks SSR. Il reste bien sûr des cas où la SPA se défend, l'application interne sans enjeu de référencement, ou la petite application où monter un serveur Node serait disproportionné. Et le SSR ne sert d'ailleurs pas qu'au référencement, loin de là.

J'avais aussi essayé [Astro](https://astro.build){target="_blank" rel="noopener"}, dès 2023. J'aime beaucoup l'idée du framework agnostic et des [islands](https://docs.astro.build/en/concepts/islands/){target="_blank" rel="noopener"}, mais c'était ma première expérience avec, et je n'ai pas accroché (il faut absolument que je le re-teste aujourd'hui). Quant au SSG, je n'y ai même pas pensé : de toutes mes expériences, le seul cas où je le trouve approprié, c'est la landing page. Dès qu'il y a du contenu régulier et du multilingue, ça devient plus compliqué que du SSR. Donc je suis resté sur le Nuxt de 2023 (mis à jour depuis, je vous rassure).

Le monorepo, lui, s'imposait de lui-même. Il me permet de garder le design system et le site bien séparés, chacun son package, et de pouvoir réutiliser ce design system ailleurs le jour où j'en aurai besoin.

Ce design system, c'est par lui que tout commence. Sur ce projet comme sur les autres, je démarre toujours par les composants ([Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/){target="_blank" rel="noopener"}, classes en [ABEM](https://css-tricks.com/abem-useful-adaptation-bem/){target="_blank" rel="noopener"}) avant d'attaquer le reste. Au lancement, il compte 12 atomes, 9 molécules et 7 organismes, et derrière ces chiffres il y a des choix. Heading et Text, par exemple, sont des composants à part entière plutôt que de simples classes CSS. Ce sont les éléments les plus utilisés du site (de très loin), et en faire des composants rend la maintenance bien plus simple. Autre réflexion, la prop variant. Quand plusieurs éléments partagent le même comportement et la même logique mais avec de fortes variations de design, je les regroupe en un seul composant décliné en variants, plutôt qu'en plusieurs composants qui se ressembleraient à moitié.

Pour le contenu, j'ai choisi [@nuxt/content](https://content.nuxt.com){target="_blank" rel="noopener"} plutôt qu'un CMS. L'équipe éditoriale se résumant à moi-même, à raison d'un article par mois, un CMS complet n'aurait servi qu'à une chose : passer plus de temps à l'administrer qu'à écrire. Je n'ai pas fait de benchmark : en restant sur Nuxt, cette solution s'est imposée naturellement, et je n'en avais entendu que du bien. Sans comparatif, je ne dirai pas que c'est la meilleure, mais elle fait exactement ce dont j'ai besoin : mes articles sont de simples fichiers markdown, versionnés avec le reste du code. Un article, un commit : c'est simple, et ça me convient très bien.

Côté styles, pas de [Sass](https://sass-lang.com){target="_blank" rel="noopener"} : du CSS natif. Sass et moi, c'est une longue histoire : il s'était imposé comme la solution dès mes débuts dans le web, et pendant de longues années c'était mérité. Mais avec le CSS moderne ([@layer](https://developer.mozilla.org/fr/docs/Web/CSS/@layer){target="_blank" rel="noopener"}, @container, et tout ce qui a débarqué ces dernières années), je pense que ce n'est plus le cas. La seule chose que je n'ai pas retrouvée, c'est la concaténation de sélecteurs (le fameux `&__element` qui rendait le nesting ABEM naturel... celui-là, je l'avoue, il me manque). C'était aussi une bonne occasion de m'y replonger : le CSS a tellement évolué que j'y découvre encore des propriétés aujourd'hui, ayant pris pas mal de recul sur l'intégration ces dernières années pour me concentrer sur le JS/TS/Node. Le sujet mérite bien plus qu'un paragraphe : ce sera donc le prochain article du blog (petit teasing) !

Un mot sur la performance, et en toute transparence : les scores Lighthouse que je peux donner aujourd'hui sont mesurés en local, pas sur le site en ligne (les chiffres réels pourront fluctuer, en mieux comme en moins bien... on verra !). À l'heure où j'écris, la homepage affiche un score performance de 100 sur desktop et de 90 sur mobile, et les autres pages se situent entre 98 et 99 sur desktop, entre 77 et 84 sur mobile. Oui, il y a un écart : seul le desktop est optimisé pour l'instant. Le mobile n'est pas ma priorité pour le lancement, son optimisation viendra plus tard (j'y reviens en fin d'article).

Ce qui ne bougera pas, en revanche, c'est le garde-fou. La CI lance des tests Lighthouse sur les pages clés du site, avec des seuils à atteindre pour valider un déploiement. Au menu : un score performance d'au moins 90, un LCP sous les 2,5 s, un CLS sous les 0,1, et un budget de poids par page (calé environ 15 % au-dessus du poids mesuré). Un seuil raté, et le déploiement échoue. Ces tests s'ajoutent aux autres étapes de la CI (lint, type-check, tests unitaires, audit de dépendances) : je refuse tout simplement de déployer en production un projet qui amène des régressions, qu'elles soient qualitatives, fonctionnelles ou de performance.

## Un mot sur la méthode

Un mot, enfin, sur la façon dont j'ai développé tout ça. Une fois la structure du projet posée et les technos choisies, je me suis assisté de [Claude Code](https://claude.com/claude-code){target="_blank" rel="noopener"} pour la partie dev, avec mes propres skills maison : mes conventions, mes linters. Le gain de temps est précieux, et je ne cède rien sur mes exigences. On reste loin du vibe coding : je relis l'intégralité de ce qui est produit, et la finition reste un vrai temps de travail (il m'arrive de réécrire des morceaux entiers, malgré les skills et mes indications). C'est d'ailleurs ma conviction du moment, et je ne pense pas qu'elle changera dans six mois (allez, peut-être dans sept). L'IA est très bonne pour exécuter, mais elle gardera toujours une lacune sur la partie architecte du métier : prendre du recul, anticiper, imaginer ce qui servira demain (une fonction générique réutilisable, la scalabilité d'une architecture). Parce qu'elle raisonne toujours à partir du concret.

Et pour garder la main tout du long, j'ai développé mon propre agent d'orchestration, Orchestra : il pilote des sous-agents spécialisés, chacun équipé des bons skills, en suivant un workflow extrêmement précis, en cinq temps :

- une interview de cadrage exhaustive, le besoin d'abord, la solution ensuite ;
- des spécifications posées noir sur blanc, critères d'acceptation compris, avant la moindre ligne de code ;
- un plan découpé en phases atomiques ;
- des phases exécutées en TDD : les tests qui échouent d'abord, l'implémentation minimale pour les faire passer au vert, puis les gates qualité (lint, type-check, tests) ;
- une review adversariale par un sous-agent au contexte vierge, dont le seul rôle est de prendre en défaut ce qui vient d'être produit.

À chaque étape clé, un STOP : c'est moi qui valide (ou pas). Rien n'est bypassé, aucune étape ne saute, et l'état du chantier vit sur le disque plutôt qu'en mémoire, donc même un crash de session ne fait rien perdre. Là aussi, le sujet mérite bien plus qu'une liste à puces : ce sera l'article d'après (oui, encore du teasing !).

## Avant de vous laisser

Ensuite ? Je n'ai pas vraiment de roadmap, mais deux chantiers sont déjà identifiés pour une v1.1.0. L'optimisation de la version mobile (comme promis plus haut), et l'intégration d'un package CV : un CV en HTML, exportable en PDF et ATS-proof (traduction : optimisé pour les outils des recruteurs). Côté blog, les deux prochains sujets, vous les connaissez déjà si vous n'avez pas lu en diagonale.

Avant de se quitter, une petite confession : c'est mon premier article, et la rédaction n'est pas l'exercice où je suis le plus à l'aise. Alors si vous avez des retours, sur le fond comme sur la forme, je les accepte avec plaisir.

Une dernière chose avant de vous laisser explorer mon portfolio. Le styleguide, vous ne trouverez le lien direct qu'ici, et seulement ici, dans cet article (bon, d'accord, il est aussi dans les README du repo, mais sur le site c'est le seul endroit). J'aime bien l'idée qu'il se mérite un peu, et que le reste se découvre au fil de la visite. Bonne visite à vous !

[C'est par ici →](https://styleguide.alexisbesson.fr){target="_blank" rel="noopener"}
