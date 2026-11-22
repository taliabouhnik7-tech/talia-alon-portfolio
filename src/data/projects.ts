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
      "My own ordering site and admin. I designed it in Figma and took it live. Real customers order from it.",
    image: "/images/work/bakery-cover.webp",
  },
  {
    slug: "audiocodes",
    title: "AudioCodes Meeting Insights",
    role: "Solo",
    category: "Enterprise SaaS",
    description:
      "Stakeholder research and a clearer information architecture for a meeting-insights product.",
    image: "/images/work/audiocodes-cover.png",
  },
  {
    slug: "y-platform",
    title: "Y, a math learning platform",
    role: "Solo",
    category: "EdTech, UX/UI and branding",
    description:
      "An online math course for grades 7–12: flows, catalogue and the full brand.",
    image: "/images/work/y-platform-cover.png",
  },
  {
    slug: "chef-coach",
    title: "Chef Coach",
    role: "Solo",
    category: "AI product",
    description:
      "A training dashboard for chefs, with an AI coach and skill tracking.",
    image: "/images/work/chef-coach-cover.png",
  },
  {
    slug: "spark",
    title: "SPARK",
    role: "Solo",
    category: "Mobile app, AI",
    description:
      "A short-video learning app with AI lessons and cliffhanger endings.",
    image: "/images/work/spark-cover.webp",
    imageFit: "cover",
  },
  {
    slug: "heichal-etzion",
    title: "Heichal Etzion",
    role: "Solo",
    category: "Donation site, real client",
    description:
      "A donation page for a real synagogue campaign. Two ways to give, nothing in the way.",
    image: "/images/work/heichal-etzion-cover.webp",
    imageFit: "cover",
  },
  {
    slug: "omaka",
    title: "OMAKA",
    role: "Solo",
    category: "Brand identity",
    description: "Logo, type, colour and a full brand book for a sushi brand.",
    image: "/images/work/omaka/slide-02.webp",
    imageFit: "cover",
  },
  {
    slug: "bubble",
    title: "Bubble",
    role: "Team",
    category: "Mobile app",
    description:
      "A location-based app that helps Israelis abroad find help and each other.",
    image: "/images/work/bubble-cover.png",
  },
  {
    slug: "aloora",
    title: "ALOORA",
    role: "Team",
    category: "Luxury e-commerce",
    description:
      "Luxury jewelry e-commerce for web and mobile, built around trust.",
    image: "/images/work/aloora-cover.png",
  },
  {
    slug: "tangled",
    title: "Tangled fan experience",
    role: "Team",
    category: "Campaign microsite",
    description:
      "A campaign microsite turning nostalgia for Tangled into donations.",
    image: "/images/work/tangled-cover.png",
  },
];
