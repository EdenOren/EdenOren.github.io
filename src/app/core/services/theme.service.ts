import { Service, WritableSignal, signal } from '@angular/core';
import { Theme } from '../enums/core.enums';

@Service()
export class ThemeService {
  readonly theme: WritableSignal<Theme> = signal<Theme>(Theme.Light);

  // TODO feature/dark-light-mode: implement toggle + persistence
}
