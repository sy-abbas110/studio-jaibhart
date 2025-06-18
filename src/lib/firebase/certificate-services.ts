
import { collection, addDoc, serverTimestamp, doc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { CertificateFormData, Certificate, Student } from "@/lib/types";
import type { CertificateFormValues } from "@/lib/schemas/certificate-schema";

const CERTIFICATES_COLLECTION = "certificates";

export async function addCertificate(data: CertificateFormValues, student: Student): Promise<string> {
  try {
    const certificateDoc = {
      ...data,
      studentId: student.id, // Store the student's Firestore ID
      studentEnrollmentNumber: student.enrollmentNumber,
      studentName: `${student.firstName} ${student.lastName}`,
      studentCourse: student.course,
      studentProgramType: student.programType,
      percentage: data.percentage !== undefined ? Number(data.percentage) : null, // Store as number or null
      marksheetLinks: data.marksheetLinks || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, CERTIFICATES_COLLECTION), certificateDoc);
    return docRef.id;
  } catch (error: any) {
    console.error("Error adding certificate to Firestore: ", error);
    throw new Error(error.message || "Failed to add certificate.");
  }
}

export async function getCertificates(): Promise<Certificate[]> {
  try {
    const q = query(collection(db, CERTIFICATES_COLLECTION), orderBy("issueDate", "desc"));
    const querySnapshot = await getDocs(q);
    const certificates: Certificate[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      certificates.push({ 
        id: doc.id, 
        ...data,
        issueDate: data.issueDate,
        percentage: data.percentage === null ? undefined : data.percentage, // Convert null back to undefined if needed by form
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as Certificate);
    });
    return certificates;
  } catch (error: any) {
    console.error("Error fetching certificates from Firestore: ", error);
    throw new Error(error.message || "Failed to fetch certificates.");
  }
}

export async function getCertificateById(id: string): Promise<Certificate | null> {
  try {
    const docRef = doc(db, CERTIFICATES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        ...data,
        issueDate: data.issueDate,
        percentage: data.percentage === null ? undefined : data.percentage,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
       } as Certificate;
    }
    return null;
  } catch (error: any) {
    console.error(`Error fetching certificate ${id} from Firestore: `, error);
    throw new Error(error.message || `Failed to fetch certificate ${id}.`);
  }
}

export async function updateCertificate(id: string, data: Partial<CertificateFormValues>, student?: Student): Promise<void> {
  try {
    const certificateRef = doc(db, CERTIFICATES_COLLECTION, id);
    const updatePayload: any = {
        ...data,
        updatedAt: serverTimestamp()
    };
    if (student) { // If student context is provided (e.g., if re-association was allowed, though usually not for cert edits)
        updatePayload.studentId = student.id;
        updatePayload.studentEnrollmentNumber = student.enrollmentNumber;
        updatePayload.studentName = `${student.firstName} ${student.lastName}`;
        updatePayload.studentCourse = student.course;
        updatePayload.studentProgramType = student.programType;
    }
    if (data.percentage !== undefined) {
        updatePayload.percentage = Number(data.percentage);
    } else if (data.percentage === undefined) { // Explicitly handle unsetting percentage
        updatePayload.percentage = null;
    }
    
    // Remove undefined fields to prevent Firestore errors, but allow null for clearing fields
    Object.keys(updatePayload).forEach(key => updatePayload[key as keyof typeof updatePayload] === undefined && delete updatePayload[key as keyof typeof updatePayload]);

    await updateDoc(certificateRef, updatePayload);
  } catch (error: any) {
    console.error(`Error updating certificate ${id} in Firestore: `, error);
    throw new Error(error.message || `Failed to update certificate ${id}.`);
  }
}

export async function deleteCertificate(id: string): Promise<void> {
  try {
    const certificateRef = doc(db, CERTIFICATES_COLLECTION, id);
    await deleteDoc(certificateRef);
  } catch (error: any) {
    console.error(`Error deleting certificate ${id} from Firestore: `, error);
    throw new Error(error.message || `Failed to delete certificate ${id}.`);
  }
}
