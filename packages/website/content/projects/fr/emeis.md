---
title: 'Emeis'
year: 2025
stack:
    - Vanilla JS
    - Twig
    - Drupal
    - Storybook
shortDescription: "Architecture front multi-thèmes et store locator pour les sites pays d'un groupe de santé, à fort enjeu SEO."
description: "Refonte de l'architecture front, en tant que lead front et développeur principal, des sites pays d'un groupe de santé présent dans plus de vingt pays : socle Drupal multi-thèmes bâti sur des variables CSS, styleguide isolé du thème parent, chargement JS asynchrone conditionnel, et développement complet du front du store locator (carte Google Maps, filtres cumulatifs par activité et par zone géographique)."
period: '2025-2026'
links:
    - label: 'Site'
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

## Contexte

Emeis est un groupe de santé présent dans plus de vingt pays, avec plus de mille établissements, des maisons de retraite aux cliniques. Après la refonte de sa marque, le groupe a lancé des sites pays pour accompagner son développement à l'international, distincts du site corporate. C'est sur ces sites pays que je suis intervenu : chacun a sa propre structure, son contenu et son URL, mais tous reposent sur un socle commun.

## Rôle

Lead front et développeur principal sur le projet, mon apport central a été de repenser l'architecture front pour absorber le multi-thème, une activité Emeis correspondant à un thème. J'ai isolé le styleguide de la structure Drupal pour le rendre indépendant du thème parent, créé les composants manquants et repris les existants pour qu'ils fonctionnent sur tous les thèmes. En parallèle, j'ai développé toute la partie front du store locator, en coordination avec la développeuse back qui développait le module Drupal.

## Réalisation

L'architecture multi-thèmes est la pièce maîtresse du projet. Elle reprend le principe des thèmes parent/enfant de Drupal : un thème parent, Emeis, porte tous les composants et les assets ; chaque thème enfant en dépend et n'override que le strict nécessaire. Toute l'identité visuelle repose sur des variables CSS, qu'un thème enfant redéfinit pour appliquer ses propres couleurs, sans jamais toucher au composant lui-même. Le prérequis a été conséquent : inventorier et mapper chaque variable en amont, pour poser le système sur des bases saines.

Le chargement du JavaScript suit le même esprit. Un script global vérifie, via les classes CSS présentes dans la page, quels scripts de composants doivent être chargés, puis les charge de façon asynchrone via dynamic import. Le but : réduire au maximum la charge JS de chaque page, sur un projet où la performance et le SEO priment.

Le store locator est la fonctionnalité applicative la plus importante. Le front récupère les paramètres d'URL pour construire les filtres et lancer les appels API : un pour le listing des établissements, paginé, un autre pour les marqueurs de la carte Google Maps, avec sa gestion de clusters. Pas de framework : sur un site Drupal servi en Twig, un framework JavaScript aurait ajouté une charge supplémentaire non nécessaire.

Le point délicat réside dans les filtres, propres à chaque activité. En accédant au store locator d'une activité, l'utilisateur ne voit que les filtres de celle-ci ; sur le store locator multi-activité, il choisit d'abord une activité avant d'atteindre ses filtres. S'y ajoute une logique géographique, du pays à la ville, qui recentre la carte et ne remonte que les établissements de la zone concernée. Autant de cas à prévoir un par un dans le code.

## Résultats

Le premier site pays est en ligne, et le socle sert désormais de base au déploiement des suivants, pays par pays. Pour un site éditorial de cette ampleur, les scores de performance sont solides, et le client est satisfait du résultat. Le projet est toujours actif, avec de nouveaux pays en cours d'ouverture.
