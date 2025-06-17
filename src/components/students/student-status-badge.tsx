"use client";

import { useEffect, useState } from 'react';
import { getStudentStatusAction } from '@/app/actions/student-actions';
import type { Student } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'; // Added AlertCircle for error

interface StudentStatusBadgeProps {
  student: Pick<Student, 'enrollmentDate' | 'courseDurationInMonths' | 'graduationDate' | 'course'>;
}

export function StudentStatusBadge({ student }: StudentStatusBadgeProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    // Set current date only on client-side to avoid hydration mismatch
    setCurrentDate(new Date().toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (!currentDate) return; // Wait for currentDate to be set

    async function fetchStatus() {
      const input = {
        enrollmentDate: student.enrollmentDate,
        courseDuration: `${student.courseDurationInMonths} months`,
        graduationDate: student.graduationDate || null,
        currentDate: currentDate,
        courseName: student.course,
      };
      const result = await getStudentStatusAction(input);
      setStatus(result.status);
    }

    fetchStatus();
  }, [student, currentDate]);

  if (status === null) {
    return <Badge variant="outline" className="animate-pulse bg-muted/50 w-20 h-6 rounded-full"></Badge>;
  }

  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
  let IconComponent = Clock;

  if (status === 'Completed') {
    badgeVariant = "secondary"; // Using secondary for completed as primary is saffron
    IconComponent = CheckCircle2;
  } else if (status === 'Ongoing') {
    badgeVariant = "outline";
    IconComponent = Clock;
  } else if (status === 'Error') {
    badgeVariant = "destructive";
    IconComponent = AlertCircle;
  }
  
  return (
    <Badge variant={badgeVariant} className="flex items-center gap-1.5 whitespace-nowrap">
      <IconComponent className="h-3.5 w-3.5" />
      {status}
    </Badge>
  );
}
