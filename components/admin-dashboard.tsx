"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Bio, Project, Settings } from "@/lib/kv-types";
import { useRouter } from "next/navigation";

interface AdminDashboardProps {
  apiKey: string;
}

export function AdminDashboard({ apiKey }: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("bio");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Bio state
  const [bio, setBio] = useState<Bio | null>(null);
  const [bioForm, setBioForm] = useState<Partial<Bio>>({});

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    id: "",
    title: "",
    description: "",
    stack: [],
    link: "",
    featured: false,
  });

  // Settings state
  const [settings, setSettings] = useState<Settings | null>(null);
  const [settingsForm, setSettingsForm] = useState<Partial<Settings>>({});

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [bioRes, projectsRes, settingsRes] = await Promise.all([
        fetch("/api/cms/bio"),
        fetch("/api/cms/projects"),
        fetch("/api/cms/settings"),
      ]);

      if (bioRes.ok) {
        const bioData = await bioRes.json();
        setBio(bioData);
        setBioForm(bioData);
      }

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData);
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
        setSettingsForm(settingsData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      showMessage("error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // BIO HANDLERS
  const handleBioChange = (field: string, value: any) => {
    setBioForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBioSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cms/bio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(bioForm),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update bio");
      }

      const updated = await res.json();
      setBio(updated);
      showMessage("success", "Bio updated successfully");
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Failed to update bio"
      );
    } finally {
      setLoading(false);
    }
  };

  // PROJECTS HANDLERS
  const handleProjectFieldChange = (field: string, value: any) => {
    setProjectForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddProject = async () => {
    try {
      if (!projectForm.id || !projectForm.title) {
        showMessage("error", "ID and Title are required");
        return;
      }

      setLoading(true);
      const res = await fetch("/api/cms/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(projectForm),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add project");
      }

      const updated = await res.json();
      setProjects(updated);
      setProjectForm({
        id: "",
        title: "",
        description: "",
        stack: [],
        link: "",
        featured: false,
      });
      showMessage("success", "Project added successfully");
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Failed to add project"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/cms/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete project");
      }

      setProjects((prev) => prev.filter((p) => p.id !== id));
      showMessage("success", "Project deleted successfully");
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Failed to delete project"
      );
    } finally {
      setLoading(false);
    }
  };

  // SETTINGS HANDLERS
  const handleSettingsChange = (field: string, value: any) => {
    setSettingsForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSettingsSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cms/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(settingsForm),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update settings");
      }

      const updated = await res.json();
      setSettings(updated);
      showMessage("success", "Settings updated successfully");
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Failed to update settings"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("cms-api-key");
    router.push("/admin");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">CMS Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      {message && (
        <Alert
          className={`mb-4 ${
            message.type === "error" ? "bg-red-50" : "bg-green-50"
          }`}
        >
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bio">Bio</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* BIO TAB */}
        <TabsContent value="bio">
          <Card>
            <CardHeader>
              <CardTitle>Edit Bio</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Name"
                  value={bioForm.name || ""}
                  onChange={(e) => handleBioChange("name", e.target.value)}
                />
                <Input
                  placeholder="Title"
                  value={bioForm.title || ""}
                  onChange={(e) => handleBioChange("title", e.target.value)}
                />
              </div>

              <Input
                placeholder="Intro"
                value={bioForm.intro || ""}
                onChange={(e) => handleBioChange("intro", e.target.value)}
              />

              <Textarea
                placeholder="About"
                value={bioForm.about || ""}
                onChange={(e) => handleBioChange("about", e.target.value)}
                rows={4}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Email"
                  value={bioForm.email || ""}
                  onChange={(e) => handleBioChange("email", e.target.value)}
                />
                <Input
                  placeholder="Photo URL"
                  value={bioForm.photo || ""}
                  onChange={(e) => handleBioChange("photo", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="GitHub URL"
                  value={bioForm.github || ""}
                  onChange={(e) => handleBioChange("github", e.target.value)}
                />
                <Input
                  placeholder="LinkedIn URL"
                  value={bioForm.linkedin || ""}
                  onChange={(e) => handleBioChange("linkedin", e.target.value)}
                />
                <Input
                  placeholder="Twitter URL"
                  value={bioForm.twitter || ""}
                  onChange={(e) => handleBioChange("twitter", e.target.value)}
                />
              </div>

              <Button onClick={handleBioSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save Bio"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROJECTS TAB */}
        <TabsContent value="projects">
          <div className="space-y-6">
            {/* Add New Project */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Project</CardTitle>
                <CardDescription>Create a new project entry</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Project ID (e.g., project-001)"
                    value={projectForm.id || ""}
                    onChange={(e) =>
                      handleProjectFieldChange("id", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Project Title"
                    value={projectForm.title || ""}
                    onChange={(e) =>
                      handleProjectFieldChange("title", e.target.value)
                    }
                  />
                </div>

                <Textarea
                  placeholder="Description"
                  value={projectForm.description || ""}
                  onChange={(e) =>
                    handleProjectFieldChange("description", e.target.value)
                  }
                  rows={3}
                />

                <Input
                  placeholder="Stack (comma separated: React, Next.js, TailwindCSS)"
                  value={
                    Array.isArray(projectForm.stack)
                      ? projectForm.stack.join(", ")
                      : ""
                  }
                  onChange={(e) =>
                    handleProjectFieldChange(
                      "stack",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                />

                <Input
                  placeholder="Project Link"
                  value={projectForm.link || ""}
                  onChange={(e) =>
                    handleProjectFieldChange("link", e.target.value)
                  }
                />

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={projectForm.featured || false}
                    onChange={(e) =>
                      handleProjectFieldChange("featured", e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                  <span>Featured</span>
                </label>

                <Button onClick={handleAddProject} disabled={loading}>
                  {loading ? "Adding..." : "Add Project"}
                </Button>
              </CardContent>
            </Card>

            {/* Projects List */}
            <Card>
              <CardHeader>
                <CardTitle>Projects ({projects.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="p-4 border rounded-lg space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{project.title}</h3>
                            <p className="text-sm text-gray-600">
                              {project.description}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleDeleteProject(project.id)}
                            variant="destructive"
                            size="sm"
                            disabled={loading}
                          >
                            Delete
                          </Button>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {project.stack?.map((tech) => (
                            <Badge key={tech} variant="outline">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        {project.featured && <Badge>Featured</Badge>}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SETTINGS TAB */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Edit Settings</CardTitle>
              <CardDescription>Configure site-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Site Title
                  </label>
                  <Input
                    value={settingsForm.siteTitle || ""}
                    onChange={(e) =>
                      handleSettingsChange("siteTitle", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Default Mode
                  </label>
                  <select
                    value={settingsForm.defaultMode || "classic"}
                    onChange={(e) =>
                      handleSettingsChange("defaultMode", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="classic">Classic</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="portal">Portal</option>
                  </select>
                </div>
              </div>

              <Textarea
                placeholder="Site Description"
                value={settingsForm.siteDescription || ""}
                onChange={(e) =>
                  handleSettingsChange("siteDescription", e.target.value)
                }
                rows={3}
              />

              <div className="space-y-3">
                <h3 className="font-semibold">Social Links</h3>
                <Input
                  placeholder="GitHub URL"
                  value={settingsForm.socials?.github || ""}
                  onChange={(e) =>
                    handleSettingsChange("socials", {
                      ...settingsForm.socials,
                      github: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="LinkedIn URL"
                  value={settingsForm.socials?.linkedin || ""}
                  onChange={(e) =>
                    handleSettingsChange("socials", {
                      ...settingsForm.socials,
                      linkedin: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Twitter URL"
                  value={settingsForm.socials?.twitter || ""}
                  onChange={(e) =>
                    handleSettingsChange("socials", {
                      ...settingsForm.socials,
                      twitter: e.target.value,
                    })
                  }
                />
              </div>

              <Input
                placeholder="Contact Email"
                value={settingsForm.contactEmail || ""}
                onChange={(e) =>
                  handleSettingsChange("contactEmail", e.target.value)
                }
              />

              <Button onClick={handleSettingsSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
