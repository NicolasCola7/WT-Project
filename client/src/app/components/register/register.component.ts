import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  standalone: true
})
export class RegisterComponent {

  registerForm: UntypedFormGroup;
  username = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30),
    Validators.pattern('[a-zA-Z0-9_-\\s]*')
  ]);
  email = new UntypedFormControl('', [
    Validators.email,
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
  password = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);
  confirmPassword = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);
  birthday = new UntypedFormControl('');

  constructor(private formBuilder: UntypedFormBuilder,
              private router: Router,
              private userService: UserService) {
    this.registerForm = this.formBuilder.group({
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      birthday: this.birthday
    });
  }

  register(): void {
    if(this.password.value != this.confirmPassword.value){
      return;
    }

    this.userService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}