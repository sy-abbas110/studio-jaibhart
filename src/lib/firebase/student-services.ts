
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { StudentFormData, Student } from "@/lib/types";

const STUDENTS_COLLECTION = "students";

// Helper to check if enrollment number already exists
export async function checkEnrollmentNumberExists(enrollmentNumber: string): Promise<boolean> {
  // This is a simplified check. For true uniqueness, you might query.
  // However, Firestore rules are better for enforcing this.
  // For now, we'll assume a scenario where we might want to check before attempting an add.
  // A more robust solution involves Firestore rules or checking for a specific doc ID if enrollmentNumber is the ID.
  // If enrollmentNumber is not the doc ID, you'd query:
  // const q = query(collection(db, STUDENTS_COLLECTION), where("enrollmentNumber", "==", enrollmentNumber));
  // const snapshot = await getDocs(q);
  // return !snapshot.empty;
  
  // If using enrollmentNumber as document ID (ensure it's sanitized for Firestore ID rules):
  // const studentDocRef = doc(db, STUDENTS_COLLECTION, enrollmentNumber.replace(/\//g, '_')); // Example sanitization
  // const docSnap = await getDoc(studentDocRef);
  // return docSnap.exists();
  
  // For this example, we'll log a warning and proceed. True uniqueness should be handled by Firestore rules
  // or a more complex pre-check query if not using enrollment number as ID.
  console.warn("Enrollment number uniqueness check is simplified in this example. Implement robust checks or Firestore rules.");
  return false; 
}


export async function addStudent(studentData: StudentFormData): Promise<string> {
  try {
    // Optional: Check for existing enrollment number if it's not the document ID
    // const exists = await checkEnrollmentNumberExists(studentData.enrollmentNumber);
    // if (exists) {
    //   throw new Error(`Student with enrollment number ${studentData.enrollmentNumber} already exists.`);
    // }

    const studentDoc: Omit<Student, 'id'> = {
      ...studentData,
      courseDurationInMonths: Number(studentData.courseDurationInMonths),
      totalFees: studentData.totalFees ? Number(studentData.totalFees) : undefined,
      feesSubmitted: studentData.feesSubmitted ? Number(studentData.feesSubmitted) : undefined,
      semesterLinks: studentData.semesterLinks || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, STUDENTS_COLLECTION), studentDoc);
    return docRef.id;
  } catch (error: any) {
    console.error("Error adding student to Firestore: ", error);
    throw new Error(error.message || "Failed to add student.");
  }
}

// Example function to use enrollmentNumber as Document ID (ensure it's sanitized)
// export async function addStudentWithEnrollmentId(studentData: StudentFormData): Promise<string> {
//   try {
//     const sanitizedEnrollmentNumber = studentData.enrollmentNumber.replace(/[\/\.#$\[\]]/g, '_'); // Basic sanitization
//     const studentDocRef = doc(db, STUDENTS_COLLECTION, sanitizedEnrollmentNumber);
//     const docSnap = await getDoc(studentDocRef);

//     if (docSnap.exists()) {
//       throw new Error(`Student with enrollment number ${studentData.enrollmentNumber} already exists.`);
//     }
    
//     const studentDoc: Omit<Student, 'id'> = {
//       ...studentData,
//       courseDurationInMonths: Number(studentData.courseDurationInMonths),
//       totalFees: studentData.totalFees ? Number(studentData.totalFees) : 0,
//       feesSubmitted: studentData.feesSubmitted ? Number(studentData.feesSubmitted) : 0,
//       semesterLinks: studentData.semesterLinks || [],
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     };

//     await setDoc(studentDocRef, studentDoc);
//     return sanitizedEnrollmentNumber; // or studentDocRef.id
//   } catch (error: any) {
//     console.error("Error adding student to Firestore: ", error);
//     throw new Error(error.message || "Failed to add student.");
//   }
// }
