import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Globe } from "@/components/sections/Globe";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { ProblemSolution } from "@/components/sections/ProblemSolution";
import { Reviews } from "@/components/sections/Reviews";
import { Stats } from "@/components/sections/Stats";
import { Ticker } from "@/components/sections/Ticker";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <ProblemSolution />
        <Stats />
        <Reviews />
        <Pricing />
        <Globe />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
