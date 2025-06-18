
"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Certificate as CertificateType } from '@/lib/types'; // Renamed to avoid conflict
import { mockCertificates, allCourseOptions, yearOptions } from '@/lib/data'; // Using new allCourseOptions
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterDropdown } from '@/components/shared/filter-dropdown';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { ExternalLink, FileText, Award, AlertTriangle } from 'lucide-react'; // Added Award

const ITEMS_PER_PAGE = 10;

const programTypeIcons: Record<string, React.ElementType> = {
  Degree: Award, // Changed to Award for Degree
  Certificate: FileText,
  Diploma: FileText, // Assuming Diploma uses FileText
  default: FileText,
};

export function CertificateTable() {
  const [allCertificates, setAllCertificates] = useState<CertificateType[]>([]);
  const [filterCourse, setFilterCourse] = useState<string>('All');
  const [filterYear, setFilterYear] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Simulate fetching data
    // In a real app, this would fetch from Firestore via a server action
    // For now, adapting mockCertificates
    const adaptedMockCerts = mockCertificates.map(cert => ({
        ...cert,
        id: String(Math.random()), // mockCertificates from data.ts doesn't have id
        studentProgramType: cert.studentProgramType || 'Certificate', // Ensure this field exists
        gdriveLink: cert.gdriveLink || '#',
        issueDate: cert.issueDate,
    })) as CertificateType[];
    setAllCertificates(adaptedMockCerts);
  }, []);

  const filteredCertificates = useMemo(() => {
    return allCertificates.filter(cert => {
      const courseMatch = filterCourse === 'All' || cert.studentCourse === filterCourse; // Use studentCourse
      const yearMatch = filterYear === 'All' || (cert.issueDate && cert.issueDate.startsWith(filterYear));
      return courseMatch && yearMatch;
    });
  }, [allCertificates, filterCourse, filterYear]);

  const totalPages = Math.ceil(filteredCertificates.length / ITEMS_PER_PAGE);

  const paginatedCertificates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCertificates.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCertificates, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const getProgramTypeIcon = (programType: CertificateType['studentProgramType']) => {
    const Icon = programTypeIcons[programType] || programTypeIcons.default;
    return <Icon className="h-4 w-4 mr-1.5 text-muted-foreground" />;
  };

  return (
    <Card className="shadow-xl w-full border-border">
      <CardHeader className="border-b border-border/70">
        <CardTitle className="text-2xl font-headline text-primary">Certificate & Marksheet Records</CardTitle>
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <FilterDropdown
            label="Filter by Course"
            options={allCourseOptions} // Use new comprehensive course list
            selectedValue={filterCourse}
            onValueChange={(value) => { setFilterCourse(value); setCurrentPage(1); }}
            className="w-full md:w-auto"
          />
          <FilterDropdown
            label="Filter by Issued Year"
            options={yearOptions}
            selectedValue={filterYear}
            onValueChange={(value) => { setFilterYear(value); setCurrentPage(1); }}
            className="w-full md:w-auto"
          />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {paginatedCertificates.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-md border border-border/50">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="text-muted-foreground/80">Student Name</TableHead>
                    <TableHead className="text-muted-foreground/80">Enrollment No.</TableHead>
                    <TableHead className="text-muted-foreground/80">Program Type</TableHead>
                    <TableHead className="text-muted-foreground/80">Course</TableHead>
                    <TableHead className="text-muted-foreground/80">Certificate/Marksheet</TableHead>
                    <TableHead className="text-muted-foreground/80">Issued Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCertificates.map((cert) => (
                    <TableRow key={cert.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium text-foreground">{cert.studentName}</TableCell>
                      <TableCell className="text-foreground/90 font-mono text-sm">{cert.studentEnrollmentNumber}</TableCell>
                      <TableCell className="flex items-center text-foreground/90">
                        {getProgramTypeIcon(cert.studentProgramType)}
                        {cert.studentProgramType}
                      </TableCell>
                      <TableCell className="text-foreground/90">{cert.studentCourse}</TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          size="sm"
                          asChild
                          className="text-accent hover:underline p-0 h-auto"
                        >
                          <a href={cert.gdriveLink || '#'} target="_blank" rel="noopener noreferrer">
                            View/Download
                            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                          </a>
                        </Button>
                      </TableCell>
                      <TableCell className="text-foreground/90">
                        {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'}
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
              totalItems={filteredCertificates.length}
            />
          </>
        ) : (
           <div className="text-center py-12 text-muted-foreground">
            <AlertTriangle className="mx-auto h-12 w-12 mb-4 text-primary/50" />
            <p className="text-xl">No certificates found matching your criteria.</p>
            {(filterCourse !== 'All' || filterYear !== 'All') && <p>Try adjusting your search or filters.</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
