// ponytail: 513 B, inert until Lenis adds `html.lenis`. Kept static because a
// dynamic CSS import is referenced but never emitted by the Astro build (404).
import "lenis/dist/lenis.css";

// Everything is already in its final state in the HTML. Motion only uses
// gsap.from(), so if this script fails or never runs, the page stays complete.
export async function initMotion(): Promise<void> {
  const reduced =
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    // ponytail: query flag lets the browser check exercise this path
    new URLSearchParams(location.search).has("reduced-motion");
  if (reduced) return;

  // Loaded only when motion will run: reduced-motion visitors fetch none of it.
  const [{ gsap }, { ScrollTrigger }, { SplitText }, { default: Lenis }] =
    await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/SplitText"),
      import("lenis"),
    ]);

  gsap.registerPlugin(ScrollTrigger, SplitText);

  const nav = document.querySelector<HTMLElement>("[data-nav]");
  const lenis = new Lenis({ anchors: { offset: -(nav?.offsetHeight ?? 0) } });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  const revealWords = (el: Element, vars: gsap.TweenVars = {}) => {
    const split = SplitText.create(el, { type: "words", aria: "auto" });
    gsap.from(split.words, {
      yPercent: 60,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.04,
      ...vars,
    });
  };

  // Hero: headline, then the ladder rows.
  const hero = document.querySelector("#hero");
  const h1 = hero?.querySelector("h1[data-split]");
  if (h1) revealWords(h1, { delay: 0.1 });
  if (hero) {
    gsap.from(hero.querySelectorAll("[data-ladder] li"), {
      opacity: 0,
      y: 6,
      duration: 0.4,
      stagger: 0.06,
      delay: 0.5,
    });
  }

  // Runtime chart (in Experience): the line draws, then points and change rows.
  document
    .querySelectorAll<SVGPolylineElement>("[data-draw]")
    .forEach((line) => {
      const length = line.getTotalLength();
      const trigger = { trigger: line, start: "top 85%", once: true };
      gsap.fromTo(
        line,
        { strokeDasharray: length, strokeDashoffset: length },
        {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.inOut",
          scrollTrigger: trigger,
        },
      );
      const figure = line.closest("figure");
      if (figure) {
        gsap.from(figure.querySelectorAll("circle, li"), {
          opacity: 0,
          y: 6,
          duration: 0.4,
          stagger: 0.06,
          delay: 0.5,
          scrollTrigger: trigger,
        });
      }
    });

  // Below the hero: headings word by word as they scroll in.
  document
    .querySelectorAll("main h2[data-split], main h3[data-split]")
    .forEach((el) =>
      revealWords(el, {
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      }),
    );

  document.querySelectorAll("[data-grow]").forEach((el) =>
    gsap.from(el, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    }),
  );

  // Fonts and images change layout; re-measure trigger positions after both.
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  // The imports are async, so `load` may already have fired.
  if (document.readyState === "complete") ScrollTrigger.refresh();
  else addEventListener("load", () => ScrollTrigger.refresh());
}
