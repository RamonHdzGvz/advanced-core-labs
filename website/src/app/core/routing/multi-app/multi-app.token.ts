import { InjectionToken } from '@angular/core';
import type { AppRegistry } from './multi-app.types';

export const APP_REGISTRY_TOKEN = new InjectionToken<AppRegistry>('APP_REGISTRY');
