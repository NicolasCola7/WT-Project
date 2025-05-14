import { Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LogoutComponent } from "../logout/logout.component";
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../common/loading/loading.component';
import { DashboardItem } from '../../models/dashboard-item.model';
import { GridComponent } from "../grid/grid.component";
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../../../assets/css/button.css'],
  imports: [
    LogoutComponent,
    GridComponent,
    RouterModule,
    CommonModule,
    LoadingComponent
],
  standalone: true
})
export class HomeComponent implements OnInit{ 
  user: User = new User();
  isHomeRoute = false;
  isLoading = true;
  dashboard: Array<DashboardItem> = [
    { 
      cols: 0,
      rows: 0, 
      y: 0, 
      x: 0, 
      name: 'Home', 
      relativeUrl: 'home', 
      urlImg: "home.png", 
      isTimeMachine: false, 
      isVisible: false,
      componentType: () => import("../../preview-components/prova/prova.component").then(m => m.ProvaComponent),
      data: { title: 'Prima Preview', description: 'Descrizione della prima preview' }
    },
    { 
      cols: 1, 
      rows: 1, 
      y: 0, 
      x: 0, 
      name: 'Calendario', 
      relativeUrl: 'calendar', 
      urlImg: "calendar.png", 
      isTimeMachine: false, 
      isVisible: true,
      componentType: () => import("../../preview-components/calendar-preview/calendar-preview.component").then(m => m.CalendarPreviewComponent),
      data: { title: 'Prima Preview', description: 'Descrizione della prima preview' }
    },
    { 
      cols: 1, 
      rows: 1, 
      y: 0, 
      x: 1, 
      name: 'Timer', 
      relativeUrl: 'timer', 
      urlImg: "timer.png", 
      isTimeMachine: false, 
      isVisible: true,
      componentType: () => import("../../components/page-timer/page-timer.component").then(m => m.PageTimerComponent),
      data: { title: 'Prima Preview', description: 'Descrizione della prima preview' }
    },
    { 
      cols: 1, 
      rows: 1, 
      y: 1, 
      x: 0, 
      name: 'Note', 
      relativeUrl: 'note', 
      urlImg: "note.png", 
      isTimeMachine: false, 
      isVisible: true,
      componentType: () => import("../../components/note-home/note-home.component").then(m => m.NoteHomeComponent),
      data: { title: 'Preview Note', description: 'Mostra le note recenti', isPreviewMode: true}
    },
    { 
      cols: 1, 
      rows: 1, 
      y: 1, 
      x: 1, 
      name: 'Assistente AI', 
      relativeUrl: 'assistant', 
      urlImg: "chatbot.png", 
      isTimeMachine: false, 
      isVisible: true,
      componentType: () => import("../../preview-components/prova/prova.component").then(m => m.ProvaComponent),
      data: { title: 'Prima Preview', description: 'Descrizione della prima preview' } 
    },
    { 
      cols: 1, 
      rows: 1, 
      y: 2, 
      x: 0, 
      name: 'Time Machine', 
      relativeUrl: 'time-machine', 
      urlImg: "time-machine.png", 
      isTimeMachine: true, 
      isVisible: true,
      componentType: () => import("../../components/time-machine/time-machine.component").then(m => m.TimeMachineComponent),
      data: { title: 'Time-machine preview', description: 'Descrizione time machine preview' }
    }
  ];

  constructor(private userService: UserService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
  this.userService.getUser(this.authService.currentUser).subscribe({
    next: data => this.user = data,
    error: error => console.log(error),
    complete: () => this.isLoading = false
  });

  // Inizializza subito isHomeRoute (utile al primo caricamento)
  this.isHomeRoute = this.router.url === '/home';

  // Aggiorna su ogni navigazione
  this.router.events.pipe(
    filter((event: any) => event instanceof NavigationEnd)
  ).subscribe(() => {
    this.isHomeRoute = this.router.url === '/home';
  });
}

}
