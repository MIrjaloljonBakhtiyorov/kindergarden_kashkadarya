import { z } from 'zod';

export const IssueLevelSchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export const InspectionIssueSchema = z.object({
  questionId: z.string(),
  comment: z.string().min(1, "Izoh kiritilishi shart"),
  level: IssueLevelSchema,
  evidenceUrl: z.string().optional(),
});

export const FoodConsumptionSchema = z.object({
  groupId: z.string(),
  stats: z.array(z.object({
    percentage: z.enum(['100', '75', '50', '25', '0']),
    count: z.number().min(0)
  })),
  evidenceUrl: z.string().optional(),
});
