export type Project = {
  slug: string;
  title: string;
  role: "Solo" | "Team";
  category: string;
  description: string;
  image: string;
  imageFit?: "contain" | "cover";
};

export const projects: Project[] = [
  {
    slug: "bakery",
    title: "Talia Alon Bakery",
    role: "Solo",
    category: "Live product",
    description:
      "Ordering site and admin system for my home bakery. I designed it in Figma, then built and launched it. Real customers order from it every week.",
    image: "/images/work/bakery-cover.webp",
  },
  {
    slug: "audiocodes",
    title: "AudioCodes Meeting Insights",
    role: "Solo",
    category: "Enterprise SaaS",
    description:
      "Stakeholder research and a new information architecture for the main screen, with simpler navigation and an easier transcript layout.",
    image: "/images/work/audiocodes-cover.png",
  },
  {
    slug: "y-platform",
    title: "Y, a math learning platform",
    role: "Solo",
    category: "EdTech, UX/UI and branding",
    description:
      "An online math course for grades 7 to 12: information architecture, user flows, the course catalogue and the brand.",
    image: "/images/work/y-platform-cover.png",
  },
  {
    slug: "chef-coach",
    title: "Chef Coach",
    role: "Solo",
    category: "AI product",
    description:
      "A training dashboard for kitchen professionals with an AI coach, skill tracking and personal recommendations.",
    image: "/images/work/chef-coach-cover.png",
  },
  {
    slug: "heichal-etzion",
    title: "Heichal Etzion",
    role: "Solo",
    category: "Donation site, real client",
    description:
      "A donation page for a synagogue renovation. Two ways to give, Paybox or bank transfer, and nothing in the way.",
    image: "/images/work/heichal-etzion-cover.webp",
    imageFit: "cover",
  },
  {
    slug: "bubble",
    title: "Bubble",
    role: "Team",
    category: "Mobile app",
    description:
      "A location-based messaging app for Israelis abroad. Research, personas, wireframes, a component library and a Figma prototype.",
    image: "/images/work/bubble-cover.png",
  },
  {
    slug: "aloora",
    title: "ALOORA",
    role: "Team",
    category: "Luxury e-commerce",
    description:
      "A jewelry store for web and mobile that carries a premium brand through every screen, from browsing to checkout.",
    image: "/images/work/aloora-cover.png",
  },
  {
    slug: "tangled",
    title: "Tangled fan experience",
    role: "Team",
    category: "Campaign microsite",
    description:
      "A playful microsite built on nostalgia for Tangled, raising ticket money and hair donations for cancer patients.",
    image: "/images/work/tangled-cover.png",
  },
];
