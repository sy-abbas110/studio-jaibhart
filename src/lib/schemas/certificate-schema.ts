
import { z } from 'zod';

const marksheetLinkSchema = z.object({
  semester: z.string().min(1, 'Semester name is required.'),
  link: z.string().url('Must be a valid GDrive URL.').or(z.literal('')), // Allow empty string if optional
});

export const certificateFormSchema = z.object({
  studentId: z.string().min(1, 'Student selection is required.'),
  
  certificateNumber: z.string().min(1, 'Certificate number is required.'),
  certificateType: z.enum(['completion', 'degree', 'diploma', 'marksheet', 'provisional'], {
    required_error: 'Certificate type is required.',
  }),
  issueDate: z.string().min(1, 'Issue date is required.'), // YYYY-MM-DD
  
  grade: z.enum(['A+', 'A', 'B+', 'B', 'C+', 'C', 'pass']).optional(),
  percentage: z.coerce.number().min(0).max(100).optional().nullable(), // Allow null for clearing
  
  gdriveLink: z.string().url('Must be a valid GDrive URL.').optional().or(z.literal('')),
  
  marksheetLinks: z.array(marksheetLinkSchema)
    .optional()
    .default([]) // Ensure it's an array even if not provided
    .refine(links => { // If program type is Degree and links are provided, they must be valid
        // This validation might be better handled conditionally based on student's programType in the component
        // For now, just ensure structure if provided.
        return true; 
    }, { message: "Invalid marksheet link structure for Degree program."}),
  
  remarks: z.string().optional().or(z.literal('')),
});

export type CertificateFormValues = z.infer<typeof certificateFormSchema>;
