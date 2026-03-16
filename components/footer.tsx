import { Fish, MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Twitter, ArrowRight } from "lucide-react"
import Link from "next/link"

const quickLinks = ["Home", "Products", "Categories", "Our Process", "About Us", "Blog"]
const fishTypes = ["Hilsa / Ilish", "Catla Fish", "Dried Fish", "Shrimp & Prawn", "Smoked Fish", "Frozen Fish"]

export function Footer() {
  return (
    <footer
      id="contact"
      style={{ background: "linear-gradient(135deg, #1B1F6F 0%, #141752 100%)" }}
    >
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
                <Fish className="h-5 w-5" style={{ color: "#1B1F6F" }} />
              </div>
              <div>
                <span className="text-lg font-bold text-white">Processed Fish</span>
                <p className="text-[10px] leading-none text-accent font-medium tracking-wider uppercase">
                  Premium Seafood
                </p>
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-blue-200">
              {"Bangladesh's"} most trusted processed fish brand. We deliver the freshest seafood from 
              ocean to your table with the highest quality standards and hygiene protocols.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Facebook, Instagram, Youtube, Twitter].map((Icon, i) => (
                <button
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-blue-200 transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Social media"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white">Quick Links</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link}>
                  <Link href="#" className="flex items-center gap-1.5 text-sm text-blue-200 transition-colors hover:text-accent">
                    <ArrowRight className="h-3 w-3" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fish Types */}
          <div>
            <h3 className="text-sm font-bold text-white">Fish Types</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {fishTypes.map((type) => (
                <li key={type}>
                  <Link href="#" className="flex items-center gap-1.5 text-sm text-blue-200 transition-colors hover:text-accent">
                    <ArrowRight className="h-3 w-3" />
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white">Contact Us</h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li className="flex items-start gap-2.5 text-sm text-blue-200">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>Mawlana Bhashani Science and Technology University,Santosh Tangail</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-blue-200">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <span>+880 1850372912</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-blue-200">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <span>naim199182@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-blue-200">
                <Clock className="h-4 w-4 shrink-0 text-accent" />
                <span>Open: 8 AM - 10 PM (Daily)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-blue-300 sm:flex-row lg:px-8">
          <p>2026 Processed Fish. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-accent">Privacy</Link>
            <Link href="#" className="hover:text-accent">Terms</Link>
            <Link href="#" className="hover:text-accent">Support</Link>
            <Link href="#" className="hover:text-accent">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
