import { Service } from '@angular/core';
import { ApiPath } from '../../enums/core.enums';
import { BaseDataService } from './base-data.service';
import { Skill } from '../../../features/skills/models/skills.models';

@Service()
export class SkillsService extends BaseDataService<Skill> {
  protected override readonly apiPath: ApiPath = ApiPath.Skills;
}
