
import { AddCertificateForm } from "@/components/admin/certificates/add-certificate-form";
import { getCertificateByIdAction } from "@/app/actions/certificate-actions";
import { getStudentByIdAction } from "@/app/actions/student-actions"; // To fetch associated student
import type { Certificate, Student } from "@/lib/types";

export default async function EditCertificatePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { certificate, message: certMessage, success: certSuccess } = await getCertificateByIdAction(id);

  let studentForEdit: Student | null = null;
  let studentMessage: string | undefined;

  if (certSuccess && certificate && certificate.studentId) {
    const { student, message, success: studentSuccess } = await getStudentByIdAction(certificate.studentId);
    if (studentSuccess && student) {
      studentForEdit = student;
    } else {
      studentMessage = message || "Associated student data could not be loaded.";
    }
  }

  if (!certSuccess || !certificate) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Edit Certificate</h1>
        <p className="text-destructive">{certMessage || "Certificate not found or failed to load data."}</p>
      </div>
    );
  }
  
  if (!studentForEdit && certificate?.studentId) {
     return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Edit Certificate: {certificate.certificateNumber}</h1>
        <p className="text-destructive">{studentMessage || "Critical error: Associated student could not be loaded. Cannot edit certificate."}</p>
      </div>
    );
  }


  // The AddCertificateForm expects CertificateFormValues.
  // Ensure dates are in 'yyyy-MM-dd' string format if they are not already.
  const initialDataForForm = {
    ...certificate,
    issueDate: certificate.issueDate ? certificate.issueDate.split('T')[0] : "",
    // Ensure marksheetLinks is an array, even if empty, and matches the expected structure
    marksheetLinks: certificate.marksheetLinks && certificate.marksheetLinks.length > 0 
                   ? certificate.marksheetLinks.map(sl => ({ semester: sl.semester || "", link: sl.link || ""})) 
                   : [{ semester: "", link: "" }],
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-headline font-bold text-primary">
          Edit Certificate: {certificate.certificateNumber}
        </h1>
        <p className="text-muted-foreground">
          Update the certificate details for student: <span className="font-semibold">{studentForEdit?.firstName} {studentForEdit?.lastName} ({studentForEdit?.enrollmentNumber})</span>
        </p>
      </div>
      <AddCertificateForm 
        initialData={initialDataForForm as CertificateFormValues} 
        certificateId={id} 
        studentForEdit={studentForEdit}
      />
    </div>
  );
}
