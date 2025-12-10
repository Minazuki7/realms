"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/kv-types";

interface ProjectsTabProps {
  projectForm: Partial<Project>;
  onFieldChange: (field: string, value: any) => void;
  onAddProject: () => Promise<void> | void;
  projects: Project[];
  onDeleteProject: (id: string) => Promise<void> | void;
  loading: boolean;
}

export default function ProjectsTab({
  projectForm,
  onFieldChange,
  onAddProject,
  projects,
  onDeleteProject,
  loading,
}: ProjectsTabProps) {
  return (
    <div className="space-y-6">
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
              onChange={(e) => onFieldChange("id", e.target.value)}
            />
            <Input
              placeholder="Project Title"
              value={projectForm.title || ""}
              onChange={(e) => onFieldChange("title", e.target.value)}
            />
          </div>

          <Textarea
            placeholder="Description"
            value={projectForm.description || ""}
            onChange={(e) => onFieldChange("description", e.target.value)}
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
              onFieldChange(
                "stack",
                e.target.value.split(",").map((s) => s.trim())
              )
            }
          />

          <Input
            placeholder="Project Link"
            value={projectForm.link || ""}
            onChange={(e) => onFieldChange("link", e.target.value)}
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={projectForm.featured || false}
              onChange={(e) => onFieldChange("featured", e.target.checked)}
              className="w-4 h-4"
            />
            <span>Featured</span>
          </label>

          <Button onClick={onAddProject} disabled={loading}>
            {loading ? "Adding..." : "Add Project"}
          </Button>
        </CardContent>
      </Card>

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
                      onClick={() => onDeleteProject(project.id)}
                      variant="destructive"
                      size="sm"
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
  );
}
