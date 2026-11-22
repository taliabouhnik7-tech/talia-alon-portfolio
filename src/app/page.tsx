import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProcessScroll from "@/components/ProcessScroll";
import WorkGrid from "@/components/WorkGrid";
import About from "@/components/About";
import ContactFooter from "@/components/ContactFooter";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <ProcessScroll />
        <WorkGrid />
        <About />
      </main>
      <ContactFooter />
    </>
  );
}
