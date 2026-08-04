---
title: 'Arneo'
year: 2025
stack:
    - Next.js
    - TypeScript
    - Drupal headless
    - Storybook
shortDescription: "Refonte du site éditorial de l'agence Arneo en Next.js (SSR) sur un Drupal headless, à fort enjeu graphique et de performance."
description: "Refonte complète du site de l'agence Arneo, en tant que lead développeur front : un site éditorial à forte identité visuelle, rendu côté serveur en Next.js sur un Drupal headless, avec un système de blocs pour la contribution, une stratégie de cache pour les performances et des animations sur une grande partie des pages."
period: '2025'
links:
    - label: 'Site'
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

## Contexte

Arneo a refondu le site de son agence, un site éditorial riche à forte identité visuelle. Trois exigences tenaient le projet : des animations poussées, des performances solides et un bon référencement, le tout sur un contenu mis à jour en continu. J'y étais lead développeur front.

## Rôle

Je chapeautais l'équipe front tout en développant avec elle. Le site repose sur un Drupal headless, dont le front Next.js consomme les API. Mon travail s'est concentré sur l'architecture front, autour de deux priorités : la performance et la souplesse laissée aux équipes de contribution.

## Réalisation

Le front est en Next.js, rendu côté serveur. Sur un site éditorial dont le contenu change en continu, le SSG était exclu : le rendu doit refléter la dernière version à chaque visite, sans rien céder sur la vitesse ni le référencement. Chaque page se construit à partir de blocs définis dans Drupal, qu'un composant unique, le BlockManager, affiche dans l'ordre voulu. Les équipes de contribution composent ainsi leurs pages librement, sans limite de blocs et sans passer par le code.

La performance repose sur un cache à plusieurs niveaux, du front avec Next.js jusqu'au back avec Drupal. J'ai mis en place tout le système de cache front avec Next.js ; puis, afin d'invalider un contenu précis, j'ai créé une API réservée au back lui permettant de déclencher cette invalidation dès qu'un contenu est modifié en contribution. La donnée s'affiche presque instantanément, sans jamais servir une version périmée. L'enjeu était là : sur un site aussi chargé, avec sa surcouche visuelle et ses librairies tierces, les performances s'effondrent sans le cache.

L'expérience passe par une direction artistique assumée et par les animations, présentes sur une grande partie des blocs. Des mouvements déclenchés au scroll, des micro-interactions poussées, avec quantité d'éléments qui apparaissent au survol, jusqu'à des SVG animés. Elles donnent au site son rythme, sans jamais en faire trop. Les images se chargent en lazy-loading, un placeholder cédant la place au visuel réel une fois prêt. Le CSS a été privilégié au JavaScript partout où c'était possible, pour alléger les pages et garder une vraie fluidité côté navigateur.

## Résultats

Le site est en ligne depuis mi-2025. Le pari était de tenir des performances élevées malgré une forte charge visuelle et de nombreuses librairies tierces : Lighthouse mesure, sur desktop, 97 en performance, 96 en accessibilité, 92 en bonnes pratiques et 92 en SEO. Le cache les maintient à ce niveau malgré tout ce que la page embarque.
