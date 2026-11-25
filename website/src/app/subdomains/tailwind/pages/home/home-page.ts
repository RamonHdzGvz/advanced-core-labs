import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import {
  ThemeDataTableColumn,
  ThemeDataTableComponent,
} from '@shared/organisms/theme-data-table/theme-data-table';
import { ThemeAlertComponent } from '@shared/molecules/theme-alert/theme-alert';
import { ThemeCardComponent } from '@shared/molecules/theme-card/theme-card';
import { ThemeHeroComponent } from '@shared/molecules/theme-hero/theme-hero';
import { ThemeStatCardComponent } from '@shared/molecules/theme-stat-card/theme-stat-card';
import { ThemeToggleComponent } from '@shared/molecules/theme-toggle/theme-toggle';
import { ThemeAvatarComponent } from '@shared/atoms/theme-avatar/theme-avatar';
import { ThemeBadgeComponent } from '@shared/atoms/theme-badge/theme-badge';
import { ThemeButtonComponent } from '@shared/atoms/theme-button/theme-button';
import { ThemeFieldComponent } from '@shared/atoms/theme-field/theme-field';
import { ThemeProgressComponent } from '@shared/atoms/theme-progress/theme-progress';
import { ThemeSwitchComponent } from '@shared/atoms/theme-switch/theme-switch';
import { ProfilePictureUploaderComponent } from '@shared/organisms/profile-picture-uploader/profile-picture-uploader';
import {
  TurnstileStatus,
  TurnstileWidgetComponent,
} from '@shared/molecules/turnstile-widget/turnstile-widget';
import { DummyUser, DummyUsersApiService } from '@subdomains/tailwind/data/dummy-users-api.service';
import { ToastService } from '@core/services/toast.service';
import { MessageService } from '@core/services/message.service';
import { LoadingService } from '@core/services/loading.service';
import {
  DummyProduct,
  DummyProductsApiService,
} from '@core/services/dummy-json/dummy-products-api.service';

@Component({
  standalone: true,
  imports: [
    ThemeDataTableComponent,
    ThemeAlertComponent,
    ThemeAvatarComponent,
    ThemeBadgeComponent,
    ThemeButtonComponent,
    ThemeCardComponent,
    ThemeFieldComponent,
    ThemeHeroComponent,
    ThemeProgressComponent,
    ProfilePictureUploaderComponent,
    ThemeStatCardComponent,
    ThemeSwitchComponent,
    ThemeToggleComponent,
    TurnstileWidgetComponent,
  ],
  selector: 'app-tailwind-home-page',
  styleUrl: './home-page.css',
  templateUrl: './home-page.html',
})
export class TailwindHomePage implements OnInit, OnDestroy {
  private readonly productsApi = inject(DummyProductsApiService);
  private readonly usersApi = inject(DummyUsersApiService);
  private readonly toastService = inject(ToastService);
  private readonly messageService = inject(MessageService);
  private readonly loadingService = inject(LoadingService);
  private productsController: AbortController | null = null;
  private usersController: AbortController | null = null;

  protected readonly products = signal<readonly DummyProduct[]>([]);
  protected readonly productsLoading = signal(false);
  protected readonly productsError = signal<string | null>(null);
  protected readonly users = signal<readonly DummyUser[]>([]);
  protected readonly usersLoading = signal(false);
  protected readonly usersError = signal<string | null>(null);

  protected readonly productColumns: readonly ThemeDataTableColumn[] = [
    { key: 'title', label: 'Producto', sortable: true, filterType: 'text' },
    { key: 'category', label: 'Categoría', sortable: true, filterType: 'set' },
    { key: 'price', label: 'Precio', display: 'currency', sortable: true, filterType: 'number' },
    { key: 'stock', label: 'Existencias', display: 'number', sortable: true, filterType: 'number' },
    {
      key: 'rating',
      label: 'Calificación',
      display: 'number',
      sortable: true,
      filterType: 'number',
    },
  ];

  protected readonly userColumns: readonly ThemeDataTableColumn[] = [
    { key: 'firstName', label: 'Nombre', sortable: true, filterType: 'text' },
    { key: 'lastName', label: 'Apellido', sortable: true, filterType: 'text' },
    { key: 'email', label: 'Correo', sortable: true, filterType: 'text' },
    { key: 'age', label: 'Edad', display: 'number', sortable: true, filterType: 'number' },
    { key: 'gender', label: 'Género', sortable: true, filterType: 'set' },
    { key: 'phone', label: 'Teléfono' },
  ];

  protected retryProducts(): void {
    void this.loadProducts();
  }

  protected retryUsers(): void {
    void this.loadUsers();
  }

  protected showToast(tone: 'info' | 'success' | 'warning' | 'danger'): void {
    const messages = {
      info: ['Información', 'Este es un aviso breve que se cierra automáticamente.'],
      success: ['Cambios guardados', 'La configuración se actualizó correctamente.'],
      warning: ['Atención', 'Revisa los datos antes de continuar.'],
      danger: ['No se pudo completar', 'Inténtalo de nuevo en unos momentos.'],
    } as const;
    const [title, message] = messages[tone];
    this.toastService.show(tone, title, message);
  }

  protected showMessage(): void {
    void this.messageService.alert({
      tone: 'info',
      title: 'Mensaje de ejemplo',
      message: 'Este diálogo presenta información que requiere atención antes de continuar.',
    });
  }

  protected async confirmMessage(): Promise<void> {
    const confirmed = await this.messageService.confirm({
      tone: 'warning',
      title: '¿Continuar con la acción?',
      message: 'Este ejemplo demuestra cómo esperar la decisión de la persona usuaria.',
      confirmLabel: 'Continuar',
    });

    if (confirmed) this.toastService.success('Confirmaste la acción de ejemplo.');
  }

  protected testLoading(): void {
    void this.loadingService.run(() => this.delay(10_000), 'Prueba de carga: 10 segundos…');
  }

  protected testConcurrentLoading(): void {
    void this.loadingService.runBatch(
      [
        { message: 'Actualizar inventario', run: () => this.delay(5_000) },
        { message: 'Validar pedido', run: () => this.delay(10_000) },
        { message: 'Enviar notificación', run: () => this.delay(3_000) },
      ],
      'concurrent',
      1_000,
    );
  }

  protected testContinuousLoading(): void {
    void this.loadingService.runBatch(
      [
        { message: 'Paso 1: actualizar inventario', run: () => this.delay(5_000) },
        { message: 'Paso 2: validar pedido', run: () => this.delay(5_000) },
      ],
      'sequential',
    );
  }

  protected submitProjectForm(event: SubmitEvent): void {
    event.preventDefault();
    this.toastService.success('El formulario de demostración se completó correctamente.');
  }

  ngOnInit(): void {
    void this.loadProducts();
    void this.loadUsers();
  }

  ngOnDestroy(): void {
    this.productsController?.abort();
    this.usersController?.abort();
  }

  private async loadProducts(): Promise<void> {
    this.productsController?.abort();
    const controller = new AbortController();
    this.productsController = controller;
    this.productsLoading.set(true);
    this.productsError.set(null);

    try {
      const result = await this.productsApi.getProducts(controller.signal);
      if (controller.signal.aborted) return;
      this.products.set(result.products);
    } catch {
      if (!controller.signal.aborted) {
        this.productsError.set(
          'No se pudieron cargar los productos. Revisa tu conexión e inténtalo de nuevo.',
        );
      }
    } finally {
      if (!controller.signal.aborted) this.productsLoading.set(false);
    }
  }

  private delay(durationMs: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, durationMs));
  }

  private async loadUsers(): Promise<void> {
    this.usersController?.abort();
    const controller = new AbortController();
    this.usersController = controller;
    this.usersLoading.set(true);
    this.usersError.set(null);

    try {
      const result = await this.usersApi.getUsers(controller.signal);
      if (controller.signal.aborted) return;
      this.users.set(result.users);
    } catch {
      if (!controller.signal.aborted) {
        this.usersError.set(
          'No se pudieron cargar los usuarios. Revisa tu conexión e inténtalo de nuevo.',
        );
      }
    } finally {
      if (!controller.signal.aborted) this.usersLoading.set(false);
    }
  }

  protected turnstileStatus: TurnstileStatus = 'loading';

  protected readonly turnstileStatusLabels: Record<TurnstileStatus, string> = {
    loading: 'Cargando',
    ready: 'Pendiente de verificación',
    verified: 'Verificación completada',
    expired: 'Verificación vencida',
    error: 'Error de verificación',
    unconfigured: 'Sin configurar',
    disabled: 'Deshabilitado',
  };

  protected readonly metrics = [
    {
      label: 'Ingresos totales',
      value: '$48,290',
      change: '↑ 12.8%',
      hint: 'vs. mes anterior',
      trend: 'positive' as const,
    },
    {
      label: 'Usuarios activos',
      value: '2,420',
      change: '↑ 4.3%',
      hint: 'vs. mes anterior',
      trend: 'positive' as const,
    },
    {
      label: 'Tasa de conversión',
      value: '3.64%',
      change: '↓ 0.8%',
      hint: 'vs. mes anterior',
      trend: 'negative' as const,
    },
    {
      label: 'Tickets abiertos',
      value: '18',
      hint: '5 requieren atención',
      trend: 'neutral' as const,
    },
  ];
}
