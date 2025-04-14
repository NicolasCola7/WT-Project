import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css','../../../assets/css/button.css'],
  standalone: true,
  imports: [CommonModule]
})
export class LogoutComponent {

  constructor(private auth: AuthService) { }

  logout(): void {
    this.auth.logout();
  }

}