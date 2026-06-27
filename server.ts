/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up JSON body parser with increased limit
app.use(express.json({ limit: "10mb" }));

// Lazy initialize Gemini client to prevent app crashing on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI features will fail.");
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// -----------------------------------------------------------------
// API ENDPOINT: Optimize Bullet Point
// -----------------------------------------------------------------
app.post("/api/optimize-bullet", async (req, res) => {
  try {
    const { bullet, role, techStack } = req.body;
    if (!bullet || !bullet.trim()) {
      return res.status(400).json({ error: "Bullet point text is required" });
    }

    const ai = getGeminiClient();
    const systemPrompt = `You are an elite Tech Recruiter and Resume Writer specialized in helping college students get internships and entry-level roles.
Your task is to rewrite a draft resume bullet point into three high-impact, professional versions using formatting frameworks popular with elite recruiters (like STAR or CAR: Context/Task, Action, Result).

Guidelines for rewriting:
1. Start with a strong action verb (e.g., Pioneered, Engineered, Orchestrated, Automated, Optimized, Spearheaded). Avoid passive words like "helped", "assisted", "worked on", "responsible for".
2. Incorporate quantified metrics and impacts (e.g., "improving performance by 40%", "reducing query times by 200ms", "saving 10+ hours weekly", "handling 500+ daily requests") even if hypothetical or estimated based on standard project outcomes.
3. Explicitly mention technologies, frameworks, or tools used (especially if specified in techStack: ${techStack || "not specified"}).
4. Ensure the output is concise, readable, and highly tailorable for a college student seeking a "${role || "Software Developer"}" role.

You MUST respond strictly in JSON format as defined by the response schema. No conversational preamble, markdown blocks, or other formatting.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Draft bullet point: "${bullet}"\nTarget Role: "${role || "Technology Intern"}"\nTech Stack/Keywords: "${techStack || "None"}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              description: "Array of three optimized versions of the bullet point",
              items: {
                type: Type.OBJECT,
                properties: {
                  bullet: {
                    type: Type.STRING,
                    description: "The complete rewritten high-impact bullet point"
                  },
                  method: {
                    type: Type.STRING,
                    description: "The framework used (e.g., 'STAR (Result-First)', 'CAR (Action-First)', 'Impact-Focused')"
                  },
                  reasoning: {
                    type: Type.STRING,
                    description: "Brief explanation of what made this version strong (what verb was chosen, what metric was added)"
                  }
                },
                required: ["bullet", "method", "reasoning"]
              }
            }
          },
          required: ["suggestions"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini");
    }

    const result = JSON.parse(text);
    return res.json(result);
  } catch (error: any) {
    console.error("Error in /api/optimize-bullet:", error);
    return res.status(500).json({ error: error.message || "An unexpected error occurred" });
  }
});

// -----------------------------------------------------------------
// API ENDPOINT: Grade and Analyze Resume
// -----------------------------------------------------------------
app.post("/api/grade-resume", async (req, res) => {
  try {
    const { resumeText, resumeData, targetRole, jobDescription } = req.body;
    
    // We can accept either direct resumeText pasted by the user, or the structured resumeData from the builder
    let textToAnalyze = resumeText || "";
    if (resumeData) {
      // Convert structured resume data to a text format for analysis
      const contact = resumeData.contact || {};
      const edu = (resumeData.education || []).map((e: any) => `${e.degree} in ${e.major} at ${e.institution} (GPA: ${e.gpa || "N/A"}), Coursework: ${e.coursework || "N/A"}`).join("\n");
      const proj = (resumeData.projects || []).map((p: any) => `Project: ${p.title} (Role: ${p.role}, Tech: ${p.technologies})\nBullets:\n${(p.bullets || []).map((b: string) => `- ${b}`).join("\n")}`).join("\n\n");
      const exp = (resumeData.experience || []).map((e: any) => `Experience: ${e.role} at ${e.company} (${e.location})\nBullets:\n${(e.bullets || []).map((b: string) => `- ${b}`).join("\n")}`).join("\n\n");
      const extra = (resumeData.extracurriculars || []).map((ec: any) => `Leadership: ${ec.role} at ${ec.organization}\nBullets:\n${(ec.bullets || []).map((b: string) => `- ${b}`).join("\n")}`).join("\n\n");
      const skills = `Skills: Languages: ${resumeData.skills?.languages || "N/A"}, Frameworks: ${resumeData.skills?.frameworks || "N/A"}, Tools: ${resumeData.skills?.tools || "N/A"}`;
      const ach = (resumeData.achievements || []).map((a: string) => `- ${a}`).join("\n");

      textToAnalyze = `
RESUME FOR ANALYSIS:
Name: ${contact.fullName || "User"}
Email: ${contact.email || ""} | Phone: ${contact.phone || ""} | Location: ${contact.location || ""}
LinkedIn: ${contact.linkedin || ""} | GitHub: ${contact.github || ""} | Portfolio: ${contact.portfolio || ""}

EDUCATION:
${edu}

PROJECTS:
${proj}

EXPERIENCE:
${exp}

LEADERSHIP & EXTRACURRICULARS:
${extra}

SKILLS:
${skills}

ACHIEVEMENTS:
${ach}
      `.trim();
    }

    if (!textToAnalyze || !textToAnalyze.trim()) {
      return res.status(400).json({ error: "No resume content provided for analysis" });
    }

    const ai = getGeminiClient();
    const systemPrompt = `You are an expert resume grader, hiring manager, and ATS (Applicant Tracking System) specialist.
Your target audience is college students who are seeking internships, co-ops, and entry-level positions.
Analyze the provided resume text against the target role and optional job description.

Evaluate the resume on these 5 dimensions (scores are 0 to 100):
1. Formatting & ATS Readability (formatting): Check for clear sections, proper hierarchies, absence of multi-columns (which confuse older ATS), and clean contact info.
2. Content Strength & Details (contentStrength): Assess bullet quality. Do they explain the "how" and "why" rather than just a list of chores?
3. Action Verbs & Tone (actionVerbs): Evaluate if bullets start with powerful, diverse action verbs instead of passive phrases or weak starters (e.g., "assisted with", "responsible for").
4. Relevance to Target Role (relevance): Check if the listed skills, projects, and experiences map well to the target role. Are key technical skills listed?
5. Extracurriculars & Leadership Balance (extracurriculars): For college students, active involvement in clubs, hackathons, sports, or teaching assistantships is highly valued. Assess if this dimension is present and well-articulated.

Additionally, provide:
- A holistic overall score (0 to 100) combining the dimensions (heavily weighted towards content strength, relevance, and projects).
- A high-level summary of the resume (strengths and main gaps).
- Matched keywords (keywords present in the resume relevant to the role).
- Missing keywords (critical skills or buzzwords standard for the target role/job description that are absent).
- A list of actionable top 3 priority steps the student should take.
- Take 2 of the weakest bullet points found in the resume, and provide high-impact, recruiter-optimized STAR/CAR rewrites as suggestions.

You MUST respond strictly in JSON format as defined by the response schema. Do not output anything other than JSON.`;

    const userPrompt = `
Target Role: "${targetRole || "Software Developer Intern"}"
Job Description: "${jobDescription || "Not provided"}"

Resume Content:
---
${textToAnalyze}
---
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: {
              type: Type.INTEGER,
              description: "Weighted overall resume grade out of 100"
            },
            summary: {
              type: Type.STRING,
              description: "Holistic 2-3 sentence overview of strengths and main opportunities for improvement"
            },
            dimensions: {
              type: Type.OBJECT,
              properties: {
                formatting: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    score: { type: Type.INTEGER },
                    maxScore: { type: Type.INTEGER },
                    feedback: { type: Type.STRING, description: "Detailed feedback on readability, contact section, and layout" },
                    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["name", "score", "maxScore", "feedback", "suggestions"]
                },
                contentStrength: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    score: { type: Type.INTEGER },
                    maxScore: { type: Type.INTEGER },
                    feedback: { type: Type.STRING, description: "Feedback on project details, results, and quantification" },
                    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["name", "score", "maxScore", "feedback", "suggestions"]
                },
                actionVerbs: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    score: { type: Type.INTEGER },
                    maxScore: { type: Type.INTEGER },
                    feedback: { type: Type.STRING, description: "Feedback on action verb usage, vocabulary variety, and tone" },
                    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["name", "score", "maxScore", "feedback", "suggestions"]
                },
                relevance: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    score: { type: Type.INTEGER },
                    maxScore: { type: Type.INTEGER },
                    feedback: { type: Type.STRING, description: "Analysis of how well skills/projects match the target role/job description" },
                    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["name", "score", "maxScore", "feedback", "suggestions"]
                },
                extracurriculars: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    score: { type: Type.INTEGER },
                    maxScore: { type: Type.INTEGER },
                    feedback: { type: Type.STRING, description: "Feedback on student involvement, leadership, hackathons, and clubs" },
                    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["name", "score", "maxScore", "feedback", "suggestions"]
                }
              },
              required: ["formatting", "contentStrength", "actionVerbs", "relevance", "extracurriculars"]
            },
            matchedKeywords: {
              type: Type.ARRAY,
              description: "Relevant keywords and technical skills successfully identified in the resume",
              items: { type: Type.STRING }
            },
            missingKeywords: {
              type: Type.ARRAY,
              description: "Critical keywords, skills, or terminologies that are absent but highly recommended",
              items: { type: Type.STRING }
            },
            actionItems: {
              type: Type.ARRAY,
              description: "Top 3 priority action items the student should implement first",
              items: { type: Type.STRING }
            },
            starBulletOptimizations: {
              type: Type.ARRAY,
              description: "2 weak bullets from the resume and their high-impact optimized STAR/CAR alternatives",
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING, description: "The weak original bullet point found in the resume" },
                  suggested: { type: Type.STRING, description: "The optimized STAR-compliant bullet point suggestion" },
                  explanation: { type: Type.STRING, description: "Why this suggested rewrite is significantly stronger" }
                },
                required: ["original", "suggested", "explanation"]
              }
            }
          },
          required: [
            "overallScore",
            "summary",
            "dimensions",
            "matchedKeywords",
            "missingKeywords",
            "actionItems",
            "starBulletOptimizations"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini grader");
    }

    const result = JSON.parse(text);
    return res.json(result);
  } catch (error: any) {
    console.error("Error in /api/grade-resume:", error);
    return res.status(500).json({ error: error.message || "An unexpected error occurred during grading" });
  }
});

// -----------------------------------------------------------------
// Express Static Asset & Dev / Production Setup
// -----------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Mount Vite dev server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static assets from production build folder
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Resume Studio server running on http://localhost:${PORT}`);
  });
}

startServer();
