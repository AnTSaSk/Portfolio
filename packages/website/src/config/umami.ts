type UmamiScriptEntry = {
  src: string;
  defer: true;
  // eslint-disable-next-line @typescript-eslint/naming-convention -- HTML data-* attribute
  'data-website-id': string;
  // eslint-disable-next-line @typescript-eslint/naming-convention -- HTML data-* attribute
  'data-domains'?: string;
};

export function buildUmamiScript(env: {
  src?: string;
  websiteId?: string;
  domains?: string;
  isProduction: boolean;
}): UmamiScriptEntry[] {
  const src = env.src?.trim();
  const websiteId = env.websiteId?.trim();
  const domains = env.domains?.trim();

  if (!env.isProduction || !src || !websiteId) {
    return [];
  }

  const entry: UmamiScriptEntry = {
    src,
    defer: true,
    'data-website-id': websiteId,
  };

  if (domains) {
    entry['data-domains'] = domains;
  }

  return [entry];
}
