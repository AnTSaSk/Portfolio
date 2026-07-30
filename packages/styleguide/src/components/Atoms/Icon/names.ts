export const iconNames = [
  'arrowLeft',
  'arrowRight',
  'github',
  'linkedin',
  'moon',
  'sun',
  'x',
] as const;

export type IconName = (typeof iconNames)[number];
