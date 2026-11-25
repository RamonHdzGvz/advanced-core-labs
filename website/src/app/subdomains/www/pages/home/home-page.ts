import { Component, signal } from '@angular/core';
import {
  DynamicFormComponent,
  DynamicFormSchema,
} from '@shared/molecules/dynamic-form/dynamic-form';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [DynamicFormComponent],
  styleUrl: './home-page.css',
  templateUrl: './home-page.html',
})
export class HomePage {
  protected readonly mobileMenuOpen = signal(false);
  protected readonly contactStatus = signal<string | null>(null);
  protected readonly currentYear = new Date().getFullYear();

  protected readonly contactForm: DynamicFormSchema = {
    id: 'contact-request',
    title: 'Cuéntanos sobre tu proyecto',
    description: 'Comparte los detalles y podremos entender mejor lo que necesitas.',
    submitLabel: 'Enviar mensaje',
    resetLabel: 'Limpiar formulario',
    sections: [
      {
        fields: [
          {
            key: 'name',
            label: 'Nombre completo',
            type: 'text',
            placeholder: 'Tu nombre',
            validation: { required: true, minLength: 2, maxLength: 100 },
          },
          {
            key: 'email',
            label: 'Correo electrónico',
            type: 'email',
            placeholder: 'nombre@empresa.com',
            validation: { required: true },
          },
          {
            key: 'businessName',
            label: 'Nombre del negocio (opcional)',
            type: 'text',
            placeholder: 'Tu negocio o equipo',
            validation: { required: false, maxLength: 120 },
          },
          {
            key: 'service',
            label: 'Servicio de interés (opcional)',
            type: 'select',
            validation: { required: false },
            options: [
              { label: 'Landing Pages', value: 'landing-pages' },
              { label: 'Directorio Empresarial', value: 'business-directory' },
              { label: 'Micro Apps', value: 'micro-apps' },
              { label: 'Otro', value: 'other' },
            ],
          },
          {
            key: 'message',
            label: '¿Qué necesitas resolver?',
            type: 'textarea',
            placeholder: 'Cuéntanos un poco sobre tu idea o necesidad…',
            helperText: 'Incluye solo la información necesaria para entender tu consulta.',
            validation: { required: true, minLength: 10, maxLength: 1500 },
            fullWidth: true,
          },
        ],
      },
    ],
  };

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((isOpen) => !isOpen);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  protected onContactFormValidated(): void {
    this.contactStatus.set(
      'El mensaje todavía no se envió. Falta configurar el servicio que recibirá las consultas; tus datos permanecen en este formulario.',
    );
  }
}
