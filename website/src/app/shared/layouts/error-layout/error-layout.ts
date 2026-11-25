import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'app-error-layout',
  templateUrl: './error-layout.html',
})
export class ErrorLayout {}
