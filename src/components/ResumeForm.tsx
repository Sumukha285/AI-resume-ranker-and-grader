/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  User,
  GraduationCap,
  Briefcase,
  Terminal,
  Users,
  Award,
  Plus,
  Trash2,
  Sparkles,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  RefreshCw,
  X,
  PlusCircle
} from "lucide-react";
import { ResumeData, Education, Project, Experience, Extracurricular } from "../types";
import { sampleStudentResume, emptyResume } from "../data";
import BulletOptimizer from "./BulletOptimizer";

interface ResumeFormProps {
  resumeData: ResumeData;
  onChange: (data: ResumeData) => void;
  onPreview: () => void;
}

type SectionKey = "contact" | "education" | "experience" | "projects" | "extracurriculars" | "skills" | "achievements";

export default function ResumeForm({ resumeData, onChange, onPreview }: ResumeFormProps) {
  const [activeSection, setActiveSection] = useState<SectionKey>("contact");
  const [optimizerOpen, setOptimizerOpen] = useState(false);
  const [targetBulletLocation, setTargetBulletLocation] = useState<{
    section: "experience" | "projects" | "extracurriculars";
    itemIndex: number;
    bulletIndex: number;
  } | null>(null);

  // Helper to trigger deep state updates
  const updateResume = (key: string, value: any) => {
    onChange({
      ...resumeData,
      [key]: value
    });
  };

  const handleContactChange = (field: string, value: string) => {
    updateResume("contact", {
      ...resumeData.contact,
      [field]: value
    });
  };

  const handleSkillsChange = (field: string, value: string) => {
    updateResume("skills", {
      ...resumeData.skills,
      [field]: value
    });
  };

  // -------------------------------------------------------------
  // EDUCATION MANAGEMENT
  // -------------------------------------------------------------
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: "",
      degree: "",
      major: "",
      gpa: "",
      graduationDate: "",
      coursework: ""
    };
    updateResume("education", [...resumeData.education, newEdu]);
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const list = [...resumeData.education];
    list[index] = { ...list[index], [field]: value };
    updateResume("education", list);
  };

  const removeEducation = (index: number) => {
    const list = resumeData.education.filter((_, i) => i !== index);
    updateResume("education", list);
  };

  // -------------------------------------------------------------
  // EXPERIENCE MANAGEMENT
  // -------------------------------------------------------------
  const addExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      bullets: [""]
    };
    updateResume("experience", [...resumeData.experience, newExp]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const list = [...resumeData.experience];
    list[index] = { ...list[index], [field]: value };
    updateResume("experience", list);
  };

  const updateExperienceBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const list = [...resumeData.experience];
    const bullets = [...list[expIndex].bullets];
    bullets[bulletIndex] = value;
    list[expIndex] = { ...list[expIndex], bullets };
    updateResume("experience", list);
  };

  const addExperienceBullet = (expIndex: number) => {
    const list = [...resumeData.experience];
    list[expIndex].bullets = [...list[expIndex].bullets, ""];
    updateResume("experience", list);
  };

  const removeExperienceBullet = (expIndex: number, bulletIndex: number) => {
    const list = [...resumeData.experience];
    const bullets = list[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    list[expIndex] = { ...list[expIndex], bullets: bullets.length ? bullets : [""] };
    updateResume("experience", list);
  };

  const removeExperience = (index: number) => {
    const list = resumeData.experience.filter((_, i) => i !== index);
    updateResume("experience", list);
  };

  // -------------------------------------------------------------
  // PROJECTS MANAGEMENT
  // -------------------------------------------------------------
  const addProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: "",
      technologies: "",
      role: "",
      bullets: [""]
    };
    updateResume("projects", [...resumeData.projects, newProj]);
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const list = [...resumeData.projects];
    list[index] = { ...list[index], [field]: value };
    updateResume("projects", list);
  };

  const updateProjectBullet = (projIndex: number, bulletIndex: number, value: string) => {
    const list = [...resumeData.projects];
    const bullets = [...list[projIndex].bullets];
    bullets[bulletIndex] = value;
    list[projIndex] = { ...list[projIndex], bullets };
    updateResume("projects", list);
  };

  const addProjectBullet = (projIndex: number) => {
    const list = [...resumeData.projects];
    list[projIndex].bullets = [...list[projIndex].bullets, ""];
    updateResume("projects", list);
  };

  const removeProjectBullet = (projIndex: number, bulletIndex: number) => {
    const list = [...resumeData.projects];
    const bullets = list[projIndex].bullets.filter((_, i) => i !== bulletIndex);
    list[projIndex] = { ...list[projIndex], bullets: bullets.length ? bullets : [""] };
    updateResume("projects", list);
  };

  const removeProject = (index: number) => {
    const list = resumeData.projects.filter((_, i) => i !== index);
    updateResume("projects", list);
  };

  // -------------------------------------------------------------
  // EXTRACURRICULAR MANAGEMENT
  // -------------------------------------------------------------
  const addExtracurricular = () => {
    const newExtra: Extracurricular = {
      id: `extra-${Date.now()}`,
      organization: "",
      role: "",
      startDate: "",
      endDate: "",
      bullets: [""]
    };
    updateResume("extracurriculars", [...resumeData.extracurriculars, newExtra]);
  };

  const updateExtracurricular = (index: number, field: keyof Extracurricular, value: any) => {
    const list = [...resumeData.extracurriculars];
    list[index] = { ...list[index], [field]: value };
    updateResume("extracurriculars", list);
  };

  const updateExtracurricularBullet = (extraIndex: number, bulletIndex: number, value: string) => {
    const list = [...resumeData.extracurriculars];
    const bullets = [...list[extraIndex].bullets];
    bullets[bulletIndex] = value;
    list[extraIndex] = { ...list[extraIndex], bullets };
    updateResume("extracurriculars", list);
  };

  const addExtracurricularBullet = (extraIndex: number) => {
    const list = [...resumeData.extracurriculars];
    list[extraIndex].bullets = [...list[extraIndex].bullets, ""];
    updateResume("extracurriculars", list);
  };

  const removeExtracurricularBullet = (extraIndex: number, bulletIndex: number) => {
    const list = [...resumeData.extracurriculars];
    const bullets = list[extraIndex].bullets.filter((_, i) => i !== bulletIndex);
    list[extraIndex] = { ...list[extraIndex], bullets: bullets.length ? bullets : [""] };
    updateResume("extracurriculars", list);
  };

  const removeExtracurricular = (index: number) => {
    const list = resumeData.extracurriculars.filter((_, i) => i !== index);
    updateResume("extracurriculars", list);
  };

  // -------------------------------------------------------------
  // ACHIEVEMENTS MANAGEMENT
  // -------------------------------------------------------------
  const addAchievement = () => {
    updateResume("achievements", [...resumeData.achievements, ""]);
  };

  const updateAchievement = (index: number, value: string) => {
    const list = [...resumeData.achievements];
    list[index] = value;
    updateResume("achievements", list);
  };

  const removeAchievement = (index: number) => {
    const list = resumeData.achievements.filter((_, i) => i !== index);
    updateResume("achievements", list);
  };

  // -------------------------------------------------------------
  // BULLET OPTIMIZER HELPER TRIGGER
  // -------------------------------------------------------------
  const triggerOptimizer = (
    section: "experience" | "projects" | "extracurriculars",
    itemIndex: number,
    bulletIndex: number
  ) => {
    setTargetBulletLocation({ section, itemIndex, bulletIndex });
    setOptimizerOpen(true);
  };

  const handleApplyOptimizedBullet = (optimizedText: string) => {
    if (!targetBulletLocation) return;
    const { section, itemIndex, bulletIndex } = targetBulletLocation;

    if (section === "experience") {
      updateExperienceBullet(itemIndex, bulletIndex, optimizedText);
    } else if (section === "projects") {
      updateProjectBullet(itemIndex, bulletIndex, optimizedText);
    } else if (section === "extracurriculars") {
      updateExtracurricularBullet(itemIndex, bulletIndex, optimizedText);
    }

    setOptimizerOpen(false);
    setTargetBulletLocation(null);
  };

  const sidebarItems = [
    { key: "contact", label: "Contact Details", icon: User },
    { key: "education", label: "Education", icon: GraduationCap },
    { key: "experience", label: "Internships & Jobs", icon: Briefcase },
    { key: "projects", label: "Projects", icon: Terminal },
    { key: "extracurriculars", label: "Leadership & Clubs", icon: Users },
    { key: "skills", label: "Skills", icon: Terminal },
    { key: "achievements", label: "Achievements", icon: Award }
  ];

  return (
    <div className="flex h-full flex-col lg:flex-row gap-6">
      {/* SECTION NAVIGATOR */}
      <div className="flex flex-row overflow-x-auto lg:flex-col gap-1.5 lg:w-64 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-4 shrink-0 scrollbar-none">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key as SectionKey)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap lg:w-full ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-50"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
              <span className="hidden sm:inline lg:inline">{item.label}</span>
            </button>
          );
        })}

        <div className="hidden lg:block border-t border-slate-100 my-4 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3.5 mb-2">
            Quick Actions
          </p>
          <button
            onClick={() => onChange(sampleStudentResume)}
            className="flex items-center gap-2.5 w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Load Sample Resume
          </button>
          <button
            onClick={() => onChange(emptyResume)}
            className="flex items-center gap-2.5 w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="h-4 w-4 text-rose-500" />
            Clear Data
          </button>
        </div>
      </div>

      {/* ACTIVE INPUTS PANEL */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-y-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {sidebarItems.find((s) => s.key === activeSection)?.label}
            </h2>
            <p className="text-xs text-slate-500">
              Fill in your details to compile your industry-grade resume.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onPreview}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <Eye className="h-4 w-4" />
              Preview Resume
            </button>
            <button
              onClick={() => onChange(sampleStudentResume)}
              className="flex items-center gap-1.5 rounded-xl bg-slate-50 border border-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 lg:hidden"
            >
              <RefreshCw className="h-4 w-4 text-indigo-600" />
              Load Sample
            </button>
          </div>
        </div>

        {/* SECTION 1: CONTACT */}
        {activeSection === "contact" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-600">Full Name</label>
              <input
                type="text"
                value={resumeData.contact.fullName}
                onChange={(e) => handleContactChange("fullName", e.target.value)}
                placeholder="e.g., Alex Rivera"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Email Address</label>
              <input
                type="email"
                value={resumeData.contact.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
                placeholder="e.g., alex.rivera@edu.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Phone Number</label>
              <input
                type="text"
                value={resumeData.contact.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
                placeholder="e.g., (555) 019-2834"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Location (City, State)</label>
              <input
                type="text"
                value={resumeData.contact.location}
                onChange={(e) => handleContactChange("location", e.target.value)}
                placeholder="e.g., Austin, TX"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">LinkedIn URL</label>
              <input
                type="text"
                value={resumeData.contact.linkedin}
                onChange={(e) => handleContactChange("linkedin", e.target.value)}
                placeholder="linkedin.com/in/username"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">GitHub Profile URL</label>
              <input
                type="text"
                value={resumeData.contact.github}
                onChange={(e) => handleContactChange("github", e.target.value)}
                placeholder="github.com/username"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Portfolio Website (Optional)</label>
              <input
                type="text"
                value={resumeData.contact.portfolio}
                onChange={(e) => handleContactChange("portfolio", e.target.value)}
                placeholder="e.g., username.dev"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        )}

        {/* SECTION 2: EDUCATION */}
        {activeSection === "education" && (
          <div className="space-y-6">
            {resumeData.education.map((edu, index) => (
              <div key={edu.id} className="relative rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                {resumeData.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="absolute right-4 top-4 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-slate-600">University / Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, "institution", e.target.value)}
                      placeholder="e.g., University of Texas at Austin"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      placeholder="e.g., Bachelor of Science"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Major / Field of Study</label>
                    <input
                      type="text"
                      value={edu.major}
                      onChange={(e) => updateEducation(index, "major", e.target.value)}
                      placeholder="e.g., Computer Science"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">GPA (e.g., 3.8 / 4.0)</label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                      placeholder="e.g., 3.85 / 4.00"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Graduation Date (e.g., May 2027)</label>
                    <input
                      type="text"
                      value={edu.graduationDate}
                      onChange={(e) => updateEducation(index, "graduationDate", e.target.value)}
                      placeholder="e.g., May 2027"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Relevant Coursework</label>
                    <input
                      type="text"
                      value={edu.coursework}
                      onChange={(e) => updateEducation(index, "coursework", e.target.value)}
                      placeholder="e.g., Data Structures, Algorithms, Software Engineering"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addEducation}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-indigo-200 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50/20 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Another University / Degree
            </button>
          </div>
        )}

        {/* SECTION 3: EXPERIENCE */}
        {activeSection === "experience" && (
          <div className="space-y-6">
            {resumeData.experience.map((exp, expIndex) => (
              <div key={exp.id} className="relative rounded-2xl border border-slate-100 bg-slate-50/30 p-5">
                <button
                  type="button"
                  onClick={() => removeExperience(expIndex)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Company / Organization</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(expIndex, "company", e.target.value)}
                      placeholder="e.g., Apex Tech Solutions"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Role / Job Title</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(expIndex, "role", e.target.value)}
                      placeholder="e.g., Software Engineering Intern"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Location (e.g., Dallas, TX)</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateExperience(expIndex, "location", e.target.value)}
                      placeholder="e.g., Dallas, TX"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(expIndex, "startDate", e.target.value)}
                        placeholder="e.g., June 2025"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(expIndex, "endDate", e.target.value)}
                        placeholder="e.g., Present"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* BULLETS */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Key Accomplishments (Recruiter Bullets)</label>
                  </div>
                  <div className="space-y-3">
                    {exp.bullets.map((bullet, bIndex) => (
                      <div key={bIndex} className="flex gap-2">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                        <div className="flex-1">
                          <textarea
                            value={bullet}
                            onChange={(e) => updateExperienceBullet(expIndex, bIndex, e.target.value)}
                            placeholder="Draft your bullet point (e.g., assisted with making the frontend using React)"
                            rows={2}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-sm outline-none focus:border-indigo-500"
                          />
                          <div className="mt-1 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => triggerOptimizer("experience", expIndex, bIndex)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                              <Sparkles className="h-3 w-3" />
                              AI Optimize with STAR
                            </button>
                            {exp.bullets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeExperienceBullet(expIndex, bIndex)}
                                className="text-xs text-rose-500 hover:text-rose-700"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addExperienceBullet(expIndex)}
                      className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Add Bullet Point
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addExperience}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-indigo-200 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50/20 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Another Experience
            </button>
          </div>
        )}

        {/* SECTION 4: PROJECTS */}
        {activeSection === "projects" && (
          <div className="space-y-6">
            {resumeData.projects.map((proj, projIndex) => (
              <div key={proj.id} className="relative rounded-2xl border border-slate-100 bg-slate-50/30 p-5">
                <button
                  type="button"
                  onClick={() => removeProject(projIndex)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Project Name</label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => updateProject(projIndex, "title", e.target.value)}
                      placeholder="e.g., Campus RideShare Hub"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Technologies Used</label>
                    <input
                      type="text"
                      value={proj.technologies}
                      onChange={(e) => updateProject(projIndex, "technologies", e.target.value)}
                      placeholder="e.g., React, Node.js, Express, PostgreSQL"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Your Role / Context (e.g., Frontend Developer - Solo Project)</label>
                    <input
                      type="text"
                      value={proj.role}
                      onChange={(e) => updateProject(projIndex, "role", e.target.value)}
                      placeholder="e.g., Full-Stack Developer (Personal Project)"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* BULLETS */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Project Descriptions (Bullets)</label>
                  </div>
                  <div className="space-y-3">
                    {proj.bullets.map((bullet, bIndex) => (
                      <div key={bIndex} className="flex gap-2">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                        <div className="flex-1">
                          <textarea
                            value={bullet}
                            onChange={(e) => updateProjectBullet(projIndex, bIndex, e.target.value)}
                            placeholder="Describe what you built and how (e.g., built real-time routes overlapping using Google maps api)"
                            rows={2}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-sm outline-none focus:border-indigo-500"
                          />
                          <div className="mt-1 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => triggerOptimizer("projects", projIndex, bIndex)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                              <Sparkles className="h-3 w-3" />
                              AI Optimize with STAR
                            </button>
                            {proj.bullets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeProjectBullet(projIndex, bIndex)}
                                className="text-xs text-rose-500 hover:text-rose-700"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addProjectBullet(projIndex)}
                      className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Add Bullet Point
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addProject}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-indigo-200 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50/20 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Another Project
            </button>
          </div>
        )}

        {/* SECTION 5: EXTRACURRICULARS */}
        {activeSection === "extracurriculars" && (
          <div className="space-y-6">
            {resumeData.extracurriculars.map((extra, extraIndex) => (
              <div key={extra.id} className="relative rounded-2xl border border-slate-100 bg-slate-50/30 p-5">
                <button
                  type="button"
                  onClick={() => removeExtracurricular(extraIndex)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Club / Organization</label>
                    <input
                      type="text"
                      value={extra.organization}
                      onChange={(e) => updateExtracurricular(extraIndex, "organization", e.target.value)}
                      placeholder="e.g., Association for Computing Machinery (ACM)"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">Your Leadership Role / Title</label>
                    <input
                      type="text"
                      value={extra.role}
                      onChange={(e) => updateExtracurricular(extraIndex, "role", e.target.value)}
                      placeholder="e.g., Technical Workshop Director"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">Start Date</label>
                      <input
                        type="text"
                        value={extra.startDate}
                        onChange={(e) => updateExtracurricular(extraIndex, "startDate", e.target.value)}
                        placeholder="e.g., September 2024"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">End Date</label>
                      <input
                        type="text"
                        value={extra.endDate}
                        onChange={(e) => updateExtracurricular(extraIndex, "endDate", e.target.value)}
                        placeholder="e.g., Present"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* BULLETS */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Activities / Leadership Contributions</label>
                  </div>
                  <div className="space-y-3">
                    {extra.bullets.map((bullet, bIndex) => (
                      <div key={bIndex} className="flex gap-2">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                        <div className="flex-1">
                          <textarea
                            value={bullet}
                            onChange={(e) => updateExtracurricularBullet(extraIndex, bIndex, e.target.value)}
                            placeholder="Describe your impact (e.g., organized code workshops and guided freshman students)"
                            rows={2}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-sm outline-none focus:border-indigo-500"
                          />
                          <div className="mt-1 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => triggerOptimizer("extracurriculars", extraIndex, bIndex)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                              <Sparkles className="h-3 w-3" />
                              AI Optimize with STAR
                            </button>
                            {extra.bullets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeExtracurricularBullet(extraIndex, bIndex)}
                                className="text-xs text-rose-500 hover:text-rose-700"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addExtracurricularBullet(extraIndex)}
                      className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Add Bullet Point
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addExtracurricular}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-indigo-200 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50/20 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Leadership or Club Role
            </button>
          </div>
        )}

        {/* SECTION 6: SKILLS */}
        {activeSection === "skills" && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Languages</label>
              <input
                type="text"
                value={resumeData.skills.languages}
                onChange={(e) => handleSkillsChange("languages", e.target.value)}
                placeholder="e.g., JavaScript, TypeScript, Python, Java, SQL, C++"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Frameworks / Libraries</label>
              <input
                type="text"
                value={resumeData.skills.frameworks}
                onChange={(e) => handleSkillsChange("frameworks", e.target.value)}
                placeholder="e.g., React, Node.js, Express, Next.js, Flask, Tailwind CSS"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Tools / Developer Platforms</label>
              <input
                type="text"
                value={resumeData.skills.tools}
                onChange={(e) => handleSkillsChange("tools", e.target.value)}
                placeholder="e.g., Git, GitHub Actions, Docker, PostgreSQL, MongoDB, Postman, Figma"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* SECTION 7: ACHIEVEMENTS */}
        {activeSection === "achievements" && (
          <div className="space-y-4">
            <div className="space-y-3">
              {resumeData.achievements.map((ach, index) => (
                <div key={index} className="flex gap-2">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={ach}
                      onChange={(e) => updateAchievement(index, e.target.value)}
                      placeholder="e.g., UT Hackathon 2025 - Winner of 'Most Innovative Hack'"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addAchievement}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-indigo-200 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50/20 transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Achievement / Honor
            </button>
          </div>
        )}

        {/* BOTTOM NAV BAR */}
        <div className="mt-8 flex justify-between border-t border-slate-100 pt-5">
          <button
            onClick={() => {
              const idx = sidebarItems.findIndex((s) => s.key === activeSection);
              if (idx > 0) {
                setActiveSection(sidebarItems[idx - 1].key as SectionKey);
              }
            }}
            disabled={activeSection === "contact"}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={() => {
              const idx = sidebarItems.findIndex((s) => s.key === activeSection);
              if (idx < sidebarItems.length - 1) {
                setActiveSection(sidebarItems[idx + 1].key as SectionKey);
              } else {
                onPreview();
              }
            }}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-all"
          >
            {activeSection === "achievements" ? "Finish & Preview" : "Next Section"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* FLOATING DIALOG FOR EMBEDDED AI BULLET OPTIMIZER */}
      {optimizerOpen && targetBulletLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setOptimizerOpen(false);
                setTargetBulletLocation(null);
              }}
              className="absolute right-4 top-4 z-10 rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
            <BulletOptimizer
              onSelect={handleApplyOptimizedBullet}
              initialRole={
                targetBulletLocation.section === "experience"
                  ? resumeData.experience[targetBulletLocation.itemIndex]?.role || "Intern"
                  : targetBulletLocation.section === "projects"
                  ? resumeData.projects[targetBulletLocation.itemIndex]?.role || "Developer"
                  : resumeData.extracurriculars[targetBulletLocation.itemIndex]?.role || "Leader"
              }
              embedded={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
