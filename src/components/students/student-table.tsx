"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Student } from '@/lib/types';
import { mockStudents } from '@/lib/data'; // Using mockStudents directly for now
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { StudentStatusBadge } from './student-status-badge';
import { SearchBar } from '@/components/shared/search-bar';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FlaskConical, Laptop, Award, AlertTriangle } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const courseIcons: Record<string, React.ElementType> = {
  "D.Pharm": FlaskConical,
  "CCC": Laptop,
  "B.Ed": BookOpen,
  "Lab Technician": Award,
  "OT Technician": Award, // Using Award as a generic for now
  "default": AlertTriangle,
};

export function StudentTable() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Simulate fetching data
    setAllStudents(mockStudents);
  }, []);

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.enrollmentNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allStudents, searchQuery]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredStudents, currentPage]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getCourseIcon = (courseName: string) => {
    const Icon = courseIcons[courseName] || courseIcons.default;
    return <Icon className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">Student Directory</CardTitle>
        <div className="mt-4">
          <SearchBar
            placeholder="Search by name or enrollment no."
            onSearchChange={handleSearchChange}
          />
        </div>
      </CardHeader>
      <CardContent>
        {paginatedStudents.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[80px]">S.No.</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Enrollment No.</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Batch/Year</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student, index) => (
                    <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.enrollmentNumber}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        {getCourseIcon(student.course)}
                        {student.course}
                      </TableCell>
                      <TableCell>{student.batchYear}</TableCell>
                      <TableCell>
                        <StudentStatusBadge student={student} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={filteredStudents.length}
            />
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
            <p className="text-xl">No students found matching your criteria.</p>
            {searchQuery && <p>Try adjusting your search or filters.</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
