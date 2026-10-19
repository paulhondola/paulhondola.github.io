export interface SkillGroup {
  title: string;
  items: string[];
}

// Verbatim from the CV's Technical Skills section.
export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    items: ["Python", "C", "C++", "Rust", "Java", "TypeScript", "SQL", "Bash"],
  },
  {
    title: "Parallel & HPC",
    items: [
      "MPI",
      "OpenMP",
      "Rayon",
      "POSIX Threads",
      "SIMD/NEON",
      "Cache Optimization",
    ],
  },
  {
    title: "Systems & Tools",
    items: [
      "Linux",
      "Docker",
      "Jenkins",
      "GitHub Actions",
      "GitLab CI",
      "Railway",
      "Meson",
      "Cargo",
      "Maven",
      "IDA Pro",
      "Frida",
    ],
  },
  {
    title: "Data",
    items: [
      "pandas",
      "NumPy",
      "DuckDB",
      "Parquet",
      "Power BI",
      "PostgreSQL",
      "MariaDB",
      "SQLite",
    ],
  },
  {
    title: "Web",
    items: [
      "React",
      "Angular",
      "Svelte",
      "NestJS",
      "FastAPI",
      "Hono",
      "Supabase",
    ],
  },
  {
    title: "Spoken",
    items: ["English (C1)", "Romanian (native)"],
  },
];
