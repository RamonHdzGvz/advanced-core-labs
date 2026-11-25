import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  selector: 'app-login-form',
  templateUrl: './login-form.html',
})
export class LoginForm {
  @Input() isSubmitting = false;
  @Input() errorMessage: string | null = null;
  @Output() readonly submitted = new EventEmitter<LoginCredentials>();

  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted.emit(this.form.getRawValue());
  }
}
