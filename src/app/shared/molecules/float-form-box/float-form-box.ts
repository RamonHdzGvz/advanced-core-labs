import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-float-form-box',
  imports: [],
  templateUrl: './float-form-box.html',
  styleUrl: './float-form-box.css',
})
export class FloatFormBox {
  @Input() label: string = '';
  @Input() requiredSign: boolean = false;
}
