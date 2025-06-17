"use server";

import { determineStudentStatus, type DetermineStudentStatusInput } from "@/ai/flows/determine-student-status";

export async function getStudentStatusAction(input: DetermineStudentStatusInput) {
  try {
    const result = await determineStudentStatus(input);
    return result;
  } catch (error) {
    console.error("Error determining student status:", error);
    // Return a default or error status
    return { status: "Error" };
  }
}
