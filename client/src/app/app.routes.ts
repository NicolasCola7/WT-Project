import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuardLogin } from './services/auth-guard.service';
import { AuthGuardNoLogin } from './services/no-auth-guard.service';
import { CalendarComponent } from './components/calendar/calendar.component';
import { PageTimerComponent } from './components/page-timer/page-timer.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuardNoLogin] },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuardNoLogin] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuardLogin] },
    { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuardLogin] },
    { path: 'timer', component: PageTimerComponent, canActivate: [AuthGuardLogin] },
    { path: '**', component: HomeComponent, canActivate: [AuthGuardLogin] }
];
