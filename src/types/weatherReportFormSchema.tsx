import { z } from 'zod';

export const weatherReportFormSchema = z.object({
    city: z.string().min(1, {message: "Miasto jest Wymagane"}),
    temperature: z.number(),
    unit: z.enum(['C', 'K', 'F'], {message: "jednostka nieprawidłowa"}),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Nieprawidłowy format daty (YYYY-MM-DD)" }),
}).refine((data) => {
    const { temperature, unit } = data;

    if (unit === 'C' && temperature < -273.15) {
      return false;
    }
    if (unit === 'K' && temperature < 0) {
      return false;
    }
    if (unit === 'F' && temperature < -459.67) {
      return false;
    }
    return true;
  }, {
    message: 'Temperatura nie może być niższa niż minimalna wartość dla wybranej jednostki',
    path: ['temperature'],
});

export type weatherReportFormData = z.infer<typeof weatherReportFormSchema>;