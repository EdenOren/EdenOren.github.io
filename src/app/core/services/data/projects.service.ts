import { Service } from '@angular/core';
import { ApiPath } from '../../enums/core.enums';
import { BaseDataService } from './base-data.service';
import { Project } from '../../../features/projects/models/projects.models';

@Service()
export class ProjectsService extends BaseDataService<Project> {
  protected override readonly apiPath: ApiPath = ApiPath.Projects;
}
