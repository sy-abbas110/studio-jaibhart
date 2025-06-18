
"use client";

import { useState, useMemo, useEffect, startTransition } from 'react';
import type { Certificate, Student } from '@/lib/types';
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
import { MoreHorizontal, Edit, Trash2, Search, FileText, AlertTriangle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { deleteCertificateAction } from '@/app/actions/certificate-actions';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isValid } from 'date-fns';

const ITEMS_PER_PAGE = 10;

interface CertificateDataTableProps {
  certificates: Certificate[];
}

export function CertificateDataTable({ certificates: initialCertificates }: CertificateDataTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<Certificate | null>(null);

  useEffect(() => {
    setCertificates(initialCertificates);
  }, [initialCertificates]);

  const filteredCertificates = useMemo(() => {
    if (!searchTerm) return certificates;
    return certificates.filter(
      (cert) =>
        cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.studentEnrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificateType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.studentCourse.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [certificates, searchTerm]);

  const paginatedCertificates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCertificates.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCertificates, currentPage]);

  const totalPages = Math.ceil(filteredCertificates.length / ITEMS_PER_PAGE);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const openDeleteDialog = (certificate: Certificate) => {
    setCertificateToDelete(certificate);
  };

  const closeDeleteDialog = () => {
    setCertificateToDelete(null);
  };

  const handleDeleteCertificate = async () => {
    if (!certificateToDelete) return;
    setIsDeleting(true);
    try {
      const result = await deleteCertificateAction(certificateToDelete.id);
      if (result.success) {
        toast({
          title: 'Certificate Deleted',
          description: `Certificate ${certificateToDelete.certificateNumber} has been removed.`,
        });
        setCertificates(prevCerts => prevCerts.filter(c => c.id !== certificateToDelete.id));
        if (paginatedCertificates.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        startTransition(() => {
          router.refresh();
        });
      } else {
        toast({
          title: 'Error Deleting Certificate',
          description: result.message || 'Could not delete certificate.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while deleting.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      closeDeleteDialog();
    }
  };
  
  const getCertificateTypeBadge = (type: Certificate['certificateType']) => {
    switch(type) {
      case 'degree': return <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">Degree</Badge>;
      case 'diploma': return <Badge variant="secondary">Diploma</Badge>;
      case 'completion': return <Badge variant="outline">Completion</Badge>;
      case 'marksheet': return <Badge className="bg-purple-600 hover:bg-purple-700">Marksheet</Badge>;
      case 'provisional': return <Badge className="bg-orange-500 hover:bg-orange-600">Provisional</Badge>;
      default: return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      {paginatedCertificates.length > 0 ? (
        <>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cert. Number</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Enrollment No.</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCertificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-mono">{cert.certificateNumber}</TableCell>
                    <TableCell className="font-medium">{cert.studentName}</TableCell>
                    <TableCell className="font-mono">{cert.studentEnrollmentNumber}</TableCell>
                    <TableCell>{cert.studentCourse}</TableCell>
                    <TableCell>{getCertificateTypeBadge(cert.certificateType)}</TableCell>
                    <TableCell>
                      {cert.issueDate && isValid(parseISO(cert.issueDate)) 
                        ? format(parseISO(cert.issueDate), "dd MMM yyyy") 
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Certificate Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/certificates/edit/${cert.id}`} className="flex items-center cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDeleteDialog(cert)} className="flex items-center text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
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
              Page {currentPage} of {totalPages} ({filteredCertificates.length} total certificates)
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
          <p className="text-xl">No certificates found.</p>
          {searchTerm && <p>Try adjusting your search term.</p>}
        </div>
      )}

      {certificateToDelete && (
        <AlertDialog open onOpenChange={closeDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the certificate <span className="font-semibold">{certificateToDelete.certificateNumber}</span> for <span className="font-semibold">{certificateToDelete.studentName}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeDeleteDialog} disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCertificate} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
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
