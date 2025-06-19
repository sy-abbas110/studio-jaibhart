
import { collection, addDoc, serverTimestamp, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { StudentFormData, Student } from "@/lib/types";
import type { StudentFormValues } from "@/lib/schemas/student-schema";

const STUDENTS_COLLECTION = "students";

export async function addStudent(studentData: StudentFormValues): Promise<string> {
  try {
    const studentDoc: Omit<Student, 'id' | 'createdAt' | 'updatedAt'> & { createdAt: any, updatedAt: any } = {
      ...studentData,
      courseDurationInMonths: Number(studentData.courseDurationInMonths),
      totalFees: studentData.totalFees !== undefined ? Number(studentData.totalFees) : undefined,
      feesSubmitted: studentData.feesSubmitted !== undefined ? Number(studentData.feesSubmitted) : undefined,
      semesterLinks: studentData.semesterLinks || [],
      // Ensure dates are correctly formatted if needed, though Firestore handles ISO strings for Timestamps
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log("Attempting to add student document to Firestore:", studentDoc);
    const docRef = await addDoc(collection(db, STUDENTS_COLLECTION), studentDoc);
    return docRef.id;
  } catch (error: any) {
    console.error("Error adding student to Firestore: ", error);
    throw new Error(error.message || "Failed to add student.");
  }
}

export async function getStudents(): Promise<Student[]> {
  try {
    const q = query(collection(db, STUDENTS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const students: Student[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      students.push({ 
        id: doc.id, 
        ...data,
        // Convert Firestore Timestamps to ISO strings for client-side date handling
        admissionDate: data.admissionDate, // Assuming stored as string
        dateOfBirth: data.dateOfBirth, // Assuming stored as string
        graduationDate: data.graduationDate, // Assuming stored as string or null
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as Student);
    });
    return students;
  } catch (error: any) {
    console.error("Error fetching students from Firestore: ", error);
    throw new Error(error.message || "Failed to fetch students.");
  }
}

export async function getStudentById(id: string): Promise<Student | null> {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        ...data,
        admissionDate: data.admissionDate,
        dateOfBirth: data.dateOfBirth,
        graduationDate: data.graduationDate,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
       } as Student;
    }
    return null;
  } catch (error: any) {
    console.error(`Error fetching student ${id} from Firestore: `, error);
    throw new Error(error.message || `Failed to fetch student ${id}.`);
  }
}

export async function updateStudent(id: string, studentData: Partial<StudentFormValues>): Promise<void> {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, id);
    const updatePayload = {
        ...studentData,
        courseDurationInMonths: studentData.courseDurationInMonths !== undefined ? Number(studentData.courseDurationInMonths) : undefined,
        totalFees: studentData.totalFees !== undefined ? Number(studentData.totalFees) : undefined,
        feesSubmitted: studentData.feesSubmitted !== undefined ? Number(studentData.feesSubmitted) : undefined,
        updatedAt: serverTimestamp()
    };
     // Remove undefined fields to prevent Firestore errors
    Object.keys(updatePayload).forEach(key => updatePayload[key as keyof typeof updatePayload] === undefined && delete updatePayload[key as keyof typeof updatePayload]);

    await updateDoc(studentRef, updatePayload);
  } catch (error: any) {
    console.error(`Error updating student ${id} in Firestore: `, error);
    throw new Error(error.message || `Failed to update student ${id}.`);
  }
}

export async function deleteStudent(id: string): Promise<void> {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, id);
    await deleteDoc(studentRef);
  } catch (error: any) {
    console.error(`Error deleting student ${id} from Firestore: `, error);
    throw new Error(error.message || `Failed to delete student ${id}.`);
  }
}
