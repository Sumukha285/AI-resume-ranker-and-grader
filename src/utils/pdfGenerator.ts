/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from "jspdf";
import { ResumeData, TemplateType } from "../types";

interface PDFGeneratorOptions {
  template: TemplateType;
  accentColor: string; // indigo, emerald, slate, blue, amber
}

export function generateResumePDF(resumeData: ResumeData, options: PDFGeneratorOptions) {
  const { template, accentColor } = options;

  // Set up standard Letter size document (8.5 x 11 inches)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "letter"
  });

  const pageWidth = 215.9;
  const pageHeight = 279.4;
  const marginX = 18; // 0.7 inch margins
  const marginY = 18;
  const printableWidth = pageWidth - (marginX * 2);

  // Map TemplateType to standard standard web-safe PDF fonts
  let primaryFont = "Helvetica";
  let boldFont = "Helvetica-Bold";
  let italicFont = "Helvetica-Oblique";

  if (template === "academic") {
    primaryFont = "Times-Roman";
    boldFont = "Times-Bold";
    italicFont = "Times-Italic";
  } else if (template === "technical") {
    primaryFont = "Courier";
    boldFont = "Courier-Bold";
    italicFont = "Courier-Oblique";
  }

  // Accent Colors mapping
  const colors: Record<string, [number, number, number]> = {
    indigo: [79, 70, 229],
    emerald: [5, 150, 105],
    slate: [30, 41, 59],
    blue: [37, 99, 235],
    amber: [180, 83, 9]
  };

  const activeRGB = colors[accentColor] || colors.indigo;

  let y = marginY;

  // Core helper to check if adding content will overflow page height
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - marginY) {
      doc.addPage();
      y = marginY;
      return true;
    }
    return false;
  };

  // Helper to draw a section header
  const drawSectionHeader = (title: string) => {
    checkPageBreak(12);
    y += 4;
    doc.setFont(boldFont, "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(activeRGB[0], activeRGB[1], activeRGB[2]);
    doc.text(title.toUpperCase(), marginX, y);

    y += 2;
    doc.setDrawColor(218, 224, 233); // light gray line
    doc.setLineWidth(0.3);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 4.5;
  };

  // 1. HEADER (Contact details)
  doc.setFont(boldFont, "bold");
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59); // dark slate text
  
  const name = resumeData.contact.fullName || "Your Full Name";
  const nameWidth = doc.getTextWidth(name);
  doc.text(name, (pageWidth - nameWidth) / 2, y);

  y += 6;

  // Contact info line 1
  doc.setFont(primaryFont, "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // intermediate slate

  const contactParts: string[] = [];
  if (resumeData.contact.email) contactParts.push(resumeData.contact.email);
  if (resumeData.contact.phone) contactParts.push(resumeData.contact.phone);
  if (resumeData.contact.location) contactParts.push(resumeData.contact.location);

  const contactLine1 = contactParts.join("  |  ");
  const line1Width = doc.getTextWidth(contactLine1);
  doc.text(contactLine1, (pageWidth - line1Width) / 2, y);

  y += 4.5;

  // Contact info line 2 (Links)
  const linkParts: string[] = [];
  if (resumeData.contact.linkedin) linkParts.push(`LinkedIn: ${resumeData.contact.linkedin}`);
  if (resumeData.contact.github) linkParts.push(`GitHub: ${resumeData.contact.github}`);
  if (resumeData.contact.portfolio) linkParts.push(`Portfolio: ${resumeData.contact.portfolio}`);

  if (linkParts.length > 0) {
    const contactLine2 = linkParts.join("  |  ");
    const line2Width = doc.getTextWidth(contactLine2);
    doc.text(contactLine2, (pageWidth - line2Width) / 2, y);
    y += 6;
  } else {
    y += 2;
  }

  // 2. EDUCATION
  if (resumeData.education.length > 0) {
    drawSectionHeader("Education");

    resumeData.education.forEach((edu) => {
      checkPageBreak(15);
      
      // Degree on left, date on right
      doc.setFont(boldFont, "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);
      doc.text(edu.institution || "Institution", marginX, y);

      const gradDate = edu.graduationDate || "Graduation Date";
      const dateWidth = doc.getTextWidth(gradDate);
      doc.setFont(primaryFont, "normal");
      doc.setFontSize(9);
      doc.text(gradDate, pageWidth - marginX - dateWidth, y);

      y += 4;

      // Major, GPA
      doc.setFont(italicFont, "italic");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      const degreeMajor = `${edu.degree || "Degree"} in ${edu.major || "Major"}${edu.gpa ? ` (GPA: ${edu.gpa})` : ""}`;
      doc.text(degreeMajor, marginX, y);

      y += 4.5;

      // Coursework
      if (edu.coursework) {
        doc.setFont(boldFont, "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text("Relevant Coursework: ", marginX, y);
        
        const labelWidth = doc.getTextWidth("Relevant Coursework: ");
        doc.setFont(primaryFont, "normal");
        
        const courseworkLines = doc.splitTextToSize(edu.coursework, printableWidth - labelWidth);
        courseworkLines.forEach((line: string, index: number) => {
          checkPageBreak(4);
          doc.text(line, marginX + labelWidth, y);
          if (index < courseworkLines.length - 1) {
            y += 3.5;
          }
        });
        y += 5;
      } else {
        y += 1.5;
      }
    });
  }

  // 3. EXPERIENCE
  if (resumeData.experience.length > 0) {
    drawSectionHeader("Professional Experience");

    resumeData.experience.forEach((exp) => {
      checkPageBreak(18);

      // Role and Company left, Date & Loc right
      doc.setFont(boldFont, "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);
      
      const roleCompany = `${exp.role || "Role"} | ${exp.company || "Company"}`;
      doc.text(roleCompany, marginX, y);

      const dateLocRange = `${exp.location ? `${exp.location}  |  ` : ""}${exp.startDate} – ${exp.endDate || "Present"}`;
      const rightWidth = doc.getTextWidth(dateLocRange);
      doc.setFont(primaryFont, "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(dateLocRange, pageWidth - marginX - rightWidth, y);

      y += 5;

      // Experience Bullet Points
      exp.bullets.forEach((bullet) => {
        if (!bullet.trim()) return;
        
        // Bullet point character
        checkPageBreak(5);
        doc.setFont(primaryFont, "normal");
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        doc.text("•", marginX + 1.5, y);

        // Word wrap long bullet texts
        const bulletTextWidth = printableWidth - 6;
        const wrappedLines = doc.splitTextToSize(bullet, bulletTextWidth);
        
        wrappedLines.forEach((line: string, index: number) => {
          if (index > 0) {
            checkPageBreak(4.5);
          }
          doc.text(line, marginX + 5, y);
          if (index < wrappedLines.length - 1) {
            y += 4;
          }
        });
        y += 4.5;
      });

      y += 1.5; // space between roles
    });
  }

  // 4. PROJECTS
  if (resumeData.projects.length > 0) {
    drawSectionHeader("Technical Projects");

    resumeData.projects.forEach((proj) => {
      checkPageBreak(15);

      // Title & Tech left
      doc.setFont(boldFont, "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);

      const title = proj.title || "Project Title";
      doc.text(title, marginX, y);
      
      if (proj.technologies) {
        const titleWidth = doc.getTextWidth(title);
        doc.setFont(italicFont, "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(` (${proj.technologies})`, marginX + titleWidth, y);
      }

      // If project has role, put it underneath or next to it
      if (proj.role) {
        y += 4;
        doc.setFont(italicFont, "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(proj.role, marginX, y);
      }

      y += 4.5;

      // Project Bullet Points
      proj.bullets.forEach((bullet) => {
        if (!bullet.trim()) return;

        checkPageBreak(5);
        doc.setFont(primaryFont, "normal");
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        doc.text("•", marginX + 1.5, y);

        const bulletTextWidth = printableWidth - 6;
        const wrappedLines = doc.splitTextToSize(bullet, bulletTextWidth);
        
        wrappedLines.forEach((line: string, index: number) => {
          if (index > 0) {
            checkPageBreak(4.5);
          }
          doc.text(line, marginX + 5, y);
          if (index < wrappedLines.length - 1) {
            y += 4;
          }
        });
        y += 4.5;
      });

      y += 1.5; // spacing
    });
  }

  // 5. EXTRACURRICULARS
  if (resumeData.extracurriculars.length > 0) {
    drawSectionHeader("Leadership & Activities");

    resumeData.extracurriculars.forEach((ec) => {
      checkPageBreak(15);

      // Role/Organization left, Date right
      doc.setFont(boldFont, "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);

      const roleOrg = `${ec.role || "Role"} | ${ec.organization || "Organization"}`;
      doc.text(roleOrg, marginX, y);

      const ecDates = `${ec.startDate} – ${ec.endDate || "Present"}`;
      const ecDatesWidth = doc.getTextWidth(ecDates);
      doc.setFont(primaryFont, "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(ecDates, pageWidth - marginX - ecDatesWidth, y);

      y += 5;

      // Bullets
      ec.bullets.forEach((bullet) => {
        if (!bullet.trim()) return;

        checkPageBreak(5);
        doc.setFont(primaryFont, "normal");
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);
        doc.text("•", marginX + 1.5, y);

        const bulletTextWidth = printableWidth - 6;
        const wrappedLines = doc.splitTextToSize(bullet, bulletTextWidth);
        
        wrappedLines.forEach((line: string, index: number) => {
          if (index > 0) {
            checkPageBreak(4.5);
          }
          doc.text(line, marginX + 5, y);
          if (index < wrappedLines.length - 1) {
            y += 4;
          }
        });
        y += 4.5;
      });

      y += 1.5;
    });
  }

  // 6. SKILLS
  const hasSkills = resumeData.skills.languages || resumeData.skills.frameworks || resumeData.skills.tools;
  if (hasSkills) {
    drawSectionHeader("Skills Directory");

    const renderSkillsRow = (label: string, value: string) => {
      if (!value) return;
      checkPageBreak(6);

      doc.setFont(boldFont, "bold");
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text(`${label}: `, marginX, y);

      const labelWidth = doc.getTextWidth(`${label}: `);
      doc.setFont(primaryFont, "normal");
      doc.setTextColor(71, 85, 105);

      const wrappedLines = doc.splitTextToSize(value, printableWidth - labelWidth);
      wrappedLines.forEach((line: string, index: number) => {
        if (index > 0) {
          checkPageBreak(4.5);
        }
        doc.text(line, marginX + labelWidth, y);
        if (index < wrappedLines.length - 1) {
          y += 4;
        }
      });
      y += 4.5;
    };

    renderSkillsRow("Languages", resumeData.skills.languages);
    renderSkillsRow("Frameworks", resumeData.skills.frameworks);
    renderSkillsRow("Tools & Tech", resumeData.skills.tools);
  }

  // 7. ACHIEVEMENTS
  const validAchievements = resumeData.achievements.filter((ach) => ach.trim());
  if (validAchievements.length > 0) {
    drawSectionHeader("Honors & Accomplishments");

    validAchievements.forEach((ach) => {
      checkPageBreak(5);
      doc.setFont(primaryFont, "normal");
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text("•", marginX + 1.5, y);

      const wrappedLines = doc.splitTextToSize(ach, printableWidth - 6);
      wrappedLines.forEach((line: string, index: number) => {
        if (index > 0) {
          checkPageBreak(4.5);
        }
        doc.text(line, marginX + 5, y);
        if (index < wrappedLines.length - 1) {
          y += 4;
        }
      });
      y += 4.5;
    });
  }

  // Download PDF
  const filename = `${name.toLowerCase().replace(/\s+/g, "_")}_resume.pdf`;
  doc.save(filename);
}
