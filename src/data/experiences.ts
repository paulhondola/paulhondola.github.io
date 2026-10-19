export interface Experience {
  role: string;
  company: string;
  period: string;
  stack: string[];
  points: string[];
}

export const experiences: Experience[] = [
  {
    role: "Software Engineer Intern",
    company: "Nokia",
    period: "Mar 2026 →",
    stack: ["Python", "pandas", "MariaDB", "Jenkins", "GitLab", "Power BI"],
    points: [
      "Re-architected two financial data pipelines (2 h 15 min + 7 min) into one 8-minute pipeline run every 2 h (~18× faster) by vectorizing row-by-row pandas logic and parallelizing data fetching via v2 API parameters and concurrent exports. A prod-vs-dev diff caught silently dropped legacy entries.",
      "Restored 3 product-management pipelines broken by an upstream access change with a minimal hotfix (HTML → XML export parsing), then proposed and executed a ~90-file rewrite that removed duplicated logic through a shared module layer and a uniform index/parser/pipeline structure per data source.",
    ],
  },
  {
    role: "Full Stack Developer Intern",
    company: "Hibyte",
    period: "Jul – Oct 2025",
    stack: ["TypeScript", "Angular", "NestJS", "Payload CMS", "Supabase"],
    points: [
      "Built the role-based authentication layer (Supabase JWTs validated by NestJS guards across admin, staff and customer roles) and backend routes for a game-center management proof of concept, in a 5-person team.",
      "Configured 7 Payload CMS collections for non-technical admins and maintained Supabase migrations through continuous schema changes.",
    ],
  },
  {
    role: "Reverse Engineering & Malware Analysis Trainee",
    company: "Bitdefender × LigaAC",
    period: "Apr – Jun 2025",
    stack: ["C", "Python", "x86 Assembly", "IDA Pro", "Frida"],
    points: [
      "Reversed a file-encryption routine from x86 disassembly in IDA Pro and wrote working decryptors in C for 5 file formats, plus a keygen reproducing a licence algorithm from recovered lookup tables and hash logic.",
      "Unpacked dynamically loaded Android DEX payloads with Frida hooks on DexClassLoader/DexFile, and built Python/Java tools to decrypt locker-app data across 8 reverse-engineering labs.",
    ],
  },
];
