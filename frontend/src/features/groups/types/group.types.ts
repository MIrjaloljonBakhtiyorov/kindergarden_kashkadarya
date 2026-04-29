import { GroupFormValues } from '../schemas/groupForm.schema';

export interface Group {
  id: string;
  name: string;
  teacher_name: string;
  capacity: number;
  age_limit: string;
}

export type { GroupFormValues };
