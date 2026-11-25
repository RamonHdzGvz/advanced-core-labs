import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-theme-switch',
  standalone: true,
  templateUrl: './theme-switch.html',
})
export class ThemeSwitchComponent {
  @Input() checked = false;
  @Input() label = '';
  @Input() description = '';
  @Output() checkedChange = new EventEmitter<boolean>();

  protected toggle(): void {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
