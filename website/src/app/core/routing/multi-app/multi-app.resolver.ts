import type { AppRegistry } from './multi-app.types';

export function extractSubdomain(hostname: string): string | null {
  const host = hostname.toLowerCase().replace(/\.$/, '');

  if (host === 'localhost' || isIpAddress(host)) {
    return null;
  }

  if (host.endsWith('.localhost')) {
    return host.slice(0, -'.localhost'.length).split('.')[0] ?? null;
  }

  const labels = host.split('.');
  return labels.length >= 3 ? (labels[0] ?? null) : null;
}

export function getBaseHostname(hostname: string): string {
  const host = hostname.toLowerCase().replace(/\.$/, '');

  if (host.endsWith('.localhost')) {
    return host.slice(host.indexOf('.') + 1);
  }

  const labels = host.split('.');
  return labels.length >= 3 ? labels.slice(1).join('.') : host;
}

export function resolveAppType<T extends AppRegistry>(hostname: string, registry: T): keyof T {
  const subdomain = extractSubdomain(hostname);

  if (subdomain) {
    for (const [key, config] of Object.entries(registry)) {
      if (config.subdomains.some((registered) => registered.toLowerCase() === subdomain)) {
        return key as keyof T;
      }
    }
  }

  for (const [key, config] of Object.entries(registry)) {
    if (config.isDefault) {
      return key as keyof T;
    }
  }

  throw new Error(`No app matched for hostname "${hostname}" and no default app is configured.`);
}

export function getAppConfig<T extends AppRegistry>(hostname: string, registry: T): T[keyof T] {
  return registry[resolveAppType(hostname, registry)];
}

export function hasValidSubdomain<T extends AppRegistry>(hostname: string, registry: T): boolean {
  const subdomain = extractSubdomain(hostname);
  return (
    subdomain !== null &&
    Object.values(registry).some((config) =>
      config.subdomains.some((registered) => registered.toLowerCase() === subdomain),
    )
  );
}

function isIpAddress(hostname: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname) || hostname.includes(':');
}
