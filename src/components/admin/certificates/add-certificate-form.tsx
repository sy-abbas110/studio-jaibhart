
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isValid, parseISO } from "date-fns";
import { Search, User, Link as LinkIcon, Award, Loader2, Save, PlusCircle, Trash2, CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { useToast } from "@/hooks/use-toast";
import { getStudentsAction } from "@/app/actions/student-actions";
import { addCertificateAction } from "@/app/actions/certificate-actions";
import type { Student, Certificate } from "@/lib/types";
import { certificateFormSchema, type CertificateFormValues } from "@/lib/schemas/certificate-schema";
import { cn } from "@/lib/utils";

const certificateTypeOptions = [
  { value: "completion", label: "Course Completion Certificate" },
  { value: "degree", label: "Degree Certificate" },
  { value: "diploma", label: "Diploma Certificate" },
  { value: "marksheet", label: "Final Marksheet" },
  { value: "provisional", label: "Provisional Certificate" },
];

const gradeOptions = [
  { value: "A+", label: "A+ (Outstanding)" },
  { value: "A", label: "A (Excellent)" },
  { value: "B+", label: "B+ (Very Good)" },
  { value: "B", label: "B (Good)" },
  { value: "C+", label: "C+ (Above Average)" },
  { value: "C", label: "C (Average)" },
  { value: "pass", label: "Pass" },
];


export function AddCertificateForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: {
      studentId: "",
      certificateNumber: "",
      certificateType: undefined,
      issueDate: "",
      grade: undefined,
      percentage: undefined,
      gdriveLink: "",
      marksheetLinks: [],
      remarks: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "marksheetLinks",
  });

  useEffect(() => {
    async function fetchStudents() {
      setStudentsLoading(true);
      const result = await getStudentsAction();
      if (result.success && result.students) {
        // Filter for students who are completed or active, as they might be eligible
        const eligibleStudents = result.students.filter(s => s.status === 'Completed' || s.status === 'Active');
        setAllStudents(eligibleStudents);
        setFilteredStudents(eligibleStudents);
      } else {
        toast({ title: "Error", description: "Failed to load students.", variant: "destructive" });
      }
      setStudentsLoading(false);
    }
    fetchStudents();
  }, [toast]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredStudents(allStudents);
    } else {
      setFilteredStudents(
        allStudents.filter(
          (student) =>
            student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, allStudents]);

  useEffect(() => {
    if (selectedStudent) {
      form.setValue("studentId", selectedStudent.id);
      // Auto-generate certificate number (can be made more robust)
      const certNum = `CERT-${selectedStudent.enrollmentNumber}-${Date.now().toString().slice(-6)}`;
      form.setValue("certificateNumber", certNum);
      // Reset marksheet links if student program type is not Degree
      if (selectedStudent.programType !== "Degree") {
        form.setValue("marksheetLinks", []);
      } else if (form.getValues("marksheetLinks")?.length === 0) {
        // Auto-add one empty marksheet link for degree students if none exist
         append({ semester: "", link: "" });
      }
    } else {
      form.reset(); // Reset form if student is deselected
    }
  }, [selectedStudent, form, append]);

  async function onSubmit(values: CertificateFormValues) {
    if (!selectedStudent) {
      setFormError("Please select a student.");
      return;
    }
    setIsSubmitting(true);
    setFormError(null);

    const result = await addCertificateAction(values, selectedStudent);

    if (result.success) {
      toast({ title: "Success!", description: "Certificate issued successfully." });
      form.reset();
      setSelectedStudent(null);
      setSearchTerm("");
      // router.push("/admin/certificates/manage"); // Uncomment when manage page exists
      // router.refresh();
    } else {
      toast({ title: "Error Issuing Certificate", description: result.message, variant: "destructive" });
      setFormError(result.message);
    }
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Student Selection */}
        <Card>
          <CardHeader><CardTitle>Select Student</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or enrollment number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={studentsLoading}
              />
            </div>

            {selectedStudent ? (
              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-primary">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                    <p className="text-sm text-foreground/80">
                      {selectedStudent.enrollmentNumber} • {selectedStudent.course}
                    </p>
                    <Badge variant="secondary" className="mt-1">{selectedStudent.programType}</Badge>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => {setSelectedStudent(null); form.setValue("studentId", "");}}>
                    Change
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-2 max-h-60 overflow-y-auto border rounded-md p-2">
                {studentsLoading && <p className="text-center text-muted-foreground py-4">Loading students...</p>}
                {!studentsLoading && filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{student.firstName} {student.lastName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {student.enrollmentNumber} • {student.course}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={student.status === "Completed" ? "default" : "secondary"}
                          className={student.status === "Completed" ? "bg-green-600/20 text-green-700" : "bg-yellow-500/20 text-yellow-700"}
                        >
                          {student.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{student.programType}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {!studentsLoading && filteredStudents.length === 0 && <p className="text-center text-muted-foreground py-4">No students found.</p>}
              </div>
            )}
             <FormField control={form.control} name="studentId" render={({ field }) => (
                <FormItem className="hidden"> {/* Hidden but necessary for validation */}
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
          </CardContent>
        </Card>

        {selectedStudent && (
          <>
            {/* Certificate Information */}
            <Card>
              <CardHeader><CardTitle>Certificate Information</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField control={form.control} name="certificateNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate Number *</FormLabel>
                    <FormControl><Input {...field} readOnly className="bg-muted font-mono" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="certificateType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select certificate type" /></SelectTrigger></FormControl>
                      <SelectContent>{certificateTypeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="issueDate" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Issue Date *</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value && isValid(parseISO(field.value)) ? format(parseISO(field.value), "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value && isValid(parseISO(field.value)) ? parseISO(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} initialFocus />
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="grade" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger></FormControl>
                      <SelectContent>{gradeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="percentage" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentage (%)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 88.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            {/* Document Links */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><LinkIcon className="w-5 h-5 text-primary" /> Document Links</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="gdriveLink" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate/Degree Google Drive Link</FormLabel>
                    <FormControl><Input placeholder="https://drive.google.com/file/d/..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {selectedStudent.programType === "Degree" && (
                  <div>
                    <FormLabel className="text-base font-medium mb-2 block">Semester-wise Marksheet Links</FormLabel>
                    {fields.map((item, index) => (
                      <div key={item.id} className="flex items-end gap-x-4 gap-y-2 mb-3 p-3 border rounded-md bg-muted/30 flex-wrap sm:flex-nowrap">
                        <FormField control={form.control} name={`marksheetLinks.${index}.semester`} render={({ field }) => (
                          <FormItem className="flex-grow min-w-[150px]">
                            <FormLabel className="text-xs">Semester Name *</FormLabel>
                            <FormControl><Input placeholder={`e.g., Semester ${index + 1}`} {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`marksheetLinks.${index}.link`} render={({ field }) => (
                          <FormItem className="flex-grow min-w-[200px]">
                            <FormLabel className="text-xs">GDrive Link *</FormLabel>
                            <FormControl><Input placeholder="Marksheet GDrive link" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove semester marksheet">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ semester: "", link: "" })} className="mt-2">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Semester Marksheet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader><CardTitle>Additional Information</CardTitle></CardHeader>
              <CardContent>
                <FormField control={form.control} name="remarks" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl><Textarea rows={3} placeholder="Any additional notes or special mentions" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
          </>
        )}

        {formError && (
          <Alert variant="destructive">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}> {/* Or router.push("/admin/certificates/manage") */}
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !selectedStudent} className="bg-primary hover:bg-primary/90">
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Issuing...</>
            ) : (
              <><Award className="w-4 h-4 mr-2" /> Issue Certificate</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
