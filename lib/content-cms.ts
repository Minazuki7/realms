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

// Load content - fetches from KV via API, falls back to default
let cachedContent: PortfolioContent | null = null;
let isLoading = false;
let loadPromise: Promise<PortfolioContent> | null = null;

async function fetchContentFromKV(): Promise<PortfolioContent> {
  try {
    const bioRes = await fetch("/api/cms/bio");
    const projectsRes = await fetch("/api/cms/projects");
    const settingsRes = await fetch("/api/cms/settings");

    if (!bioRes.ok || !projectsRes.ok || !settingsRes.ok) {
      return defaultContent;
    }

    const bio = await bioRes.json();
    const projects = await projectsRes.json();
    const settings = await settingsRes.json();

    // Transform KV data to content structure
    return {
      metadata: {
        name: bio.name || defaultContent.metadata.name,
        title: bio.title || defaultContent.metadata.title,
        email: bio.email || defaultContent.metadata.email,
        social: bio.socials || defaultContent.metadata.social,
      },
      classic: {
        hero: {
          id: "classic-hero",
          title: "Welcome",
          description: bio.title || defaultContent.classic.hero.description,
          heroText: bio.headline || defaultContent.classic.hero.heroText,
          content: bio.bio || defaultContent.classic.hero.content,
          tags: ["developer", "designer", "creative"],
        },
        about: {
          id: "classic-about",
          title: "About Me",
          description: "My professional journey",
          content: bio.bio || defaultContent.classic.about.content,
          tags: ["professional", "experienced"],
        },
        projects: Array.isArray(projects)
          ? projects.map((p, i) => ({
              id: `project-${i}`,
              title: p.title || "",
              description: p.description || "",
              content: p.description || "",
              tags: p.tags || ["project"],
            }))
          : defaultContent.classic.projects,
        skills: {
          id: "classic-skills",
          title: "Technical Skills",
          description: "Technologies and expertise",
          content: bio.skills
            ? Object.values(bio.skills)
                .flat()
                .join(", ")
            : defaultContent.classic.skills.content,
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
          content: bio.bio || defaultContent.fantasy.origin.content,
          tags: ["origin", "lore"],
        },
        forge: {
          id: "fantasy-forge",
          title: "The Forge",
          description: "Where creation manifests",
          content:
            projects.length > 0
              ? `At the Forge, ${projects.length} magical artifacts have been created. ${projects.map((p: any) => p.title).join(", ")}.`
              : defaultContent.fantasy.forge.content,
          tags: ["projects", "creation"],
        },
        codex: {
          id: "fantasy-codex",
          title: "The Codex",
          description: "Ancient knowledge and arcane arts",
          content: bio.skills
            ? `Within the Codex lie the ancient runes: ${Object.values(bio.skills)
                .flat()
                .join(", ")}. Mastery of these arts unlocks infinite possibilities.`
            : defaultContent.fantasy.codex.content,
          tags: ["skills", "knowledge"],
        },
        bridge: {
          id: "fantasy-bridge",
          title: "The Bridge",
          description: "A connection between worlds",
          content: `Send a message to ${bio.email || "the traveler"}, and let conversation bloom.`,
          tags: ["contact", "bridge"],
        },
      },
    };
  } catch (error) {
    console.error("Failed to fetch content from KV:", error);
    return defaultContent;
  }
}

export function getContent(): PortfolioContent {
  // If running on client and cache is available, return it
  if (cachedContent) {
    return cachedContent;
  }
  
  // Return default content immediately; async loading happens in background
  return defaultContent;
}

// Load content asynchronously (called on mount in client components)
export async function loadContent(): Promise<PortfolioContent> {
  if (cachedContent) {
    return cachedContent;
  }

  if (loadPromise) {
    return loadPromise;
  }

  isLoading = true;
  loadPromise = fetchContentFromKV().then((content) => {
    cachedContent = content;
    isLoading = false;
    loadPromise = null;
    return content;
  });

  return loadPromise;
}
