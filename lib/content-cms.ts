// Setter CMS - JSON-based content management
export interface ContentEntry {
  id: string
  title: string
  description: string
  content: string
  tags: string[]
  heroText?: string
}

export interface PortfolioContent {
  metadata: {
    name: string
    title: string
    email: string
    social: Record<string, string>
  }
  classic: {
    hero: ContentEntry
    about: ContentEntry
    projects: ContentEntry[]
    skills: ContentEntry
    contact: ContentEntry
  }
  fantasy: {
    origin: ContentEntry
    forge: ContentEntry
    codex: ContentEntry
    bridge: ContentEntry
  }
}

// Default portfolio content (Setter format)
export const defaultContent: PortfolioContent = {
  metadata: {
    name: "Traveler Between Realms",
    title: "Full-Stack Developer & Creative Technologist",
    email: "hello@traveler.dev",
    social: {
      github: "https://github.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
  classic: {
    hero: {
      id: "classic-hero",
      title: "Welcome",
      description: "A portfolio bridging reality and fantasy",
      heroText: "Full-Stack Developer crafting digital experiences",
      content: "I build innovative web applications with modern technologies.",
      tags: ["developer", "designer", "creative"],
    },
    about: {
      id: "classic-about",
      title: "About Me",
      description: "My professional journey",
      content:
        "With 5+ years of experience in full-stack development, I specialize in creating seamless user experiences through carefully crafted code and thoughtful design.",
      tags: ["professional", "experienced"],
    },
    projects: [
      {
        id: "project-1",
        title: "Project Alpha",
        description: "A modern web platform",
        content: "Built a scalable SaaS platform using Next.js, TypeScript, and PostgreSQL.",
        tags: ["fullstack", "saas"],
      },
      {
        id: "project-2",
        title: "Project Beta",
        description: "Interactive visualization tool",
        content: "Created an interactive data visualization dashboard with real-time updates.",
        tags: ["frontend", "visualization"],
      },
    ],
    skills: {
      id: "classic-skills",
      title: "Technical Skills",
      description: "Technologies and expertise",
      content: "TypeScript, React, Next.js, Node.js, PostgreSQL, TailwindCSS",
      tags: ["technical"],
    },
    contact: {
      id: "classic-contact",
      title: "Get In Touch",
      description: "Let's collaborate",
      content: "Have a project in mind? I'd love to hear from you.",
      tags: ["contact"],
    },
  },
  fantasy: {
    origin: {
      id: "fantasy-origin",
      title: "The Origin",
      description: "Where the journey began",
      heroText: "A traveler awakens between two worlds",
      content:
        "In the misty mountains of code, a seeker was born. The child of logic and creativity, destined to bridge the mortal and magical realms.",
      tags: ["origin", "lore"],
    },
    forge: {
      id: "fantasy-forge",
      title: "The Forge",
      description: "Where creation manifests",
      content:
        "At the Forge, magical artifacts spring to life—great works that harness the power of thought and imagination. Each creation tells a tale of wonder and wonder.",
      tags: ["projects", "creation"],
    },
    codex: {
      id: "fantasy-codex",
      title: "The Codex",
      description: "Ancient knowledge and arcane arts",
      content:
        "Within the Codex lie the ancient runes—the languages of power: TypeScript, React, Node.js. Mastery of these arts unlocks infinite possibilities.",
      tags: ["skills", "knowledge"],
    },
    bridge: {
      id: "fantasy-bridge",
      title: "The Bridge",
      description: "A connection between worlds",
      content:
        "At the Bridge, all boundaries dissolve. Here, seeker and creator unite. Send a message across the veil, and let conversation bloom.",
      tags: ["contact", "bridge"],
    },
  },
}

// Load content - can be extended to load from database or file
export function getContent(): PortfolioContent {
  return defaultContent
}
