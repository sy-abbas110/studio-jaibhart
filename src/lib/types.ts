
import type { Timestamp } from "firebase/firestore";

export interface Student {
  id: string; // Firestore document ID
  // Basic Information
  enrollmentNumber: string; 
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
  course: string; // e.g., D.Pharm, B.Ed - Will use new comprehensive list
  programType: 'Degree' | 'Certificate'; 
  batch: string; 
  admissionDate: string; // YYYY-MM-DD
  courseDurationInMonths: number; 
  graduationDate?: string | null; // YYYY-MM-DD or null

  // Fee Information
  totalFees?: number;
  feesSubmitted?: number;

  // Additional Information
  remarks?: string;
  status: 'Active' | 'Completed' | 'Inactive'; 
  certificateStatus: 'Pending' | 'Issued'; 

  profilePictureUrl?: string; 

  programCertificateLink?: string;
  degreeCertificateLink?: string;
  semesterLinks?: Array<{
    semester: string;
    link: string;
    storagePath?: string; 
    fileName?: string; 
  }>;

  createdAt?: Timestamp | Date | string; 
  updatedAt?: Timestamp | Date | string; 
}

// This PublicStudentInfo was used for the old mock data.
// The student-table.tsx now uses the full Student type (or should aim to)
// and adapt data if necessary (e.g., combining firstName and lastName).
// For simplicity, I will remove it as the public student table can adapt the full Student type.
/*
export interface PublicStudentInfo {
  id: string;
  serialNumber: number;
  name: string;
  enrollmentNumber: string;
  course: string;
  batchYear: string; 
  enrollmentDate: string; 
  courseDurationInMonths: number;
  graduationDate: string | null;
}
*/


export interface Certificate {
  id: string; 
  studentId: string; 
  studentEnrollmentNumber: string; 
  studentName: string; 
  studentCourse: string; 
  studentProgramType: 'Degree' | 'Certificate'; 

  certificateNumber: string; 
  certificateType: 'completion' | 'degree' | 'diploma' | 'marksheet' | 'provisional';
  issueDate: string; // YYYY-MM-DD
  grade?: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'pass';
  percentage?: number | null; // Can be null if not applicable or cleared

  gdriveLink?: string; 
  marksheetLinks?: Array<{ semester: string; link: string }>; 

  remarks?: string;

  createdAt?: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
}

// This PublicCertificateInfo was used for the old mock data.
// The certificate-table.tsx now uses the full Certificate type (or should aim to).
/*
export interface PublicCertificateInfo {
  id: string;
  studentName: string;
  enrollmentNumber: string;
  programType: string; 
  documentLink: string;
  issuedDate: string; // YYYY-MM-DD
  course: string;
}
*/

export type StudentFormValues = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;
export type CertificateFormValues = Omit<Certificate, 'id' | 'createdAt' | 'updatedAt' | 'studentEnrollmentNumber' | 'studentName' | 'studentCourse' | 'studentProgramType'>;

