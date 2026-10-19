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

export const readouts = [
  { value: "~18×", label: "Nokia pipeline" },
  { value: ">16 GB → 5.05 GB", label: "Groundly peak memory" },
  { value: "679 GFLOPS", label: "gemm-bench, 87% of NEON peak" },
  { value: "194", label: "EchoCare backend tests" },
];
