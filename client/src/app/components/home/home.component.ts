import { Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LogoutComponent } from "../logout/logout.component";
import { GridComponent } from "../grid/grid.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../common/loading/loading.component';
import { DashboardItem } from '../../models/dashboard-item.model';

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
  isLoading = true;
  dashboard: Array<DashboardItem> = [
    { cols: 0, rows: 0, y: 0, x: 0, name: 'Home', relativeUrl: '/home', urlImg: "home.png", isTimeMachine: false },
    { cols: 4, rows: 6, y: 0, x: 0, name: 'Calendario', relativeUrl: '/calendar', urlImg: "calendar.png", isTimeMachine: false },
    { cols: 4, rows: 6, y: 0, x: 4, name: 'Timer', relativeUrl: '/timer', urlImg: "timer.png", isTimeMachine: false },
    { cols: 4, rows: 6, y: 0, x: 8, name: 'Note', relativeUrl: '/note', urlImg: "note.png", isTimeMachine: false },
    { cols: 4, rows: 6, y: 3, x: 0, name: 'Assistente AI', relativeUrl: '/assistant', urlImg: "chatbot.png", isTimeMachine: false },
    { cols: 4, rows: 6, y: 3, x: 4, name: 'Extra 2', relativeUrl: '/extra2', urlImg: "extra.png", isTimeMachine: false },
    { cols: 4, rows: 6, y: 3, x: 8, name: 'Time Machine', relativeUrl: '/time-machine', urlImg: "time-machine.png", isTimeMachine: true },
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
  }

  navigateTo(url: string) {
    this.router.navigate([url], { relativeTo: this.route });
  }
}
