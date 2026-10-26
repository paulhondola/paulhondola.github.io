import { email, availability, socials, cvHref } from "../data/site";
import { ladder } from "../data/hero";
import { projects, archive } from "../data/projects";
import { experiences } from "../data/experiences";
import { skillGroups } from "../data/skills";

const SITE_URL = "https://paulhondola.github.io";

export function generateLlmsTxt(): string {
  const lines: string[] = [];

  lines.push("# Paul Hondola");
  lines.push("");
  lines.push(
    "> From metal to cloud: I build complex systems, then take them apart to make them better. Computer Engineering at Universitatea Politehnica Timișoara (UPT, GPA 9.72/10), open to full-time backend, cloud, and systems/performance roles from Jul 2027.",
  );
  lines.push("");

  lines.push("## Contact & Profiles");
  lines.push(`- Website: ${SITE_URL}`);
  lines.push(`- Full LLM Context: ${SITE_URL}/llms-full.txt`);
  lines.push(`- CV (PDF): ${SITE_URL}${cvHref}`);
  lines.push(`- Email: mailto:${email}`);
  for (const s of socials) {
    if (s.label !== "Email") {
      lines.push(`- ${s.label}: ${s.href}`);
    }
  }
  lines.push(`- Availability: ${availability}`);
  lines.push("");

  lines.push("## Key Projects");
  for (const p of projects) {
    const proofs = p.proof.map((pr) => pr.text).join(", ");
    const primaryLink = p.links.find((l) => l.label === "GitHub") ?? p.links[0];
    if (p.isPrivate) {
      lines.push(`- ${p.title} (private repo): ${p.what}. Proof: ${proofs}.`);
    } else if (primaryLink) {
      lines.push(
        `- [${p.title}](${primaryLink.href}): ${p.what}. Proof: ${proofs}.`,
      );
    } else {
      lines.push(`- ${p.title}: ${p.what}. Proof: ${proofs}.`);
    }
  }
  lines.push("");

  lines.push("## Professional Experience");
  for (const exp of experiences) {
    lines.push(
      `- **${exp.company}** — ${exp.role} (${exp.period}): ${exp.points[0]}`,
    );
  }
  lines.push("");

  lines.push("## Technical Skills");
  for (const group of skillGroups) {
    lines.push(`- **${group.title}**: ${group.items.join(", ")}`);
  }
  lines.push("");

  lines.push("## More Information");
  lines.push(
    `For complete engineering traces (Problem → Tried → Measured → Decided), benchmark stats, and archive projects, see [llms-full.txt](${SITE_URL}/llms-full.txt).`,
  );

  return lines.join("\n") + "\n";
}

export function generateLlmsFullTxt(): string {
  const lines: string[] = [];

  lines.push("# Paul Hondola — Full Engineering Portfolio");
  lines.push("");
  lines.push(
    "> From metal to cloud: I build complex systems, then take them apart to make them better. Computer Engineering at Universitatea Politehnica Timișoara (UPT, Oct 2023 – Jul 2027, GPA 9.72/10). Open to full-time backend, cloud, and systems/performance roles from Jul 2027.",
  );
  lines.push("");

  lines.push("## Contact & Profiles");
  lines.push(`- Website: ${SITE_URL}`);
  lines.push(`- CV (PDF): ${SITE_URL}${cvHref}`);
  lines.push(`- Email: mailto:${email}`);
  for (const s of socials) {
    if (s.label !== "Email") {
      lines.push(`- ${s.label}: ${s.href}`);
    }
  }
  lines.push(`- Availability: ${availability}`);
  lines.push("");

  lines.push("## Education");
  lines.push(
    "- **Universitatea Politehnica Timișoara (UPT)**: BSc Computer Engineering, Oct 2023 – Jul 2027 (expected). GPA 9.72/10.",
  );
  lines.push(
    "- **Relevant Coursework**: Data Structures and Algorithms, Parallel and Distributed Algorithms, Operating Systems, Computer Architecture, Formal Languages and Compilation Techniques, Software Architecture, Networking, Databases.",
  );
  lines.push("");

  lines.push("## Systems Stack Ladder");
  for (const item of ladder) {
    lines.push(
      `- **${item.layer}**: ${item.what} — ${item.proof} (${item.measured ? "measured" : "stated"})`,
    );
  }
  lines.push("");

  lines.push("## Core Projects & Engineering Traces");
  lines.push(
    "Every claim is measured and grounded in repo evidence, benchmarks, or thesis experiments.",
  );
  lines.push("");

  for (const p of projects) {
    lines.push(`### ${p.title}`);
    lines.push(`- **Context**: ${p.context} (${p.period})`);
    lines.push(`- **Summary**: ${p.what}`);
    if (p.isPrivate) {
      lines.push("- **Access**: private repo (code available on request)");
    } else {
      const linkList = p.links.map((l) => `[${l.label}](${l.href})`).join(", ");
      lines.push(`- **Links**: ${linkList}`);
    }
    lines.push(`- **Tech Stack**: ${p.tech.join(", ")}`);
    lines.push("");
    lines.push("#### Engineering Decision Trace");
    lines.push(`- **Problem**: ${p.problem}`);
    lines.push(`- **Tried**: ${p.tried}`);
    lines.push(`- **Measured**: ${p.measured}`);
    lines.push(`- **Decided**: ${p.decided}`);
    lines.push("");

    if (p.tiles && p.tiles.length > 0) {
      lines.push("#### Key Measurements & Specs");
      for (const t of p.tiles) {
        lines.push(
          `- ${t.label}: **${t.value}** (${t.measured ? "measured" : "stated"})`,
        );
      }
      lines.push("");
    }

    if (p.graphs && p.graphs.length > 0) {
      lines.push("#### Architecture & Benchmark Data");
      for (const g of p.graphs) {
        lines.push(`- **${g.caption}**:`);
        if (g.kind === "bars") {
          for (const b of g.bars) {
            const detail = b.detail ? ` (${b.detail})` : "";
            lines.push(`  - ${b.label}: ${b.display}${detail}`);
          }
        } else if (g.kind === "pipeline") {
          const steps = g.steps
            .map((s) => (s.value ? `${s.value} ${s.label}` : s.label))
            .join(" → ");
          lines.push(`  - ${steps}`);
        } else if (g.kind === "stacked") {
          for (const r of g.rows) {
            lines.push(`  - ${r.label}: ${r.display}`);
          }
        } else if (g.kind === "specs") {
          for (const s of g.specs) {
            lines.push(`  - ${s.label}: ${s.value}`);
          }
        } else if (g.kind === "flow") {
          for (const col of g.columns) {
            lines.push(`  - ${col.join(" → ")}`);
          }
        }
        if ("note" in g && g.note) {
          lines.push(`  - Note: ${g.note}`);
        }
      }
      lines.push("");
    }

    if (p.app.kind === "specs") {
      lines.push(`- **${p.app.caption}**:`);
      for (const s of p.app.specs) {
        lines.push(`  - ${s.label}: ${s.value}`);
      }
      lines.push("");
    } else if (p.app.kind === "image" && p.app.below) {
      const below = p.app.below;
      lines.push(`- **${below.caption}**:`);
      const steps = below.steps
        .map((s) => (s.value ? `${s.value} ${s.label}` : s.label))
        .join(" → ");
      lines.push(`  - ${steps}`);
      lines.push("");
    }
  }

  lines.push("## Professional Experience");
  for (const exp of experiences) {
    lines.push(`### ${exp.company} — ${exp.role}`);
    lines.push(`- **Period**: ${exp.period}`);
    lines.push(`- **Stack**: ${exp.stack.join(", ")}`);
    for (const pt of exp.points) {
      lines.push(`- ${pt}`);
    }
    lines.push("");
  }

  lines.push("## Technical Skills");
  for (const group of skillGroups) {
    lines.push(`- **${group.title}**: ${group.items.join(", ")}`);
  }
  lines.push("");

  lines.push("## Archive Projects");
  for (const a of archive) {
    lines.push(`- [${a.title}](${a.href}): ${a.description}`);
  }
  lines.push("");

  return lines.join("\n") + "\n";
}
