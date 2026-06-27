/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResumeData } from "./types";

export const emptyResume: ResumeData = {
  contact: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: ""
  },
  education: [
    {
      id: "edu-1",
      institution: "",
      degree: "",
      major: "",
      gpa: "",
      graduationDate: "",
      coursework: ""
    }
  ],
  projects: [],
  experience: [],
  extracurriculars: [],
  skills: {
    languages: "",
    frameworks: "",
    tools: ""
  },
  achievements: []
};

export const sampleStudentResume: ResumeData = {
  contact: {
    fullName: "Alex Rivera",
    email: "alex.rivera@university.edu",
    phone: "(555) 019-2834",
    location: "Austin, TX",
    linkedin: "linkedin.com/in/alex-rivera-student",
    github: "github.com/alexriveradev",
    portfolio: "alexrivera.dev"
  },
  education: [
    {
      id: "edu-1",
      institution: "University of Texas at Austin",
      degree: "Bachelor of Science",
      major: "Computer Science",
      gpa: "3.85 / 4.00",
      graduationDate: "May 2027",
      coursework: "Data Structures, Algorithms, Web Development, Database Management, Software Engineering"
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Campus RideShare Hub",
      technologies: "React, Node.js, Express, PostgreSQL, Google Maps API",
      role: "Full-Stack Developer (Personal Project)",
      bullets: [
        "Architected and developed a full-stack real-time carpooling application used by 150+ students, resulting in an estimated 30% reduction in weekly student transit costs.",
        "Engineered secure JWT authentication and optimized PostgreSQL database queries, improving endpoint response times by 120ms during peak booking hours.",
        "Integrated Google Maps Directions API to dynamically calculate carpool route overlaps and match passengers with nearby drivers."
      ]
    },
    {
      id: "proj-2",
      title: "AI Study Buddy Chrome Extension",
      technologies: "JavaScript, HTML/CSS, Chrome Extension API, Gemini API",
      role: "Lead Creator (Hackathon Winning Project)",
      bullets: [
        "Built a browser extension that summarizes lecture transcripts and auto-generates study cards, capturing 1st Place in the 'Most Innovative Hack' category at UT Hackathon.",
        "Implemented local chrome storage synchronization to persist deck histories, allowing users to study offline with 100% data preservation."
      ]
    }
  ],
  experience: [
    {
      id: "exp-1",
      company: "Apex Tech Solutions",
      role: "Software Engineering Intern",
      location: "Dallas, TX",
      startDate: "June 2025",
      endDate: "August 2025",
      bullets: [
        "Developed and maintained React frontends for a high-traffic client portal, improving user engagement metrics by 15% through streamlined navigation.",
        "Collaborated with senior engineers to implement Jest unit tests, increasing overall codebase test coverage from 68% to 84% across core microservices.",
        "Refactored complex state management from legacy Prop Drilling to React Context, reducing redundant API re-renders by 25%."
      ]
    },
    {
      id: "exp-2",
      company: "UT Austin CS Department",
      role: "Undergraduate Teaching Assistant",
      location: "Austin, TX",
      startDate: "September 2025",
      endDate: "Present",
      bullets: [
        "Lead twice-weekly recitation sessions for 45+ freshman students covering fundamental data structures (trees, graphs, hashing) and sorting algorithms.",
        "Deliver clear, objective feedback on code quality and complexity while grading weekly programming assignments, boosting average exam scores by 8%."
      ]
    }
  ],
  extracurriculars: [
    {
      id: "extra-1",
      organization: "Association for Computing Machinery (ACM)",
      role: "Technical Workshop Director",
      startDate: "September 2024",
      endDate: "Present",
      bullets: [
        "Organized and hosted 8 hands-on software workshops covering Git fundamentals, React, and Python, drawing an average attendance of 60+ undergraduate students.",
        "Established a student mentorship program matching 30+ sophomores with senior student leaders in research and industry."
      ]
    },
    {
      id: "extra-2",
      organization: "UT Dev Club",
      role: "Active Member & Frontend Lead",
      startDate: "January 2024",
      endDate: "Present",
      bullets: [
        "Contributed to building the club's new open-source website using Tailwind CSS, ensuring 100% responsive design across mobile and desktop devices."
      ]
    }
  ],
  skills: {
    languages: "TypeScript, JavaScript, Python, Java, SQL, C++",
    frameworks: "React, Node.js, Express, Next.js, Flask, Tailwind CSS",
    tools: "Git, GitHub Actions, Docker, PostgreSQL, MongoDB, Postman, Figma"
  },
  achievements: [
    "UT Hackathon 2025 - Winner of 'Most Innovative Hack' (out of 120 teams)",
    "College of Natural Sciences Dean's Honor List (4 consecutive semesters)",
    "Academic Excellence Scholarship Recipient (representing top 5% of incoming class)"
  ]
};

export const sampleRoles = [
  "Software Engineering Intern",
  "Frontend Developer Intern",
  "Backend Developer Intern",
  "Product Management Intern",
  "Data Analyst Intern",
  "UI/UX Design Intern",
  "Cloud Engineer Co-op",
  "Finance Analyst Intern",
  "Marketing & Content Co-op"
];
