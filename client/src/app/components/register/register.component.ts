import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert.service';
import { CalendarService } from '../../services/calendar.service';
import { CalendarEvent } from '../../models/event.model';

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
  name = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)
  ]);
  surname = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)
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
              private userService: UserService,
              private alertService: AlertService,
              private calendarService: CalendarService) {
    this.registerForm = this.formBuilder.group({
      username: this.username,
      email: this.email,
      name: this.name,
      surname: this.surname,
      password: this.password,
      confirmPassword: this.confirmPassword,
      birthday: this.birthday
    });
  }

  register(): void {
    if(this.password.value != this.confirmPassword.value){
      this.alertService.showError("Le due password non coincidono!")
      return;
    }

    this.userService.register(this.registerForm.value).subscribe({
      next: (user) => {
        if(this.birthday.value) {
          const birthday: CalendarEvent = {
            title: 'Il tuo compleanno',
            startDate: this.birthday.value,
            endDate:  this.birthday.value,
            frequency: 'YEARLY',
            creatorId: user._id
          }
          this.calendarService.addEvent(birthday).subscribe({
            next: () => this.router.navigate(['/login']),
            error: (error) => console.log(error)
          })
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: () => this.alertService.showError("Questa email è già associata ad un account, usane una diversa!")
    });
  }
}