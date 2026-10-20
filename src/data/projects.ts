import groundlyCli from "../assets/projects/groundly.png";
import echocareDashboard from "../assets/projects/echocare_dashboard.png";
import gemmBench from "../assets/projects/gemm_bench.png";
import vibecodiumEditor from "../assets/projects/vibecodium_editor.png";

export interface Bar {
  label: string;
  value: number;
  display: string;
  detail?: string;
  highlight?: boolean;
  // Dashed reference tick (peak, perfect scaling), on the same scale as value.
  mark?: number;
}

export interface BarsGraph {
  kind: "bars";
  caption: string;
  bars: Bar[];
  scale?: "linear" | "log";
  domain?: [number, number];
  note?: string;
}

export interface Step {
  value?: string;
  label: string;
}

export interface PipelineGraph {
  kind: "pipeline";
  caption: string;
  steps: Step[];
}

export interface StackedGraph {
  kind: "stacked";
  caption: string;
  max: number;
  rows: { label: string; display: string; parts: [number, number] }[];
  legend: [string, string];
  note?: string;
}

export interface FlowGraph {
  kind: "flow";
  caption: string;
  columns: string[][];
  highlight: string;
}

export interface SpecsGraph {
  kind: "specs";
  caption: string;
  specs: { value: string; label: string }[];
}

export type Graph =
  BarsGraph | PipelineGraph | StackedGraph | FlowGraph | SpecsGraph;

export type App =
  | {
      kind: "image";
      src: ImageMetadata;
      alt: string;
      caption: string;
      below?: PipelineGraph;
    }
  | SpecsGraph;

// `measured` decides the colour: only measurements render in signal green.
export interface Tile {
  value: string;
  label: string;
  measured: boolean;
}

export interface ProofPart {
  text: string;
  measured: boolean;
}

export interface Project {
  title: string;
  context: string;
  period: string;
  what: string;
  proof: ProofPart[];
  problem: string;
  tried: string;
  measured: string;
  decided: string;
  tech: string[];
  links: { label: string; href: string }[];
  isPrivate?: boolean;
  graphs: Graph[];
  app: App;
  tiles?: Tile[];
}

export interface ArchiveProject {
  title: string;
  description: string;
  href: string;
}

// Every number below is sourced in
// docs/superpowers/specs/2026-10-20-hero-and-project-cards-design.md.
export const projects: Project[] = [
  {
    title: "Groundly",
    context: "Bachelor thesis",
    period: "Jul 2026 →",
    what: "Local-first MCP RAG server for learning progress",
    proof: [
      { text: "zero API keys", measured: false },
      {
        text: "flat 5.05 GB peak memory at any document size",
        measured: true,
      },
    ],
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
    graphs: [
      {
        kind: "bars",
        caption: "peak indexing memory",
        domain: [0, 16],
        bars: [
          { label: "before", value: 16, display: ">16 GB" },
          { label: "after", value: 5.05, display: "5.05 GB", highlight: true },
        ],
        note: "streaming fp16 embeddings in bounded batches into SQLite",
      },
    ],
    app: {
      kind: "image",
      src: groundlyCli,
      caption: "the app · groundly CLI",
      alt: "Groundly's command-line help in a terminal, listing its commands",
    },
    tiles: [
      {
        value: "17% → 60%",
        label:
          "how often a coding agent given only the search tool searched the course unprompted, after I rewrote the tool descriptions and server instructions together (48 questions, p = 1.9e-05)",
        measured: true,
      },
      {
        value: "71% vs 67%",
        label:
          "hit rate at 8 chunks, plain hybrid retrieval vs GraphRAG on its best graph build. Retrieval led at 5, 8, 10 and 20 chunks on every build, so the graph left the default path",
        measured: true,
      },
      {
        value: "verified",
        label:
          "the agent writes flashcards, Groundly re-retrieves each one and rejects any its citations don't support, then exports to Anki",
        measured: false,
      },
      {
        value: "0.73 h",
        label:
          "the graph build a coursemate skips by importing the bundle instead (apd, gpt-oss-120b, measured)",
        measured: true,
      },
    ],
  },
  {
    title: "EchoCare",
    context: "tech lead · team of 4",
    period: "Oct 2026 →",
    what: "Large-scale agentic monitoring for seniors living alone",
    proof: [
      {
        text: "live on Railway staging + production · calls, watch, Android app and dispatch in one system",
        measured: false,
      },
    ],
    problem:
      "Seniors living alone need someone to notice when something goes wrong. EchoCare checks in through automated phone calls, a Wear OS watch and an Android app, and hands emergencies to a dispatch team.",
    tried:
      "Twilio check-in calls detect alarm phrases and open incidents on the dispatch team's Svelte dashboard, refreshed every 15 s. One Android app serves seniors, caregivers, medics and dispatch, backed by FastAPI and PostgreSQL.",
    measured:
      "CI runs only for the folder a change touches, and Railway waits for it before deploying.",
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
    graphs: [
      {
        kind: "flow",
        caption: "how an alarm reaches a human",
        columns: [
          ["weather warning", "abnormal watch reading", "request from the app"],
          ["AI agent calls the senior", "server scores green / yellow / red"],
          ["red: incident opened", "DAS dispatcher takes the call", "resolved"],
        ],
        highlight: "AI agent calls the senior",
      },
    ],
    app: {
      kind: "image",
      src: echocareDashboard,
      caption: "the app · dispatch board",
      alt: "EchoCare's dispatch board with a red-code incident banner above the incident list, using seeded test data",
    },
    tiles: [
      {
        value: "AI agent",
        label:
          "calls each senior in Romanian during a heatwave or frost. The server turns the answers into green / yellow / red",
        measured: false,
      },
      {
        value: "ElevenLabs voice",
        label:
          "Twilio and Google transcribe the senior, ElevenLabs speaks the agent's replies. The backend only ever sees text, and no audio is stored",
        measured: false,
      },
      {
        value: "every 15 min",
        label:
          "the custom Wear OS app sends a status overview: worn, battery, last reading. A watch silent for 45 min is flagged offline",
        measured: false,
      },
      {
        value: "instantly",
        label:
          "a pulse, fall or inactivity spike skips the schedule, goes out immediately and starts an automated call",
        measured: false,
      },
    ],
  },
  {
    title: "gemm-bench",
    context: "Rust · HPC",
    period: "Sep – Oct 2026",
    what: "An Apple Silicon-first, hand-tuned GEMM benchmark across CPU, AMX and GPU",
    proof: [
      {
        text: "679 GFLOPS f32 · 87% of the M1 Pro's NEON peak",
        measured: true,
      },
    ],
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
    graphs: [
      {
        kind: "bars",
        caption: "my CPU tuning · f32 · log scale",
        scale: "log",
        domain: [0.1, 1000],
        bars: [
          { label: "naive ijk", value: 0.525, display: "0.525" },
          { label: "packed, 1 core", value: 92.8, display: "92.8" },
          {
            label: "rayon-packed, 8 P-cores",
            value: 679,
            display: "679",
            highlight: true,
            mark: 777.216,
          },
        ],
        note: "dashed line = NEON peak · ~1,300× from naive to tuned",
      },
      {
        kind: "bars",
        caption: "best run per engine · f32",
        domain: [0, 3538],
        bars: [
          { label: "CPU · my rayon-packed", value: 679, display: "679" },
          { label: "AMX · Accelerate BLAS", value: 1897, display: "1,897" },
          { label: "AMX · Accelerate BNNS", value: 2318, display: "2,318" },
          {
            label: "GPU · my Metal simdgroup shader",
            value: 2886,
            display: "2,886",
          },
          {
            label: "GPU · Apple MPS",
            value: 3538,
            display: "3,538",
            highlight: true,
          },
        ],
        note: "GFLOPS, best run per engine on the M1 Pro · BLAS at N=1024, the rest at N=4096",
      },
    ],
    app: {
      kind: "image",
      src: gemmBench,
      caption: "the app · live dashboard",
      alt: "gemm-bench's live dashboard comparing GFLOPS across CPU kernels, AMX and the GPU",
    },
    tiles: [
      {
        value: "3,538",
        label:
          "GFLOPS f32 on the GPU through Apple's MPS, the fastest f32 result on the M1 Pro",
        measured: true,
      },
      {
        value: "82%",
        label:
          "of MPS reached by my hand-written Metal simdgroup shader (2,886 GFLOPS f32), 97% at f16",
        measured: true,
      },
      {
        value: "+22%",
        label:
          "BNNS's best over BLAS's best on the same AMX coprocessor: 2,318 GFLOPS f32 at N=4096 vs 1,897 at N=1024",
        measured: true,
      },
      {
        value: "4,721",
        label:
          "GFLOPS f16 on AMX through BNNS at N=1024, the fastest f16 result on the M1 Pro",
        measured: true,
      },
    ],
  },
  {
    title: "Vibecodium",
    context: "co-lead · team of 4",
    period: "Mar – Jun 2026",
    what: "Real-time collaborative IDE · 1st place, iTEC 2026 (web dev)",
    proof: [
      {
        text: "user code sandboxed in 6 runtimes · 2 GB cap · no network · 3 s timeout",
        measured: false,
      },
    ],
    problem:
      "A browser IDE where several people edit and run the same code in real time.",
    tried:
      "Yjs CRDTs for multi-user editing. I owned the workspace UI and the REST APIs.",
    measured:
      "User code runs in a Docker sandbox for 6 runtimes with a 2 GB memory cap, no network access and a 3 s timeout.",
    decided:
      "User code runs sandboxed, capped and offline. The project took 1st place at iTEC 2026.",
    tech: ["TypeScript", "React", "Bun", "Supabase", "Yjs", "Docker"],
    links: [
      { label: "github", href: "https://github.com/paulhondola/vibecodium" },
    ],
    graphs: [
      {
        kind: "specs",
        caption: "sandbox limits",
        specs: [
          { value: "6", label: "runtimes: Python, Node, Bun, C++, Rust, Go" },
          { value: "2 GB", label: "memory cap" },
          { value: "none", label: "network access" },
          { value: "3 s", label: "timeout" },
        ],
      },
    ],
    app: {
      kind: "image",
      src: vibecodiumEditor,
      caption: "the app · editor",
      alt: "Vibecodium's collaborative editor with a file tree and code panel",
    },
    tiles: [
      {
        value: "Yjs CRDT",
        label:
          "every keystroke merges conflict-free across clients, with per-user cursors and file focus in per-project WebSocket rooms",
        measured: false,
      },
      {
        value: "accept / reject",
        label:
          "the AI agent's edits land as a diff overlay in the editor, and nothing is written until a person accepts it",
        measured: false,
      },
      {
        value: "pre-scan",
        label:
          "static checks block rm -rf /, fork bombs and mkfs before a container ever starts",
        measured: false,
      },
      {
        value: "99 / 233",
        label: "commits, the most of anyone on the team",
        measured: false,
      },
    ],
  },
  {
    title: "Distributed Image Processing",
    context: "Parallel Algorithms coursework",
    period: "Dec 2025 – Feb 2026",
    what: "2D convolution on images up to 16800×12600 px, five execution models",
    proof: [
      { text: "median 6.8× speedup over all 8-process runs", measured: true },
    ],
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
    graphs: [
      {
        kind: "bars",
        caption:
          "MPI scaling · 1 thread per process · 16800×12600 px · 3×3 kernel",
        domain: [0, 8],
        bars: [
          {
            label: "2 × 1 thread",
            value: 1.82,
            display: "1.82×",
            detail: "91%",
            mark: 2,
          },
          {
            label: "4 × 1 thread",
            value: 3.52,
            display: "3.52×",
            detail: "88%",
            mark: 4,
          },
          {
            label: "8 × 1 thread",
            value: 6.51,
            display: "6.51×",
            detail: "81%",
            highlight: true,
            mark: 8,
          },
        ],
        note: "dashed line = perfect scaling · % = parallel efficiency · median of 10 runs",
      },
    ],
    app: {
      kind: "specs",
      caption: "the build · specs",
      specs: [
        {
          value: "6",
          label:
            "convolution kernels: edge, ridge, sharpen, box, gaussian, unsharp",
        },
        {
          value: "5",
          label: "execution models: serial, OpenMP, MPI, shared FS, task pool",
        },
        { value: "212 MP", label: "largest image, 16800×12600 px" },
        { value: "--verify", label: "checks parallel output against serial" },
      ],
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
