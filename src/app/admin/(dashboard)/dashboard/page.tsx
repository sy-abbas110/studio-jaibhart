
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Users, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Total Students", value: "150+", icon: Users, color: "text-primary", link: "/admin/students/manage" },
    { title: "Certificates Issued", value: "300+", icon: FileText, color: "text-accent", link: "/admin/certificates/manage" },
    { title: "Courses Offered", value: "5", icon: BarChart3, color: "text-green-600", link: "#" },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-headline font-bold text-primary mb-8">
        Admin Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <Link href={stat.link} key={stat.title} legacyBehavior>
            <a className="block hover:scale-[1.02] transition-transform">
             <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            </a>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-headline text-primary">Quick Actions</CardTitle>
            <CardDescription>Commonly used administrative tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/students/add" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" /> Add New Student
              </Button>
            </Link>
            <Link href="/admin/certificates/add" className="block">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" /> Add New Certificate Record
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-headline text-primary">Recent Activity</CardTitle>
             <CardDescription>Overview of recent system events.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent activity to display yet.</p>
            {/* Placeholder for activity log */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Placeholder Button component if not already globally available via ShadCN
// For actual use, ensure Button is imported from '@/components/ui/button'
const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: string, className?: string}) => (
  <button {...props} className={`px-4 py-2 rounded-md border ${props.className}`}>{children}</button>
);

