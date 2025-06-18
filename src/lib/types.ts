
import type { Timestamp } from "firebase/firestore";

export interface Student {
  id: string; // Firestore document ID
  // Basic Information
  enrollmentNumber: string; // Should be unique
  firstName: string;
  lastName: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  category?: 'general' | 'obc' | 'sc' | 'st' | 'ews';

  // Contact Information
  phone: string;
  alternatePhone?: string;
  email?: string;
  emergencyContact?: string;
  aadharNumber?: string; // 12 digits

  // Address Information
  address?: string;
  city?: string;
  state?: string;
  pincode?: string; // 6 digits

  // Academic Information
  course: string; // e.g., D.Pharm, B.Ed
  programType: 'Degree' | 'Certificate'; // Type of program student enrolled in
  batch: string; // e.g., 2024-2025 or 2024 (renamed from batchYear)
  admissionDate: string; // YYYY-MM-DD (renamed from enrollmentDate)
  courseDurationInMonths: number; // Kept from previous schema
  graduationDate?: string | null; // YYYY-MM-DD or null

  // Fee Information
  totalFees?: number;
  feesSubmitted?: number;

  // Additional Information
  remarks?: string;
  status: 'Active' | 'Completed' | 'Inactive'; // Student's current status
  certificateStatus: 'Pending' | 'Issued'; // Status of their main certificate/degree

  profilePictureUrl?: string; // URL to student's photo in Firebase Storage

  // Links to documents, specific to programType
  programCertificateLink?: string;
  degreeCertificateLink?: string;
  semesterLinks?: Array<{
    semester: string;
    link: string;
    storagePath?: string; // If using Firebase storage directly for these
    fileName?: string; // If using Firebase storage directly for these
  }>;

  // Firestore timestamps
  createdAt?: Timestamp | Date | string; 
  updatedAt?: Timestamp | Date | string; 
}

// For public student table (subset of fields)
export interface PublicStudentInfo {
  id: string;
  serialNumber: number;
  name: string;
  enrollmentNumber: string;
  course: string;
  batchYear: string; // Or batch
  enrollmentDate: string; // Or admissionDate
  courseDurationInMonths: number;
  graduationDate: string | null;
}


export interface Certificate {
  id: string; // Firestore document ID
  studentId: string; // Firestore ID of the student this certificate belongs to
  studentEnrollmentNumber: string; // Denormalized
  studentName: string; // Denormalized
  studentCourse: string; // Denormalized
  studentProgramType: 'Degree' | 'Certificate'; // Denormalized from student

  certificateNumber: string; // Auto-generated or unique identifier
  certificateType: 'completion' | 'degree' | 'diploma' | 'marksheet' | 'provisional';
  issueDate: string; // YYYY-MM-DD
  grade?: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'pass';
  percentage?: number; // e.g., 85.5, stored as number or null

  gdriveLink?: string; // Link to the main certificate document
  marksheetLinks?: Array<{ semester: string; link: string }>; // For degree students, semester-wise marksheets

  remarks?: string;

  // Firestore timestamps
  createdAt?: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
}

// For public certificate table (subset of fields)
export interface PublicCertificateInfo {
  id: string;
  studentName: string;
  enrollmentNumber: string;
  programType: string; // 'Degree', 'Certificate', 'Diploma' etc.
  documentLink: string;
  issuedDate: string; // YYYY-MM-DD
  course: string;
}


// For forms, especially with react-hook-form and Zod
export type StudentFormValues = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;
export type CertificateFormValues = Omit<Certificate, 'id' | 'createdAt' | 'updatedAt' | 'studentEnrollmentNumber' | 'studentName' | 'studentCourse' | 'studentProgramType'>;
// The CertificateFormValues type from Zod is more precise for form validation.
// This general type is fine but Zod infer is preferred where schema is used.
