import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'custom-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() title: string = '';
  @Input() type: string = 'button';

  @Output() click: EventEmitter<void> = new EventEmitter<void>();
  
  onClick(): void {
    this.click.emit();
  }

}
