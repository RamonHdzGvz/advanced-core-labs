import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-error-code',
  templateUrl: './error-code.html',
})
export class ErrorCode {
  @Input({ required: true }) code!: number;
}
