import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-zinc-950/80 backdrop-blur-2xl border-b border-zinc-800/60 shadow-lg shadow-black/20"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="relative group">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700/50 flex items-center justify-center font-bold text-sm text-zinc-100 group-hover:border-blue-500/50 transition-colors duration-300">
              <span className="text-gradient">PH</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-blue-500 group-hover:w-2/3 transition-all duration-300" />
              </a>
            ))}
            <a
              href="/cv/Paul_Hondola_CV.pdf"
              download
              className="ml-4 px-4 py-2 text-sm font-medium text-zinc-100 bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/50 hover:border-zinc-600 rounded-lg transition-all duration-300"
            >
              Resume
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-zinc-400 hover:text-zinc-100 transition-colors p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu — CSS transition, no framer-motion */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/60 p-6 md:hidden transition-all duration-200 ${
          mobileOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-xl transition-all duration-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/cv/Paul_Hondola_CV.pdf"
            download
            className="mt-2 px-4 py-3 text-center text-zinc-100 bg-zinc-800/80 border border-zinc-700/50 rounded-xl"
          >
            Download Resume
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
