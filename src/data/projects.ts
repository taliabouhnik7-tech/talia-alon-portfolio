export type Project = {
  slug: string;
  title: string;
  role: string;
  category: string;
  description: string;
  image: string;
  coverType: "mockup" | "browser";
};

export const projects: Project[] = [
  {
    slug: "audiocodes",
    title: "AudioCodes Meeting Insights",
    role: "Solo",
    category: "Enterprise SaaS Redesign",
    description:
      "Stakeholder research and an information-architecture redesign of the product's main screen, simplifying navigation and the transcription layout.",
    image: "/images/work/audiocodes-cover.png",
    coverType: "mockup",
  },
  {
    slug: "y-platform",
    title: "Y — Math Learning Platform",
    role: "Solo",
    category: "EdTech · UX/UI + Branding",
    description:
      "End-to-end design for an online math course platform — information architecture, user flows, catalogue, and full brand identity.",
    image: "/images/work/y-platform-cover.png",
    coverType: "mockup",
  },
  {
    slug: "chef-coach",
    title: "Chef Coach",
    role: "Solo",
    category: "AI Coaching Platform",
    description:
      "A culinary training dashboard built around an AI coach — skill tracking, personalized recommendations, and community support for kitchen professionals.",
    image: "/images/work/chef-coach.png",
    coverType: "browser",
  },
  {
    slug: "heichal-etzion",
    title: "Heichal Etzion",
    role: "Solo",
    category: "Real-client donation landing page",
    description:
      "A donation site for a synagogue's renovation campaign — built for a real community, with a simple flow to give via Paybox or bank transfer.",
    image: "/images/work/heichal-etzion.png",
    coverType: "browser",
  },
  {
    slug: "bubble",
    title: "Bubble — Social Networking App",
    role: "Team",
    category: "UX/UI Case Study",
    description:
      "A location-based messaging app for Israelis abroad. Research, personas, wireframes, a component library, and a Figma prototype.",
    image: "/images/work/bubble-cover.png",
    coverType: "mockup",
  },
  {
    slug: "aloora",
    title: "ALOORA — Luxury Jewelry E-commerce",
    role: "Team",
    category: "Web & Mobile",
    description:
      "A premium shopping experience across web and mobile, built to carry a luxury brand identity through every screen.",
    image: "/images/work/aloora-cover.png",
    coverType: "mockup",
  },
  {
    slug: "tangled",
    title: "Tangled Fan Experience",
    role: "Team",
    category: "Creative Microsite",
    description:
      "A playful movie-themed microsite tying nostalgia for Tangled to a real cause — ticket proceeds and hair donations supporting cancer patients.",
    image: "/images/work/tangled.png",
    coverType: "browser",
  },
];
