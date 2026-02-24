"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

function useCountdown(targetHours: number) {
  const [timeLeft, setTimeLeft] = useState({ hours: targetHours, minutes: 41, seconds: 23 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev
        seconds--
        if (seconds < 0) {
          seconds = 59
          minutes--
        }
        if (minutes < 0) {
          minutes = 59
          hours--
        }
        if (hours < 0) {
          return { hours: targetHours, minutes: 59, seconds: 59 }
        }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [targetHours])

  return timeLeft
}

export function PromoSection() {
  const countdown = useCountdown(8)

  return (
    <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1B1F6F 0%, #141752 100%)" }}>
      {/* Accent top bar */}
      <div className="h-1.5 bg-accent" />

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-14 lg:flex-row lg:px-8 lg:py-20">
        <div className="flex-1 text-center lg:text-left">
          <span className="inline-block rounded-full bg-accent/20 px-4 py-1.5 text-xs font-semibold text-accent">
            Limited Time Offer
          </span>
          <h2 className="mt-5 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Get 30% OFF on<br />Premium Hilsa Fish
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-blue-200 sm:text-base">
            Order our premium-grade Hilsa fish, freshly caught from the Padma river. Perfectly 
            processed, vacuum-packed, and delivered to your home. {"Don't"} miss this exclusive deal!
          </p>

          {/* Countdown */}
          <div className="mt-8 flex items-center justify-center gap-3 lg:justify-start">
            {[
              { value: String(countdown.hours).padStart(2, "0"), label: "Hours" },
              { value: String(countdown.minutes).padStart(2, "0"), label: "Minutes" },
              { value: String(countdown.seconds).padStart(2, "0"), label: "Seconds" },
            ].map((unit) => (
              <div key={unit.label} className="flex flex-col items-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent text-xl font-bold sm:h-16 sm:w-16 sm:text-2xl" style={{ color: "#1B1F6F" }}>
                  {unit.value}
                </span>
                <span className="mt-1.5 text-[10px] text-blue-300">{unit.label}</span>
              </div>
            ))}
          </div>

          <Button size="lg" className="mt-8 bg-accent font-bold hover:bg-amber-400" style={{ color: "#1B1F6F" }}>
            Grab This Deal
          </Button>
        </div>

        <div className="flex-1">
          <div className="mx-auto w-[260px] sm:w-[320px] lg:w-[380px]">
            <Image
              src="/images/hilsa-promo.jpg"
              alt="Premium Hilsa Fish promotional offer"
              width={380}
              height={380}
              className="rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
