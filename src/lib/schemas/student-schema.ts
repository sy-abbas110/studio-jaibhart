
import { z } from 'zod';

const semesterLinkSchema = z.object({
  semester: z.string().min(1, 'Semester name is required.'),
  link: z.string().url('Must be a valid URL.').or(z.literal('')),
  // storagePath and fileName are optional and not directly part of the form input for links
});

export const studentFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  enrollmentNumber: z.string().min(5, { message: "Enrollment number is required." })
    .regex(/^[A-Z0-9]+$/, "Enrollment number should be alphanumeric (uppercase letters and numbers)."),
  course: z.string().min(1, { message: "Course selection is required." }),
  batchYear: z.string().min(4, { message: "Batch year is required (e.g., 2023-2025 or 2023)." }),
  enrollmentDate: z.string().min(1, { message: "Enrollment date is required." }), // Will be string from date picker
  courseDurationInMonths: z.coerce.number().int().positive({ message: "Course duration must be a positive number." }),
  programType: z.enum(['Degree', 'Certificate'], { required_error: "Program type is required." }),
  totalFees: z.coerce.number().nonnegative({ message: "Total fees cannot be negative." }).optional(),
  feesSubmitted: z.coerce.number().nonnegative({ message: "Fees submitted cannot be negative." }).optional(),
  profilePictureUrl: z.string().url({ message: "Invalid URL format for profile picture." }).optional().or(z.literal('')),
  
  // Conditional fields based on programType
  programCertificateLink: z.string().url({ message: "Invalid URL for certificate." }).optional().or(z.literal('')),
  degreeCertificateLink: z.string().url({ message: "Invalid URL for degree certificate." }).optional().or(z.literal('')),
  semesterLinks: z.array(semesterLinkSchema).optional(),
  graduationDate: z.string().optional().nullable(), // Can be null or empty
}).refine(data => { // Ensure feesSubmitted is not greater than totalFees if both are provided
  if (data.totalFees !== undefined && data.feesSubmitted !== undefined) {
    return data.feesSubmitted <= data.totalFees;
  }
  return true;
}, {
  message: "Fees submitted cannot exceed total fees.",
  path: ["feesSubmitted"], 
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;
