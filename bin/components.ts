import { readdirSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

const PACKAGES_DIR = resolve(import.meta.dirname!, '../packages');
const ATOMIC_LEVELS = ['Atoms', 'Molecules', 'Organisms', 'Templates'];

interface ComponentInfo {
  name: string;
  level: string;
  hasProps: boolean;
  hasTag: boolean;
  hasVariant: boolean;
}

const findComponents = (componentsDir: string): ComponentInfo[] => {
  const components: ComponentInfo[] = [];

  for (const level of ATOMIC_LEVELS) {
    const levelDir = join(componentsDir, level);
    if (!existsSync(levelDir)) continue;

    const entries = readdirSync(levelDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const indexTs = join(levelDir, entry.name, 'index.ts');
      if (!existsSync(indexTs)) continue;

      const vueFile = join(levelDir, entry.name, 'index.vue');
      let hasProps = false;
      let hasTag = false;
      let hasVariant = false;

      if (existsSync(vueFile)) {
        const content = readFileSync(vueFile, 'utf-8');
        hasProps = /export\s+interface\s+Props/.test(content);
        hasTag = /export\s+type\s+Tag\b/.test(content);
        hasVariant = /export\s+type\s+Variant\b/.test(content);
      }

      components.push({
        name: entry.name,
        level,
        hasProps,
        hasTag,
        hasVariant,
      });
    }
  }

  return components;
};

const generateIndexTs = (components: ComponentInfo[]): string => {
  const imports = components
    .map((c) => `import ${c.name} from './components/${c.level}/${c.name}';`)
    .join('\n');

  const names = components.map((c) => `  ${c.name},`).join('\n');

  return `import type { App } from 'vue';

// imports components
${imports}

const components = [
${names}
];
// end imports components

const install = (Vue: App) => {
  for (const component of components) {
    Vue.component(component.name!, component);
  }
};

export default { install };

// export components
export {
${names}
};
// end export components
`;
};

const generateTypesDts = (components: ComponentInfo[]): string => {
  const reExports = components.map((c) => `  ${c.name},`).join('\n');

  const propsExports = components
    .filter((c) => c.hasProps)
    .map(
      (c) =>
        `export type { Props as ${c.name}Props } from '../src/components/${c.level}/${c.name}/index.vue';`,
    )
    .join('\n');

  const typeExports = components
    .flatMap((c) => {
      const types: string[] = [];
      if (c.hasTag) {
        types.push(`  Tag as ${c.name}Tag,`, `  Variant as ${c.name}Variant,`);
      } else if (c.hasVariant) {
        types.push(`  Variant as ${c.name}Variant,`);
      }
      if (types.length === 0) return [];
      return [
        `export type {`,
        ...types,
        `} from '../src/components/${c.level}/${c.name}/index.vue';`,
      ];
    })
    .join('\n');

  return `export {
${reExports}
} from '../src/index';

${propsExports}

${typeExports}
`;
};

// Main
for (const entry of readdirSync(PACKAGES_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;

  const pkgDir = join(PACKAGES_DIR, entry.name);
  const srcDir = join(pkgDir, 'src');
  const componentsDir = join(srcDir, 'components');

  if (!existsSync(componentsDir)) continue;

  // Skip packages with .vue files directly in src/ (not component libraries)
  const srcFiles = readdirSync(srcDir);
  if (srcFiles.some((f) => f.endsWith('.vue'))) continue;

  const components = findComponents(componentsDir);
  if (components.length === 0) continue;

  console.log(`[${entry.name}] Found ${components.length} components:`);
  for (const c of components) {
    console.log(`  - ${c.level}/${c.name}`);
  }

  writeFileSync(join(srcDir, 'index.ts'), generateIndexTs(components));
  writeFileSync(
    join(pkgDir, 'types', 'index.d.ts'),
    generateTypesDts(components),
  );

  console.log(`  Generated src/index.ts and types/index.d.ts`);
}
