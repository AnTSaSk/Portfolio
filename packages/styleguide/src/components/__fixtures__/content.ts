/**
 * Real portfolio content used by the stories, so the public styleguide never
 * shows invented projects or hotlinked visuals. Values are copied from
 * packages/website: i18n locales, content/ frontmatter and constants/links.ts.
 *
 * Articles #1 and #2 are not written yet: their title and description are
 * planned entries. Replace them with the real frontmatter once published.
 */

export const LINKS = {
  github: 'https://github.com/AnTSaSk',
  linkedin: 'https://www.linkedin.com/in/alexis-besson-lead-front/',
  x: 'https://x.com/AlexisBessonWeb',
} as const;

export const AUTHOR = {
  initials: 'AB',
  name: 'Alexis Besson',
  bio: "Lead développeur front, une dizaine d'années à concevoir des interfaces pensées pour durer et performer. Mon terrain de prédilection : JavaScript et TypeScript, les design systems, la performance, et depuis peu, utiliser l'IA pour m'assister (supervisée de près). J'ai toujours aimé partager ce sur quoi je travaille : d'où ce blog.",
  photo: '/img/Blog/author.jpg',
  links: [
    { label: 'GitHub', href: LINKS.github, external: true },
    { label: 'LinkedIn', href: LINKS.linkedin, external: true },
    { label: 'X', href: LINKS.x, external: true },
  ],
} as const;

export const HOME = {
  greeting: 'Bonjour',
  name: 'Alexis Besson',
  role: 'Lead Développeur Front-end',
  body: [
    "Depuis une dizaine d'années, je conçois des interfaces web et j'accompagne des équipes en agence.",
    'Du SaaS porté dans la durée au site événementiel haut de gamme, des fronts pensés pour la performance et pour durer.',
  ],
  tags: [
    'JavaScript / TypeScript',
    'Vue 3 & Nuxt',
    'Design Systems',
    'Performance',
    'Dev IA',
  ],
  watermark: 'AnTSaSk/Alexis Besson',
} as const;

export const NAV_LINKS = [
  { label: 'Accueil', href: '/', current: true },
  { label: 'Blog', href: '/blog' },
  { label: 'Projets', href: '/projects' },
  { label: 'À propos', href: '/about' },
] as const;

export const VALHALLA = {
  title: 'Valhalla',
  year: 2026,
  client: 'Breitling × Aston Martin',
  role: 'Lead Développeur Front-end',
  shortDescription:
    'Site événementiel avec configurateur de montre pour la collaboration Breitling × Aston Martin.',
  stack: ['Nuxt', 'TypeScript', 'Pinia', 'i18n'],
  href: '/projects/valhalla-breitling-aston-martin',
  cover: { src: '/img/Projects/Valhalla_Cover.jpg', width: 2560, height: 1440 },
  gallery: [
    {
      src: '/img/Projects/Valhalla_Gallery_Hero.jpg',
      width: 2560,
      height: 1440,
    },
    {
      src: '/img/Projects/Valhalla_Gallery_Tile-1.jpg',
      width: 1600,
      height: 1200,
    },
    {
      src: '/img/Projects/Valhalla_Gallery_Tile-2.jpg',
      width: 1600,
      height: 1200,
    },
  ],
} as const;

export const EMEIS_GALLERY = [
  { src: '/img/Projects/EMEIS_Gallery_Hero.jpg', width: 2560, height: 1440 },
  { src: '/img/Projects/EMEIS_Gallery_Tile-1.jpg', width: 1600, height: 1200 },
  { src: '/img/Projects/EMEIS_Gallery_Tile-2.jpg', width: 1600, height: 1200 },
] as const;

export const LAUNCH_ARTICLES = [
  {
    href: '/blog/portfolio-v1',
    title: "Portfolio v1 : le lancement, et ce qu'il y a derrière",
    excerpt:
      "Le lancement de mon portfolio, un projet en tête depuis 2023 : ce qu'on y trouve, pourquoi le design system est public, et les choix derrière le site.",
    date: '27.07.2026',
    tags: ['Nuxt', 'Storybook', 'Design System'],
    image: { src: '/img/Blog/N0_Cover.jpg', width: 2560, height: 1440 },
  },
  {
    href: '/blog/css-moderne-2026',
    title: 'CSS moderne en 2026 : ce qui remplace SCSS',
    excerpt:
      '@layer, le nesting natif, light-dark(), les nouvelles unités : ce que le CSS natif reprend à SCSS, démontré sur des architectures réelles.',
    date: '31.08.2026',
    tags: ['CSS', 'Performance'],
    image: { src: '/img/Blog/N0_Figma2023.png', width: 1732, height: 1000 },
  },
  {
    href: '/blog/industrialiser-claude-code',
    title: 'Industrialiser Claude Code en équipe front',
    excerpt:
      'Workflows, skills maison et gates qualité : comment cadrer le développement assisté par IA pour en faire un usage critique et supervisé.',
    date: '30.09.2026',
    tags: ['Dev IA', 'Qualité'],
    image: { src: '/img/Blog/N0_OldLanding.png', width: 1732, height: 1000 },
  },
] as const;

export const PROJECT_CARDS = [
  {
    href: '/projects/valhalla-breitling-aston-martin',
    title: 'Valhalla',
    excerpt: VALHALLA.shortDescription,
    year: 2026,
    image: VALHALLA.cover,
  },
  {
    href: '/projects/emeis',
    title: 'Emeis',
    excerpt:
      "Architecture front multi-thèmes et store locator pour les sites pays d'un groupe de santé.",
    year: 2025,
    image: { src: '/img/Projects/EMEIS_Cover.jpg', width: 2560, height: 1440 },
  },
  {
    href: '/projects/site-arneo',
    title: 'Arneo',
    excerpt:
      "Refonte du site éditorial de l'agence Arneo en Next.js (SSR) sur un Drupal headless.",
    year: 2025,
    image: { src: '/img/Projects/Arneo_Cover.jpg', width: 2560, height: 1440 },
  },
] as const;
