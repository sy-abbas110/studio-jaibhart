
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
    storagePath?: string;
    fileName?: string;
  }>;

  // Firestore timestamps
  createdAt?: Timestamp | Date | string; 
  updatedAt?: Timestamp | Date | string; 
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
  percentage?: number; // e.g., 85.5

  gdriveLink?: string; // Link to the main certificate document
  marksheetLinks?: Array<{ semester: string; link: string }>; // For degree students, semester-wise marksheets

  remarks?: string;

  // Firestore timestamps
  createdAt?: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
}


// For forms, especially with react-hook-form and Zod
export type StudentFormData = Omit<Student, 'id' | 'createdAt' | 'updatedAt'> & {
  // Explicitly define all fields that are in the Zod schema
  enrollmentNumber: string;
  firstName: string;
  lastName: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  category?: 'general' | 'obc' | 'sc' | 'st' | 'ews';
  phone: string;
  alternatePhone?: string;
  email?: string;
  emergencyContact?: string;
  aadharNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  course: string;
  programType: 'Degree' | 'Certificate';
  batch: string;
  admissionDate: string;
  courseDurationInMonths: number;
  totalFees?: number;
  feesSubmitted?: number;
  remarks?: string;
  status: 'Active' | 'Completed' | 'Inactive';
  certificateStatus: 'Pending' | 'Issued';
  profilePictureUrl?: string;
  programCertificateLink?: string;
  degreeCertificateLink?: string;
  semesterLinks?: Array<{ semester: string; link: string }>;
  graduationDate?: string | null;
};

export type CertificateFormData = Omit<Certificate, 'id' | 'createdAt' | 'updatedAt' | 'studentEnrollmentNumber' | 'studentName' | 'studentCourse' | 'studentProgramType'>;

