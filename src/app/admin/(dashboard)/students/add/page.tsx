
import { AddStudentForm } from "@/components/admin/students/add-student-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddStudentPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-headline font-bold text-primary">
          Add New Student
        </h1>
        <p className="text-muted-foreground">
          Register a new student in the system by filling out the details below.
        </p>
      </div>
      {/* The form component itself might be wrapped in a Card, or Cards are used internally.
          The provided example has internal cards, so we might not need an outer one here.
          Adjusting to remove the outer Card to match the more granular card structure within the form.
      */}
      <AddStudentForm />
    </div>
  );
}
