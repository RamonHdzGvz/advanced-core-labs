import { JsonPipe } from '@angular/common';
import { Component, OnDestroy, inject, signal } from '@angular/core';
import { DummyProductsApiService } from '@core/services/dummy-json/dummy-products-api.service';
import { ToastService } from '@core/services/toast.service';
import {
  DynamicFormComponent,
  DynamicFormCatalogError,
  DynamicFormCatalogItem,
  DynamicFormCatalogLoader,
  DynamicFormError,
  DynamicFormOption,
  DynamicFormSchema,
  DynamicFormValues,
} from '@shared/molecules/dynamic-form/dynamic-form';
import { ThemeToggleComponent } from '@shared/molecules/theme-toggle/theme-toggle';

@Component({
  selector: 'app-forms-home-page',
  standalone: true,
  imports: [DynamicFormComponent, JsonPipe, ThemeToggleComponent],
  templateUrl: './home-page.html',
})
export class FormsHomePage implements OnDestroy {
  private readonly toastService = inject(ToastService);
  private readonly productsApi = inject(DummyProductsApiService);
  private readonly productsRequest = new AbortController();
  private productsCatalogPromise: Promise<readonly DynamicFormCatalogItem[]> | null = null;

  protected readonly validationErrors = signal<DynamicFormError | null>(null);
  protected readonly submittedValues = signal<DynamicFormValues | null>(null);
  private readonly catalogData: Readonly<Record<string, readonly DynamicFormOption[]>> = {
    'project-types': [
      { label: 'Sitio web', value: 'website' },
      { label: 'Aplicación web', value: 'web-app' },
      { label: 'Integración', value: 'integration' },
      { label: 'Otro', value: 'other' },
    ],
    departments: [
      { label: 'Producto', value: 'product' },
      { label: 'Operaciones', value: 'operations' },
      { label: 'Ventas', value: 'sales' },
      { label: 'Tecnología', value: 'technology' },
    ],
  };

  protected readonly loadCatalog: DynamicFormCatalogLoader = async (dataKey) => {
    if (dataKey === 'products') {
      return this.loadProductsCatalog();
    }

    const options = this.catalogData[dataKey];
    if (!options) throw new Error('No se encontró el catálogo "' + dataKey + '".');
    return options;
  };

  private loadProductsCatalog(): Promise<readonly DynamicFormCatalogItem[]> {
    if (!this.productsCatalogPromise) {
      this.productsCatalogPromise = this.productsApi
        .getProducts(this.productsRequest.signal, 10)
        .then((response) =>
          response.products.map((product) => ({
            ...product,
            label: product.title + ' · ' + product.category + ' · $' + product.price.toFixed(2),
          })),
        )
        .catch((error: unknown) => {
          this.productsCatalogPromise = null;
          throw error;
        });
    }
    return this.productsCatalogPromise;
  }

  ngOnDestroy(): void {
    this.productsRequest.abort();
  }

  protected get validationErrorCount(): number {
    return Object.keys(this.validationErrors()?.fieldErrors ?? {}).length;
  }

  protected readonly projectForm: DynamicFormSchema = {
    id: 'project-request',
    title: 'Solicitud de proyecto',
    description: 'Completa los datos para preparar el inicio del proyecto.',
    submitLabel: 'Enviar solicitud',
    resetLabel: 'Limpiar formulario',
    sections: [
      {
        title: 'Datos de contacto',
        description: '¿Quién será el contacto principal?',
        fields: [
          {
            key: 'fullName',
            label: 'Nombre completo',
            type: 'text',
            placeholder: 'Ej. Alex Rivera',
            validation: { required: true, minLength: 3, maxLength: 80 },
          },
          {
            key: 'email',
            label: 'Correo electrónico',
            type: 'email',
            placeholder: 'alex@empresa.com',
            helperText: 'Usaremos este correo para dar seguimiento.',
            validation: { required: true },
          },
          {
            key: 'company',
            label: 'Empresa o equipo',
            type: 'text',
            placeholder: 'Nombre de la organización',
            validation: { required: true },
          },
          {
            key: 'phone',
            label: 'Teléfono (opcional)',
            type: 'tel',
            placeholder: '+52 000 000 0000',
            validation: { required: false },
          },
          {
            key: 'accessCode',
            label: 'Código de referencia (opcional)',
            type: 'password',
            placeholder: 'Escribe un código de ejemplo',
            helperText: 'Campo demostrativo: no uses una contraseña real.',
            validation: { required: false },
          },
          {
            key: 'website',
            label: 'Sitio actual (opcional)',
            type: 'url',
            placeholder: 'https://ejemplo.com',
            validation: { required: false },
          },
        ],
      },
      {
        title: 'Alcance',
        description: 'Describe qué se necesita y cuándo.',
        fields: [
          {
            key: 'projectType',
            label: 'Tipo de proyecto',
            type: 'select',
            data: { key: 'project-types' },
          },
          {
            key: 'department',
            label: 'Área solicitante',
            type: 'select',
            data: { key: 'departments' },
          },
          {
            key: 'featuredProductId',
            label: 'Elige un producto destacado',
            type: 'radio',
            helperText: 'Opciones cargadas desde la primera página de DummyJSON.',
            data: { key: 'products', labelKey: 'label', valueKey: 'id' },
            fullWidth: true,
          },
          {
            key: 'comparisonProductIds',
            label: 'Productos que quieres comparar',
            type: 'checkbox-group',
            helperText: 'Puedes seleccionar varios productos del mismo catálogo.',
            data: { key: 'products', labelKey: 'label', valueKey: 'id' },
            validation: { required: false },
            fullWidth: true,
          },
          {
            key: 'productId',
            label: 'Producto de referencia',
            type: 'select',
            helperText: 'Se carga desde DummyJSON y el valor enviado será su ID.',
            data: {
              key: 'products',
              labelKey: 'label',
              valueKey: 'id',
            },
            fullWidth: true,
          },
          {
            key: 'budget',
            label: 'Presupuesto estimado (MXN)',
            type: 'number',
            placeholder: '50000',
            validation: { required: true, min: 1000, max: 5000000 },
          },
          {
            key: 'targetDate',
            label: 'Fecha deseada de inicio',
            type: 'date',
            validation: { required: true },
          },
          {
            key: 'summary',
            label: 'Resumen del proyecto',
            type: 'textarea',
            placeholder: 'Cuéntanos los objetivos, alcance y necesidades principales...',
            helperText: 'Incluye el contexto necesario para entender la solicitud.',
            validation: { required: true, minLength: 20, maxLength: 1000 },
            fullWidth: true,
          },
          {
            key: 'acceptContact',
            label: 'Acepto que AdvancedCoreLabs me contacte sobre esta solicitud.',
            type: 'checkbox',
            validation: { required: true },
            fullWidth: true,
          },
        ],
      },
      {
        title: 'Preferencias de seguimiento',
        description: 'Selecciona las actualizaciones que te gustaría recibir.',
        fields: [
          {
            key: 'emailUpdates',
            label: 'Recibir actualizaciones del proyecto por correo',
            type: 'checkbox',
            validation: { required: false },
            fullWidth: true,
          },
          {
            key: 'meetingInvitations',
            label: 'Recibir invitaciones para reuniones de seguimiento',
            type: 'checkbox',
            validation: { required: false },
            fullWidth: true,
          },
          {
            key: 'productNews',
            label: 'Recibir novedades sobre productos y servicios',
            type: 'checkbox',
            validation: { required: false },
            fullWidth: true,
          },
        ],
      },
    ],
  };

  protected handleSuccess(values: DynamicFormValues): void {
    this.validationErrors.set(null);
    this.submittedValues.set({
      ...values,
      accessCode: values['accessCode'] ? '••••••••' : '',
    });
    this.toastService.success('La solicitud de ejemplo se envió correctamente.');
  }

  protected handleError(error: DynamicFormError): void {
    this.validationErrors.set(error);
    this.submittedValues.set(null);
    this.toastService.warning('Revisa los campos marcados antes de enviar.');
  }

  protected handleCatalogError(error: DynamicFormCatalogError): void {
    this.toastService.danger(
      'No se pudo cargar el catálogo "' + error.dataKey + '". Puedes intentarlo de nuevo.',
      'Error de catálogo',
    );
  }
}
