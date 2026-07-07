import { Component, Input } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-form-input',
  imports: [TextareaModule, FloatLabelModule, InputTextModule, FormsModule, ButtonModule, PasswordModule, ReactiveFormsModule],
  templateUrl: './form-input.html',
  styleUrl: './form-input.css',
})
export class FormInput {
  @Input() label: string = '';
  @Input() type: 'text' | 'email' | 'password' | 'textarea' = 'text';
  @Input() control!: FormControl;
}
