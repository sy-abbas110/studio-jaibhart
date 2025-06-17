"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Certificate } from '@/lib/types';
import { mockCertificates, courseOptions, yearOptions } from '@/lib/data'; // Using mockCertificates directly
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
import { ExternalLink, Download, FileText, AlertTriangle } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const programTypeIcons: Record<string, React.ElementType> = {
  Degree: FileText,
  Certificate: FileText,
  Diploma: FileText,
  default: FileText,
};

export function CertificateTable() {
  const [allCertificates, setAllCertificates] = useState<Certificate[]>([]);
  const [filterCourse, setFilterCourse] = useState<string>('All');
  const [filterYear, setFilterYear] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Simulate fetching data
    setAllCertificates(mockCertificates);
  }, []);

  const filteredCertificates = useMemo(() => {
    return allCertificates.filter(cert => {
      const courseMatch = filterCourse === 'All' || cert.course === filterCourse;
      const yearMatch = filterYear === 'All' || cert.issuedDate.startsWith(filterYear);
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
  
  const getProgramTypeIcon = (programType: string) => {
    const Icon = programTypeIcons[programType] || programTypeIcons.default;
    return <Icon className="h-4 w-4 mr-1.5 text-muted-foreground" />;
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">Certificate Records</CardTitle>
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <FilterDropdown
            label="Filter by Course"
            options={courseOptions}
            selectedValue={filterCourse}
            onValueChange={(value) => { setFilterCourse(value); setCurrentPage(1); }}
          />
          <FilterDropdown
            label="Filter by Issued Year"
            options={yearOptions}
            selectedValue={filterYear}
            onValueChange={(value) => { setFilterYear(value); setCurrentPage(1); }}
          />
        </div>
      </CardHeader>
      <CardContent>
        {paginatedCertificates.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Enrollment No.</TableHead>
                    <TableHead>Program Type</TableHead>
                    <TableHead>Certificate/Marks Card</TableHead>
                    <TableHead>Issued Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCertificates.map((cert) => (
                    <TableRow key={cert.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{cert.studentName}</TableCell>
                      <TableCell>{cert.enrollmentNumber}</TableCell>
                      <TableCell className="flex items-center">
                        {getProgramTypeIcon(cert.programType)}
                        {cert.programType}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          size="sm"
                          asChild
                          className="text-accent hover:underline p-0 h-auto"
                        >
                          <a href={cert.documentLink} target="_blank" rel="noopener noreferrer">
                            View/Download
                            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                          </a>
                        </Button>
                      </TableCell>
                      <TableCell>{new Date(cert.issuedDate).toLocaleDateString()}</TableCell>
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
            <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
            <p className="text-xl">No certificates found matching your criteria.</p>
            {(filterCourse !== 'All' || filterYear !== 'All') && <p>Try adjusting your search or filters.</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
