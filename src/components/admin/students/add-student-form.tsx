
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { studentFormSchema, type StudentFormValues } from "@/lib/schemas/student-schema";
import { addStudentAction } from "@/app/actions/student-actions";
import { courseOptions } from "@/lib/data"; // Using mock data for course options
import { useRouter } from "next/navigation";
import { useState } from "react";

const programTypes = [
  { label: "Certificate", value: "Certificate" },
  { label: "Degree", value: "Degree" },
] as const;


export function AddStudentForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      enrollmentNumber: "",
      course: "",
      batchYear: "",
      enrollmentDate: "",
      courseDurationInMonths: undefined, // Use undefined for zod's coerce.number()
      programType: undefined,
      totalFees: undefined,
      feesSubmitted: undefined,
      profilePictureUrl: "",
      programCertificateLink: "",
      degreeCertificateLink: "",
      semesterLinks: [{ semester: "", link: "" }],
      graduationDate: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "semesterLinks",
  });

  const programType = form.watch("programType");

  async function onSubmit(values: StudentFormValues) {
    setIsSubmitting(true);
    try {
      // Transform values if necessary, e.g., ensure numbers are numbers
      const dataToSubmit: StudentFormValues = {
        ...values,
        courseDurationInMonths: Number(values.courseDurationInMonths),
        totalFees: values.totalFees ? Number(values.totalFees) : undefined,
        feesSubmitted: values.feesSubmitted ? Number(values.feesSubmitted) : undefined,
        // Ensure empty strings for optional URLs are handled if schema expects url or empty string
        profilePictureUrl: values.profilePictureUrl || "",
        programCertificateLink: values.programCertificateLink || "",
        degreeCertificateLink: values.degreeCertificateLink || "",
        semesterLinks: values.semesterLinks?.map(sl => ({ ...sl, link: sl.link || "" })) || [],
        graduationDate: values.graduationDate || null,
      };
      
      const result = await addStudentAction(dataToSubmit);

      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
        form.reset();
        // Optionally redirect or update UI
        // router.push("/admin/students/manage"); 
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter student's full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="enrollmentNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enrollment Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., JBPI2024CCC001" {...field} />
                </FormControl>
                <FormDescription>
                  Unique identifier for the student. Suggestion: JBPI[YEAR][COURSECODE][SERIAL]
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="course"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="batchYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch Year</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2023-2025 or 2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="enrollmentDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Enrollment Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="courseDurationInMonths"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Duration (Months)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 24" {...field} onChange={e => field.onChange(parseInt(e.target.value,10) || undefined )}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="graduationDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Graduation Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date (if graduated)</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="programType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select program type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {programTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalFees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Fees (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 50000" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="feesSubmitted"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fees Submitted (Optional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 25000" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profilePictureUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.png" {...field} />
                </FormControl>
                <FormDescription>
                  Link to student's photo. File upload can be added later.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {programType === "Certificate" && (
          <FormField
            control={form.control}
            name="programCertificateLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Certificate GDrive Link</FormLabel>
                <FormControl>
                  <Input placeholder="Enter GDrive link for the certificate" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {programType === "Degree" && (
          <div className="space-y-4 rounded-md border p-4">
            <h3 className="text-lg font-medium">Degree Documents</h3>
            <FormField
              control={form.control}
              name="degreeCertificateLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Final Degree Certificate GDrive Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter GDrive link for the final degree" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Semester Marksheets</FormLabel>
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-end gap-4 mt-2 p-3 border rounded-md">
                  <FormField
                    control={form.control}
                    name={`semesterLinks.${index}.semester`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">Semester Name</FormLabel>
                        <FormControl>
                          <Input placeholder={`e.g., Semester ${index + 1}`} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`semesterLinks.${index}.link`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">GDrive Link</FormLabel>
                        <FormControl>
                          <Input placeholder="Marksheet GDrive link" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove semester">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ semester: "", link: "" })}
                className="mt-2"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Semester Link
              </Button>
            </div>
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? "Adding Student..." : "Add Student"}
        </Button>
      </form>
    </Form>
  );
}
