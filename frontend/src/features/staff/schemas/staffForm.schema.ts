import { z } from 'zod';

export const staffFormSchema = z.object({
  full_name: z.string().min(2, "F.I.Sh kiritilishi shart"),
  position: z.string().min(2, "Lavozim kiritilishi shart"),
  phone: z.string().min(7, "Telefon raqami kiritilishi shart"),
  email: z.string().email("Noto'g'ri email format").optional().or(z.literal('')),
  passport_no: z.string().min(1, "Passport ma'lumotlari kiritilishi shart"),
  passport_pdf: z.any().optional(),
  birth_date: z.string().min(1, "Tug'ilgan sana kiritilishi shart"),
  education: z.string().min(2, "O'qish joyi kiritilishi shart"),
  experience_years: z.string().min(1, "Ish staji kiritilishi shart"),
  group_id: z.string().optional().or(z.literal('')),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type StaffFormValues = z.infer<typeof staffFormSchema>;
