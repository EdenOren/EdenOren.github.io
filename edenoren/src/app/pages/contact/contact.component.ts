import { Component } from '@angular/core';
import { FreeTextInputComponent } from "../../ui/free-text-input/free-text-input.component";
import { TextareaInputComponent } from '../../ui/textarea-input/textarea-input.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FreeTextInputComponent, TextareaInputComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

}
