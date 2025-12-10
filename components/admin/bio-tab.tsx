"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Bio } from "@/lib/kv-types";

interface BioTabProps {
  bioForm: Partial<Bio>;
  onChange: (field: string, value: any) => void;
  onSubmit: () => Promise<void> | void;
  loading: boolean;
}

export default function BioTab({
  bioForm,
  onChange,
  onSubmit,
  loading,
}: BioTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Bio</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Name"
            value={bioForm.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
          />
          <Input
            placeholder="Title"
            value={bioForm.title || ""}
            onChange={(e) => onChange("title", e.target.value)}
          />
        </div>

        <Input
          placeholder="Intro"
          value={bioForm.intro || ""}
          onChange={(e) => onChange("intro", e.target.value)}
        />

        <Textarea
          placeholder="About"
          value={bioForm.about || ""}
          onChange={(e) => onChange("about", e.target.value)}
          rows={4}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Email"
            value={bioForm.email || ""}
            onChange={(e) => onChange("email", e.target.value)}
          />
          <Input
            placeholder="Photo URL"
            value={bioForm.photo || ""}
            onChange={(e) => onChange("photo", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="GitHub URL"
            value={bioForm.github || ""}
            onChange={(e) => onChange("github", e.target.value)}
          />
          <Input
            placeholder="LinkedIn URL"
            value={bioForm.linkedin || ""}
            onChange={(e) => onChange("linkedin", e.target.value)}
          />
          <Input
            placeholder="Twitter URL"
            value={bioForm.twitter || ""}
            onChange={(e) => onChange("twitter", e.target.value)}
          />
        </div>

        <Button onClick={onSubmit} disabled={loading} variant="default">
          {loading ? "Saving..." : "Save Bio"}
        </Button>
      </CardContent>
    </Card>
  );
}
