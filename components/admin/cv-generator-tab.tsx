"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CVGeneratorProps {
  jobPosting: string;
  setJobPosting: (v: string) => void;
  documentType: DocumentType;
  setDocumentType: (v: DocumentType) => void;
  generating: boolean;
  onGenerateFast: () => Promise<void> | void;
  onGenerateSlow: () => Promise<void> | void;
  generatedCV: string;
  generatedCoverLetter: string;
  clearCV: () => void;
  clearCoverLetter: () => void;
}

type DocumentType = "both" | "cv" | "cover-letter";

export default function CVGeneratorTab({
  jobPosting,
  setJobPosting,
  documentType,
  setDocumentType,
  generating,
  onGenerateFast,
  onGenerateSlow,
  generatedCV,
  generatedCoverLetter,
  clearCV,
  clearCoverLetter,
}: CVGeneratorProps) {
  const canGenerate = jobPosting.trim() !== "" && documentType !== null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate CV & Cover Letter</CardTitle>
          <CardDescription>
            Paste a job posting below to generate tailored documents based on
            your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Document Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              What to Generate
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as DocumentType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background"
            >
              <option value="both">Both CV and Cover Letter</option>
              <option value="cv">CV Only</option>
              <option value="cover-letter">Cover Letter Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Job Posting
            </label>
            <Textarea
              placeholder="Paste the job posting here..."
              value={jobPosting}
              onChange={(e) => setJobPosting(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onGenerateFast}
              disabled={generating || !canGenerate}
              variant="default"
              size="lg"
              className="flex-1"
            >
              {generating ? "Generating..." : "⚡ Fast Generate (3B Model)"}
            </Button>
            <Button
              onClick={onGenerateSlow}
              disabled={generating || !canGenerate}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              {generating ? "Generating..." : "🎯 Quality Generate (8B Model)"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            ⚡ Fast: ~30-40 seconds • 🎯 Quality: ~1-2 minutes (better results)
          </p>
        </CardContent>
      </Card>

      {generatedCV && (
        <Card>
          <CardHeader>
            <CardTitle>Generated CV</CardTitle>
            <CardDescription>
              Your tailored CV based on the job posting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full h-[400px]">
              <div
                className="cv-preview p-8 bg-white text-black rounded-md"
                dangerouslySetInnerHTML={{ __html: generatedCV }}
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  fontSize: "11pt",
                  lineHeight: "1.4",
                  color: "#000",
                }}
              />
              <style jsx global>{`
                .cv-preview h1 {
                  font-size: 20pt;
                  font-weight: bold;
                  margin: 0 0 5px 0;
                  color: #000;
                }
                .cv-preview h2 {
                  font-size: 12pt;
                  font-weight: bold;
                  margin: 15px 0 8px 0;
                  text-transform: uppercase;
                  border-bottom: 1px solid #333;
                  padding-bottom: 3px;
                  color: #000;
                }
                .cv-preview .contact-info {
                  font-size: 10pt;
                  margin-bottom: 15px;
                  color: #333;
                }
                .cv-preview ul {
                  margin: 5px 0 10px 20px;
                  padding: 0;
                  list-style: none;
                }
                .cv-preview li {
                  margin: 3px 0;
                  padding-left: 0;
                }
                .cv-preview .date-range {
                  font-weight: bold;
                  color: #000;
                }
                .cv-preview .company {
                  font-weight: bold;
                  margin-left: 10px;
                  color: #000;
                }
                .cv-preview .location {
                  font-size: 10pt;
                  color: #555;
                  margin: 2px 0;
                }
                .cv-preview .job-title {
                  font-weight: bold;
                  margin: 3px 0 5px 0;
                  color: #000;
                }
                .cv-preview .experience-item {
                  margin-bottom: 15px;
                }
                .cv-preview .skills-grid {
                  line-height: 1.6;
                }
                .cv-preview strong {
                  font-weight: bold;
                  color: #000;
                }
                .cv-preview p {
                  margin: 5px 0 10px 0;
                }
              `}</style>
            </ScrollArea>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(generatedCV)}
              >
                📋 Copy HTML
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const printWindow = window.open("", "_blank");
                  if (printWindow) {
                    printWindow.document.write(`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>CV - Print</title>
                          <meta charset="UTF-8">
                          <style>
                            @page { margin: 0.75in; }
                            body { 
                              font-family: Arial, Helvetica, sans-serif; 
                              font-size: 11pt;
                              line-height: 1.4;
                              color: #000;
                              max-width: 8.5in;
                              margin: 0 auto;
                            }
                            h1 { 
                              font-size: 20pt; 
                              font-weight: bold; 
                              margin: 0 0 5px 0; 
                            }
                            h2 { 
                              font-size: 12pt; 
                              font-weight: bold; 
                              margin: 15px 0 8px 0; 
                              text-transform: uppercase;
                              border-bottom: 1px solid #333;
                              padding-bottom: 3px;
                            }
                            .contact-info { 
                              font-size: 10pt; 
                              margin-bottom: 15px; 
                              color: #333; 
                            }
                            ul { 
                              margin: 5px 0 10px 20px; 
                              padding: 0; 
                              list-style: none; 
                            }
                            li { 
                              margin: 3px 0; 
                              padding-left: 0; 
                            }
                            .date-range { font-weight: bold; }
                            .company { font-weight: bold; margin-left: 10px; }
                            .location { font-size: 10pt; color: #555; margin: 2px 0; }
                            .job-title { font-weight: bold; margin: 3px 0 5px 0; }
                            .experience-item { margin-bottom: 15px; }
                            .skills-grid { line-height: 1.6; }
                            strong { font-weight: bold; }
                            p { margin: 5px 0 10px 0; }
                            @media print { 
                              body { margin: 0; padding: 0.5in; }
                              h2 { page-break-after: avoid; }
                              .experience-item { page-break-inside: avoid; }
                            }
                          </style>
                        </head>
                        <body>${generatedCV}</body>
                      </html>
                    `);
                    printWindow.document.close();
                    printWindow.print();
                  }
                }}
              >
                🖨️ Print/PDF
              </Button>
              <Button variant="outline" onClick={clearCV}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {generatedCoverLetter && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Cover Letter</CardTitle>
            <CardDescription>
              Your tailored cover letter based on the job posting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full h-[400px]">
              <div
                className="cover-letter-preview p-6 bg-white text-black rounded-md"
                dangerouslySetInnerHTML={{ __html: generatedCoverLetter }}
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "14px",
                  lineHeight: "1.8",
                }}
              />
            </ScrollArea>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  navigator.clipboard.writeText(generatedCoverLetter)
                }
              >
                📋 Copy HTML
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const printWindow = window.open("", "_blank");
                  if (printWindow) {
                    printWindow.document.write(`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>Cover Letter - Print</title>
                          <style>
                            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.8; }
                            p { margin-bottom: 15px; }
                            @media print { body { margin: 20px; } }
                          </style>
                        </head>
                        <body>${generatedCoverLetter}</body>
                      </html>
                    `);
                    printWindow.document.close();
                    printWindow.print();
                  }
                }}
              >
                🖨️ Print/PDF
              </Button>
              <Button variant="outline" onClick={clearCoverLetter}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
