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
import type { Settings } from "@/lib/kv-types";

interface SettingsTabProps {
  settingsForm: Partial<Settings>;
  onChange: (field: string, value: any) => void;
  onSubmit: () => Promise<void> | void;
  loading: boolean;
}

export default function SettingsTab({
  settingsForm,
  onChange,
  onSubmit,
  loading,
}: SettingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Settings</CardTitle>
        <CardDescription>Configure site-wide settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Site Title</label>
            <Input
              value={settingsForm.siteTitle || ""}
              onChange={(e) => onChange("siteTitle", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Default Mode
            </label>
            <select
              value={settingsForm.defaultMode || "classic"}
              onChange={(e) => onChange("defaultMode", e.target.value)}
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
          onChange={(e) => onChange("siteDescription", e.target.value)}
          rows={3}
        />

        <div className="space-y-3">
          <h3 className="font-semibold">Social Links</h3>
          <Input
            placeholder="GitHub URL"
            value={settingsForm.socials?.github || ""}
            onChange={(e) =>
              onChange("socials", {
                ...settingsForm.socials,
                github: e.target.value,
              })
            }
          />
          <Input
            placeholder="LinkedIn URL"
            value={settingsForm.socials?.linkedin || ""}
            onChange={(e) =>
              onChange("socials", {
                ...settingsForm.socials,
                linkedin: e.target.value,
              })
            }
          />
          <Input
            placeholder="Twitter URL"
            value={settingsForm.socials?.twitter || ""}
            onChange={(e) =>
              onChange("socials", {
                ...settingsForm.socials,
                twitter: e.target.value,
              })
            }
          />
        </div>

        <Input
          placeholder="Contact Email"
          value={settingsForm.contactEmail || ""}
          onChange={(e) => onChange("contactEmail", e.target.value)}
        />

        <Button onClick={onSubmit} disabled={loading} variant="default">
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
