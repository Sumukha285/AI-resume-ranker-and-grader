/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Sparkles,
  FileText,
  Layers,
  FileSearch,
  BookOpen,
  FolderLock,
  BookmarkCheck,
  Award,
  ExternalLink,
  Github,
  Zap,
  RotateCcw
} from "lucide-react";
import { ResumeData } from "./types";
import { emptyResume, sampleStudentResume } from "./data";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import ResumeGrader from "./components/ResumeGrader";
import BulletOptimizer from "./components/BulletOptimizer";

export default function App() {
  const [activeTab, setActiveTab] = useState<"builder" | "grader" | "playpen">("builder");
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResume);
  const [showWelcome, setShowWelcome] = useState(true);

  // Load draft from LocalStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("ai_student_resume_draft");
    if (savedDraft) {
      try {
        setResumeData(JSON.parse(savedDraft));
        setShowWelcome(false);
      } catch (err) {
        console.error("Failed to parse saved resume draft:", err);
      }
    } else {
      // Default to sample on first visit to guide the student
      setResumeData(sampleStudentResume);
    }
  }, []);

  // Persist draft on changes
  const handleResumeChange = (newData: ResumeData) => {
    setResumeData(newData);
    localStorage.setItem("ai_student_resume_draft", JSON.stringify(newData));
  };

  const handleResetToEmpty = () => {
    if (window.confirm("Are you sure you want to clear all fields? This will delete your current draft.")) {
      handleResumeChange(emptyResume);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* GLOBAL BANNER */}
      <header className="sticky top-0 z-40 bg-white/80 border-b border-slate-100 backdrop-blur-md no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* BRAND */}
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg block leading-none">
                  AI Resume Studio
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-0.5 block">
                  Built for College Students
                </span>
              </div>
            </div>

            {/* TAB SELECTOR */}
            <nav className="flex items-center gap-1 sm:gap-2">
              {[
                { id: "builder", label: "Build & Export", icon: FileText },
                { id: "grader", label: "ATS Grader & Advisor", icon: Layers },
                { id: "playpen", label: "STAR Bullet Playpen", icon: Zap }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* CORE WRAPPER */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* WELCOME ANNOUNCEMENT */}
        {showWelcome && activeTab === "builder" && (
          <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between no-print">
            <div className="space-y-1">
              <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                <BookmarkCheck className="h-4 w-4 text-indigo-600" />
                Loaded Professional Student Sample
              </h4>
              <p className="text-xs text-indigo-700 leading-relaxed max-w-3xl">
                We've auto-populated standard, recruiter-approved coursework, projects, and experiences of a typical computer science candidate. Feel free to overwrite with your details or clear fields!
              </p>
            </div>
            <button
              onClick={() => setShowWelcome(false)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-white border border-indigo-100 rounded-xl px-3.5 py-1.5 shrink-0"
            >
              Got it
            </button>
          </div>
        )}

        {/* 1. BUILDER TAB */}
        {activeTab === "builder" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* BUILDER SIDEBAR FORM */}
            <div className="lg:col-span-6 h-full flex flex-col gap-6">
              <ResumeForm
                resumeData={resumeData}
                onChange={handleResumeChange}
                onPreview={() => {
                  const node = document.getElementById("resume-printable-area");
                  if (node) {
                    node.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              />
            </div>

            {/* LIVE PREVIEW RENDERER */}
            <div className="lg:col-span-6 lg:sticky lg:top-24 h-full">
              <ResumePreview resumeData={resumeData} />
            </div>
          </div>
        )}

        {/* 2. GRADER TAB */}
        {activeTab === "grader" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Resume Grader</h1>
              <p className="text-xs text-slate-500 mt-1">
                Evaluate your resume against top tech and business ATS (Applicant Tracking Systems) to see what is missing.
              </p>
            </div>
            <ResumeGrader currentBuilderData={resumeData} />
          </div>
        )}

        {/* 3. PLAYPEN TAB */}
        {activeTab === "playpen" && (
          <div className="max-w-xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">STAR Bullet Playpen</h1>
              <p className="text-xs text-slate-500 mt-1">
                A sandbox playpen to isolate and rewrite a single achievement. Craft strong action-based sentences before pasting into your document.
              </p>
            </div>
            <BulletOptimizer
              initialRole="Software Engineering Intern"
              embedded={false}
            />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400 font-medium">
          <p>© 2026 AI Student Resume Studio. Designed specifically for university students, interns, and co-ops.</p>
          <p className="mt-1 flex justify-center gap-1.5 text-slate-400/80">
            <span>Keep secrets secure on server</span>
            <span>•</span>
            <span>No data shared externally without consent</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

