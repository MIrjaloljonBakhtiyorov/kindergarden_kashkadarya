import { z } from 'zod';

export const groupFormSchema = z.object({
  name: z.string().min(2, "Guruh nomi kiritilishi shart"),
  teacher_name: z.string().min(2, "Tarbiyachi ismi kiritilishi shart"),
  capacity: z.number().min(1, "Kvota kiritilishi shart"),
  age_limit: z.string().min(1, "Yosh chegarasi kiritilishi shart"),
});

export type GroupFormValues = z.infer<typeof groupFormSchema>;
