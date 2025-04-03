
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LogoutComponent } from "../logout/logout.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [LogoutComponent]
})
export class HomeComponent { 
  auth = inject(AuthService);
  
  username = this.auth.currentUser.username;
}
