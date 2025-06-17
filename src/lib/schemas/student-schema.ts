
import { z } from 'zod';

const semesterLinkSchema = z.object({
  semester: z.string().min(1, 'Semester name is required.'),
  link: z.string().url('Must be a valid URL.').or(z.literal('')),
});

export const studentFormSchema = z.object({
  // Basic Information
  enrollmentNumber: z.string().min(5, "Enrollment number is required.")
    .regex(/^[A-Z0-9]+$/, "Enrollment number should be alphanumeric (uppercase letters and numbers)."),
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  dateOfBirth: z.string().optional(), // Assuming YYYY-MM-DD string from <Input type="date">
  gender: z.enum(['male', 'female', 'other']).optional(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  category: z.enum(['general', 'obc', 'sc', 'st', 'ews']).optional(),

  // Contact Information
  phone: z.string().min(10, "Phone number must be at least 10 digits.").max(15, "Phone number too long."),
  alternatePhone: z.string().max(15, "Alternate phone number too long.").optional().or(z.literal('')),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  emergencyContact: z.string().max(15, "Emergency contact too long.").optional().or(z.literal('')),
  aadharNumber: z.string().length(12, "Aadhar number must be 12 digits.").regex(/^\d{12}$/, "Invalid Aadhar number.").optional().or(z.literal('')),

  // Address Information
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().length(6, "Pincode must be 6 digits.").regex(/^\d{6}$/, "Invalid pincode.").optional().or(z.literal('')),

  // Academic Information
  course: z.string().min(1, "Course selection is required."),
  programType: z.enum(['Degree', 'Certificate'], { required_error: "Program type is required." }),
  batch: z.string().min(4, "Batch year is required (e.g., 2023-2025 or 2023)."),
  admissionDate: z.string().min(1, "Admission date is required."), // String from date picker
  courseDurationInMonths: z.coerce.number().int().positive("Course duration must be a positive number."),

  // Fee Information
  totalFees: z.coerce.number().nonnegative("Total fees cannot be negative.").optional(),
  feesSubmitted: z.coerce.number().nonnegative("Fees submitted cannot be negative.").optional(),
  
  // Additional Information
  remarks: z.string().optional(),
  status: z.enum(['Active', 'Completed', 'Inactive'], { required_error: "Student status is required."}),
  certificateStatus: z.enum(['Pending', 'Issued'], { required_error: "Certificate status is required."}),
  
  profilePictureUrl: z.string().url("Invalid URL format for profile picture.").optional().or(z.literal('')),
  
  programCertificateLink: z.string().url("Invalid URL for program certificate.").optional().or(z.literal('')),
  degreeCertificateLink: z.string().url("Invalid URL for degree certificate.").optional().or(z.literal('')),
  semesterLinks: z.array(semesterLinkSchema).optional(),
  
  graduationDate: z.string().optional().nullable(), // Kept from previous schema, might relate to 'Completed' status
}).refine(data => {
  if (data.totalFees !== undefined && data.feesSubmitted !== undefined) {
    return data.feesSubmitted <= data.totalFees;
  }
  return true;
}, {
  message: "Fees submitted cannot exceed total fees.",
  path: ["feesSubmitted"], 
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;
