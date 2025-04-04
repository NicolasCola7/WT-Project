
import { Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LogoutComponent } from "../logout/logout.component";
import { RouterModule } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [
    LogoutComponent,
    RouterModule,
    CommonModule
  ],
  standalone: true
})
export class HomeComponent implements OnInit{ 
  user: User = new User();
  constructor(private userService: UserService,
              private authService: AuthService) {}

    ngOnInit(): void {
      this.userService.getUser(this.authService.currentUser).subscribe({
        next: data => this.user = data,
        error: error => console.log(error)
      });
    }
}
