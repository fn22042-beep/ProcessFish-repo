"use client"

import { useState } from "react"
import { Fish, Search, ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCart } from "@/context/cart-context"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/#categories" },
  { label: "Our Process", href: "/#process" },
  { label: "About Us", href: "/" },
  { label: "Contact", href: "/#contact" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <Link href="#" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
            <Fish className="h-5 w-5" style={{ color: "#1B1F6F" }} />
          </div>
          <div>
            <span className="text-lg font-bold" style={{ color: "#1B1F6F" }}>Processe Fish</span>
            <p className="text-[10px] leading-none text-accent font-medium tracking-wider uppercase">Premium All Fish</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-foreground transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="hidden rounded-full p-2 text-foreground transition-colors hover:bg-muted sm:inline-flex" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
          <Link href="/cart" className="relative rounded-full p-2 text-foreground transition-colors hover:bg-muted" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold" style={{ color: "#1B1F6F" }}>
              {totalItems}
            </span>
          </Link>
          <Link href="/cart">
            <Button className="hidden bg-accent text-foreground font-semibold hover:bg-amber-400 sm:inline-flex" style={{ color: "#1B1F6F" }}>
              Order Now
            </Button>
          </Link>
          <button
            className="rounded-full p-2 text-foreground lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="border-t border-border bg-background px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/cart" onClick={() => setMobileOpen(false)}>
              <Button className="mt-2 w-full bg-accent font-semibold hover:bg-amber-400" style={{ color: "#1B1F6F" }}>
                Order Now
              </Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
