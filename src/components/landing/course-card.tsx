
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface CourseCardProps {
  title: string;
  description: string;
  Icon: LucideIcon; // This was for the old flagship courses. The new section doesn't use individual icons per course in the same way.
}

// This component might be deprecated or repurposed if AllCoursesSection fully replaces its functionality.
// For now, keeping it as it was, but it's not used on the homepage anymore.
export function CourseCard({ title, description, Icon }: CourseCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-headline font-semibold text-primary">{title}</CardTitle>
        <Icon className="h-8 w-8 text-accent" />
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-foreground/80 leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
