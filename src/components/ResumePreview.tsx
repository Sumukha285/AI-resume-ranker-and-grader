/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Printer, Download, Layout, Type as FontIcon, AlignJustify, Palette, Info } from "lucide-react";
import { ResumeData, TemplateType } from "../types";
import { generateResumePDF } from "../utils/pdfGenerator";

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export default function ResumePreview({ resumeData }: ResumePreviewProps) {
  const [template, setTemplate] = useState<TemplateType>("minimalist");
  const [accentColor, setAccentColor] = useState<string>("indigo"); // indigo, emerald, slate, blue, amber
  const [spacing, setSpacing] = useState<"compact" | "normal" | "relaxed">("normal");

  const colors: Record<string, { text: string; bg: string; border: string; accent: string }> = {
    indigo: { text: "text-indigo-600", bg: "bg-indigo-600", border: "border-indigo-600", accent: "#4f46e5" },
    emerald: { text: "text-emerald-600", bg: "bg-emerald-600", border: "border-emerald-600", accent: "#059669" },
    slate: { text: "text-slate-800", bg: "bg-slate-800", border: "border-slate-800", accent: "#1e293b" },
    blue: { text: "text-blue-600", bg: "bg-blue-600", border: "border-blue-600", accent: "#2563eb" },
    amber: { text: "text-amber-700", bg: "bg-amber-700", border: "border-amber-700", accent: "#b45309" }
  };

  const spacingClasses = {
    compact: "space-y-2.5",
    normal: "space-y-4",
    relaxed: "space-y-6"
  };

  const itemSpacingClasses = {
    compact: "space-y-1",
    normal: "space-y-2",
    relaxed: "space-y-3.5"
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    generateResumePDF(resumeData, { template, accentColor });
  };

  const activeColor = colors[accentColor] || colors.indigo;

  return (
    <div className="space-y-6">
      {/* PREVIEW CONTROLS */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center no-print">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* TEMPLATE */}
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Template Vibe
            </label>
            <div className="flex rounded-xl bg-slate-50 p-1">
              {(["minimalist", "technical", "academic"] as TemplateType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                    template === t
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* ACCENT COLOR */}
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Accent Color
            </label>
            <div className="flex gap-1.5 p-1 bg-slate-50 rounded-xl">
              {Object.keys(colors).map((c) => (
                <button
                  key={c}
                  onClick={() => setAccentColor(c)}
                  className={`h-5 w-5 rounded-full border transition-all ${
                    accentColor === c ? "ring-2 ring-offset-1 ring-indigo-500 scale-110" : ""
                  }`}
                  style={{ backgroundColor: colors[c].accent, borderColor: "rgba(0,0,0,0.1)" }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* SPACING */}
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Spacing / Density
            </label>
            <div className="flex rounded-xl bg-slate-50 p-1">
              {(["compact", "normal", "relaxed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpacing(s)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                    spacing === s
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PRINT / EXPORT ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={handleDownloadPDF}
            className="flex flex-1 md:flex-initial items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 shadow-sm"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
          
          <button
            onClick={handlePrint}
            className="flex flex-1 md:flex-initial items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 shadow-sm"
          >
            <Printer className="h-4 w-4" />
            Print / System PDF
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-indigo-50/50 border border-indigo-100 p-4 flex gap-3 text-xs text-indigo-800 no-print">
        <Info className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Recruiter Recommended PDF Formats:</p>
          <div className="mt-1 space-y-1 text-indigo-700/90 leading-relaxed">
            <p>
              • <strong>Download PDF (Instant)</strong>: Generates an immediate ATS-friendly PDF with 100% selectable text, perfect for recruiter scanning software.
            </p>
            <p>
              • <strong>Print / System PDF</strong>: Launches your standard browser print dialogue. Set destination to "Save as PDF", enable background graphics, and set margins to "Default" for exact visual matches.
            </p>
          </div>
        </div>
      </div>

      {/* RENDERED RESUME CONTAINER */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50 p-4 md:p-8 no-print">
        <div
          id="resume-printable-area"
          className={`printable-resume-node mx-auto w-full max-w-[800px] bg-white p-8 md:p-12 shadow-md rounded-xl transition-all duration-300 ${
            template === "academic" ? "font-serif" : template === "technical" ? "font-mono text-[13px]" : "font-sans"
          }`}
          style={{ minHeight: "1050px" }}
        >
          {/* RESUME RENDER */}
          <div className={spacingClasses[spacing]}>
            {/* 1. CONTACT HEADER */}
            <div className="text-center border-b border-slate-200 pb-4">
              <h1 className={`text-2xl md:text-3xl font-bold tracking-tight text-slate-900 ${template === "academic" ? "italic font-normal" : ""}`}>
                {resumeData.contact.fullName || "Your Full Name"}
              </h1>
              <div className="mt-2.5 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600">
                {resumeData.contact.email && (
                  <span className="hover:underline">{resumeData.contact.email}</span>
                )}
                {resumeData.contact.phone && <span>{resumeData.contact.phone}</span>}
                {resumeData.contact.location && <span>{resumeData.contact.location}</span>}
              </div>
              <div className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
                {resumeData.contact.linkedin && (
                  <span className="hover:underline">LinkedIn: {resumeData.contact.linkedin}</span>
                )}
                {resumeData.contact.github && (
                  <span className="hover:underline">GitHub: {resumeData.contact.github}</span>
                )}
                {resumeData.contact.portfolio && (
                  <span className="hover:underline">Portfolio: {resumeData.contact.portfolio}</span>
                )}
              </div>
            </div>

            {/* 2. EDUCATION SECTION */}
            {resumeData.education.length > 0 && (
              <div className="space-y-2">
                <h2 className={`text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 ${
                  template === "academic" ? "border-b border-slate-200 pb-1" : ""
                }`}>
                  <span className={`h-2 w-2 rounded-full ${activeColor.bg} no-print`} />
                  Education
                </h2>
                <div className={itemSpacingClasses[spacing]}>
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{edu.institution || "Institution Name"}</h3>
                        <p className="text-xs text-slate-700 font-medium mt-0.5">
                          {edu.degree || "Degree"} in {edu.major || "Major"}
                          {edu.gpa ? ` (GPA: ${edu.gpa})` : ""}
                        </p>
                        {edu.coursework && (
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                            <strong className="text-slate-600">Relevant Coursework:</strong> {edu.coursework}
                          </p>
                        )}
                      </div>
                      <div className="sm:text-right shrink-0">
                        <span className="text-xs font-semibold text-slate-600">{edu.graduationDate || "Graduation Year"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. EXPERIENCE SECTION */}
            {resumeData.experience.length > 0 && (
              <div className="space-y-2">
                <h2 className={`text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 ${
                  template === "academic" ? "border-b border-slate-200 pb-1" : ""
                }`}>
                  <span className={`h-2 w-2 rounded-full ${activeColor.bg} no-print`} />
                  Professional Experience
                </h2>
                <div className={itemSpacingClasses[spacing]}>
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">
                            {exp.role || "Role"} <span className="font-normal text-slate-400">|</span> <span className={`${activeColor.text} font-semibold`}>{exp.company || "Company"}</span>
                          </h3>
                        </div>
                        <div className="sm:text-right shrink-0 flex gap-1.5 text-xs font-semibold text-slate-600">
                          <span>{exp.location}</span>
                          <span className="text-slate-300">|</span>
                          <span>{exp.startDate} – {exp.endDate || "Present"}</span>
                        </div>
                      </div>
                      <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1 leading-relaxed">
                        {exp.bullets.map((b, i) => b.trim() && (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. PROJECTS SECTION */}
            {resumeData.projects.length > 0 && (
              <div className="space-y-2">
                <h2 className={`text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 ${
                  template === "academic" ? "border-b border-slate-200 pb-1" : ""
                }`}>
                  <span className={`h-2 w-2 rounded-full ${activeColor.bg} no-print`} />
                  Technical Projects
                </h2>
                <div className={itemSpacingClasses[spacing]}>
                  {resumeData.projects.map((proj) => (
                    <div key={proj.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">
                            {proj.title || "Project Title"}
                            {proj.technologies && (
                              <span className="ml-2 text-[11px] font-normal text-slate-500">
                                ({proj.technologies})
                              </span>
                            )}
                          </h3>
                          {proj.role && (
                            <p className="text-[11px] text-slate-500 font-medium italic mt-0.5">
                              {proj.role}
                            </p>
                          )}
                        </div>
                      </div>
                      <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1 leading-relaxed">
                        {proj.bullets.map((b, i) => b.trim() && (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. EXTRACURRICULARS SECTION */}
            {resumeData.extracurriculars.length > 0 && (
              <div className="space-y-2">
                <h2 className={`text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 ${
                  template === "academic" ? "border-b border-slate-200 pb-1" : ""
                }`}>
                  <span className={`h-2 w-2 rounded-full ${activeColor.bg} no-print`} />
                  Leadership & Extracurricular Activities
                </h2>
                <div className={itemSpacingClasses[spacing]}>
                  {resumeData.extracurriculars.map((ec) => (
                    <div key={ec.id} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">
                            {ec.role || "Role"} <span className="font-normal text-slate-300">|</span> <span className="text-slate-800 font-semibold">{ec.organization || "Organization"}</span>
                          </h3>
                        </div>
                        <div className="sm:text-right shrink-0 text-xs font-semibold text-slate-600">
                          <span>{ec.startDate} – {ec.endDate || "Present"}</span>
                        </div>
                      </div>
                      <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1 leading-relaxed">
                        {ec.bullets.map((b, i) => b.trim() && (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. SKILLS SECTION */}
            {(resumeData.skills.languages || resumeData.skills.frameworks || resumeData.skills.tools) && (
              <div className="space-y-2">
                <h2 className={`text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 ${
                  template === "academic" ? "border-b border-slate-200 pb-1" : ""
                }`}>
                  <span className={`h-2 w-2 rounded-full ${activeColor.bg} no-print`} />
                  Skills Directory
                </h2>
                <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
                  {resumeData.skills.languages && (
                    <p>
                      <strong className="text-slate-800 text-sm inline-block w-24">Languages:</strong>{" "}
                      {resumeData.skills.languages}
                    </p>
                  )}
                  {resumeData.skills.frameworks && (
                    <p>
                      <strong className="text-slate-800 text-sm inline-block w-24">Frameworks:</strong>{" "}
                      {resumeData.skills.frameworks}
                    </p>
                  )}
                  {resumeData.skills.tools && (
                    <p>
                      <strong className="text-slate-800 text-sm inline-block w-24">Tools:</strong>{" "}
                      {resumeData.skills.tools}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 7. ACHIEVEMENTS SECTION */}
            {resumeData.achievements.length > 0 && (
              <div className="space-y-2">
                <h2 className={`text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 ${
                  template === "academic" ? "border-b border-slate-200 pb-1" : ""
                }`}>
                  <span className={`h-2 w-2 rounded-full ${activeColor.bg} no-print`} />
                  Honors & Accomplishments
                </h2>
                <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1 leading-relaxed">
                  {resumeData.achievements.map((ach, i) => ach.trim() && (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
