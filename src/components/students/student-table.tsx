
"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Student } from '@/lib/types';
import { mockStudents, allCourseOptions } from '@/lib/data'; // Using mockStudents and new allCourseOptions
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
import { FilterDropdown } from '@/components/shared/filter-dropdown';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FlaskConical, Laptop, Award, AlertTriangle, Users } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

// Simplified course icons, can be expanded or made more generic
const courseIcons: Record<string, React.ElementType> = {
  "D.PHARMA (Ayurved & Homeopath)": FlaskConical,
  "B.PHARMA & D.PHARMA (Allopath)": FlaskConical,
  "CCC": Laptop,
  "O-LEVEL": Laptop,
  "PGDCA": Laptop,
  "DCA": Laptop,
  "ADCA": Laptop,
  "BCA": Laptop,
  "MCA": Laptop,
  "B.Ed.": BookOpen,
  "D.M.L.T. (Diagnostic)": Award, // Example, adjust as needed
  "O.T. Technician": Award, // Example
  "B.A.": BookOpen,
  "B.Sc.": BookOpen,
  "B.Com.": BookOpen,
  "default": Users, // Generic icon
};

export function StudentTable() {
  const [allStudents, setAllStudents] = useState<Student[]>([]); // Will be populated by actual data later
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCourse, setFilterCourse] = useState<string>('All');


  useEffect(() => {
    // In a real app, this would be:
    // async function fetchData() {
    //   const result = await getStudentsAction(); // Assuming a getStudentsAction for public view
    //   if (result.success && result.students) {
    //     setAllStudents(result.students.map(s => ({...s, name: `${s.firstName} ${s.lastName}`, batchYear: s.batch})));
    //   }
    // }
    // fetchData();
    // For now, using mock data adapted to the new structure
    const adaptedMockStudents = mockStudents.map(s => ({
      ...s,
      // The PublicStudentInfo type had 'name' and 'batchYear'. We are using the full Student type here
      // but ensuring the fields match what StudentStatusBadge and display expects.
      // StudentStatusBadge expects enrollmentDate, courseDurationInMonths, graduationDate, course.
      // The table displays name, enrollmentNumber, course, batchYear (which is student.batch).
      name: `${s.firstName} ${s.lastName}`, // Combine first and last name for display
      batchYear: s.batch, // Map batch to batchYear for display consistency if needed, or use s.batch directly
      enrollmentDate: s.admissionDate, // Map admissionDate to enrollmentDate if StudentStatusBadge expects that
    })) as unknown as Student[]; // Cast needed because mockStudents might not exactly match Student type
    setAllStudents(adaptedMockStudents);
  }, []);

  const filteredStudents = useMemo(() => {
    return allStudents.filter(student => {
      const nameMatch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
      const enrollmentMatch = student.enrollmentNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const courseMatch = filterCourse === 'All' || student.course === filterCourse;
      return (nameMatch || enrollmentMatch) && courseMatch;
    });
  }, [allStudents, searchQuery, filterCourse]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredStudents, currentPage]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); 
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getCourseIcon = (courseName: string) => {
    // Attempt to find a more specific match first
    for (const key in courseIcons) {
        if (courseName.includes(key) || key.includes(courseName)) { // Simple matching
            const Icon = courseIcons[key] || courseIcons.default;
            return <Icon className="h-5 w-5 text-muted-foreground" />;
        }
    }
    const Icon = courseIcons.default;
    return <Icon className="h-5 w-5 text-muted-foreground" />;
  };


  return (
    <Card className="shadow-xl w-full border-border">
      <CardHeader className="border-b border-border/70">
        <CardTitle className="text-2xl font-headline text-primary">Student Directory</CardTitle>
        <div className="mt-6 flex flex-col md:flex-row gap-4 items-center">
          <SearchBar
            placeholder="Search by name or enrollment no."
            onSearchChange={handleSearchChange}
          />
          <FilterDropdown
            label="Filter by Course"
            options={allCourseOptions} // Use new comprehensive course list
            selectedValue={filterCourse}
            onValueChange={(value) => { setFilterCourse(value); setCurrentPage(1); }}
            className="w-full md:w-auto"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {paginatedStudents.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-md border border-border/50">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-[80px] text-muted-foreground/80">S.No.</TableHead>
                    <TableHead className="text-muted-foreground/80">Student Name</TableHead>
                    <TableHead className="text-muted-foreground/80">Enrollment No.</TableHead>
                    <TableHead className="text-muted-foreground/80">Course</TableHead>
                    <TableHead className="text-muted-foreground/80">Batch</TableHead>
                    <TableHead className="text-muted-foreground/80">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student, index) => (
                    <TableRow key={student.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="text-foreground/80">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</TableCell>
                      <TableCell className="font-medium text-foreground">{student.firstName} {student.lastName}</TableCell>
                      <TableCell className="text-foreground/90 font-mono text-sm">{student.enrollmentNumber}</TableCell>
                      <TableCell className="flex items-center gap-2 text-foreground/90">
                        {getCourseIcon(student.course)}
                        {student.course}
                      </TableCell>
                      <TableCell className="text-foreground/90">{student.batch}</TableCell>
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
            <AlertTriangle className="mx-auto h-12 w-12 mb-4 text-primary/50" />
            <p className="text-xl">No students found matching your criteria.</p>
            {searchQuery && <p>Try adjusting your search or filters.</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
