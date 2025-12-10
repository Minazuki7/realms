"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import BioTab from "@/components/admin/bio-tab";
import ProjectsTab from "@/components/admin/projects-tab";
import SettingsTab from "@/components/admin/settings-tab";
import CVGeneratorTab from "@/components/admin/cv-generator-tab";
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

  // CV Generator state
  const [jobPosting, setJobPosting] = useState("");
  const [documentType, setDocumentType] = useState<
    "both" | "cv" | "cover-letter"
  >("both");
  const [generatedCV, setGeneratedCV] = useState("");
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");
  const [generating, setGenerating] = useState(false);

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

  // CV GENERATOR HANDLERS
  const handleGenerateCV = async (mode: "fast" | "slow") => {
    try {
      if (!jobPosting.trim()) {
        showMessage("error", "Please paste a job posting");
        return;
      }

      setGenerating(true);

      const res = await fetch("/api/cms/generate-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          jobPosting,
          model: mode,
          documentType,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to generate documents");
      }

      const result = await res.json();

      // Only set CV if it was generated
      if (result.cv) {
        setGeneratedCV(result.cv);
      }

      // Only set cover letter if it was generated
      if (result.coverLetter) {
        setGeneratedCoverLetter(result.coverLetter);
      }

      const generatedDocs = [];
      if (result.cv) generatedDocs.push("CV");
      if (result.coverLetter) generatedDocs.push("Cover Letter");

      showMessage(
        "success",
        `${generatedDocs.join(" and ")} generated successfully`
      );
    } catch (error) {
      showMessage(
        "error",
        error instanceof Error ? error.message : "Failed to generate documents"
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-card">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">CMS Admin Dashboard</h1>
        {/* Top-right logout */}
        <Button onClick={handleLogout} variant="secondary">
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bio">Bio</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="cv-generator">CV Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="bio">
          <BioTab
            bioForm={bioForm}
            onChange={handleBioChange}
            onSubmit={handleBioSubmit}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsTab
            projectForm={projectForm}
            onFieldChange={handleProjectFieldChange}
            onAddProject={handleAddProject}
            projects={projects}
            onDeleteProject={handleDeleteProject}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab
            settingsForm={settingsForm}
            onChange={handleSettingsChange}
            onSubmit={handleSettingsSubmit}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="cv-generator">
          <CVGeneratorTab
            jobPosting={jobPosting}
            setJobPosting={setJobPosting}
            documentType={documentType}
            setDocumentType={setDocumentType}
            generating={generating}
            onGenerateFast={() => handleGenerateCV("fast")}
            onGenerateSlow={() => handleGenerateCV("slow")}
            generatedCV={generatedCV}
            generatedCoverLetter={generatedCoverLetter}
            clearCV={() => setGeneratedCV("")}
            clearCoverLetter={() => setGeneratedCoverLetter("")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
