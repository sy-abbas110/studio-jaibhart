import { StudentTable } from '@/components/students/student-table';

export default function StudentsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-headline font-bold text-primary mb-8 text-center">
        Our Students
      </h1>
      <StudentTable />
    </div>
  );
}
