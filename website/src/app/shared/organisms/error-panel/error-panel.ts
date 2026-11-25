import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ErrorPageContent } from '@core/models/error-page.model';
import { ErrorCode } from '@shared/atoms/error-code/error-code';
import { ErrorMessage } from '@shared/molecules/error-message/error-message';

@Component({
  standalone: true,
  imports: [ErrorCode, ErrorMessage, RouterLink],
  selector: 'app-error-panel',
  templateUrl: './error-panel.html',
})
export class ErrorPanel {
  @Input({ required: true }) error!: ErrorPageContent;
}
