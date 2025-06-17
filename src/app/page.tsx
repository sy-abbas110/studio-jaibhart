import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CourseCard } from '@/components/landing/course-card';
import { Award, BookOpen, Computer, FlaskConical, Mail, MessageSquare, Phone, Users, FileText } from 'lucide-react';

const courses = [
  {
    title: 'D.Pharm',
    description: 'Diploma in Pharmacy program focusing on pharmaceutical sciences and patient care.',
    Icon: FlaskConical,
  },
  {
    title: 'CCC',
    description: 'Course on Computer Concepts, providing foundational knowledge in IT and computer applications.',
    Icon: Computer,
  },
  {
    title: 'B.Ed',
    description: 'Bachelor of Education degree program for aspiring teachers and educational professionals.',
    Icon: BookOpen,
  },
  {
    title: 'Lab Technician',
    description: 'Training for medical laboratory technicians, covering diagnostics and lab procedures.',
    Icon: Award, // Placeholder, consider specific icon
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/80 via-primary/70 to-accent/60 text-primary-foreground shadow-inner">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Institute background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0 opacity-20"
          data-ai-hint="education building"
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6 drop-shadow-md">
            Jai Bharat Paramedical Institute of Management Groups, Ghazipur
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto drop-shadow-sm">
            Your gateway to excellence in paramedical and management education. Join us to build a successful career.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform hover:scale-105 transition-transform">
              <Link href="/students">
                <Users className="mr-2 h-5 w-5" /> View Students
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10 shadow-lg transform hover:scale-105 transition-transform">
              <Link href="/certificates">
                <FileText className="mr-2 h-5 w-5" /> Check Certificates
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-semibold text-primary mb-4">
              About Our Institute
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Jai Bharat Paramedical Institute of Management Groups is dedicated to providing top-tier education and practical training. We foster an environment of learning and innovation, preparing students for impactful careers in healthcare and management.
            </p>
          </div>
        </div>
      </section>
      
      {/* Courses Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-semibold text-primary text-center mb-12">
            Our Flagship Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.title} title={course.title} description={course.description} Icon={course.Icon} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto shadow-xl bg-card/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline text-primary">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-lg text-foreground/80">
                We are here to help you with any inquiries.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-secondary/50 transition-colors">
                  <Phone className="h-10 w-10 text-accent mb-2" />
                  <h4 className="font-semibold text-foreground">Phone</h4>
                  <a href="tel:+911234567890" className="text-accent hover:underline">+91 123 456 7890</a>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-secondary/50 transition-colors">
                  <Mail className="h-10 w-10 text-accent mb-2" />
                  <h4 className="font-semibold text-foreground">Email</h4>
                  <a href="mailto:info@jaibharatinstitute.com" className="text-accent hover:underline">info@jaibharatinstitute.com</a>
                </div>
                <div className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-secondary/50 transition-colors">
                  <MessageSquare className="h-10 w-10 text-accent mb-2" />
                  <h4 className="font-semibold text-foreground">WhatsApp</h4>
                  <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Chat with us</a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
