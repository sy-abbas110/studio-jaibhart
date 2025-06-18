
import { z } from 'zod';

const marksheetLinkSchema = z.object({
  semester: z.string().min(1, 'Semester name is required.'),
  link: z.string().url('Must be a valid GDrive URL.').or(z.literal('')),
});

export const certificateFormSchema = z.object({
  studentId: z.string().min(1, 'Student selection is required.'),
  
  certificateNumber: z.string().min(1, 'Certificate number is required.'), // Will be auto-populated
  certificateType: z.enum(['completion', 'degree', 'diploma', 'marksheet', 'provisional'], {
    required_error: 'Certificate type is required.',
  }),
  issueDate: z.string().min(1, 'Issue date is required.'), // YYYY-MM-DD
  
  grade: z.enum(['A+', 'A', 'B+', 'B', 'C+', 'C', 'pass']).optional(),
  percentage: z.coerce.number().min(0).max(100).optional(),
  
  gdriveLink: z.string().url('Must be a valid GDrive URL.').optional().or(z.literal('')),
  
  // Only applicable if student's programType is 'Degree'
  marksheetLinks: z.array(marksheetLinkSchema).optional(), 
  
  remarks: z.string().optional(),
});

export type CertificateFormValues = z.infer<typeof certificateFormSchema>;
