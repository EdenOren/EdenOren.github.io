import { GoogleButtonShape, GoogleButtonTheme } from '../enums/admin.enums';

export interface AdminSkillGroup {
  id: string;
  label: string;
  skills: string[];
}

export interface GoogleButtonStyle {
  theme: GoogleButtonTheme;
  shape: GoogleButtonShape;
}
