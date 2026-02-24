"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell } from "lucide-react"
import { toast } from "sonner"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      toast.error("Please enter your email address.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "Subscription failed. Please try again.")
        return
      }
      toast.success(data.message ?? "Thank you for subscribing!")
      setEmail("")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-muted py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 text-center lg:px-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold" style={{ color: "#1B1F6F" }}>
          <Bell className="h-3 w-3" />
          Stay Updated
        </span>
        <h2 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Subscribe & Get<br />Exclusive Deals!
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Subscribe to our newsletter and get 10% off your first order plus exclusive deals, 
          new arrivals and weekly fresh catch updates.
        </p>
        <form
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          onSubmit={handleSubmit}
        >
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 max-w-sm bg-background"
            aria-label="Email address"
            disabled={loading}
          />
          <Button
            type="submit"
            className="bg-accent font-semibold hover:bg-amber-400"
            style={{ color: "#1B1F6F" }}
            disabled={loading}
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  )
}
