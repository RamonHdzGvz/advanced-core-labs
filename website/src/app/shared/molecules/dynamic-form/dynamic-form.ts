import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ThemeButtonComponent } from '@shared/atoms/theme-button/theme-button';

export type DynamicFormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'number'
  | 'date'
  | 'select'
  | 'radio'
  | 'checkbox-group'
  | 'textarea'
  | 'checkbox';

export type DynamicFormScalar = string | number | boolean;
export type DynamicFormValue = DynamicFormScalar | readonly DynamicFormScalar[];
export type DynamicFormValues = Record<string, DynamicFormValue>;

export type DynamicFormOption = Readonly<Record<string, unknown>> & {
  label: string;
  value: DynamicFormScalar;
};

export type DynamicFormCatalogItem = Readonly<Record<string, unknown>>;

export interface DynamicFormValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface DynamicFormField {
  key: string;
  label: string;
  type: DynamicFormFieldType;
  placeholder?: string;
  helperText?: string;
  initialValue?: DynamicFormValue;
  options?: readonly DynamicFormOption[];
  data?: {
    key: string;
    labelKey?: string;
    valueKey?: string;
  };
  validation?: DynamicFormValidation;
  fullWidth?: boolean;
}

export interface DynamicFormSection {
  title?: string;
  description?: string;
  fields: readonly DynamicFormField[];
}

export interface DynamicFormSchema {
  id: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  resetLabel?: string;
  sections: readonly DynamicFormSection[];
}

export interface DynamicFormError {
  fieldErrors: Readonly<Record<string, string>>;
}

export type DynamicFormCatalogLoader = (
  dataKey: string,
) => readonly DynamicFormCatalogItem[] | Promise<readonly DynamicFormCatalogItem[]>;

export interface DynamicFormCatalogError {
  fieldKey: string;
  dataKey: string;
  message: string;
}

interface DynamicFormCatalogState {
  options: readonly DynamicFormOption[];
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule, ThemeButtonComponent],
  templateUrl: './dynamic-form.html',
})
export class DynamicFormComponent implements OnChanges {
  @Input({ required: true }) schema!: DynamicFormSchema;
  @Input() catalogLoader: DynamicFormCatalogLoader | null = null;
  @Output() readonly success = new EventEmitter<DynamicFormValues>();
  @Output() readonly validationError = new EventEmitter<DynamicFormError>();
  @Output() readonly catalogLoadError = new EventEmitter<DynamicFormCatalogError>();

  protected form = new FormGroup<Record<string, FormControl<DynamicFormValue>>>({});
  protected readonly catalogs = signal<Record<string, DynamicFormCatalogState>>({});
  private catalogGeneration = 0;

  ngOnChanges(): void {
    if (!this.schema) return;

    const generation = ++this.catalogGeneration;
    this.catalogs.set({});
    const controls: Record<string, FormControl<DynamicFormValue>> = {};
    const fields = this.schema.sections.flatMap((section) => section.fields);
    for (const field of fields) {
      controls[field.key] = new FormControl<DynamicFormValue>(this.initialValue(field), {
        nonNullable: true,
        validators: this.validatorsFor(field),
      });
    }
    this.form = new FormGroup(controls);

    for (const field of fields) {
      if (
        (field.type === 'select' || field.type === 'radio' || field.type === 'checkbox-group') &&
        field.data?.key
      ) {
        void this.loadCatalog(field, generation);
      }
    }
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.validationError.emit({ fieldErrors: this.collectFieldErrors() });
      return;
    }

    this.success.emit(this.form.getRawValue());
  }

  protected fieldId(key: string): string {
    return this.schema.id + '-' + key;
  }

  protected catalogState(field: DynamicFormField): DynamicFormCatalogState {
    if (!field.data?.key) return { options: field.options ?? [], loading: false, error: null };
    return (
      this.catalogs()[field.key] ?? {
        options: [],
        loading: false,
        error: 'Catálogo no disponible.',
      }
    );
  }

  protected retryCatalog(field: DynamicFormField): void {
    void this.loadCatalog(field, this.catalogGeneration);
  }

  protected checkboxOptionSelected(fieldKey: string, value: DynamicFormScalar): boolean {
    const current = this.form.controls[fieldKey]?.value;
    return Array.isArray(current) && current.includes(value);
  }

  protected toggleCheckboxOption(fieldKey: string, value: DynamicFormScalar, event: Event): void {
    const control = this.form.controls[fieldKey];
    if (!control) return;

    const checked = (event.target as HTMLInputElement).checked;
    const current = Array.isArray(control.value) ? [...control.value] : [];
    const next = checked ? [...current, value] : current.filter((item) => item !== value);
    control.setValue(next);
    control.markAsTouched();
    control.markAsDirty();
  }

  protected get catalogsLoading(): boolean {
    return Object.values(this.catalogs()).some((catalog) => catalog.loading);
  }

  protected fieldError(key: string): string | null {
    const control = this.form.controls[key];
    if (!control?.touched || !control.errors) return null;
    return this.errorMessageForControl(key);
  }

  private initialValue(field: DynamicFormField): DynamicFormValue {
    if (field.initialValue !== undefined) return field.initialValue;
    if (field.type === 'checkbox-group') return [];
    return field.type === 'checkbox' ? false : '';
  }

  private async loadCatalog(field: DynamicFormField, generation: number): Promise<void> {
    const dataKey = field.data?.key;
    if (!dataKey) return;

    this.setCatalogState(field.key, { options: [], loading: true, error: null });
    if (!this.catalogLoader) {
      this.finishCatalogError(
        field,
        dataKey,
        'No se configuró el cargador de catálogos.',
        generation,
      );
      return;
    }

    try {
      const items = await this.catalogLoader(dataKey);
      if (generation !== this.catalogGeneration) return;
      if (
        !Array.isArray(items) ||
        items.some((item) => !item || typeof item !== 'object' || Array.isArray(item))
      ) {
        throw new Error('El catálogo debe devolver una colección de objetos.');
      }
      const labelKey = field.data?.labelKey ?? 'label';
      const valueKey = field.data?.valueKey ?? 'value';
      const options = items.map((item, index) => {
        const label = item[labelKey];
        const value = item[valueKey];
        if (
          (typeof label !== 'string' && typeof label !== 'number') ||
          (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean')
        ) {
          throw new Error(
            'La opción ' +
              (index + 1) +
              ' no contiene las propiedades configuradas: ' +
              labelKey +
              ' y ' +
              valueKey +
              '.',
          );
        }
        return { label: String(label), value };
      });
      this.setCatalogState(field.key, { options, loading: false, error: null });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No se pudo cargar el catálogo solicitado.';
      this.finishCatalogError(field, dataKey, message, generation);
    }
  }

  private finishCatalogError(
    field: DynamicFormField,
    dataKey: string,
    message: string,
    generation: number,
  ): void {
    if (generation !== this.catalogGeneration) return;
    this.setCatalogState(field.key, { options: [], loading: false, error: message });
    this.catalogLoadError.emit({ fieldKey: field.key, dataKey, message });
  }

  private setCatalogState(fieldKey: string, state: DynamicFormCatalogState): void {
    this.catalogs.update((catalogs) => ({ ...catalogs, [fieldKey]: state }));
  }

  private validatorsFor(field: DynamicFormField): ValidatorFn[] {
    const rules = field.validation ?? {};
    const validators: ValidatorFn[] = [];
    if (rules.required !== false) {
      validators.push((control) => {
        const value = control.value;
        const missing =
          field.type === 'checkbox'
            ? value !== true
            : field.type === 'checkbox-group'
              ? !Array.isArray(value) || value.length === 0
              : value === null || value === undefined || String(value).trim().length === 0;
        return missing ? { required: true } : null;
      });
    }
    if (rules.minLength !== undefined) validators.push(Validators.minLength(rules.minLength));
    const defaultMaxLength: Partial<Record<DynamicFormFieldType, number>> = {
      email: 254,
      password: 128,
      tel: 32,
      text: 255,
      textarea: 2000,
      url: 2048,
    };
    const maxLength = rules.maxLength ?? defaultMaxLength[field.type];
    if (maxLength !== undefined) validators.push(Validators.maxLength(maxLength));
    if (rules.min !== undefined) validators.push(Validators.min(rules.min));
    if (rules.max !== undefined) validators.push(Validators.max(rules.max));
    if (rules.pattern) validators.push(Validators.pattern(rules.pattern));
    if (field.type === 'email') validators.push(Validators.email);
    if (field.type === 'tel') validators.push(Validators.pattern(/^\+?[\d\s().-]{7,32}$/));
    if (field.type === 'url') {
      validators.push((control) => {
        const value = String(control.value ?? '').trim();
        if (!value) return null;
        try {
          const url = new URL(value);
          return url.protocol === 'http:' || url.protocol === 'https:' ? null : { url: true };
        } catch {
          return { url: true };
        }
      });
    }
    return validators;
  }

  private collectFieldErrors(): Record<string, string> {
    const errors: Record<string, string> = {};
    for (const section of this.schema.sections) {
      for (const field of section.fields) {
        if (!this.form.controls[field.key]?.errors) continue;
        const message = this.errorMessageForControl(field.key);
        if (message) errors[field.key] = message;
      }
    }
    return errors;
  }

  private errorMessageForControl(key: string): string | null {
    const control = this.form.controls[key];
    if (!control?.errors) return null;
    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('email')) return 'Escribe un correo electrónico válido.';
    if (control.hasError('url')) return 'Escribe una URL válida, por ejemplo https://ejemplo.com.';
    if (
      control.hasError('pattern') &&
      this.schema.sections.some((section) =>
        section.fields.some((field) => field.key === key && field.type === 'tel'),
      )
    ) {
      return 'Escribe un teléfono válido, sin letras.';
    }
    if (control.hasError('minlength')) {
      return 'Escribe al menos ' + control.getError('minlength').requiredLength + ' caracteres.';
    }
    if (control.hasError('maxlength')) {
      return 'Escribe como máximo ' + control.getError('maxlength').requiredLength + ' caracteres.';
    }
    if (control.hasError('min')) return 'El valor mínimo es ' + control.getError('min').min + '.';
    if (control.hasError('max')) return 'El valor máximo es ' + control.getError('max').max + '.';
    if (control.hasError('pattern')) return 'El formato no es válido.';
    return 'Revisa este campo.';
  }
}
