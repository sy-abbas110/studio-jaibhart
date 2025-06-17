
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

export interface Certificate { // This represents individual certificate/marksheet records
  id: string; // Firestore document ID
  studentId?: string; // Firestore ID of the student this certificate belongs to
  studentName: string; // Denormalized for easy display
  enrollmentNumber: string; // Denormalized

  course: string; // Course this certificate is related to
  // programType: 'Degree' | 'Certificate' | 'Diploma'; // from mockCertificates, align with Student's programType or make more generic
  programType: string; // Generalizing for now based on mockCertificates

  documentLink: string; // GDrive link or Firebase Storage URL
  storagePath?: string; // Optional: path in Firebase Storage if uploaded
  fileName?: string; // Optional: original file name

  issuedDate: string; // YYYY-MM-DD

  // Firestore timestamps
  createdAt?: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
}

// For forms, especially with react-hook-form and Zod
export type StudentFormData = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;
export type CertificateFormData = Omit<Certificate, 'id' | 'createdAt' | 'updatedAt' | 'studentName' | 'enrollmentNumber'> & { studentId: string };

