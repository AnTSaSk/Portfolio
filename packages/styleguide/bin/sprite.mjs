import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';
import SVGSpriter from 'svg-sprite';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const svgRoot = path.resolve(dirname, '../src/assets/icons');
const spriteOutDir = path.resolve(dirname, '../src/assets');
const namesFile = path.resolve(
  dirname,
  '../src/components/Atoms/Icon/names.ts',
);

// Flat structure: symbol id = filename without extension (camelCase preserved).
const config = {
  shape: {
    id: {
      generator: (name) => name.replace(/\.svg$/i, ''),
    },
  },
  mode: {
    symbol: {
      inline: true,
      dest: spriteOutDir,
      prefix: '',
      dimensions: '',
      sprite: 'sprite.svg',
    },
  },
};

const spriter = new SVGSpriter(config);
const files = (await glob('*.svg', { cwd: svgRoot })).sort((a, b) =>
  a.localeCompare(b),
);

for (const file of files) {
  spriter.add(
    path.join(svgRoot, file),
    file,
    fs.readFileSync(path.join(svgRoot, file), 'utf8'),
  );
}

spriter.compile((error, result) => {
  if (error) {
    console.error(error);
    process.exitCode = 1;
    return;
  }
  for (const mode of Object.values(result)) {
    for (const resource of Object.values(mode)) {
      fs.mkdirSync(path.dirname(resource.path), { recursive: true });
      fs.writeFileSync(resource.path, resource.contents);
    }
  }

  const ids = files
    .map((file) => file.replace(/\.svg$/i, ''))
    .sort((a, b) => a.localeCompare(b));
  const body = ids.map((id) => `  '${id}',`).join('\n');

  fs.mkdirSync(path.dirname(namesFile), { recursive: true });
  fs.writeFileSync(
    namesFile,
    `export const iconNames = [\n${body}\n] as const;\n\nexport type IconName = (typeof iconNames)[number];\n`,
  );
  console.log(`sprite.svg written with ${files.length} icons`);
});
