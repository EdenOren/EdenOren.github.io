import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-classic-shell',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './classic-shell.component.html',
  styleUrl: './classic-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassicShellComponent {}
