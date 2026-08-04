---
title: 'Paper.club'
year: 2019
stack:
    - Vue 2
    - Vue 3
    - TypeScript
    - Vite
shortDescription: 'Plateforme SaaS de netlinking construite de zéro et portée pendant plusieurs années.'
description: "Conception et développement front, en tant que lead front et développeur principal, d'une plateforme SaaS de netlinking de premier plan en Europe pour le groupe Ydylle (Eskimoz) : marketplace annonceurs/éditeurs, tunnel de commande et de paiement, portefeuille, outil de rédaction collaborative. Migration Vue 2 vers Vue 3 pilotée sur une codebase de production."
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

## Contexte

Paper.club est une marketplace de netlinking : les annonceurs y achètent des articles sponsorisés pour renforcer le référencement de leurs sites, les éditeurs y vendent de la visibilité sur leurs sites. L'annonceur parcourt un annuaire de sites, chacun décrit par sa thématique, ses audiences et ses indicateurs SEO, puis commande un article auprès de l'éditeur de son choix. La plateforme est une marque du groupe Ydylle (Eskimoz), l'un des acteurs européens de référence du secteur. Le développement a démarré mi-2019.

## Rôle

J'ai conçu et développé l'intégralité du front, comme lead front et développeur principal. D'abord seul, puis aidé de plusieurs développeurs sur la phase la plus intense jusqu'à la V1, avant de reprendre la main sur le front pour la maintenance et les évolutions. Un lead back développait l'API en parallèle sur toute la durée du projet. Quand une évolution arrivait sans maquette, mon background créatif prenait le relais : concevoir les écrans manquants en puisant uniquement dans le design system existant, pour une interface qui garde sa cohérence.

## Réalisation

Le front couvre une application large : back-office d'administration, onboarding des nouveaux clients, moteur de recherche à filtres cumulatifs pour explorer l'annuaire, suivi de commande. Trois chantiers ressortent : le tunnel de commande et le système de portefeuille, l'outil de rédaction d'article, et la migration de Vue 2 vers Vue 3.

Toute la mécanique de commande vit dans la plateforme : l'annonceur remplit son panier, un tunnel de paiement gère la transaction, et l'application orchestre les échanges entre annonceur et éditeur jusqu'à la mise en ligne de l'article. À côté, chaque profil dispose d'un porte-monnaie complet, avec historique des transactions, moyens de paiement et rechargement, sur des rôles aux droits très différents, de l'annonceur à l'éditeur en passant par les agences et leurs consultants.

La partie la plus délicate est l'outil de rédaction d'article. Il couvre tout le parcours, de l'écriture du contenu, mise en forme comprise, jusqu'à sa validation. Les commentaires se posent directement sur le texte de l'article, ce qui ouvre des allers-retours entre annonceur et éditeur pour l'affiner passage par passage jusqu'à la version finale.

La dernière grande étape a été la migration de Vue 2 vers Vue 3, sur une codebase de production déjà conséquente. Le projet n'a jamais été mis en pause : la migration avançait sur une branche à part, maintenue à jour des évolutions du quotidien, pendant que le développement courant continuait en Vue 2. Une phase de conseil a permis de décaler les gros chantiers après la bascule, pour ne pas avoir à les livrer deux fois, une version par framework. L'exercice a été exigeant, entre des dépendances qui n'avaient pas encore franchi le pas vers Vue 3 et le quotidien à tenir en parallèle.

## Résultats

Mise en ligne mi-2021, après plus d'un an de développement, la plateforme a ensuite été suivie et enrichie pendant quatre années. Ce qui était prévu comme une première version a donné lieu à un accompagnement au long cours, la confiance se renouvelant d'année en année jusqu'en 2025. Paper.club est toujours en ligne aujourd'hui et donne accès à plus de 120 000 médias, l'un des plus grands catalogues du marché.

_Les captures présentées illustrent des maquettes de l'application : toutes les données affichées sont fictives._
{.l-page__disclaimer}
