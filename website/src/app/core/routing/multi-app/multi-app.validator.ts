import type { AppRegistry } from './multi-app.types';

export function validateRegistry(registry: AppRegistry): void {
  const seen = new Set<string>();
  const defaults = Object.values(registry).filter((config) => config.isDefault);

  if (defaults.length !== 1) {
    throw new Error(
      `The app registry must define exactly one default app; found ${defaults.length}.`,
    );
  }

  for (const [key, config] of Object.entries(registry)) {
    if (config.subdomains.length === 0) {
      throw new Error(`App "${key}" must define at least one subdomain.`);
    }

    for (const subdomain of config.subdomains) {
      const normalized = subdomain.toLowerCase();
      if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(normalized)) {
        throw new Error(`Invalid subdomain "${subdomain}" in app "${key}".`);
      }
      if (seen.has(normalized)) {
        throw new Error(`Duplicate subdomain: ${normalized}.`);
      }
      seen.add(normalized);
    }
  }
}
