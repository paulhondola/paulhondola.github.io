export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string[];
  tech: string[];
}

export const experiences: Experience[] = [
  {
    role: "Software Engineer Intern",
    company: "Nokia",
    period: "Mar 2026 — Present",
    description: [
      "Profiled and optimized data-processing Python scripts, reducing end-to-end runtime by 50% through algorithmic refactoring and NumPy vectorization.",
      "Contributed to the Mobile Infrastructure Metrics Automation platform, developing ETL scripts and automated test pipelines.",
      "Enhanced CI/CD pipelines using Jenkins and Docker for scalable metric processing and analysis.",
      "Maintained and improved interactive Power BI dashboards to surface key metrics and KPIs.",
      "Contributed reusable modules to the team's shared core library, extending functionality across multiple internal automation projects.",
    ],
    tech: ["Python", "Jenkins", "Docker", "Power BI", "NumPy", "Pandas"],
  },
  {
    role: "Full Stack Developer Intern",
    company: "Hibyte",
    period: "Jul 2025 — Oct 2025",
    description: [
      "Engineered 'GameBox', a full-stack monorepo for game center management, integrating a customer-facing web app with an admin CMS.",
      "Built a responsive frontend architecture using Angular, TypeScript, and SCSS.",
      "Developed a backend system using NestJS and Payload CMS, leveraging Supabase for secure authentication and real-time database operations.",
    ],
    tech: ["TypeScript", "Angular", "NestJS", "Payload CMS", "Supabase"],
  },
  {
    role: "Malware Analyst Trainee",
    company: "Bitdefender",
    period: "Apr 2025 — Jun 2025",
    description: [
      "Conducted static and dynamic analysis of Windows and Android malware samples to identify C&C protocols and persistence mechanisms.",
      "Reverse engineered ransomware encryption routines using IDA Pro (x86 disassembly) and jadx (Java decompilation).",
      "Investigated Android system vulnerabilities and exploitation techniques, analyzing APK structures and security models in sandboxed environments.",
    ],
    tech: ["Java", "Python", "C", "x86 Assembly", "IDA Pro", "jadx"],
  },
];
