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
  //richiamo il servizio di autenticazione per gestire il logout
  constructor(private auth: AuthService) { }
  //metodo chiamato per effettuare il logout dell’utente
  logout(): void {
    //chiama il metodo logout definito nel servizio AuthService
    this.auth.logout();
  }
}