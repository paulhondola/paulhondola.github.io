export interface SocialLink {
  icon: "github" | "linkedin" | "mail";
  href: string;
  label: string;
  hoverClass: string;
}

export const socials: SocialLink[] = [
  {
    icon: "github",
    href: "https://github.com/paulhondola",
    label: "GitHub",
    hoverClass: "hover:text-zinc-100 hover:border-zinc-600",
  },
  {
    icon: "linkedin",
    href: "https://linkedin.com/in/paulhondola",
    label: "LinkedIn",
    hoverClass: "hover:text-blue-400 hover:border-blue-500/40",
  },
  {
    icon: "mail",
    href: "mailto:paulhondola@gmail.com",
    label: "Email",
    hoverClass: "hover:text-rose-400 hover:border-rose-500/40",
  },
];
