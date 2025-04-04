import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class LogoutComponent {

  constructor(private auth: AuthService) { }

  logout(): void {
    this.auth.logout();
  }

}