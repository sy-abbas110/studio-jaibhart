import { CertificateTable } from '@/components/certificates/certificate-table';

export default function CertificatesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-headline font-bold text-primary mb-8 text-center">
        Student Certificates & Marksheets
      </h1>
      <CertificateTable />
    </div>
  );
}
