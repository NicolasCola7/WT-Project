import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuardLogin } from './services/auth-guard.service';
import { AuthGuardNoLogin } from './services/no-auth-guard.service';
import { CalendarComponent } from './components/calendar/calendar.component';
import { PageTimerComponent } from './components/page-timer/page-timer.component';
import { NoteHomeComponent } from './components/note-home/note-home.component';
import { NoteEditorComponent } from './components/note-editor/note-editor.component';
import { AiAssistantComponent } from './components/ai-assistant/ai-assistant.component';
import { TimeMachineComponent } from './components/time-machine/time-machine.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuardNoLogin] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuardNoLogin] },
  { 
    path: 'home', 
    component: HomeComponent, 
    canActivate: [AuthGuardLogin],
    children: [
      { path: 'calendar', component: CalendarComponent },
      { path: 'timer', component: PageTimerComponent },
      { path: 'note', component: NoteHomeComponent },
      { path: 'editor', component: NoteEditorComponent },
      { path: 'assistant', component: AiAssistantComponent },
      { path: 'time-machine', component: TimeMachineComponent },
    ]
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

