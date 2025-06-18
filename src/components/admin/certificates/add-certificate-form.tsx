
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isValid, parseISO } from "date-fns";
import { Search, User, Link as LinkIcon, Award, Loader2, Save, PlusCircle, Trash2, CalendarIcon, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Not directly used, FormLabel is used
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
import { getStudentsAction, getStudentByIdAction } from "@/app/actions/student-actions";
import { addCertificateAction, updateCertificateAction } from "@/app/actions/certificate-actions";
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

interface AddCertificateFormProps {
  initialData?: CertificateFormValues | Certificate | null; // For edit mode
  certificateId?: string; // For edit mode
  studentForEdit?: Student | null; // Pre-fetched student for edit mode
}

export function AddCertificateForm({ initialData, certificateId, studentForEdit }: AddCertificateFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(studentForEdit || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  
  const mode = certificateId && initialData ? 'edit' : 'add';

  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: mode === 'edit' && initialData ? {
      ...initialData,
      issueDate: initialData.issueDate && isValid(parseISO(initialData.issueDate)) ? initialData.issueDate : "",
      percentage: initialData.percentage ?? undefined,
      marksheetLinks: initialData.marksheetLinks || [{ semester: "", link: "" }],
    } : {
      studentId: "",
      certificateNumber: "",
      certificateType: undefined,
      issueDate: "",
      grade: undefined,
      percentage: undefined,
      gdriveLink: "",
      marksheetLinks: [{ semester: "", link: "" }],
      remarks: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "marksheetLinks",
  });

  // Student Search/Filter Logic (only for add mode)
  const filteredStudents = useMemo(() => {
    if (mode === 'edit' || !searchTerm) {
      return allStudents.filter(s => s.status === 'Completed' || s.status === 'Active');
    }
    return allStudents.filter(
      (student) =>
        (student.status === 'Completed' || student.status === 'Active') &&
        (student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, allStudents, mode]);


  useEffect(() => {
    async function fetchStudentsData() {
      if (mode === 'add') {
        setStudentsLoading(true);
        const result = await getStudentsAction();
        if (result.success && result.students) {
          setAllStudents(result.students);
        } else {
          toast({ title: "Error", description: "Failed to load students.", variant: "destructive" });
        }
        setStudentsLoading(false);
      } else if (mode === 'edit' && studentForEdit) {
         setSelectedStudent(studentForEdit);
         setStudentsLoading(false); // Student data is pre-fetched
      }
    }
    fetchStudentsData();
  }, [mode, studentForEdit, toast]);
  
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const transformedInitialData = {
        ...initialData,
        issueDate: initialData.issueDate && isValid(parseISO(initialData.issueDate)) ? initialData.issueDate : "",
        percentage: initialData.percentage ?? undefined,
        marksheetLinks: initialData.marksheetLinks && initialData.marksheetLinks.length > 0 ? initialData.marksheetLinks : [{ semester: "", link: "" }],
      };
      form.reset(transformedInitialData as CertificateFormValues);
      if (studentForEdit) {
        setSelectedStudent(studentForEdit);
        form.setValue("studentId", studentForEdit.id);
      }
    }
  }, [initialData, studentForEdit, mode, form]);

  useEffect(() => {
    if (selectedStudent) {
      form.setValue("studentId", selectedStudent.id);
      if (mode === 'add') { // Only auto-populate cert number in add mode
        const certNum = `CERT-${selectedStudent.enrollmentNumber}-${Date.now().toString().slice(-6)}`;
        form.setValue("certificateNumber", certNum);
      }
      // Reset marksheet links if student program type is not Degree
      if (selectedStudent.programType !== "Degree") {
        form.setValue("marksheetLinks", []);
      } else if (form.getValues("marksheetLinks")?.length === 0 && mode === 'add') {
         append({ semester: "", link: "" });
      }
    } else if (mode === 'add') { // Only reset fully if in add mode and student deselected
      form.reset({
        studentId: "",
        certificateNumber: "",
        certificateType: undefined,
        issueDate: "",
        grade: undefined,
        percentage: undefined,
        gdriveLink: "",
        marksheetLinks: [{ semester: "", link: "" }],
        remarks: "",
      });
    }
  }, [selectedStudent, form, mode, append]);

  async function onSubmit(values: CertificateFormValues) {
    if (!selectedStudent) {
      setFormError("Please select a student.");
      return;
    }
    setIsSubmitting(true);
    setFormError(null);

    let result;
    if (mode === 'edit' && certificateId) {
      result = await updateCertificateAction(certificateId, values, selectedStudent);
    } else {
      result = await addCertificateAction(values, selectedStudent);
    }

    if (result.success) {
      toast({ title: "Success!", description: `Certificate ${mode === 'edit' ? 'updated' : 'issued'} successfully.` });
      if (mode === 'add') {
        form.reset();
        setSelectedStudent(null);
        setSearchTerm("");
      }
      router.push("/admin/certificates/manage");
      router.refresh();
    } else {
      toast({ title: `Error ${mode === 'edit' ? 'Updating' : 'Issuing'} Certificate`, description: result.message, variant: "destructive" });
      setFormError(result.message);
    }
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Student Selection Card */}
        <Card>
          <CardHeader><CardTitle>{mode === 'edit' ? 'Selected Student' : 'Select Student'}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {mode === 'add' && (
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
            )}

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
                  {mode === 'add' && (
                    <Button type="button" variant="outline" size="sm" onClick={() => {setSelectedStudent(null); form.setValue("studentId", "");}}>
                      Change
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              mode === 'add' && (
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
                              className={cn(
                                "capitalize",
                                student.status === "Completed" ? "bg-green-600/20 text-green-700" : 
                                student.status === "Active" ? "bg-blue-500/20 text-blue-700" : 
                                "bg-yellow-500/20 text-yellow-700"
                              )}
                            >
                            {student.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{student.programType}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!studentsLoading && filteredStudents.length === 0 && <p className="text-center text-muted-foreground py-4">No eligible (Active/Completed) students found.</p>}
                </div>
              )
            )}
             <FormField control={form.control} name="studentId" render={({ field }) => (
                <FormItem className="hidden">
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
          </CardContent>
        </Card>

        {/* Certificate Information (always shown if student selected or in edit mode) */}
        {(selectedStudent || mode === 'edit') && (
          <>
            <Card>
              <CardHeader><CardTitle>Certificate Information</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField control={form.control} name="certificateNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate Number *</FormLabel>
                    <FormControl><Input {...field} readOnly={mode === 'add'} className={mode === 'add' ? "bg-muted font-mono": "font-mono"} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="certificateType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select grade (Optional)" /></SelectTrigger></FormControl>
                      <SelectContent>{gradeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="percentage" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Percentage (%)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 88.5 (Optional)" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><LinkIcon className="w-5 h-5 text-primary" /> Document Links</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="gdriveLink" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate/Degree Google Drive Link</FormLabel>
                    <FormControl><Input placeholder="https://drive.google.com/file/d/... (Optional)" {...field} value={field.value ?? ""} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {selectedStudent?.programType === "Degree" && (
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

            <Card>
              <CardHeader><CardTitle>Additional Information</CardTitle></CardHeader>
              <CardContent>
                <FormField control={form.control} name="remarks" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl><Textarea rows={3} placeholder="Any additional notes or special mentions (Optional)" {...field} value={field.value ?? ""} /></FormControl>
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
          <Button type="button" variant="outline" onClick={() => router.push("/admin/certificates/manage")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || (!selectedStudent && mode === 'add')} className="bg-primary hover:bg-primary/90">
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {mode === 'edit' ? 'Updating...' : 'Issuing...'}</>
            ) : (
              <>{mode === 'edit' ? <Edit className="w-4 h-4 mr-2" /> : <Award className="w-4 h-4 mr-2" /> } {mode === 'edit' ? 'Update Certificate' : 'Issue Certificate'}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
