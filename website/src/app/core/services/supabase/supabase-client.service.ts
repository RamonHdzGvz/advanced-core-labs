import { Injectable } from '@angular/core';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@environment';

@Injectable({ providedIn: 'root' })
export class SupabaseClientService {
  readonly isConfigured =
    environment.supabaseUrl.trim().length > 0 &&
    environment.supabasePublishableKey.trim().length > 0;

  private readonly client: SupabaseClient | null = this.isConfigured
    ? createClient(environment.supabaseUrl, environment.supabasePublishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null;

  getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase no está configurado para esta aplicación.');
    }

    return this.client;
  }
}
