'use client';

import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { InfiniteSlider } from "@/components/ui/infinite-slider";

const ShaderGradient = dynamic(() => import('./components/ShaderGradient'), { ssr: false });

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Codavra – Modern Web Development Agency</title>
        <meta name="description" content="Codavra builds sleek, responsive websites and web apps for modern brands, startups, and creators. Next.js, Framer Motion, 3D, and seamless API integrations." />
        <link rel="canonical" href="https://codavra.com/" />
        <meta property="og:title" content="Codavra – Modern Web Development Agency" />
        <meta property="og:description" content="Sleek, responsive websites and web apps for modern brands. Next.js, Framer Motion, 3D, and seamless API integrations." />
        <meta property="og:image" content="/Codavra.png" />
        <meta property="og:url" content="https://codavra.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Codavra – Modern Web Development Agency" />
        <meta name="twitter:description" content="Sleek, responsive websites and web apps for modern brands. Next.js, Framer Motion, 3D, and seamless API integrations." />
        <meta name="twitter:image" content="/Codavra.png" />
      </Head>
      {/* Single navbar that transforms on scroll */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
        initial={false}
      >
        <div className="container mx-auto">
          <motion.div 
            className="flex items-center justify-between mx-auto relative"
            layout
            style={{
              width: scrolled ? "min(90%, 1152px)" : "100%",
              backgroundColor: scrolled ? "rgba(18, 18, 32, 0.95)" : "transparent",
              backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
              WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
              borderRadius: scrolled ? "9999px" : "0px",
              padding: scrolled ? "12px 32px" : "8px 0px",
              boxShadow: scrolled ? "0 8px 32px rgba(0, 0, 0, 0.2)" : "none",
              border: scrolled ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
            }}
            transition={{ 
              duration: 0.3,
              ease: [0.23, 1, 0.32, 1]
            }}
          >
            {/* Glassmorphism highlight effect */}
            {scrolled && (
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%)",
                  pointerEvents: "none"
                }}
              />
            )}
            
            <div className="flex items-center gap-2 relative w-full justify-center md:justify-start">
              <img src="/Codavra.png" alt="Codavra Logo" className="h-10 w-auto" />
            </div>
            
            <nav className="hidden md:flex items-center gap-8 relative">
              <a href="#features" className="text-white/90 hover:text-white text-sm transition-colors">Features</a>
              <a href="#contact" className="text-white/90 hover:text-white text-sm transition-colors">Contact</a>
              <a href="#faq" className="text-white/90 hover:text-white text-sm transition-colors">FAQ</a>
            </nav>
          </motion.div>
        </div>
      </motion.header>
      
      {/* Hero Section with Shader Gradient */}
      <section className="relative h-screen">
        <ShaderGradient />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            <div className="inline-block mb-10 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
              <p className="text-sm text-white/80">
                Welcome to Codavra
              </p>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">
              <div>We Craft Websites</div>
              <div className="relative">
                <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded border border-white/10">That Grow with You</span>
              </div>
            </h1>
            
            <p className="text-l md:text-xl mb-10 text-white/80 mt-8 max-w-2xl mx-auto">
              Bring your ideas to life with sleek, responsive websites and smart tools built for creators, startups, and businesses ready to scale.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#features"
                className="bg-white/90 backdrop-blur-sm text-[#6d1c1c] px-6 py-3 rounded-full font-medium hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#ff9c75]/10"
              >
                 Start Building Your Company's Future with Codavra
              </a>
             
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with clean black background */}
      <section id="features" className="bg-[#090910] text-white py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Codavra Offers True <span className="text-[#ff9c75]">Intelligence</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Client Logo Carousel */}
            <motion.div 
              className="bg-[#101010] rounded-xl overflow-hidden padding-10 transition-all duration-300 hover:border-[#ff9c75]/40 hover:shadow-lg hover:shadow-[#ff9c75]/5 relative group flex flex-col items-center justify-center min-h-[320px]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-center">Trusted by Forward-Thinking Brands</h3>
              <div className="w-full flex items-center justify-center overflow-hidden py-4">
                <div className="relative w-full">
                <InfiniteSlider gap={24} reverse className="w-full h-full bg-[#101010]">
                  <img
                    src="https://www.raytronics.lk/logos/06.svg"
                    alt="Apple Music logo"
                    className="h-[120px] w-auto"
                  />
                  <img
                    src="https://www.ajlandscaper.com/_next/image?url=%2Fimages%2Flogohorizontal.png&w=1920&q=75"
                    alt="Chrome logo"
                    className="h-[80px] w-[80%]"
                  />
                  <img
                    src="https://www.rayrealtysl.com/static/media/RayRealty.ad292067d7979485ef29c1045e2a4b92.svg"
                    alt="Strava logo"
                    className="h-[120px] w-auto"
                  />
                  
                  
                </InfiniteSlider>
                </div>
              </div>
              <div className="text-xs text-gray-500 text-center mt-2">From SaaS to eCommerce, agencies to creators</div>
            </motion.div>

            {/* Card 2: Visual-first Development */}
            <motion.div 
              className="bg-[#101010] rounded-xl overflow-hidden p-6 transition-all duration-300 hover:border-[#ff9c75]/40 hover:shadow-lg hover:shadow-[#ff9c75]/5 relative group flex flex-col items-center justify-center min-h-[320px]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-center">Visual-first Development</h3>
              <div className="flex flex-col items-center gap-2 mb-4">
                <span className="inline-block bg-[#ff9c75]/10 text-[#ff9c75] px-3 py-1 rounded-full text-xs font-medium border border-[#ff9c75]/20">Next.js</span>
                <span className="inline-block bg-[#ff9c75]/10 text-[#ff9c75] px-3 py-1 rounded-full text-xs font-medium border border-[#ff9c75]/20">Framer Motion</span>
                <span className="inline-block bg-[#ff9c75]/10 text-[#ff9c75] px-3 py-1 rounded-full text-xs font-medium border border-[#ff9c75]/20">Three.js</span>
              </div>
              <p className="text-gray-300 text-center mb-2">
                We build intuitive, responsive, and design-driven websites. Our team collaborates closely with you to bring your ideas to life—combining beautiful UI, smooth animations, and 3D when it matters.
              </p>
              <div className="text-xs text-gray-500 text-center">Built for creators, startups, and brands that care about design</div>
            </motion.div>

            {/* Card 3: Seamless Integrations */}
            <motion.div 
              className="bg-[#101010] rounded-xl overflow-hidden p-6 transition-all duration-300 hover:border-[#ff9c75]/40 hover:shadow-lg hover:shadow-[#ff9c75]/5 relative group flex flex-col items-center justify-center min-h-[320px]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-center">Seamless Integrations</h3>
              <div className="flex flex-wrap gap-3 justify-center mb-4">
                <span className="inline-flex items-center gap-2 bg-[#222] px-3 py-1 rounded-full text-xs text-white border border-[#ff9c75]/20"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#635BFF"/><text x="12" y="16" textAnchor="middle" fontSize="10" fill="#fff">Stripe</text></svg>Stripe</span>
                <span className="inline-flex items-center gap-2 bg-[#222] px-3 py-1 rounded-full text-xs text-white border border-[#ff9c75]/20"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#FF5D01"/><text x="12" y="16" textAnchor="middle" fontSize="10" fill="#fff">Contentful</text></svg>Contentful</span>
                <span className="inline-flex items-center gap-2 bg-[#222] px-3 py-1 rounded-full text-xs text-white border border-[#ff9c75]/20"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#3ECF8E"/><text x="12" y="16" textAnchor="middle" fontSize="10" fill="#fff">Supabase</text></svg>Supabase</span>
              </div>
              <p className="text-gray-300 text-center mb-2">
                We integrate the best modern APIs and tools—like Stripe, Contentful, and Supabase—to create scalable, maintainable web apps tailored to your needs.
              </p>
              <div className="text-xs text-gray-500 text-center">API-first, future-proof, and ready to scale</div>
            </motion.div>
          </div>

          <div className="text-center mt-16">
            <motion.a 
              href="#" 
              className="inline-flex items-center gap-2 bg-[#6d1c1c] text-white px-8 py-3 rounded-full font-medium hover:bg-[#7d2c2c] transition-colors border border-[#ff9c75]/20 shadow-lg shadow-black/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              See all features
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=""><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-[#0e0e20] text-white py-20 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Reach Out to Us</h2>
          <p className="text-lg text-white/80 mb-6">We'd love to hear from you! For project inquiries, partnerships, or just to say hello, contact us below.</p>
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/90">Email: <a href="mailto:info@codavra.com" className="underline hover:text-[#ff9c75]">info@codavra.com</a></span>
            <span className="text-white/90">Phone: <a href="tel:+1234567890" className="underline hover:text-[#ff9c75]">+1 (416) 474-6869</a></span>
            <span className="text-white/90">Location: Remote / Global</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-[#090910] text-white py-20 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="divide-y divide-white/10">
            <div className="py-6">
              <h3 className="font-semibold text-lg mb-2">Is Codavra suitable for startups and small businesses?</h3>
              <p className="text-white/80">Absolutely! We work with companies of all sizes, from solo founders to established enterprises, and tailor our solutions to your needs.</p>
            </div>
            <div className="py-6">
              <h3 className="font-semibold text-lg mb-2">What technologies do you use?</h3>
              <p className="text-white/80">We specialize in Next.js, React, Framer Motion, Three.js, and integrate with modern APIs like Stripe, Contentful, and Supabase.</p>
            </div>
            <div className="py-6">
              <h3 className="font-semibold text-lg mb-2">How do I get started?</h3>
              <p className="text-white/80">Just reach out via email or phone, and we'll schedule a free consultation to discuss your project and goals.</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Footer with ShaderGradient inside */}
      <footer className="bg-[#0e0e20]/80 backdrop-blur-md text-white py-10 px-4 border-t border-white/10 mt-0 relative overflow-hidden rounded-t-3xl">
        {/* Shader gradient background for footer (inside) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none -z-10">
          <ShaderGradient />
        </div>
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <img src="/Codavra.png" alt="Codavra Logo" className="h-16 w-auto mb-2" />
            <span className="text-white/70 text-sm">Modern web solutions for brands that want to grow.</span>
            <div className="flex gap-4 mt-2">
              <a href="https://www.instagram.com/heycodavra/" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff9c75]" aria-label="Instagram"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg></a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8 text-center md:text-left">
            <div>
              <span className="font-semibold text-lg">Links</span>
              <ul className="mt-2 space-y-1">
                <li><a href="#features" className="hover:text-[#ff9c75]">Features</a></li>
                <li><a href="#contact" className="hover:text-[#ff9c75]">Contact</a></li>
                <li><a href="#faq" className="hover:text-[#ff9c75]">FAQ</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center text-white/40 text-xs mt-8">© {new Date().getFullYear()} Codavra. All rights reserved.</div>
      </footer>
    </div>
  );
}
