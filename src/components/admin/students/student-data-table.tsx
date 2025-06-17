
"use client";

import { useState, useMemo, useEffect, startTransition } from 'react';
import type { Student } from '@/lib/types';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Trash2, Search, FileText, Briefcase, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { deleteStudentAction } from '@/app/actions/student-actions';
import { Badge } from '@/components/ui/badge';

const ITEMS_PER_PAGE = 10;

interface StudentDataTableProps {
  students: Student[];
}

export function StudentDataTable({ students: initialStudents }: StudentDataTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  useEffect(() => {
    setStudents(initialStudents);
  }, [initialStudents]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    return students.filter(
      (student) =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const openDeleteDialog = (student: Student) => {
    setStudentToDelete(student);
  };

  const closeDeleteDialog = () => {
    setStudentToDelete(null);
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      const result = await deleteStudentAction(studentToDelete.id);
      if (result.success) {
        toast({
          title: 'Student Deleted',
          description: `${studentToDelete.firstName} ${studentToDelete.lastName} has been removed.`,
        });
        // Refresh data by re-fetching or filtering client-side
        setStudents(prevStudents => prevStudents.filter(s => s.id !== studentToDelete.id));
        // Adjust current page if the last item on a page was deleted
        if (paginatedStudents.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        startTransition(() => {
          router.refresh(); // Re-fetch server-side props for the page
        });

      } else {
        toast({
          title: 'Error Deleting Student',
          description: result.message || 'Could not delete student.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      closeDeleteDialog();
    }
  };
  
  const getStatusBadgeVariant = (status: Student['status']) => {
    switch (status) {
      case 'Active':
        return 'default'; // bg-primary
      case 'Completed':
        return 'secondary'; // bg-secondary
      case 'Inactive':
        return 'outline'; // text-foreground with border
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      {paginatedStudents.length > 0 ? (
        <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enrollment No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Program Type</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-mono">{student.enrollmentNumber}</TableCell>
                <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                <TableCell>{student.course}</TableCell>
                <TableCell>
                  <Badge variant={student.programType === 'Degree' ? 'outline' : 'secondary'} className="whitespace-nowrap">
                    {student.programType === 'Degree' ? 
                      <FileText className="h-3 w-3 mr-1.5" /> : 
                      <Briefcase className="h-3 w-3 mr-1.5" />
                    }
                    {student.programType}
                  </Badge>
                </TableCell>
                <TableCell>{student.batch}</TableCell>
                <TableCell>
                    <Badge variant={getStatusBadgeVariant(student.status)} className="capitalize whitespace-nowrap">
                        {student.status}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Student Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/students/edit/${student.id}`} className="flex items-center cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openDeleteDialog(student)} className="flex items-center text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} ({filteredStudents.length} total students)
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
          <p className="text-xl">No students found.</p>
          {searchTerm && <p>Try adjusting your search term.</p>}
        </div>
      )}


      {studentToDelete && (
        <AlertDialog open onOpenChange={closeDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the student record for <span className="font-semibold">{studentToDelete.firstName} {studentToDelete.lastName}</span> ({studentToDelete.enrollmentNumber}).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeDeleteDialog} disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteStudent} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                {isDeleting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
