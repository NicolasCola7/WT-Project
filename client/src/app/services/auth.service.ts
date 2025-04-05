import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { AlertService } from './alert.service';


@Injectable({providedIn: 'root'})
export class AuthService {
  loggedIn = false;
  currentUser: User = new User();

  constructor(private userService: UserService,
              private router: Router,
              private jwtHelper: JwtHelperService,
              private alertService: AlertService) {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = this.decodeUserFromToken(token);
      this.setCurrentUser(decodedUser);
    }
  }

  login(emailAndPassword: { email: string; password: string }): void {
    this.userService.login(emailAndPassword).subscribe({
      next: res => {
        localStorage.setItem('token', res.token);
        const decodedUser = this.decodeUserFromToken(res.token);
        this.setCurrentUser(decodedUser);
        this.loggedIn = true;
        this.router.navigate(['/home']);
      },
      error: () => this.alertService.showError('Errore', 'Email o password errata!')
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn = false;
    this.currentUser = new User();
    this.router.navigate(['/']);
  }

  decodeUserFromToken(token: string): object {
    return this.jwtHelper.decodeToken(token).user;
  }

  setCurrentUser(decodedUser: object): void {
    this.loggedIn = true;
    const id = JSON.parse(JSON.stringify(decodedUser)).id;
    this.currentUser._id = id;
  }
}