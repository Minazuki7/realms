import fs from "fs"
import path from "path"

// Types for CMS data
export interface Bio {
  name: string
  title: string
  intro: string
  email: string
  github: string
  linkedin: string
  photo: string
  about: string
  skills: {
    languages: string[]
    frontend: string[]
    backend: string[]
    tools: string[]
  }
}

export interface Project {
  id: string
  title: string
  description: string
  stack: string[]
  link: string
  featured: boolean
}

export interface Settings {
  theme: "light" | "dark"
  defaultMode: "classic" | "fantasy"
  socials: {
    github: string
    linkedin: string
    twitter: string
  }
  contactEmail: string
  siteTitle: string
  siteDescription: string
}

const cmsDir = path.join(process.cwd(), "cms")

/**
 * Read bio data from CMS
 */
export function getBio(): Bio {
  const bioPath = path.join(cmsDir, "bio.json")
  const bioData = fs.readFileSync(bioPath, "utf-8")
  return JSON.parse(bioData) as Bio
}

/**
 * Read all projects from CMS
 */
export function getProjects(): Project[] {
  const projectsPath = path.join(cmsDir, "projects.json")
  const projectsData = fs.readFileSync(projectsPath, "utf-8")
  return JSON.parse(projectsData) as Project[]
}

/**
 * Get featured projects only
 */
export function getFeaturedProjects(): Project[] {
  return getProjects().filter((project) => project.featured)
}

/**
 * Get a single project by ID
 */
export function getProjectById(id: string): Project | undefined {
  return getProjects().find((project) => project.id === id)
}

/**
 * Read settings from CMS
 */
export function getSettings(): Settings {
  const settingsPath = path.join(cmsDir, "settings.json")
  const settingsData = fs.readFileSync(settingsPath, "utf-8")
  return JSON.parse(settingsData) as Settings
}

/**
 * Update bio data (for future CMS admin panel)
 */
export function updateBio(bio: Bio): void {
  const bioPath = path.join(cmsDir, "bio.json")
  fs.writeFileSync(bioPath, JSON.stringify(bio, null, 2), "utf-8")
}

/**
 * Update projects data (for future CMS admin panel)
 */
export function updateProjects(projects: Project[]): void {
  const projectsPath = path.join(cmsDir, "projects.json")
  fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2), "utf-8")
}

/**
 * Update settings data (for future CMS admin panel)
 */
export function updateSettings(settings: Settings): void {
  const settingsPath = path.join(cmsDir, "settings.json")
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf-8")
}
