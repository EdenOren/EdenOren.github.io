import { Service } from '@angular/core';
import { ApiPath } from '../../enums/core.enums';
import { BaseDataService } from './base-data.service';
import { ExperienceEntry } from '../../../features/experience/models/experience.models';

@Service()
export class ExperienceService extends BaseDataService<ExperienceEntry> {
  protected override readonly apiPath: ApiPath = ApiPath.Experience;
}
