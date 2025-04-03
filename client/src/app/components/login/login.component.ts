import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule ]
})
export class LoginComponent {

  loginForm: UntypedFormGroup;
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

  constructor(private auth: AuthService,
              private formBuilder: UntypedFormBuilder,
              private router: Router
            ) {
    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password
    });
  }

  login(): void {
    this.auth.login(this.loginForm.value);
  }
}