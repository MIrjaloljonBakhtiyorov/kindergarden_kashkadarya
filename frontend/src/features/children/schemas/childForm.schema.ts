import { z } from 'zod';

export const childFormSchema = z.object({
  first_name: z.string().min(2, "Ism kiritilishi shart"),
  last_name: z.string().min(2, "Otasining ismi kiritilishi shart"),
  birth_date: z.string().min(1, "Tug'ilgan sana kiritilishi shart"),
  age_category: z.string().min(1, "Yosh kategoriyasi kiritilishi shart"),
  gender: z.enum(["M", "F"], { message: "Jinsi tanlanishi shart" } as any),
  address: z.string().min(1, "Manzil kiritilishi shart"),
  weight: z.string().optional(),
  height: z.string().optional(),
  allergies: z.string().optional(),
  passport_info: z.string().optional(),
  birth_certificate_number: z.string().min(1, "Guvohnoma raqami kiritilishi shart"),
  medical_notes: z.string().optional(),
  father_full_name: z.string().min(2, "Otasining to'liq ismi kiritilishi shart"),
  father_workplace: z.string().optional(),
  father_phone: z.string().min(7, "Telefon raqami kiritilishi shart"),
  father_passport: z.string().optional(),
  mother_full_name: z.string().min(2, "Onasining to'liq ismi kiritilishi shart"),
  mother_workplace: z.string().optional(),
  mother_phone: z.string().min(7, "Telefon raqami kiritilishi shart"),
  mother_passport: z.string().optional(),
  group_id: z.string().min(1, "Guruh tanlanishi shart"),
  status: z.enum(["DRAFT", "PENDING", "ACTIVE"]).optional(),
});

export type ChildFormValues = z.infer<typeof childFormSchema>;
