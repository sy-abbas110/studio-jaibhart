
"use server";

import { determineStudentStatus, type DetermineStudentStatusInput } from "@/ai/flows/determine-student-status";
import { 
  addStudent as addStudentToFirestore,
  getStudents as getStudentsFromFirestore,
  getStudentById as getStudentByIdFromFirestore,
  updateStudent as updateStudentInFirestore,
  deleteStudent as deleteStudentFromFirestore
} from "@/lib/firebase/student-services";
import type { Student, StudentFormData } from "@/lib/types";
import type { StudentFormValues } from "@/lib/schemas/student-schema";

export async function getStudentStatusAction(input: DetermineStudentStatusInput) {
  try {
    const result = await determineStudentStatus(input);
    return result;
  } catch (error) {
    console.error("Error determining student status:", error);
    return { status: "Error" };
  }
}

export async function addStudentAction(formData: StudentFormValues): Promise<{ success: boolean; message: string; studentId?: string }> {
  try {
    const studentId = await addStudentToFirestore(formData);
    return { success: true, message: "Student added successfully!", studentId };
  } catch (error: any) {
    console.error("Error in addStudentAction:", error);
    return { success: false, message: error.message || "Failed to add student. Please try again." };
  }
}

export async function getStudentsAction(): Promise<{ success: boolean; students?: Student[]; message?: string }> {
  try {
    const students = await getStudentsFromFirestore();
    return { success: true, students };
  } catch (error: any) {
    console.error("Error in getStudentsAction:", error);
    return { success: false, message: error.message || "Failed to fetch students." };
  }
}

export async function getStudentByIdAction(id: string): Promise<{ success: boolean; student?: Student | null; message?: string }> {
  try {
    const student = await getStudentByIdFromFirestore(id);
    if (!student) {
      return { success: false, message: "Student not found." };
    }
    return { success: true, student };
  } catch (error: any) {
    console.error(`Error in getStudentByIdAction for ${id}:`, error);
    return { success: false, message: error.message || "Failed to fetch student details." };
  }
}

export async function updateStudentAction(id: string, formData: StudentFormValues): Promise<{ success: boolean; message: string }> {
  try {
    await updateStudentInFirestore(id, formData);
    return { success: true, message: "Student updated successfully!" };
  } catch (error: any) {
    console.error(`Error in updateStudentAction for ${id}:`, error);
    return { success: false, message: error.message || "Failed to update student. Please try again." };
  }
}

export async function deleteStudentAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await deleteStudentFromFirestore(id);
    return { success: true, message: "Student deleted successfully!" };
  } catch (error: any) {
    console.error(`Error in deleteStudentAction for ${id}:`, error);
    return { success: false, message: error.message || "Failed to delete student. Please try again." };
  }
}
