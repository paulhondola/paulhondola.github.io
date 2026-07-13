export interface SkillCategory {
  title: string;
  icon: "code" | "cpu" | "terminal" | "globe" | "database" | "bar-chart";
  color: string;
  border: string;
  skills: string[];
}

export const categories: SkillCategory[] = [
  {
    title: "Languages",
    icon: "code",
    color: "text-blue-400",
    border: "group-hover:border-blue-500/30",
    skills: ["Python", "TypeScript", "Java", "C/C++", "C#", "SQL", "Bash"],
  },
  {
    title: "Web Development",
    icon: "globe",
    color: "text-emerald-400",
    border: "group-hover:border-emerald-500/30",
    skills: [
      "FastAPI",
      "React",
      "NestJS",
      "Hono",
      "ASP.NET Core",
    ],
  },
  {
    title: "High Performance Computing",
    icon: "cpu",
    color: "text-indigo-400",
    border: "group-hover:border-indigo-500/30",
    skills: [
      "MPI",
      "OpenMP",
      "POSIX Threads",
      "SIMD",
      "Shared Memory",
      "Distributed Systems",
    ],
  },
  {
    title: "Systems & Tools",
    icon: "terminal",
    color: "text-violet-400",
    border: "group-hover:border-violet-500/30",
    skills: [
      "Linux",
      "Docker",
      "Jenkins",
      "Git",
      "Meson",
      "CMake",
      "Postman",
      "IDA Pro",
      "jadx",
      "Wireshark",
    ],
  },
  {
    title: "Data Analysis",
    icon: "bar-chart",
    color: "text-rose-400",
    border: "group-hover:border-rose-500/30",
    skills: ["NumPy", "Pandas", "Matplotlib", "PyTorch", "Power BI"],
  },
  {
    title: "Databases",
    icon: "database",
    color: "text-amber-400",
    border: "group-hover:border-amber-500/30",
    skills: ["PostgreSQL", "pgvector", "MariaDB"],
  },
];
