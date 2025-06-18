
"use server";

import { 
  addCertificate as addCertificateToFirestore,
  getCertificates as getCertificatesFromFirestore,
  getCertificateById as getCertificateByIdFromFirestore,
  updateCertificate as updateCertificateInFirestore,
  deleteCertificate as deleteCertificateFromFirestore
} from "@/lib/firebase/certificate-services";
import type { Certificate, Student } from "@/lib/types";
import type { CertificateFormValues } from "@/lib/schemas/certificate-schema";

export async function addCertificateAction(formData: CertificateFormValues, student: Student): Promise<{ success: boolean; message: string; certificateId?: string }> {
  try {
    const certificateId = await addCertificateToFirestore(formData, student);
    return { success: true, message: "Certificate added successfully!", certificateId };
  } catch (error: any) {
    console.error("Error in addCertificateAction:", error);
    return { success: false, message: error.message || "Failed to add certificate. Please try again." };
  }
}

export async function getCertificatesAction(): Promise<{ success: boolean; certificates?: Certificate[]; message?: string }> {
  try {
    const certificates = await getCertificatesFromFirestore();
    return { success: true, certificates };
  } catch (error: any) {
    console.error("Error in getCertificatesAction:", error);
    return { success: false, message: error.message || "Failed to fetch certificates." };
  }
}

export async function getCertificateByIdAction(id: string): Promise<{ success: boolean; certificate?: Certificate | null; message?: string }> {
  try {
    const certificate = await getCertificateByIdFromFirestore(id);
    if (!certificate) {
      return { success: false, message: "Certificate not found." };
    }
    return { success: true, certificate };
  } catch (error: any) {
    console.error(`Error in getCertificateByIdAction for ${id}:`, error);
    return { success: false, message: error.message || "Failed to fetch certificate details." };
  }
}

export async function updateCertificateAction(id: string, formData: CertificateFormValues, student?: Student): Promise<{ success: boolean; message: string }> {
  try {
    await updateCertificateInFirestore(id, formData, student);
    return { success: true, message: "Certificate updated successfully!" };
  } catch (error: any) {
    console.error(`Error in updateCertificateAction for ${id}:`, error);
    return { success: false, message: error.message || "Failed to update certificate. Please try again." };
  }
}

export async function deleteCertificateAction(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await deleteCertificateFromFirestore(id);
    return { success: true, message: "Certificate deleted successfully!" };
  } catch (error: any) {
    console.error(`Error in deleteCertificateAction for ${id}:`, error);
    return { success: false, message: error.message || "Failed to delete certificate. Please try again." };
  }
}
