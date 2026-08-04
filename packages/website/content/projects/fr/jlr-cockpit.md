---
title: 'Cockpit'
year: 2019
stack:
    - Vue 3
    - TypeScript
    - Vite
    - Storybook
shortDescription: 'Application interne de reporting pour Jaguar Land Rover, du POC au déploiement européen.'
description: "Conception du POC front d'une application interne de reporting pour Jaguar Land Rover, qui a grandi jusqu'à équiper la plupart des concessions françaises, puis toute l'Europe. Plusieurs dizaines de dashboards filtrables sur des données CRM fraîches et migration Vue 2 vers Vue 3."
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

## Contexte

Jaguar Land Rover pilotait son activité commerciale sans outil centralisé : chaque concession faisait remonter ses chiffres à la main, par fax ou par tableur, sans jamais de vision d'ensemble. Le projet Cockpit est né de ce manque : réunir toutes ces données dans une seule application pour redonner aux équipes une visibilité claire sur leurs ventes, leurs leads et leur après-vente.

## Rôle

En tant que Lead Développeur, j'ai accompagné le cadrage du besoin avant de développer un POC en Vue 2. Cette première version testable a permis au client de mesurer concrètement les gains de temps et de coordination attendus. Le POC a convaincu, et le projet est passé en V1 : j'ai pris le lead sur une équipe de développeurs front qui sont repartis du POC, tout en gardant la main sur l'architecture et les revues de code. Tous seniors, ils ont peu à peu repris le développement. Je suis ensuite revenu ponctuellement, sur les grosses évolutions et pour piloter la migration de Vue 2 vers Vue 3.

## Réalisation

Le client ayant adhéré à notre application, les demandes ont suivi : de nouveaux dashboards, de nouvelles données à intégrer, au fil des années. L'application a fini par couvrir tout le cycle commercial, du suivi des leads au portefeuille de véhicules, jusqu'à l'après-vente et les marges. Chaque tableau de bord se filtre très finement, par région, groupe, concession, marque ou modèle, avec des droits ajustés à chaque profil, du chef de région au directeur après-vente. Adopté par la plupart des concessions françaises, l'outil a ensuite été déployé dans toute l'Europe.

Le vrai défi n'était pas d'afficher la donnée ni de gérer ces dizaines de dashboards, mais de bien concevoir la couche qui les alimente, filtres compris, pour réduire au maximum le temps d'attente à l'écran. Le back-end Python traite des millions de lignes et a besoin de quelques secondes pour récupérer, traiter et renvoyer la donnée. Tout le travail a donc consisté à absorber cette attente côté front. Préchargement des contenus avant l'affichage, transitions maîtrisées d'un écran à l'autre, loaders animés : une interface qui fait patienter proprement plutôt que de laisser l'utilisateur devant un écran figé.

## Résultats

Parti d'un simple POC, Cockpit s'est imposé comme l'outil de reporting de référence de Jaguar Land Rover, adopté à la fois dans les bureaux et dans les concessions, qui alimentent elles-mêmes leurs données pour le faire vivre. Étendu à toute l'Europe, il est aujourd'hui toujours en place et utilisé par JLR.

---

_Les captures présentées illustrent des maquettes de l'application : toutes les données affichées (concessions, chiffres, indicateurs) sont fictives._
