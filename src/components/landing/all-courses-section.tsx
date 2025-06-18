
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { courseCategories } from "@/lib/data"; // Import from centralized data

export function AllCoursesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-semibold text-primary mb-4">
            Our Comprehensive Courses
          </h2>
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            We offer a wide range of courses across multiple disciplines, all designed to meet industry standards and empower your career.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseCategories.map((category, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm border-border hover:border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {/* Using provided specific Tailwind classes for unique category badge colors as per user's design */}
                  <Badge className={`${category.color} px-3 py-1 text-sm font-semibold`}>{category.title}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {category.courses.map((course, courseIndex) => (
                    <li key={courseIndex} className="text-sm text-foreground/90 flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 bg-primary/70 rounded-full mt-[7px] flex-shrink-0" />
                      <span>{course}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/80 via-primary/70 to-accent/70 text-primary-foreground p-8 rounded-lg shadow-xl">
            <h3 className="text-2xl font-headline font-bold mb-3">Special Features</h3>
            <p className="mb-6 text-base">
              Government Approved • Industry Recognized • Placement Assistance
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
              <span>✓ Practical Training</span>
              <span>✓ Modern Labs</span>
              <span>✓ Expert Faculty</span>
              <span>✓ Affordable Fees</span>
              <span>✓ Flexible Timings</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
