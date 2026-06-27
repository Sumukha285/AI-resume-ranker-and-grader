/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Loader2, Check, Copy, RefreshCw } from "lucide-react";
import { OptimizeBulletResponse } from "../types";

interface BulletOptimizerProps {
  onSelect?: (optimizedBullet: string) => void;
  initialRole?: string;
  embedded?: boolean;
}

export default function BulletOptimizer({
  onSelect,
  initialRole = "Software Engineering Intern",
  embedded = false,
}: BulletOptimizerProps) {
  const [draft, setDraft] = useState("");
  const [role, setRole] = useState(initialRole);
  const [techStack, setTechStack] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizeBulletResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/optimize-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bullet: draft,
          role,
          techStack,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to optimize bullet point");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md ${
        embedded ? "p-4" : "p-6"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">AI Bullet Optimizer</h3>
            <p className="text-xs text-slate-500">
              Transform weak phrases into STAR-compliant recruiter statements.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleOptimize} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Draft Bullet Point / What did you do?
          </label>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="e.g., worked on the frontend, built the landing page and fixed some bugs"
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Target Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Software Engineering Intern"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Tech Stack Used (Optional)
            </label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="e.g., React, TypeScript, Tailind"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !draft.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Optimizing with Gemini...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Optimize Bullet Point
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-xl bg-rose-50 p-3.5 text-xs text-rose-700 border border-rose-100">
          {error}
        </div>
      )}

      {result && result.suggestions && (
        <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Gemini Recruiter Suggestions
          </h4>

          <div className="space-y-3">
            {result.suggestions.map((item, index) => (
              <div
                key={index}
                className="group relative rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition-all hover:border-indigo-200 hover:bg-indigo-50/10"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="inline-flex rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700">
                    {item.method}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyToClipboard(item.bullet, index)}
                      className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-200/50 hover:text-slate-600"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    {onSelect && (
                      <button
                        onClick={() => onSelect(item.bullet)}
                        className="rounded bg-indigo-600 px-2 py-0.5 text-xs font-medium text-white transition-all hover:bg-indigo-700"
                      >
                        Insert
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed pr-6">
                  {item.bullet}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {item.reasoning}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-center text-slate-400 italic">
            Tips: Recruiter-optimized bullets highlight quantifiable results and start with powerful verbs.
          </p>
        </div>
      )}
    </div>
  );
}
