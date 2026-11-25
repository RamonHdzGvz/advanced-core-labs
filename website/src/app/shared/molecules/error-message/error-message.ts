import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-error-message',
  templateUrl: './error-message.html',
})
export class ErrorMessage {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
}
