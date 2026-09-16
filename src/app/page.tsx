import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import WorkGrid from "@/components/WorkGrid";
import BakeryCaseStudy from "@/components/BakeryCaseStudy";
import About from "@/components/About";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <WorkGrid />
        <BakeryCaseStudy />
        <About />
      </main>
      <ContactFooter />
    </>
  );
}
