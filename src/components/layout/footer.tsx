import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/60 text-muted-foreground py-8 border-t border-border/40">
      <div className="container mx-auto px-4 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-headline font-semibold text-foreground mb-3">Jai Bharat Institute</h3>
            <p className="text-sm">
              Empowering students with quality paramedical education and management skills.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-headline font-semibold text-foreground mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/students" className="hover:text-primary transition-colors">Student Directory</Link></li>
              <li><Link href="/certificates" className="hover:text-primary transition-colors">Certificate Records</Link></li>
              {/* <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li> */}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-headline font-semibold text-foreground mb-3">Connect With Us</h3>
            <p className="text-sm">
              Ghazipur, Uttar Pradesh, India
            </p>
            <p className="text-sm mt-1">
              Email: <a href="mailto:info@jaibharatinstitute.com" className="hover:text-primary transition-colors">info@jaibharatinstitute.com</a>
            </p>
            <p className="text-sm mt-1">
              Phone: <a href="tel:+911234567890" className="hover:text-primary transition-colors">+91 123 456 7890</a>
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/60 text-sm text-center">
          <p>&copy; {currentYear} Jai Bharat Paramedical Institute of Management Groups, Ghazipur. All rights reserved.</p>
          <p className="mt-1">Designed with care.</p>
        </div>
      </div>
    </footer>
  );
}
