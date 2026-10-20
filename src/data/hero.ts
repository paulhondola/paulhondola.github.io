// Nokia finance pipeline runtimes, Paul's own measurements across iterations.
export const runtime = [
  { label: "before", minutes: 150, display: "2h 30" },
  { label: "", minutes: 90, display: "1h 30" },
  { label: "", minutes: 15, display: "15 min" },
  { label: "now", minutes: 8, display: "8 min" },
];

// What changed, from the CV. Not tied to individual runtime drops.
export const changes = [
  { from: "row-by-row pandas", to: "vectorized" },
  {
    from: "sequential fetches",
    to: "parallel (v2 API params + concurrent exports)",
  },
  { from: "two pipelines", to: "one, run every 2 h" },
  { from: "prod-vs-dev diff", to: "caught silently dropped legacy entries" },
];

// The hero's stack ladder, metal at the top, cloud at the bottom.
// `measured` decides the colour: only measurements render in signal green.
export const ladder = [
  {
    layer: "metal",
    what: "Rust GEMM kernels, std::simd",
    proof: "648 GFLOPS",
    measured: true,
  },
  {
    layer: "binaries",
    what: "x86 reversing, decryptors in C",
    proof: "5 formats",
    measured: false,
  },
  {
    layer: "parallel",
    what: "MPI + OpenMP convolution",
    proof: "6.8×",
    measured: true,
  },
  {
    layer: "data",
    what: "Nokia finance pipelines",
    proof: "~18×",
    measured: true,
  },
  {
    layer: "retrieval",
    what: "Groundly MCP server",
    proof: ">16 GB → 5.05 GB",
    measured: true,
  },
  {
    layer: "cloud",
    what: "EchoCare on Railway",
    proof: "staging + prod",
    measured: false,
  },
];
