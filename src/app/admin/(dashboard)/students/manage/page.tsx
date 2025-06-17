
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { StudentDataTable } from "@/components/admin/students/student-data-table";
import { getStudentsAction } from "@/app/actions/student-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ManageStudentsPage() {
  const { students, message, success } = await getStudentsAction();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">
            Manage Students
          </h1>
          <p className="text-muted-foreground">
            View, edit, or delete student records.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/admin/students/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Student
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            A comprehensive list of all registered students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && students ? (
            <StudentDataTable students={students} />
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">{message || "Could not load students."}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
