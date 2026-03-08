import React, { Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import UploadSection from "@/components/landing/UploadSection";
import { LazySection } from "@/components/LazySection";

// --- LAZY LOADED SECTIONS ---
const FeaturesSection = lazy(() => import("@/components/landing/FeaturesSection"));
const HowItWorksSection = lazy(() => import("@/components/landing/HowItWorksSection"));
const UseCasesSection = lazy(() => import("@/components/landing/UseCasesSection"));
const BeforeAfterSection = lazy(() => import("@/components/landing/BeforeAfterSection"));
const TestimonialsSection = lazy(() => import("@/components/landing/TestimonialsSection"));
const PricingSection = lazy(() => import("@/components/landing/PricingSection"));
const ApiSection = lazy(() => import("@/components/landing/ApiSection"));
const AboutSection = lazy(() => import("@/components/landing/AboutSection"));
const TeamSection = lazy(() => import("@/components/landing/TeamSection"));
const FAQSection = lazy(() => import("@/components/landing/FAQSection"));
const ContactSection = lazy(() => import("@/components/landing/ContactSection"));
const NewsletterSection = lazy(() => import("@/components/landing/NewsletterSection"));
const Footer = lazy(() => import("@/components/landing/Footer"));

const Index = () => {
  return (
    <div className="relative min-h-screen bg-[#050507]">
      {/* ── GLOBAL BACKGROUND GRID ── */}
      <div className="fixed inset-0 z-0 bg-grid pointer-events-none opacity-40 mix-blend-screen" />

      <div className="relative z-10">
        <Navbar />

        {/* ── Core sections (Always rendered for SEO & LCP) ── */}
        <HeroSection />
        <StatsSection />
        <UploadSection />

        {/* ── Secondary sections (Lazy loaded for Performance) ── */}
        <LazySection id="features" minHeight="600px"><FeaturesSection /></LazySection>
        <LazySection id="how-it-works" minHeight="600px"><HowItWorksSection /></LazySection>
        <LazySection id="use-cases" minHeight="700px"><UseCasesSection /></LazySection>
        <LazySection minHeight="600px"><BeforeAfterSection /></LazySection>
        <LazySection minHeight="500px"><TestimonialsSection /></LazySection>

        {/* ── Conversion & Deep content ── */}
        <LazySection id="pricing" minHeight="800px"><PricingSection /></LazySection>
        <LazySection id="api" minHeight="600px"><ApiSection /></LazySection>
        <LazySection id="about" minHeight="700px"><AboutSection /></LazySection>
        <LazySection minHeight="600px"><TeamSection /></LazySection>

        {/* ── Support & Footer ── */}
        <LazySection id="faq" minHeight="500px"><FAQSection /></LazySection>
        <LazySection id="contact" minHeight="600px"><ContactSection /></LazySection>
        <LazySection minHeight="400px"><NewsletterSection /></LazySection>

        <LazySection minHeight="300px"><Footer /></LazySection>
      </div>
    </div>
  );
};

export default Index;
