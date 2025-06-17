
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { StudentFormData, Student } from "@/lib/types";

const STUDENTS_COLLECTION = "students";

export async function addStudent(studentData: StudentFormData): Promise<string> {
  try {
    const studentDoc: Omit<Student, 'id'> = {
      ...studentData,
      // Ensure numeric fields are correctly typed if they come from FormData or are parsed
      courseDurationInMonths: Number(studentData.courseDurationInMonths),
      totalFees: studentData.totalFees !== undefined ? Number(studentData.totalFees) : undefined,
      feesSubmitted: studentData.feesSubmitted !== undefined ? Number(studentData.feesSubmitted) : undefined,
      
      // Ensure optional fields that might be empty strings are handled correctly
      // Zod schema with .optional().or(z.literal('')) handles empty strings for URLs.
      // If a field should be absent if empty, you might need to transform data before this point.
      // For example: fatherName: studentData.fatherName || undefined,

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
