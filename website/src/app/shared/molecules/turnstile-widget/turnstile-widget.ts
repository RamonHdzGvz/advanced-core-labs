import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { environment } from '@environment';
import {
  TurnstileApi,
  TurnstileLoaderService,
  TurnstileWidgetOptions,
} from '@core/services/turnstile-loader.service';

const noop = (): void => undefined;

export type TurnstileStatus =
  'loading' | 'ready' | 'verified' | 'expired' | 'error' | 'unconfigured' | 'disabled';

@Component({
  selector: 'app-turnstile-widget',
  standalone: true,
  templateUrl: './turnstile-widget.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TurnstileWidgetComponent),
      multi: true,
    },
  ],
})
export class TurnstileWidgetComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  private widgetId: string | null = null;
  private api: TurnstileApi | null = null;
  private destroyed = false;
  private disabled = false;
  private value: string | null = null;
  private onChange: (value: string | null) => void = noop;
  private onTouched: () => void = noop;

  @ViewChild('widget', { static: true })
  private readonly widgetElement!: ElementRef<HTMLDivElement>;

  @Input() siteKey = environment.turnstileSiteKey;
  @Input() action = 'public-form';
  @Input() theme: 'light' | 'dark' | 'auto' = 'auto';
  @Output() readonly tokenChange = new EventEmitter<string | null>();
  @Output() readonly statusChange = new EventEmitter<TurnstileStatus>();

  protected readonly status = signal<TurnstileStatus>('loading');
  protected readonly statusMessage = signal('Cargando verificación…');

  private readonly loader = inject(TurnstileLoaderService);

  ngAfterViewInit(): void {
    void this.renderWidget();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.removeWidget();
  }

  writeValue(value: string | null): void {
    const shouldReset = this.value !== null && value === null;
    this.value = value;
    if (shouldReset) this.resetWidget();
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.disabled === isDisabled) return;
    this.disabled = isDisabled;
    if (isDisabled) {
      this.removeWidget();
      this.setStatus('disabled', 'Verificación deshabilitada.');
    } else {
      void this.renderWidget();
    }
  }

  resetWidget(): void {
    this.clearToken();
    if (this.widgetId && this.api) {
      this.api.reset(this.widgetId);
      this.setStatus('ready', 'Completa la verificación para continuar.');
    } else if (!this.disabled && !this.destroyed) {
      void this.renderWidget();
    }
  }

  private async renderWidget(): Promise<void> {
    if (this.destroyed || this.disabled || this.widgetId) return;
    if (!this.siteKey.trim()) {
      this.setStatus('unconfigured', 'Falta configurar la Site Key pública de Turnstile.');
      return;
    }

    this.setStatus('loading', 'Cargando verificación…');
    try {
      const api = await this.loader.load();
      if (this.destroyed || this.disabled || this.widgetId) return;

      const options: TurnstileWidgetOptions = {
        sitekey: this.siteKey,
        theme: this.theme,
        action: this.action,
        tabindex: 0,
        'response-field': false,
        callback: (token) => this.acceptToken(token),
        'expired-callback': () => this.invalidateToken('expired'),
        'timeout-callback': () => this.invalidateToken('expired'),
        'error-callback': () => this.invalidateToken('error'),
      };

      this.api = api;
      this.widgetId = api.render(this.widgetElement.nativeElement, options);
      this.setStatus('ready', 'Completa la verificación para continuar.');
    } catch {
      if (!this.destroyed)
        this.setStatus('error', 'No se pudo cargar la verificación. Inténtalo de nuevo.');
    }
  }

  private acceptToken(token: string): void {
    if (!token || this.destroyed) return;
    this.value = token;
    this.onChange(token);
    this.onTouched();
    this.tokenChange.emit(token);
    this.setStatus('verified', 'Verificación completada.');
  }

  private invalidateToken(status: 'expired' | 'error'): void {
    this.clearToken();
    this.setStatus(
      status,
      status === 'expired'
        ? 'La verificación venció. Complétala de nuevo.'
        : 'No se pudo verificar. Inténtalo de nuevo.',
    );
  }

  private clearToken(): void {
    if (this.value === null) return;
    this.value = null;
    this.onChange(null);
    this.tokenChange.emit(null);
  }

  private removeWidget(): void {
    if (this.widgetId && this.api) this.api.remove(this.widgetId);
    this.widgetId = null;
    this.api = null;
  }

  private setStatus(status: TurnstileStatus, message: string): void {
    this.status.set(status);
    this.statusMessage.set(message);
    this.statusChange.emit(status);
  }
}
