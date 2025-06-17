
"use server";

import { determineStudentStatus, type DetermineStudentStatusInput } from "@/ai/flows/determine-student-status";
import { addStudent as addStudentToFirestore } from "@/lib/firebase/student-services";
import type { StudentFormData } from "@/lib/types";

export async function getStudentStatusAction(input: DetermineStudentStatusInput) {
  try {
    const result = await determineStudentStatus(input);
    return result;
  } catch (error) {
    console.error("Error determining student status:", error);
    return { status: "Error" };
  }
}

export async function addStudentAction(formData: StudentFormData): Promise<{ success: boolean; message: string; studentId?: string }> {
  try {
    // Ensure numeric fields are correctly typed if they come from FormData
    const parsedData: StudentFormData = {
      ...formData,
      courseDurationInMonths: Number(formData.courseDurationInMonths),
      totalFees: formData.totalFees !== undefined ? Number(formData.totalFees) : undefined,
      feesSubmitted: formData.feesSubmitted !== undefined ? Number(formData.feesSubmitted) : undefined,
      // Graduation date might be an empty string from form, convert to null
      graduationDate: formData.graduationDate === "" ? null : formData.graduationDate,
    };

    const studentId = await addStudentToFirestore(parsedData);
    return { success: true, message: "Student added successfully!", studentId };
  } catch (error: any) {
    console.error("Error in addStudentAction:", error);
    return { success: false, message: error.message || "Failed to add student. Please try again." };
  }
}
