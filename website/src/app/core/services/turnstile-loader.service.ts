import { Injectable } from '@angular/core';

export interface TurnstileWidgetOptions {
  readonly sitekey: string;
  readonly theme?: 'light' | 'dark' | 'auto';
  readonly action?: string;
  readonly tabindex?: number;
  readonly callback: (token: string) => void;
  readonly 'expired-callback': () => void;
  readonly 'timeout-callback': () => void;
  readonly 'error-callback': () => void;
  readonly 'response-field': false;
}

export interface TurnstileApi {
  render(container: HTMLElement, options: TurnstileWidgetOptions): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

@Injectable({ providedIn: 'root' })
export class TurnstileLoaderService {
  private static loading: Promise<TurnstileApi> | null = null;

  load(): Promise<TurnstileApi> {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return Promise.reject(new Error('Turnstile solo está disponible en el navegador.'));
    }

    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (TurnstileLoaderService.loading) return TurnstileLoaderService.loading;

    TurnstileLoaderService.loading = new Promise<TurnstileApi>((resolve, reject) => {
      const scriptId = 'cloudflare-turnstile-api';
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      const onLoad = (): void => {
        if (window.turnstile) {
          resolve(window.turnstile);
        } else {
          reject(new Error('No se pudo iniciar Turnstile.'));
        }
      };
      const onError = (): void => reject(new Error('No se pudo cargar Turnstile.'));

      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
      }

      script.addEventListener('load', onLoad, { once: true });
      script.addEventListener('error', onError, { once: true });
      if (!script.isConnected) document.head.append(script);
    }).catch((error: unknown) => {
      TurnstileLoaderService.loading = null;
      throw error;
    });

    return TurnstileLoaderService.loading;
  }
}
