export interface Student {
  id: string;
  serialNumber: number;
  name: string;
  enrollmentNumber: string;
  course: string;
  batchYear: string;
  enrollmentDate: string; // YYYY-MM-DD
  courseDurationInMonths: number; 
  graduationDate?: string | null; // YYYY-MM-DD
}

export interface Certificate {
  id: string;
  studentName: string;
  enrollmentNumber: string;
  programType: 'Degree' | 'Certificate' | 'Diploma';
  documentLink: string; // GDrive link
  issuedDate: string; // YYYY-MM-DD
  course: string;
}
