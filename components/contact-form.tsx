"use client"

import type React from "react"
import { useState } from "react"
import { getContent } from "@/lib/content-cms"

export function ContactForm() {
  const content = getContent()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {[
        { label: "Name", name: "name", type: "text", placeholder: "Your name" },
        { label: "Email", name: "email", type: "email", placeholder: "your@email.com" },
      ].map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-semibold text-foreground/80 mb-2">{field.label}</label>
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name as keyof typeof formData]}
            onChange={handleChange}
            placeholder={field.placeholder}
            className="w-full px-4 py-3 rounded-lg bg-white/[0.02] backdrop-blur-xl border border-white/10 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 smooth-transition hover:border-white/20 dark:border-purple-500/30 dark:hover:border-primary/50 dark:focus:ring-primary/60 dark:focus:border-primary/60"
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-semibold text-foreground/80 mb-2">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          placeholder="Your message..."
          className="w-full px-4 py-3 rounded-lg bg-white/[0.02] backdrop-blur-xl border border-white/10 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 smooth-transition hover:border-white/20 resize-none dark:border-purple-500/30 dark:hover:border-primary/50 dark:focus:ring-primary/60 dark:focus:border-primary/60"
        />
      </div>

      <button
        type="submit"
        className="w-full group relative py-3 rounded-lg overflow-hidden font-semibold tracking-wide smooth-transition dark:neo-button"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-100 group-hover:opacity-110 dark:hidden" />
        <div className="absolute inset-px bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-30 blur dark:hidden" />
        <span className="relative z-10 text-primary-foreground dark:text-foreground block group-hover:scale-105 smooth-transition dark:group-hover:text-primary">
          Send Message
        </span>
      </button>
    </form>
  )
}
