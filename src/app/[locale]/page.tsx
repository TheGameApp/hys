import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Ribbon } from "@/components/sections/ribbon";
import { Features } from "@/components/sections/features";
import { Process } from "@/components/sections/process";
import { Infrastructure } from "@/components/sections/infrastructure";
import { Metrics } from "@/components/sections/metrics";
import { Integrations } from "@/components/sections/integrations";
import { Security } from "@/components/sections/security";
import { Developers } from "@/components/sections/developers";
import { About } from "@/components/sections/about";
import { Testimonials } from "@/components/sections/testimonials";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Pricing } from "@/components/sections/pricing";
import { CTA } from "@/components/sections/cta";
import { ContactForm } from "@/components/sections/contact-form";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Ribbon />
        <Features />
        <Process />
        <Infrastructure />
        <Metrics />
        <Integrations />
        <Security />
        <Developers />
        <About />
        <Testimonials />
        <FeaturedProjects />
        <Pricing />
        <CTA />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
