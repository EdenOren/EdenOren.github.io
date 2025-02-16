import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'textarea-input',
  templateUrl: './textarea-input.component.html',
  styleUrls: ['./textarea-input.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaInputComponent),
      multi: true
    }
  ]
})
export class TextareaInputComponent implements ControlValueAccessor{
  @Input() label: string = '';
  @Input() name: string | null = null;
  @Input() isRequired: boolean = false;
  @Input() 
  set showError(value: string) {
    this._showError = !!value?.length;
    this.errorMessage = this._showError ? value : '';
  };
  get showError(): boolean {
    return this._showError;
  }

  private _showError: boolean = false;

  public errorMessage: string = '';
  public value: string = '';
  public touched: boolean = false;

  onChange = (value: string) => {};
  onTouched = () => {};

  constructor() { }

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