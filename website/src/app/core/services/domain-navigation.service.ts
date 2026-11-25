import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DomainNavigationService {
  navigateTo(subdomain: string, path = ''): void {
    window.location.href = this.buildUrl(subdomain, path);
  }

  openInNewTab(subdomain: string, path = ''): void {
    window.open(this.buildUrl(subdomain, path), '_blank', 'noopener,noreferrer');
  }

  getBaseUrl(subdomain: string): string {
    return this.buildUrl(subdomain);
  }

  private buildUrl(subdomain: string, path = ''): string {
    const hostLabel = subdomain.trim().toLowerCase();
    if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(hostLabel)) {
      throw new Error(`Invalid subdomain: "${subdomain}".`);
    }

    const currentUrl = new URL(window.location.href);
    const host = currentUrl.hostname.toLowerCase();
    const labels = host.split('.');
    const baseDomain =
      host === 'localhost' || host.endsWith('.localhost')
        ? 'localhost'
        : labels.length >= 3
          ? labels.slice(1).join('.')
          : host;

    currentUrl.hostname = `${hostLabel}.${baseDomain}`;
    currentUrl.pathname = path ? (path.startsWith('/') ? path : `/${path}`) : '/';
    currentUrl.search = '';
    currentUrl.hash = '';
    return currentUrl.toString();
  }
}
