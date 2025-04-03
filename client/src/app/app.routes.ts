import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuardLogin } from './services/auth-guard.service';
import { AuthGuardNoLogin } from './services/no-auth-guard.service';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuardNoLogin] },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuardNoLogin] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuardLogin]}
];
