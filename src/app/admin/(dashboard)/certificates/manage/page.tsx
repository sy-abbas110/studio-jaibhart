
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, FileText } from "lucide-react";
import { CertificateDataTable } from "@/components/admin/certificates/certificate-data-table";
import { getCertificatesAction } from "@/app/actions/certificate-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ManageCertificatesPage() {
  const { certificates, message, success } = await getCertificatesAction();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">
            Manage Certificate Records
          </h1>
          <p className="text-muted-foreground">
            View, edit, or delete issued certificates and marksheets.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/admin/certificates/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Issue New Certificate
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Certificate List
          </CardTitle>
          <CardDescription>
            A comprehensive list of all issued certificates and marksheets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && certificates ? (
            <CertificateDataTable certificates={certificates} />
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">{message || "Could not load certificates."}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
