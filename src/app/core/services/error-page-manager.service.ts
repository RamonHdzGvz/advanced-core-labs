import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorPageManagerService {
  router = inject(Router);

  navigateToErrorWithParams(code: number, customTitle?: string, customDescription?: string) {
    let title = customTitle || '';
    let description = customDescription || '';

    if (!customTitle || !customDescription) {
      const defaultMessages = this.getDefaultMessages(code);
      title = customTitle || defaultMessages.title;
      description = customDescription || defaultMessages.description;
    }

    this.router.navigate(['/error'], {
      state: { code, title, description },
    });
  }

  private getDefaultMessages(code: number): { title: string; description: string } {
    switch (code) {
      case 400:
        return { title: 'Bad Request', description: 'The request data sent to the server was malformed or incomplete.' };
      case 401:
        return { title: 'Unauthorized', description: 'Authentication is required to access this resource.' };
      case 403:
        return { title: 'Access denied', description: 'You are logged in, but you do not have permission to view or modify this resource.' };
      case 404:
        return { title: 'Page Not Found', description: 'Sorry, we couldn’t find the page you’re looking for.' };
      case 408:
        return { title: 'Request Timeout', description: 'The server took too long to receive a response.' };
      case 409:
        return { title: 'Conflict', description: 'The resource could not be processed due to a conflict with the current state of the system.' };
      case 429:
        return { title: 'Too Many Requests', description: 'You have sent too many requests in a given amount of time.' };
      case 500:
        return { title: 'Internal Server Error', description: 'We have encountered an unexpected issue on our server.' };
      case 502:
        return { title: 'Bad Gateway', description: 'The server received an invalid response from an upstream server while processing your request.' };
      case 503:
        return { title: 'Service Unavailable', description: 'Our service is currently unavailable, likely due to maintenance or high load.' };
      case 504:
        return { title: 'Gateway Timeout', description: 'The upstream gateway timed out while waiting for a response from the backend service.' };
      default:
        return { title: 'Error', description: 'An unexpected error occurred.' };
    }
  }
}