import Link from "next/link";
import { Sparkles, Globe, Briefcase, Code, Heart } from "lucide-react";
import { siteConfig } from "@/src/config";

const footerLinks = {
  Platform: [
    { label: "Courses", href: "/courses" },
    { label: "Internships", href: "/internships" },
    { label: "Mentors", href: "/mentors" },
    { label: "Certificates", href: "/certificates" },
    { label: "Pricing", href: "/pricing" },
  ],
  "Learn More": [
    { label: "For Students", href: "/for-students" },
    { label: "For Professionals", href: "/for-professionals" },
    { label: "For Mentors", href: "/for-mentors" },
    { label: "For Recruiters", href: "/for-recruiters" },
    { label: "Enterprise", href: "/enterprise" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Press", href: "/press" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Refund Policy", href: "/refunds" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Nexora</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Briefcase className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Code className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-sm mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © {new Date().getFullYear()} Nexora. Made with{" "}
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for
            learners everywhere.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              🔒 Secured by SSL
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              💳 PayPal Verified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
