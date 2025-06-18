
import type { Student, Certificate } from './types';

export const courseCategories = [
  {
    title: "Paramedical Courses",
    color: "bg-red-100 text-red-800", // Kept for specific visual identity from user's design
    courses: [
      "D.PHARMA (Ayurved & Homeopath)",
      "G.N.M. (Ayurved)",
      "C.C.H. (Ayurved Community Health)",
      "D.M.L.T. (Diagnostic)",
      "C.M.S & E.D.",
      "G.N.O.",
      "O.T. Technician",
      "Vaithery (एवं चिकित्सक)",
      "B.PHARMA & D.PHARMA (Allopath)",
    ],
  },
  {
    title: "Medical Courses",
    color: "bg-green-100 text-green-800",
    courses: ["B.A.M.S.", "B.N.Y.S.", "D.N.Y.S.", "M.S.W.", "M.A.H.W."],
  },
  {
    title: "Technical Courses",
    color: "bg-blue-100 text-blue-700", // Adjusted for better contrast if needed
    courses: [
      "I.T.I. - Fitter, Welder, Mechanical, Electrician",
      "Material Management",
      "POLYTECHNIC (Civil Engineering All Courses)",
      "N.T.T.",
      "T.O.T.",
      "A.D.F.A.",
    ],
  },
  {
    title: "Computer Courses",
    color: "bg-purple-100 text-purple-800",
    courses: ["CCC", "PGDCA", "O-LEVEL", "DCA", "ADCA", "BCA", "MCA"],
  },
  {
    title: "Degree Programs",
    color: "bg-yellow-100 text-yellow-800",
    courses: [
      "B.A.",
      "B.Sc.",
      "B.Com.",
      "M.Com.",
      "M.A.",
      "L.L.B.",
      "L.L.M.",
      "BBA",
      "MBA",
      "B.T.C.",
      "B.Ed.",
      "D.Ed.",
      "B.P.Ed.",
      "M.P.Ed.",
      "B.Tech",
      "M.Tech",
    ],
  },
  {
    title: "Yoga & Wellness",
    color: "bg-orange-100 text-orange-800",
    courses: [
      "YOGA D.N.Y.S.",
      "YOGA B.N.Y.S.",
      "YOGA P.G. Diploma",
      "YOGA B.Sc.",
      "YOGA M.Sc.",
      "M.A. YOGA",
      "B.A. YOGA",
      "Yoga Teacher Training Certificate",
    ],
  },
];

const getAllCourses = () => {
  const courses: string[] = [];
  courseCategories.forEach(category => {
    category.courses.forEach(course => {
      if (!courses.includes(course)) {
        courses.push(course);
      }
    });
  });
  return courses.sort();
};

export const allCourseOptions: { value: string; label: string }[] = [
  { value: "All", label: "All Courses" }, // For filter dropdowns
  ...getAllCourses().map(course => ({ value: course, label: course }))
];

export const studentFormCourseOptions: { value: string; label: string }[] = 
  getAllCourses().map(course => ({ value: course, label: course }));


export const mockStudents: Student[] = [
  {
    id: '1',
    // serialNumber: 1, // serialNumber removed from Student type, not in StudentFormValues
    firstName: 'Aarav',
    lastName: 'Sharma',
    enrollmentNumber: 'JBPI2021001',
    course: 'D.PHARMA (Ayurved & Homeopath)',
    batch: '2021-2023',
    admissionDate: '2021-08-15',
    courseDurationInMonths: 24,
    graduationDate: '2023-07-20',
    status: 'Completed',
    certificateStatus: 'Issued',
    programType: 'Certificate', // Assuming D.Pharma is a Certificate/Diploma
    phone: '9876543210'
  },
  {
    id: '2',
    firstName: 'Diya',
    lastName: 'Patel',
    enrollmentNumber: 'JBPI2022002',
    course: 'CCC',
    batch: '2022',
    admissionDate: '2022-01-10',
    courseDurationInMonths: 3,
    graduationDate: '2022-04-05',
    status: 'Completed',
    certificateStatus: 'Issued',
    programType: 'Certificate',
    phone: '9876543211'
  },
  {
    id: '3',
    firstName: 'Rohan',
    lastName: 'Mehta',
    enrollmentNumber: 'JBPI2020003',
    course: 'B.Ed.',
    batch: '2020-2022',
    admissionDate: '2020-07-01',
    courseDurationInMonths: 24,
    graduationDate: '2022-06-15',
    status: 'Completed',
    certificateStatus: 'Issued',
    programType: 'Degree',
    phone: '9876543212'
  },
  {
    id: '4',
    firstName: 'Priya',
    lastName: 'Singh',
    enrollmentNumber: 'JBPI2023004',
    course: 'D.PHARMA (Ayurved & Homeopath)',
    batch: '2023-2025',
    admissionDate: '2023-09-01',
    courseDurationInMonths: 24,
    graduationDate: null, // Ongoing
    status: 'Active',
    certificateStatus: 'Pending',
    programType: 'Certificate',
    phone: '9876543213'
  },
  {
    id: '5',
    firstName: 'Amit',
    lastName: 'Kumar',
    enrollmentNumber: 'JBPI2022005',
    course: 'D.M.L.T. (Diagnostic)',
    batch: '2022-2024',
    admissionDate: '2022-07-20',
    courseDurationInMonths: 24,
    graduationDate: '2024-06-30',
    status: 'Completed',
    certificateStatus: 'Issued',
    programType: 'Certificate', // Assuming DMLT is cert/diploma
    phone: '9876543214'
  },
  // Add more mock students if needed, matching the new Student type and course names
];


// Mock data for certificates (simplified for brevity, adjust as needed)
export const mockCertificates: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    studentId: '1', // Placeholder, ensure studentId matches actual student IDs if linking
    studentName: 'Aarav Sharma',
    studentEnrollmentNumber: 'JBPI2021001',
    studentCourse: 'D.PHARMA (Ayurved & Homeopath)',
    studentProgramType: 'Certificate',
    certificateNumber: 'CERT-JBPI2021001-001',
    certificateType: 'diploma', // D.Pharma could be diploma
    issueDate: '2023-08-01',
    gdriveLink: 'https://docs.google.com/document/d/example',
  },
  {
    studentId: '2',
    studentName: 'Diya Patel',
    studentEnrollmentNumber: 'JBPI2022002',
    studentCourse: 'CCC',
    studentProgramType: 'Certificate',
    certificateNumber: 'CERT-JBPI2022002-001',
    certificateType: 'completion',
    issueDate: '2022-04-15',
    gdriveLink: 'https://docs.google.com/document/d/example',
  },
  {
    studentId: '3',
    studentName: 'Rohan Mehta',
    studentEnrollmentNumber: 'JBPI2020003',
    studentCourse: 'B.Ed.',
    studentProgramType: 'Degree',
    certificateNumber: 'CERT-JBPI2020003-001',
    certificateType: 'degree',
    issueDate: '2022-07-01',
    gdriveLink: 'https://docs.google.com/document/d/example',
    marksheetLinks: [
        { semester: 'Semester 1', link: 'https://docs.google.com/document/d/sem1_example' },
        { semester: 'Semester 2', link: 'https://docs.google.com/document/d/sem2_example' },
    ]
  },
];


export const yearOptions = [
  { value: "All", label: "All Years" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
  { value: "2020", label: "2020" },
];

// This is the old courseOptions. It will be replaced by allCourseOptions / studentFormCourseOptions.
// Keeping it commented out for reference during transition.
/*
export const courseOptions = [
  { value: "All", label: "All Courses" },
  { value: "D.Pharm", label: "D.Pharm" },
  { value: "CCC", label: "CCC" },
  { value: "B.Ed", label: "B.Ed" },
  { value: "Lab Technician", label: "Lab Technician" },
  { value: "OT Technician", label: "OT Technician" },
];
*/
