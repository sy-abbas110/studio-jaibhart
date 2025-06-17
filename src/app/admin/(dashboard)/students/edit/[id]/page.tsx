
import { AddStudentForm } from "@/components/admin/students/add-student-form";
import { getStudentByIdAction } from "@/app/actions/student-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Student } from "@/lib/types";

export default async function EditStudentPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { student, message, success } = await getStudentByIdAction(id);

  if (!success || !student) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Edit Student</h1>
        <p className="text-destructive">{message || "Student not found or failed to load data."}</p>
      </div>
    );
  }

  // The AddStudentForm expects StudentFormValues, so we ensure the fetched student matches that structure
  // or transform it if necessary. Timestamps might need to be strings.
  const initialDataForForm = {
    ...student,
    // Ensure dates are in 'yyyy-MM-dd' string format if they are not already
    dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : undefined,
    admissionDate: student.admissionDate ? student.admissionDate.split('T')[0] : "",
    graduationDate: student.graduationDate ? student.graduationDate.split('T')[0] : undefined,
    // Ensure semesterLinks is an array, even if empty, and matches the expected structure
    semesterLinks: student.semesterLinks && student.semesterLinks.length > 0 
                   ? student.semesterLinks.map(sl => ({ semester: sl.semester || "", link: sl.link || ""})) 
                   : [{ semester: "", link: "" }],
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-headline font-bold text-primary">
          Edit Student: {student.firstName} {student.lastName}
        </h1>
        <p className="text-muted-foreground">
          Update the student's details below. Enrollment Number: <span className="font-semibold">{student.enrollmentNumber}</span>
        </p>
      </div>
      <AddStudentForm initialData={initialDataForForm as Student} studentId={id} />
    </div>
  );
}
