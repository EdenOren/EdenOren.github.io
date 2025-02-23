import { Component } from '@angular/core';
import { Project, projects } from '../../core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../ui/button/button.component";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  public projects: Project[] = projects;

  public openLink(link: string): void {
    window.open(link, '_blank');
  }
}
