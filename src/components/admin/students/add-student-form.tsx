
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, PlusCircle, Trash2, User, Phone, MapPin, GraduationCap, DollarSign, FileText, Save, Loader2, Edit, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isValid, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { studentFormSchema, type StudentFormValues } from "@/lib/schemas/student-schema";
import { addStudentAction, updateStudentAction } from "@/app/actions/student-actions";
import { studentFormCourseOptions } from "@/lib/data"; 
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Student } from "@/lib/types";

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const bloodGroupOptions = [
  { label: "A+", value: "A+" }, { label: "A-", value: "A-" },
  { label: "B+", value: "B+" }, { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" }, { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" }, { label: "O-", value: "O-" },
];

const categoryOptions = [
  { label: "General", value: "general" }, { label: "OBC", value: "obc" },
  { label: "SC", value: "sc" }, { label: "ST", value: "st" },
  { label: "EWS", value: "ews" },
];

const studentStatusOptions = [
  { label: "Active", value: "Active" },
  { label: "Completed", value: "Completed" },
  { label: "Inactive", value: "Inactive" },
];

const certificateStatusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "Issued", value: "Issued" },
];

const programTypeOptions = [
  { label: "Certificate", value: "Certificate" },
  { label: "Degree", value: "Degree" },
] as const;

interface AddStudentFormProps {
  initialData?: StudentFormValues | Student | null; 
  studentId?: string;
}

export function AddStudentForm({ initialData, studentId }: AddStudentFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mode = studentId && initialData ? 'edit' : 'add';

  const defaultAddValues: StudentFormValues = {
    enrollmentNumber: "",
    firstName: "",
    lastName: "",
    fatherName: "", // Changed from undefined
    motherName: "", // Changed from undefined
    dateOfBirth: undefined, // Calendar handles undefined for no selection
    gender: undefined, // Select handles undefined
    bloodGroup: undefined,
    category: undefined,
    phone: "",
    alternatePhone: "", // Changed from undefined
    email: "", // Changed from undefined
    emergencyContact: "", // Changed from undefined
    aadharNumber: "", // Changed from undefined
    address: "", // Changed from undefined
    city: "", // Changed from undefined
    state: "", // Changed from undefined
    pincode: "", // Changed from undefined
    course: "", // Should be selected
    programType: undefined, // Should be selected
    batch: "",
    admissionDate: "", // Should be selected
    courseDurationInMonths: undefined, // Number input, user needs to fill
    totalFees: undefined,
    feesSubmitted: undefined,
    remarks: "", // Changed from undefined
    status: "Active", // Default status
    certificateStatus: "Pending", // Default cert status
    profilePictureUrl: "", // Changed from undefined
    programCertificateLink: "", // Changed from undefined
    degreeCertificateLink: "", // Changed from undefined
    semesterLinks: [{ semester: "", link: "" }],
    graduationDate: undefined, // Calendar handles undefined
  };

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: mode === 'edit' && initialData ? {
      ...initialData,
      dateOfBirth: initialData.dateOfBirth && isValid(parseISO(initialData.dateOfBirth)) ? initialData.dateOfBirth : undefined,
      admissionDate: initialData.admissionDate && isValid(parseISO(initialData.admissionDate)) ? initialData.admissionDate : "", 
      graduationDate: initialData.graduationDate && isValid(parseISO(initialData.graduationDate)) ? initialData.graduationDate : undefined,
      totalFees: initialData.totalFees ?? undefined,
      feesSubmitted: initialData.feesSubmitted ?? undefined,
      courseDurationInMonths: initialData.courseDurationInMonths ?? undefined,
      semesterLinks: initialData.semesterLinks && initialData.semesterLinks.length > 0 ? initialData.semesterLinks.map(sl => ({ semester: sl.semester || "", link: sl.link || "" })) : [{ semester: "", link: "" }],
      // Ensure all optional string fields from initialData are at least ""
      fatherName: initialData.fatherName ?? "",
      motherName: initialData.motherName ?? "",
      alternatePhone: initialData.alternatePhone ?? "",
      email: initialData.email ?? "",
      emergencyContact: initialData.emergencyContact ?? "",
      aadharNumber: initialData.aadharNumber ?? "",
      address: initialData.address ?? "",
      city: initialData.city ?? "",
      state: initialData.state ?? "",
      pincode: initialData.pincode ?? "",
      remarks: initialData.remarks ?? "",
      profilePictureUrl: initialData.profilePictureUrl ?? "",
      programCertificateLink: initialData.programCertificateLink ?? "",
      degreeCertificateLink: initialData.degreeCertificateLink ?? "",

    } : defaultAddValues,
  });
  
  const { formState: { errors } } = form;
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
    }
  }, [errors]);


  useEffect(() => {
    if (mode === 'edit' && initialData) {
       const transformedInitialData = {
        ...initialData,
        dateOfBirth: initialData.dateOfBirth && isValid(parseISO(initialData.dateOfBirth)) ? initialData.dateOfBirth : undefined,
        admissionDate: initialData.admissionDate && isValid(parseISO(initialData.admissionDate)) ? initialData.admissionDate : "",
        graduationDate: initialData.graduationDate && isValid(parseISO(initialData.graduationDate)) ? initialData.graduationDate : undefined,
        totalFees: initialData.totalFees ?? undefined,
        feesSubmitted: initialData.feesSubmitted ?? undefined,
        courseDurationInMonths: initialData.courseDurationInMonths ?? undefined,
        semesterLinks: initialData.semesterLinks && initialData.semesterLinks.length > 0 ? initialData.semesterLinks.map(sl => ({ semester: sl.semester || "", link: sl.link || "" })) : [{ semester: "", link: "" }],
        // Ensure all optional string fields are at least ""
        fatherName: initialData.fatherName ?? "",
        motherName: initialData.motherName ?? "",
        alternatePhone: initialData.alternatePhone ?? "",
        email: initialData.email ?? "",
        emergencyContact: initialData.emergencyContact ?? "",
        aadharNumber: initialData.aadharNumber ?? "",
        address: initialData.address ?? "",
        city: initialData.city ?? "",
        state: initialData.state ?? "",
        pincode: initialData.pincode ?? "",
        remarks: initialData.remarks ?? "",
        profilePictureUrl: initialData.profilePictureUrl ?? "",
        programCertificateLink: initialData.programCertificateLink ?? "",
        degreeCertificateLink: initialData.degreeCertificateLink ?? "",
      };
      form.reset(transformedInitialData as StudentFormValues);
    }
  }, [initialData, mode, form]);


  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "semesterLinks",
  });

  const selectedProgramType = form.watch("programType");

  async function onSubmit(values: StudentFormValues) {
    console.log("RHF onSubmit handler called with values:", values); 
    setIsSubmitting(true);
    try {
      let result;
      console.log('Started submitting student data'); 
      if (mode === 'edit' && studentId) {
        result = await updateStudentAction(studentId, values);
      } else {
        result = await addStudentAction(values);
      }

      if (result.success) {
        toast({
          title: "Success!",
          description: mode === 'edit' ? "Student updated successfully." : "Student added successfully.",
        });
        if (mode === 'add') {
            form.reset(defaultAddValues); 
        }
        router.push("/admin/students/manage");
        router.refresh(); 
      } else {
        toast({
          title: mode === 'edit' ? "Error Updating Student" : "Error Adding Student",
          description: result.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Submission error in AddStudentForm:", error);
      toast({
        title: "Submission Failed",
        description: (error as Error).message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="w-5 h-5 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField control={form.control} name="enrollmentNumber" render={({ field }) => (
              <FormItem>
                <FormLabel>Enrollment Number *</FormLabel>
                <FormControl><Input placeholder="e.g., JBPI2024CCC001" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="firstName" render={({ field }) => (
              <FormItem>
                <FormLabel>First Name *</FormLabel>
                <FormControl><Input placeholder="Enter first name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="lastName" render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name *</FormLabel>
                <FormControl><Input placeholder="Enter last name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="fatherName" render={({ field }) => (
              <FormItem>
                <FormLabel>Father's Name</FormLabel>
                <FormControl><Input placeholder="Enter father's name" {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="motherName" render={({ field }) => (
              <FormItem>
                <FormLabel>Mother's Name</FormLabel>
                <FormControl><Input placeholder="Enter mother's name" {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
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
                    <Calendar mode="single" selected={field.value && isValid(parseISO(field.value)) ? parseISO(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} captionLayout="dropdown-buttons" fromYear={1950} toYear={new Date().getFullYear()}/>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="gender" render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                  <SelectContent>{genderOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="bloodGroup" render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Group</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger></FormControl>
                  <SelectContent>{bloodGroupOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="category" render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                  <SelectContent>{categoryOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Phone className="w-5 h-5 text-primary" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl><Input placeholder="10-digit phone number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="alternatePhone" render={({ field }) => (
              <FormItem>
                <FormLabel>Alternate Phone</FormLabel>
                <FormControl><Input placeholder="Alternate phone number" {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" placeholder="student@example.com" {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="emergencyContact" render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact</FormLabel>
                <FormControl><Input placeholder="Emergency contact number" {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="aadharNumber" render={({ field }) => (
              <FormItem>
                <FormLabel>Aadhar Number</FormLabel>
                <FormControl><Input placeholder="12-digit Aadhar number" {...field} value={field.value ?? ""} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <MapPin className="w-5 h-5 text-primary" />
                    Address Information
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem className="md:col-span-2 lg:col-span-3">
                        <FormLabel>Address</FormLabel>
                        <FormControl><Textarea placeholder="Complete address" rows={2} {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl><Input placeholder="City" {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl><Input placeholder="State" {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="pincode" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Pincode</FormLabel>
                        <FormControl><Input placeholder="6-digit pincode" {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Academic Information
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField control={form.control} name="course" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Course *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger></FormControl>
                            <SelectContent>{studentFormCourseOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="programType" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Program Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select program type" /></SelectTrigger></FormControl>
                        <SelectContent>{programTypeOptions.map(type => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="batch" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Batch *</FormLabel>
                        <FormControl><Input placeholder="e.g., 2024-2025 or 2024" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="admissionDate" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Admission Date *</FormLabel>
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
                <FormField control={form.control} name="courseDurationInMonths" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Course Duration (Months) *</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 24" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : parseInt(e.target.value,10) )} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="graduationDate" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Graduation Date (Optional)</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value && isValid(parseISO(field.value)) ? format(parseISO(field.value), "PPP") : <span>Pick a date (if graduated)</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value && isValid(parseISO(field.value)) ? parseISO(field.value) : undefined} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")} initialFocus/>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )} />
            </CardContent>
        </Card>

        {/* Fee Information */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Fee Information
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="totalFees" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Total Fees (₹)</FormLabel>
                        <FormControl><Input type="number" placeholder="Total course fees" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="feesSubmitted" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fees Submitted (₹)</FormLabel>
                        <FormControl><Input type="number" placeholder="Amount paid" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : parseFloat(e.target.value))} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </CardContent>
        </Card>

        {/* Document Links (Conditional) */}
        {selectedProgramType === "Certificate" && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Briefcase className="w-5 h-5 text-primary" />Program Certificate</CardTitle></CardHeader>
            <CardContent>
              <FormField control={form.control} name="programCertificateLink" render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Certificate GDrive Link</FormLabel>
                  <FormControl><Input placeholder="Enter GDrive link for the certificate" {...field} value={field.value ?? ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>
        )}

        {selectedProgramType === "Degree" && (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-xl"><Briefcase className="w-5 h-5 text-primary" />Degree Documents</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="degreeCertificateLink" render={({ field }) => (
                <FormItem>
                  <FormLabel>Final Degree Certificate GDrive Link (Optional)</FormLabel>
                  <FormControl><Input placeholder="Enter GDrive link for the final degree" {...field} value={field.value ?? ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div>
                <FormLabel className="text-base font-medium">Semester Marksheets</FormLabel>
                {fields.map((item, index) => (
                  <div key={item.id} className="flex items-end gap-4 mt-2 p-3 border rounded-md bg-muted/30">
                    <FormField control={form.control} name={`semesterLinks.${index}.semester`} render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">Semester Name *</FormLabel>
                        <FormControl><Input placeholder={`e.g., Semester ${index + 1}`} {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`semesterLinks.${index}.link`} render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">GDrive Link *</FormLabel>
                        <FormControl><Input placeholder="Marksheet GDrive link" {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove semester">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => append({ semester: "", link: "" })} className="mt-2">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Semester Link
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Additional Information */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="w-5 h-5 text-primary" />
                    Additional Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField control={form.control} name="remarks" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl><Textarea placeholder="Additional notes or comments" rows={2} {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Student Status *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                                <SelectContent>{studentStatusOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="certificateStatus" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Certificate Status *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select certificate status" /></SelectTrigger></FormControl>
                                <SelectContent>{certificateStatusOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="profilePictureUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Profile Picture URL (Optional)</FormLabel>
                        <FormControl><Input placeholder="https://example.com/image.png" {...field} value={field.value ?? ""} /></FormControl>
                        <FormDescription>Link to student's photo. File upload can be added later.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
            </CardContent>
        </Card>


        <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/students/manage')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {mode === 'edit' ? 'Updating...' : 'Adding...'}</>
              ) : (
                <>{mode === 'edit' ? <Edit className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />} {mode === 'edit' ? 'Update Student' : 'Add Student'}</>
              )}
            </Button>
        </div>
      </form>
    </Form>
  );
}

    