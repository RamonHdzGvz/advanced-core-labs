import { Injectable } from '@angular/core';
import type { ThemeDataTableRow } from '@shared/organisms/theme-data-table/theme-data-table';

export type DummyUser = ThemeDataTableRow & {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly age: number;
  readonly gender: string;
  readonly phone: string;
};

export interface DummyUserPage {
  readonly users: readonly DummyUser[];
  readonly total: number;
  readonly skip: number;
  readonly limit: number;
}

const BASE_URL = 'https://dummyjson.com/users';
const SELECT_FIELDS = 'id,firstName,lastName,email,age,gender,phone';

@Injectable({ providedIn: 'root' })
export class DummyUsersApiService {
  async getUsers(signal: AbortSignal): Promise<DummyUserPage> {
    const url = new URL(BASE_URL);
    url.searchParams.set('limit', '0');
    url.searchParams.set('select', SELECT_FIELDS);

    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error('El API de usuarios no está disponible. Inténtalo de nuevo.');
    return parseUserPage(await response.json());
  }
}

function parseUserPage(payload: unknown): DummyUserPage {
  if (!isRecord(payload) || !Array.isArray(payload['users'])) {
    throw new Error('El API devolvió usuarios con un formato inesperado.');
  }

  const users = payload['users'].filter(isDummyUser);
  const total = payload['total'];
  const skip = payload['skip'];
  const limit = payload['limit'];
  if (
    typeof total !== 'number' ||
    typeof skip !== 'number' ||
    typeof limit !== 'number' ||
    users.length !== payload['users'].length
  ) {
    throw new Error('El API devolvió usuarios con un formato inesperado.');
  }

  return { users, total, skip, limit };
}

function isDummyUser(value: unknown): value is DummyUser {
  return (
    isRecord(value) &&
    typeof value['id'] === 'number' &&
    typeof value['firstName'] === 'string' &&
    typeof value['lastName'] === 'string' &&
    typeof value['email'] === 'string' &&
    typeof value['age'] === 'number' &&
    typeof value['gender'] === 'string' &&
    typeof value['phone'] === 'string'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
