import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'free-text-input',
  templateUrl: './free-text-input.component.html',
  styleUrls: ['./free-text-input.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FreeTextInputComponent),
      multi: true
    }
  ]
})
export class FreeTextInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() name: string | null = null;
  @Input() type: string = '';
  @Input() isRequired: boolean = false;
  @Input() maxLength: number = 100;
  @Input() 
  set showError(value: string) {
    this._showError = !!value;
    this.errorMessage = this._showError ? value : '';
  };
  get showError(): boolean {
    return this._showError;
  }

  private _showError: boolean = false;

  public errorMessage: string = '';
  public touched: boolean = false;
  public value: string = '';

  constructor() { }

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onTouch() {
    this.touched = true;
    this.onTouched();
  }

  public handleInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.value = inputValue;
    this.onChange(inputValue);
  }
}