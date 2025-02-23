import { Component, signal, WritableSignal } from '@angular/core';
import { FreeTextInputComponent } from "../../ui/free-text-input/free-text-input.component";
import { TextareaInputComponent } from '../../ui/textarea-input/textarea-input.component';
import { ButtonComponent } from "../../ui/button/button.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    FreeTextInputComponent,
    TextareaInputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  public formErrors: WritableSignal<Record<string, string>> = signal<Record<string, string>>({});
  public emailSent: WritableSignal<boolean> = signal<boolean>(false);

  public NAME_CONTROL_NAME: string = 'name';
  public EMAIL_CONTROL_NAME: string = 'email';
  public DETAILS_CONTROL_NAME: string = 'details';
  public formGroup: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    details: new FormControl('', Validators.required)
  });

  constructor(
    private http: HttpClient,
  ) {
    this.subscribeToFormControlChanges();
  }

  private subscribeToFormControlChanges() {
    Object.keys(this.formGroup.controls).forEach((control: string) => {
      const formControl = this.formGroup.get(control);
      formControl?.valueChanges.subscribe(() => {
        if (!formControl?.touched || (formControl?.touched && formControl?.valid)) {
          this.clearError(control);
        } else {
          this.formErrors.set({ ...this.formErrors(), [control]: this.getError(control) });
        }
      });
    });
  }

  private clearError(controlName: string) {
    const currentErrors: Record<string, string> = this.formErrors();
    const updatedErrors = { ...currentErrors };
    delete updatedErrors[controlName];
  
    this.formErrors.set(updatedErrors);
  }

  private getError(controlName: string): string {
    const control = this.formGroup.get(controlName);
    if (!control?.errors) {
      return '';
    }
    const firstError = Object.keys(control.errors)[0];
    return `Error: ${firstError}`;
  }
  
  private formSubmit(formData: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Accept': 'application/json' }) };
    return this.http.post('https://formspree.io/f/xyzkybnl', formData, options);
  }
  
  public reset(): void {
    this.formGroup.reset();
    this.formGroup.updateValueAndValidity();
  }


  public submit(): void {
    if (this.formGroup.invalid) {
      const errors: Record<string, string> = {};
      Object.keys(this.formGroup.controls).forEach(controlName => {
        errors[controlName] = this.getError(controlName);
      });
      this.formErrors.set(errors);
      return;
    }
    this.formSubmit(this.formGroup.getRawValue())
      .subscribe((res) => {
        if (res.ok) {
          this.emailSent.set(true);
        }
      });
  }
}