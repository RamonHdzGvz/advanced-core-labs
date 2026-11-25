import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/services/supabase/supabase-client.service';

export interface ProtectedFormPayload {
  readonly turnstileToken: string;
  readonly [field: string]: unknown;
}

@Injectable({ providedIn: 'root' })
export class PublicFormSubmissionService {
  private readonly supabase = inject(SupabaseClientService);

  async submit<TResponse>(
    functionName: string,
    payload: Readonly<Record<string, unknown>>,
    turnstileToken: string | null,
  ): Promise<TResponse> {
    if (!turnstileToken?.trim()) {
      throw new Error('Completa la verificación anti-spam antes de enviar.');
    }

    if (!/^[a-z][a-z0-9-]{0,62}$/.test(functionName)) {
      throw new Error('El identificador del formulario no es válido.');
    }

    const { data, error } = await this.supabase
      .getClient()
      .functions.invoke<TResponse>(functionName, {
        body: { ...payload, turnstileToken },
      });

    if (error || data === null) {
      throw new Error('No se pudo enviar el formulario. Vuelve a verificar e inténtalo de nuevo.');
    }

    return data;
  }
}
