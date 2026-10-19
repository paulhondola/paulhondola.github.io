import vibecodiumEditor from "../assets/projects/vibecodium_editor.png";
import imageProcessingBench from "../assets/projects/image_processing_bench.png";

export interface Bar {
  label: string;
  value: number;
  display: string;
  highlight?: boolean;
}

type Media =
  | { kind: "image"; src: ImageMetadata; alt: string }
  | { kind: "bars"; caption: string; bars: Bar[] }
  | { kind: "pipeline"; caption: string; steps: string[] };

export interface Project {
  title: string;
  context: string;
  period: string;
  metric: string;
  problem: string;
  tried: string;
  measured: string;
  decided: string;
  tech: string[];
  links: { label: string; href: string }[];
  isPrivate?: boolean;
  media: Media;
}

export interface ArchiveProject {
  title: string;
  description: string;
  href: string;
}

export const projects: Project[] = [
  {
    title: "Groundly",
    context: "Bachelor thesis",
    period: "Jul 2026 →",
    metric: "peak indexing memory >16 GB → 5.05 GB, flat at any document size",
    problem:
      "Coding agents answer course questions from memory. Groundly is an MCP server, tested with Claude Code and Codex, that grounds them in the actual course materials with zero API keys.",
    tried:
      "A reranked hybrid retriever (bge-m3 dense + learned sparse + BM25, reciprocal rank fusion, cross-encoder reranking) against 3 GraphRAG retrieval strategies.",
    measured:
      "124 gold questions across 2 course corpora, and peak indexing memory profiled with memray.",
    decided:
      "GraphRAG didn't beat the hybrid baseline, so I removed it along with the external-model answer pipeline. Streaming fp16 embeddings in bounded batches into SQLite flattened memory at 5.05 GB.",
    tech: ["Python", "FastMCP", "SQLite", "bge-m3", "memray"],
    links: [
      { label: "github", href: "https://github.com/paulhondola/groundly" },
    ],
    media: {
      kind: "bars",
      caption: "peak indexing memory",
      bars: [
        { label: "before", value: 16, display: ">16 GB" },
        { label: "after", value: 5.05, display: "5.05 GB", highlight: true },
      ],
    },
  },
  {
    title: "EchoCare",
    context:
      "tech lead across backend, cloud, dashboard and Android · team of 4",
    period: "Oct 2026 →",
    metric: "staging + production on Railway · 194 backend tests",
    problem:
      "Seniors living alone need someone to notice when something goes wrong. EchoCare checks in through automated phone calls, a Wear OS watch and an Android app, and hands emergencies to a dispatch team.",
    tried:
      "Twilio check-in calls detect alarm phrases and open incidents on the dispatch team's Svelte dashboard, refreshed every 15 s. One Android app serves seniors, caregivers, medics and dispatch, backed by FastAPI and PostgreSQL.",
    measured:
      "194 backend tests. CI runs only for the folder a change touches, and Railway waits for it before deploying.",
    decided:
      "Watch paths keep docs, dashboard and Android changes from redeploying the API, which would drop live calls. Consent is append-only history, and the big calls are written down in 4 ADRs.",
    tech: [
      "FastAPI",
      "PostgreSQL",
      "Twilio",
      "Kotlin",
      "Wear OS",
      "SvelteKit",
      "Railway",
    ],
    links: [],
    isPrivate: true,
    media: {
      kind: "pipeline",
      caption: "deploys never drop live calls",
      steps: ["PR", "CI (per folder)", "staging", "release PR", "production"],
    },
  },
  {
    title: "gemm-bench",
    context: "Rust · HPC",
    period: "Sep – Oct 2026",
    metric: "679 GFLOPS f32 · 87% of the M1 Pro's NEON peak",
    problem:
      "How close can hand-written Rust get to the hardware, and how far is that from Apple's AMX units and the GPU?",
    tried:
      "9 CPU GEMM kernels, from cache tiling and Rayon work-stealing to a BLIS-style packed micro-kernel with std::simd register blocking.",
    measured:
      "5 precisions against Apple AMX and Metal GPU. Results from 8 machines and 4 contributors in strict-schema SQLite, validated in CI on Ubuntu, Windows and macOS (147 Rust tests).",
    decided:
      "Published every result in a live dashboard: 679 GFLOPS on the CPU, 1.9–2.3 TFLOPS on AMX, 3.5 TFLOPS on the GPU.",
    tech: [
      "Rust",
      "Rayon",
      "std::simd",
      "Metal",
      "Accelerate",
      "SQLite",
      "Svelte",
    ],
    links: [
      { label: "github", href: "https://github.com/paulhondola/gemm-bench" },
      {
        label: "live dashboard",
        href: "https://paulhondola.github.io/gemm-bench/",
      },
    ],
    media: {
      kind: "bars",
      caption: "f32 GFLOPS",
      bars: [
        {
          label: "packed micro-kernel",
          value: 679,
          display: "679",
          highlight: true,
        },
        { label: "Apple AMX", value: 2300, display: "1.9–2.3k" },
        { label: "Metal GPU", value: 3500, display: "3.5k" },
      ],
    },
  },
  {
    title: "Vibecodium",
    context: "1st place, iTEC 2026 · co-lead, team of 4",
    period: "Mar – Jun 2026",
    metric: "sandbox: 4 languages · 2 GB cap · no network · 3 s timeout",
    problem:
      "A browser IDE where several people edit and run the same code in real time.",
    tried:
      "Yjs CRDTs for multi-user editing. I owned the workspace UI and the REST APIs.",
    measured:
      "User code runs in a Docker sandbox for 4 languages with a 2 GB memory cap, no network access and a 3 s timeout.",
    decided:
      "Every run gets its own capped, offline container. The project took 1st place at iTEC 2026.",
    tech: ["TypeScript", "React", "Bun", "Supabase", "Yjs", "Docker"],
    links: [
      { label: "github", href: "https://github.com/paulhondola/vibecodium" },
    ],
    media: {
      kind: "image",
      src: vibecodiumEditor,
      alt: "Vibecodium's collaborative editor with a file tree and code panel",
    },
  },
  {
    title: "Distributed Image Processing",
    context: "Parallel Algorithms coursework",
    period: "Dec 2025 – Feb 2026",
    metric: "median 6.8× speedup with 8 MPI processes",
    problem:
      "2D convolution on images up to 16800×12600 px is slow on a single core.",
    tried:
      "5 execution models: serial, OpenMP, MPI message passing, shared-file I/O and a master-worker task pool.",
    measured: "Scaling of every model, benchmarked with a Python suite.",
    decided: "MPI with 8 processes gave a median 6.8× speedup over serial.",
    tech: ["C", "MPI", "OpenMP", "Python"],
    links: [
      {
        label: "github",
        href: "https://github.com/paulhondola/MPI-OpenMP-Image-Processing",
      },
    ],
    media: {
      kind: "image",
      src: imageProcessingBench,
      alt: "Benchmark charts comparing the image-processing execution models",
    },
  },
];

export const archive: ArchiveProject[] = [
  {
    title: "Smart Shopping Assistant",
    description:
      "E-commerce platform with a two-agent LLM cart analyzer, on ASP.NET Core and PostgreSQL.",
    href: "https://github.com/paulhondola/Smart-Shopping-Assistant",
  },
  {
    title: "ArchLens Analyzer",
    description:
      "CLI that reverse-engineers .jar and .dll binaries into UML class diagrams.",
    href: "https://github.com/paulhondola/archlens",
  },
  {
    title: "AtomC Compiler",
    description:
      "Compiler for a C-like language, in C: lexer, semantic analyzer and a stack-based VM.",
    href: "https://github.com/paulhondola/atomc_compiler",
  },
  {
    title: "Parallel DMM Benchmark",
    description:
      "Dense matrix multiplication with OpenMP, cache blocking and SIMD, checked in the generated assembly.",
    href: "https://github.com/paulhondola/OpenMP-Dense-Matrix-Multiplication",
  },
];
