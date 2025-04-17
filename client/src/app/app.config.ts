import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { provideNativeDateAdapter } from '@angular/material/core';
import { routes } from './app.routes';

// Token getter function
export function tokenGetter() {
  return localStorage.getItem('token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withFetch()),
    { provide: JWT_OPTIONS, useValue: { tokenGetter } },
    JwtHelperService,
    provideNativeDateAdapter()
  ]
};