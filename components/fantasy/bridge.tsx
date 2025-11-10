"use client";

import type React from "react";
import { useEffect, useState } from "react";

import { RealmCard } from "./realm-card";
import { getContent, loadContent } from "@/lib/content-cms";
import type { PortfolioContent } from "@/lib/content-cms";

export function BridgeRealm() {
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    // Load fresh content from KV on mount
    loadContent()
      .then(setContent)
      .catch(() => {
        setContent(getContent());
      });
  }, []);

  if (!content) {
    return (
      <section id="bridge" className="py-16 px-6">
        <div />
      </section>
    );
  }

  const bridge = content.fantasy.bridge;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Message sent across the veil:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="bridge" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <RealmCard
          title={bridge.title}
          description={bridge.description}
          content={bridge.content}
          heroText="A message whispered across dimensions finds its destination."
        />

        {/* Contact Ritual */}
        <div className="mt-20 space-y-8">
          <h2 className="text-2xl font-bold text-mystical">
            Send a Message Across the Veil
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Mystical Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-mystical mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-mystical/10 border border-mystical/30 text-foreground focus:outline-none focus:ring-2 focus:ring-mystical smooth-transition"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mystical mb-2">
                  Mystical Seal (Email)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-mystical/10 border border-mystical/30 text-foreground focus:outline-none focus:ring-2 focus:ring-mystical smooth-transition"
                  placeholder="your@mystical.realm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mystical mb-2">
                  Your Incantation
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-mystical/10 border border-mystical/30 text-foreground focus:outline-none focus:ring-2 focus:ring-mystical smooth-transition resize-none"
                  placeholder="Share your thoughts..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-mystical/20 border border-mystical/50 text-mystical font-semibold hover:bg-mystical/30 smooth-transition glow"
              >
                Send Across Realms
              </button>
            </form>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-mystical mb-3">Direct Conduit</h3>
                <a
                  href={`mailto:${content.metadata.email}`}
                  className="text-mystical hover:text-glow smooth-transition block glow"
                >
                  {content.metadata.email}
                </a>
              </div>

              <div>
                <h3 className="font-bold text-mystical mb-4">
                  Ethereal Pathways
                </h3>
                <div className="space-y-3">
                  {Object.entries(content.metadata.social).map(
                    ([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-mystical hover:text-glow smooth-transition block capitalize hover:pl-2 smooth-transition"
                      >
                        → {platform}
                      </a>
                    )
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-mystical/10 border border-mystical/30">
                <p className="text-sm text-muted-foreground">
                  The magic of connection transcends dimensions. Your message
                  will be received.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
