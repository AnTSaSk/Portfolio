---
title: Valhalla
year: 2026
stack:
    - Nuxt
    - TypeScript
    - Pinia
    - i18n
shortDescription: Site événementiel avec configurateur de montre pour la collaboration Breitling × Aston Martin.
description: "Conception et développement de bout en bout du front d'un site événementiel de luxe : un configurateur de montre avec aperçu en direct, une expérience sans scroll pensée pour le haut de gamme, livrée dans des délais courts. Lighthouse Performance 100/100 desktop (LCP 0,7 s) et 91/100 mobile, CLS 0, malgré des visuels haute définition."
role: Lead Développeur Front-end
client: Breitling × Aston Martin
highlight: true
links:
    - label: Site
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

## Contexte

Aston Martin et Breitling ont collaboré autour du projet Valhalla : un site qui permet à chaque acquéreur de la supercar de se voir offrir une montre Breitling personnalisée. Le client y choisit son modèle, entre homme et femme, puis le configure à son goût. J'ai conçu l'ensemble du front-end de cette expérience, sur un projet aux exigences élevées : visuels haute définition, navigation fluide, performance, et un rendu parfait aussi bien à l'écran que dans le code.

## Rôle

Sur ce projet, j'ai porté le front-end, de l'architecture jusqu'à la mise en production. Un lead back gérait en parallèle la partie back-office et la synchronisation avec le CRM du client. Le configurateur, le formulaire et les transitions de page sans rechargement voulues par la créa demandaient une vraie application côté client. Le templating a donc été écarté très vite au profit de **Nuxt**, dont le rendu côté serveur offrait les meilleures performances sans sacrifier la fluidité côté client.

## Réalisation

Le configurateur est la pièce maîtresse du site. Le client y personnalise sa montre et voit l'aperçu se mettre à jour en temps réel, d'une combinaison à l'autre, **sans transition ni clignotement**. Pour obtenir ce résultat, chaque nouvelle image est chargée et décodée en arrière-plan avant d'apparaître : elle ne remplace la précédente qu'une fois prête à l'affichage. Chaque combinaison possède son visuel dédié, retrouvé à partir des références produit fournies par le client.

Pour aller au bout de l'expérience, j'ai développé plusieurs fonctionnalités :

- afficher ou masquer l'interface pour observer la montre en détail ;
- reprendre sa personnalisation depuis le début ;
- alterner entre les bracelets.

Le tout sans scroll, en restant fluide, même sur mobile.

Côté performance, l'enjeu était de conserver des visuels haute définition sans alourdir le site. J'ai développé un script Node qui retravaille les images fournies et les décline en WebP et AVIF sur plusieurs tailles, pour le mobile comme pour le desktop, soit **plus de 400 visuels générés**. Le responsive mobile, non prévu à l'origine, a été ajouté en cours de projet et affiné jusqu'à un rendu optimal, pour préserver l'expérience d'origine.

## Résultats

Les performances mesurées, visuels haute définition compris :

- **Desktop** : Lighthouse Performance **100/100**, LCP **0,7 s** ;
- **Mobile** : Lighthouse Performance **91/100** ;
- **CLS de 0** sur l'ensemble.
