import { Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LogoutComponent } from "../logout/logout.component";
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../common/loading/loading.component';
import { DashboardItem } from '../../models/dashboard-item.model';
import { GridComponent } from "../grid/grid.component";
import { filter } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';

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
  dashboard: Array<DashboardItem>;
  constructor(private userService: UserService,
              private authService: AuthService,
              private router: Router,
              private dashboardService: DashboardService) {
                this.dashboard = dashboardService.getDefaultLayout();
              }

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
