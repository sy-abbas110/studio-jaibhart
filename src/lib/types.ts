
import type { Timestamp } from "firebase/firestore";

export interface Student {
  id: string; // Firestore document ID
  serialNumber?: number; // Keep for public data compatibility, may remove for Firestore
  name: string;
  enrollmentNumber: string; // Should be unique
  course: string; // e.g., D.Pharm, B.Ed
  batchYear: string;
  enrollmentDate: string; // YYYY-MM-DD
  courseDurationInMonths: number; 
  graduationDate?: string | null; // YYYY-MM-DD

  // New fields for admin panel / Firebase
  programType?: 'Degree' | 'Certificate'; // Type of program student enrolled in
  profilePictureUrl?: string; // URL to student's photo in Firebase Storage
  
  // Links to documents, specific to program type
  // For 'Certificate' programType:
  programCertificateLink?: string; // Link to the main certificate for the program
  programCertificateStoragePath?: string; // Optional: path in Firebase Storage if uploaded

  // For 'Degree' programType:
  degreeCertificateLink?: string; // Link to the final degree certificate
  degreeCertificateStoragePath?: string; // Optional: path in Firebase Storage if uploaded
  semesterLinks?: Array<{ 
    semester: string; // e.g., "Semester 1", "Semester 2"
    link: string; // GDrive or Firebase Storage URL to marksheet
    storagePath?: string; // Optional: path in Firebase Storage if uploaded
    fileName?: string; // Optional: original file name
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
  // programType: 'Degree' | 'Certificate' | 'Diploma'; // This field describes the nature of the document
  certificateTitle: string; // e.g., "Diploma in Pharmacy", "Course Completion CCC", "Semester 1 Marksheet"
  documentType: 'Degree' | 'Certificate' | 'Diploma' | 'Marksheet' | 'Award' | 'Other';


  documentLink: string; // GDrive link or Firebase Storage URL
  storagePath?: string; // Optional: path in Firebase Storage if uploaded
  fileName?: string; // Optional: original file name
  
  issuedDate: string; // YYYY-MM-DD

  // Firestore timestamps
  createdAt?: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
}

// For forms, especially with react-hook-form and Zod
export type StudentFormData = Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'serialNumber'>;
export type CertificateFormData = Omit<Certificate, 'id' | 'createdAt' | 'updatedAt' | 'studentName' | 'enrollmentNumber'> & { studentId: string };

