import { Building2, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Categories", "Mobile App", "API"],
  Company: ["About Us", "Careers", "Press", "Blog", "Contact"],
  Support: ["Help Center", "Community", "FAQs", "Terms of Service", "Privacy Policy"],
  "For Business": ["Register", "Advertise", "Partnerships", "Success Stories", "Resources"],
};

const Footer = () => {
  return (
    <footer id="footer" className="border-t border-border bg-card pt-16 pb-8">
      <div className="container">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-heading font-bold text-foreground">Business<span className="text-accent">Matrix</span></span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              India's leading business matrix connecting millions of customers with trusted local businesses.
            </p>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> support@businessmatrix.in
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +91 1800-123-4567
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Mumbai, Maharashtra, India
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-foreground">{title}</h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 BusinessMatrix. All rights reserved.
          </p>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
