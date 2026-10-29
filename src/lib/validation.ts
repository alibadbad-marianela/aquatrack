import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().optional(),
  nickname: z.string().trim().max(30, 'Nickname must be under 30 characters').optional().default(''),
}).refine((data) => !data.confirmPassword || data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const waterRecordSchema = z.object({
  activityName: z.string().min(2, 'Activity name is required').max(60, 'Activity name too long'),
  category: z.enum([
    'drinking_cooking',
    'bathing_showering',
    'toilet',
    'laundry',
    'dishwashing',
    'cleaning',
    'gardening_plants',
    'other',
  ]),
  quantity: z.number().positive('Quantity must be greater than zero').max(50000, 'Unreasonably large quantity'),
  unit: z.enum(['liters', 'milliliters', 'gallons', 'imperial_gallons', 'cubic_meters']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:mm format'),
  notes: z.string().max(300, 'Notes must be under 300 characters').optional().default(''),
  isEstimated: z.boolean().default(false),
});

export const goalSchema = z.object({
  title: z.string().min(3, 'Title is required').max(60, 'Title too long'),
  targetLiters: z.number().positive('Target must be greater than 0').max(100000, 'Unreasonably large target'),
  period: z.enum(['daily', 'weekly', 'monthly', 'custom']),
  category: z.string().default('all'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
