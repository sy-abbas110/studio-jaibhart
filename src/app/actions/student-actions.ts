
"use server";

import { determineStudentStatus, type DetermineStudentStatusInput } from "@/ai/flows/determine-student-status";
import { addStudent as addStudentToFirestore } from "@/lib/firebase/student-services";
import type { StudentFormData } from "@/lib/types"; // Changed from StudentFormValues to StudentFormData if they are different
import type { StudentFormValues } from "@/lib/schemas/student-schema"; // Assuming this is the validated form values type

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
    // StudentFormValues from Zod already coerces numbers, so direct pass-through should be mostly fine.
    // The firebase service can also do final type checks/conversions if necessary.
    const studentId = await addStudentToFirestore(formData);
    return { success: true, message: "Student added successfully!", studentId };
  } catch (error: any) {
    console.error("Error in addStudentAction:", error);
    return { success: false, message: error.message || "Failed to add student. Please try again." };
  }
}
