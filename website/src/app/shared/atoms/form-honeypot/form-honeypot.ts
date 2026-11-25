import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const noop = (): void => undefined;

@Component({
  selector: 'app-form-honeypot',
  standalone: true,
  templateUrl: './form-honeypot.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormHoneypotComponent),
      multi: true,
    },
  ],
})
export class FormHoneypotComponent implements ControlValueAccessor {
  private static nextId = 0;
  protected readonly inputId = `form-honeypot-${FormHoneypotComponent.nextId++}`;
  protected value = '';
  protected disabled = false;
  private onChange: (value: string) => void = noop;
  private onTouched: () => void = noop;

  @Input() fieldName = 'age';

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected updateValue(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
    this.onTouched();
  }
}
