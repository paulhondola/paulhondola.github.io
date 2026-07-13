export interface ProjectImage {
  main: string;
  hover?: string;
}

export interface Project {
  title: string;
  badge: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  image: ProjectImage;
  disabled?: boolean;
}

export const projects: Project[] = [
  {
    title: "Vibecodium",
    badge: "1st Place — iTEC 2026 Web Dev",
    description:
      "Collaborative browser-based IDE with real-time multi-user editing (Yjs CRDT), an AI coding assistant via SSE streaming, sandboxed Docker execution, GitHub integration, and one-click Vercel deploys.",
    tech: ["React", "Hono", "Bun", "Supabase", "Docker", "Vercel"],
    github: "https://github.com/paulhondola/vibecodium",
    live: "",
    image: {
      main: "/projects/vibecodium_repo.png",
      hover: "/projects/vibecodium_editor.png",
    },
    disabled: false,
  },
  {
    title: "Smart Shopping Assistant",
    badge: "Full-Stack · LigaAC Labs × NetRom",
    description:
      "Full-stack e-commerce platform with an AI-powered agentic cart analyzer. Sequential two-agent LLM pipeline detecting promotions and composing personalized recommendations. Layered ASP.NET Core backend over PostgreSQL with JWT RBAC.",
    tech: ["React", "TypeScript", "ASP.NET Core", "PostgreSQL", "OpenAI"],
    github: "https://github.com/paulhondola/Smart-Shopping-Assistant",
    live: "",
    image: {
      main: "/projects/smart-shopping-assistant.png",
    },
    disabled: false,
  },
  {
    title: "ArchLens Analyzer",
    badge: "CLI Tool · Reverse Engineering",
    description:
      "Polyglot CLI tool (Python orchestrator + Java/C# backends) that reverse-engineers compiled binaries (.jar, .dll) into UML class diagrams via runtime reflection. Outputs PlantUML and yUML across a Maven and .NET monorepo.",
    tech: ["Python", "Java", "C#"],
    github: "https://github.com/paulhondola/archlens",
    live: "",
    image: {
      main: "/projects/java_analyzer.png",
      hover: "/projects/archlens.png",
    },
    disabled: false,
  },
  {
    title: "AtomC Compiler",
    badge: "Compiler Design",
    description:
      "Recursive-descent compiler frontend for a C-like language written from scratch in C. Implements lexical analysis, tokenization, a semantic analyzer, a stack-based VM, and code generator. Full CI pipeline with integration test suites.",
    tech: ["C", "Meson"],
    github: "https://github.com/paulhondola/atomc_compiler",
    live: "",
    image: {
      main: "/projects/atomc_compiler.png",
    },
    disabled: false,
  },
  {
    title: "Distributed Image Processing System",
    badge: "High Performance Computing",
    description:
      "Hybrid parallel image processing engine using MPI for distributed memory and OpenMP for shared memory. Architectures include multithreaded, message passing, shared filesystem, producer-consumer task pool, and full hybrid parallelism. Python benchmarking suite with scaling analysis.",
    tech: ["C", "MPI", "OpenMP", "Python", "Assembly"],
    github: "https://github.com/paulhondola/MPI-OpenMP-Image-Processing",
    live: "",
    image: {
      main: "/projects/image_processing_bench.png",
      hover: "/projects/image_processing.png",
    },
    disabled: false,
  },
  {
    title: "Parallel DMM Benchmark",
    badge: "High Performance Computing",
    description:
      "Benchmarking suite for dense matrix multiplication implementing serial and parallel algorithms with OpenMP. Covers loop permutations, cache blocking (tiling), and SIMD vectorization validated by inspecting generated assembly across compiler optimization levels.",
    tech: ["C", "OpenMP", "Python", "Assembly"],
    github: "https://github.com/paulhondola/OpenMP-Dense-Matrix-Multiplication",
    live: "",
    image: {
      main: "/projects/dmm_bench.png",
      hover: "/projects/dmm.png",
    },
    disabled: false,
  },
];
