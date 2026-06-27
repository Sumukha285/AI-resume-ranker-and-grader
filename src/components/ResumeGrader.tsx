/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronRight,
  TrendingUp,
  FileText,
  Briefcase,
  Layers,
  Award,
  Zap,
  Target,
  FileSearch,
  Check,
  Plus
} from "lucide-react";
import { ResumeData, GradeResult, GradeItem } from "../types";
import { sampleRoles } from "../data";

interface ResumeGraderProps {
  currentBuilderData: ResumeData;
}

export default function ResumeGrader({ currentBuilderData }: ResumeGraderProps) {
  const [sourceType, setSourceType] = useState<"builder" | "paste">("builder");
  const [pastedText, setPastedText] = useState("");
  const [targetRole, setTargetRole] = useState("Software Engineering Intern");
  const [customRole, setCustomRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "dimensions" | "keywords" | "rewrites">("overview");

  const finalRole = targetRole === "Custom" ? customRole : targetRole;

  const handleGrade = async () => {
    setLoading(true);
    setError(null);

    // If grading builder but there's no contact name, warn
    if (sourceType === "builder" && !currentBuilderData.contact.fullName) {
      setError("Your builder resume is currently empty. Please add at least your contact info or choose 'Paste Existing Resume' instead.");
      setLoading(false);
      return;
    }

    if (sourceType === "paste" && !pastedText.trim()) {
      setError("Please paste your resume text to begin analysis.");
      setLoading(false);
      return;
    }

    try {
      const payload: any = {
        targetRole: finalRole,
        jobDescription: jobDescription.trim() || undefined
      };

      if (sourceType === "builder") {
        payload.resumeData = currentBuilderData;
      } else {
        payload.resumeText = pastedText;
      }

      const response = await fetch("/api/grade-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze resume");
      }

      const data = await response.json();
      setGradeResult(data);
      setActiveTab("overview");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during resume analysis. Check that the server is active.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to color grade score circle
  const getScoreColor = (score: number) => {
    if (score >= 85) return { stroke: "stroke-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50", fill: "fill-emerald-500" };
    if (score >= 70) return { stroke: "stroke-amber-500", text: "text-amber-600", bg: "bg-amber-50", fill: "fill-amber-500" };
    return { stroke: "stroke-rose-500", text: "text-rose-600", bg: "bg-rose-50", fill: "fill-rose-500" };
  };

  return (
    <div className="space-y-6">
      {/* INPUT SETTINGS HEADER */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Configure Grading Goals</h3>
            <p className="text-xs text-slate-500">
              Grade your resume against real recruiter standards for your desired student role.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* SOURCE CHOICE */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Resume Source</label>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-1">
              <button
                onClick={() => setSourceType("builder")}
                className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                  sourceType === "builder" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-500"
                }`}
              >
                Use Active Builder Resume
              </button>
              <button
                onClick={() => setSourceType("paste")}
                className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                  sourceType === "paste" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-500"
                }`}
              >
                Paste Existing Resume (Text)
              </button>
            </div>
          </div>

          {/* TARGET ROLE */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">Target Student Role</label>
            <div className="flex gap-2">
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none transition-all focus:border-indigo-500"
              >
                {sampleRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
                <option value="Custom">Custom Role...</option>
              </select>

              {targetRole === "Custom" && (
                <input
                  type="text"
                  placeholder="e.g. Sales Intern"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-500"
                />
              )}
            </div>
          </div>

          {/* PASTE OPTION BOX */}
          {sourceType === "paste" && (
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-600">Paste Resume Content</label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the full text of your current resume (from PDF or Word)..."
                rows={8}
                className="w-full rounded-xl border border-slate-200 p-4 text-xs text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          )}

          {/* JOB DESCRIPTION (OPTIONAL) */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-600">
                Target Internship / Job Description (Optional)
              </label>
              <span className="text-[10px] text-slate-400">Paste for custom keyword matching</span>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description or internship post requirements here to analyze matching density and missing skills..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 p-3.5 text-xs text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 p-4 text-xs text-rose-700 flex gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleGrade}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-all disabled:bg-slate-200 disabled:text-slate-400"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Scanning Resume & Grading with Gemini ATS Engine...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Grade & Optimize Resume
            </>
          )}
        </button>
      </div>

      {/* DETAILED GRADING REPORT PANEL */}
      {gradeResult && (
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* INTERACTIVE SCORE PANEL HEADER */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-6 flex flex-col md:flex-row gap-6 items-center">
            {/* PROGRESS RING */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="h-28 w-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  className="stroke-slate-100"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  className={`${getScoreColor(gradeResult.overallScore).stroke} transition-all duration-1000 ease-out`}
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - gradeResult.overallScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-slate-800">{gradeResult.overallScore}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">ATS Score</span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-2">
                <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  Target: {finalRole}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Analysis completed against recruiter hiring criteria
                </span>
              </div>
              <h4 className="mt-2 text-md font-semibold text-slate-800">Recruiter Summary</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {gradeResult.summary}
              </p>
            </div>
          </div>

          {/* TAB BAR */}
          <div className="flex border-b border-slate-100 bg-slate-50/50 px-6 overflow-x-auto scrollbar-none">
            {[
              { id: "overview", label: "Priorities", icon: TrendingUp },
              { id: "dimensions", label: "Grading Breakdown", icon: Layers },
              { id: "keywords", label: "Skills & Keywords", icon: FileSearch },
              { id: "rewrites", label: "STAR Bullet Rewrites", icon: Sparkles }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? "border-indigo-600 text-indigo-700 bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB CONTENTS */}
          <div className="p-6">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-indigo-600" />
                    Top Action Items (Fix these to boost score!)
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {gradeResult.actionItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 rounded-xl border border-indigo-50 bg-indigo-50/10 p-4 transition-all hover:bg-indigo-50/20"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                          {index + 1}
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium mt-0.5">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-4 flex gap-3 text-xs text-amber-800">
                  <Info className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">Recruiter Pro-Tip for College Students:</p>
                    <p className="leading-relaxed text-amber-700">
                      Internship recruiters scan resumes in less than 6 seconds. Start every single bullet point with a powerful action verb and include numerical outputs (e.g. "built React dashboard reducing latency by 20%") to stand out immediately.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* DIMENSIONS TAB */}
            {activeTab === "dimensions" && (
              <div className="grid grid-cols-1 gap-4">
                {(Object.values(gradeResult.dimensions) as GradeItem[]).map((dim, index) => {
                  const colors = getScoreColor(dim.score);
                  return (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-100 p-5 transition-all hover:border-slate-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-50 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block h-2 w-2 rounded-full ${colors.bg}`} />
                          <h4 className="font-bold text-slate-800 text-sm">{dim.name}</h4>
                        </div>
                        <span className={`text-xs font-extrabold ${colors.text} bg-slate-50 px-2.5 py-0.5 rounded-full`}>
                          Grade: {dim.score} / {dim.maxScore}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {dim.feedback}
                      </p>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Tailored Action Items:
                        </span>
                        {dim.suggestions.map((sug, i) => (
                          <div key={i} className="flex gap-2 text-xs text-slate-700">
                            <span className="text-indigo-500 mt-0.5">•</span>
                            <span className="leading-relaxed">{sug}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* KEYWORDS MATCH TAB */}
            {activeTab === "keywords" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* MATCHED KEYWORDS */}
                <div className="rounded-xl border border-slate-100 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                    <h4 className="font-bold text-slate-800 text-sm">Matched Keywords ({gradeResult.matchedKeywords.length})</h4>
                  </div>
                  {gradeResult.matchedKeywords.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {gradeResult.matchedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="inline-flex rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100/50"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No matched skills identified yet. Try adding technical keywords in your skills section.</p>
                  )}
                </div>

                {/* MISSING KEYWORDS */}
                <div className="rounded-xl border border-slate-100 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
                    <h4 className="font-bold text-slate-800 text-sm">Absences / Missing Skills ({gradeResult.missingKeywords.length})</h4>
                  </div>
                  {gradeResult.missingKeywords.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {gradeResult.missingKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="inline-flex rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-100/50"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Perfect! Your resume is highly matching current recruiter expectations for this role.</p>
                  )}
                </div>
              </div>
            )}

            {/* STAR REWRITES TAB */}
            {activeTab === "rewrites" && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1.5">Recruiter Bullet Point Transformations</h4>
                  <p className="text-xs text-slate-500">
                    We scanned your bullets, found two weak examples, and rewrote them using the high-impact STAR method:
                  </p>
                </div>

                <div className="space-y-5">
                  {gradeResult.starBulletOptimizations.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 grid grid-cols-1 lg:grid-cols-2 gap-4"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">
                          Original Weak Bullet
                        </span>
                        <div className="rounded-lg border border-rose-100 bg-rose-50/30 p-3 text-xs text-slate-600 line-through leading-relaxed">
                          "{item.original}"
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block flex items-center gap-1">
                          Optimized Recruiter STAR Statement
                        </span>
                        <div className="rounded-lg border border-emerald-100 bg-emerald-50/30 p-3 text-xs text-slate-800 font-semibold leading-relaxed">
                          "{item.suggested}"
                        </div>
                      </div>

                      <div className="lg:col-span-2 text-xs text-slate-500 border-t border-slate-100 pt-3 flex gap-1.5 items-center">
                        <Info className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        <span><strong>Recruiter Logic:</strong> {item.explanation}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
