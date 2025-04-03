import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthGuardLogin  {

  constructor(public auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.auth.loggedIn) {
        this.router.navigate(['/login']);
        return false;
    }
    return true;
  }

}