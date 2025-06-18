
import { AddCertificateForm } from "@/components/admin/certificates/add-certificate-form";

export default function AddCertificatePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-headline font-bold text-primary">
          Issue New Certificate/Degree
        </h1>
        <p className="text-muted-foreground">
          Select a student and fill in the details to issue a new certificate or degree record.
        </p>
      </div>
      <AddCertificateForm />
    </div>
  );
}
