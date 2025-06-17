
import { AddStudentForm } from "@/components/admin/students/add-student-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddStudentPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline font-bold text-primary">
            Add New Student
          </CardTitle>
          <CardDescription>
            Fill in the details below to add a new student record. Ensure all information is accurate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddStudentForm />
        </CardContent>
      </Card>
    </div>
  );
}
