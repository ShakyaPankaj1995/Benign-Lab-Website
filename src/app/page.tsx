"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import CanvasViewer from "@/components/CanvasViewer";
import Header from "@/components/Header";
import { Wind, ShieldAlert, Brain, Megaphone } from "lucide-react";

export default function Home() {
  const animationContainerRef = useRef<HTMLDivElement>(null);

  // Raw scroll progress for the master container (1200vh)
  const { scrollYProgress } = useScroll({
    target: animationContainerRef,
    offset: ["start start", "end end"]
  });

  // Adds a smooth ~300ms glide to the text horizontal transitions on all slides
  const smoothTextProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    mass: 0.5,
  });

  const scrollToDiscover = () => {
    window.scrollTo({
      top: window.innerHeight * 4.8,
      behavior: "smooth"
    });
  };

  // --- VIRTUAL TIMELINE ---
  // Total virtual frames = 1200.
  // 60-frame entry/exit blocks guarantee strict NO-OVERLAP between sections.
  const TOTAL_VFRAMES = 1200;
  const vp = (f: number) => f / TOTAL_VFRAMES;

  // The video progress is 0 until vFrame 300, scales to 1 by 1020 (720 frames = 24s), and holds 1 after 1020
  const clampedVideoProgress = useTransform(scrollYProgress, [vp(300), vp(1020)], [0, 1]);

  // Horizontal transition and opacity mappings for ALL sections
  
  // 1. Problem (vFrames 0 - 120)
  const problemX = useTransform(smoothTextProgress, [vp(0), vp(60), vp(120)], ["0vw", "0vw", "-100vw"]);
  const problemOpacity = useTransform(smoothTextProgress, [vp(0), vp(60), vp(120)], [1, 1, 0]);

  // 2. Intro (vFrames 120 - 300)
  const introX = useTransform(smoothTextProgress, [vp(120), vp(180), vp(240), vp(300)], ["-100vw", "0vw", "0vw", "-100vw"]);
  const introOpacity = useTransform(smoothTextProgress, [vp(120), vp(180), vp(240), vp(300)], [0, 1, 1, 0]);

  // 3. Why Sanicare (vFrames 420 - 660) 
  const whyX = useTransform(smoothTextProgress, [vp(420), vp(480), vp(600), vp(660)], ["100vw", "0vw", "0vw", "100vw"]);
  const whyOpacity = useTransform(smoothTextProgress, [vp(420), vp(480), vp(600), vp(660)], [0, 1, 1, 0]);

  // 4. Patented Tech (vFrames 660 - 900)
  const techX = useTransform(smoothTextProgress, [vp(660), vp(720), vp(840), vp(900)], ["100vw", "0vw", "0vw", "100vw"]);
  const techOpacity = useTransform(smoothTextProgress, [vp(660), vp(720), vp(840), vp(900)], [0, 1, 1, 0]);

  // 5. Solution (vFrames 900 - 1080)
  const solutionX = useTransform(smoothTextProgress, [vp(900), vp(960), vp(1020), vp(1080)], ["-100vw", "0vw", "0vw", "-100vw"]);
  const solutionOpacity = useTransform(smoothTextProgress, [vp(900), vp(960), vp(1020), vp(1080)], [0, 1, 1, 0]);

  // 6. Contact Us (vFrames 1080 - 1200)
  const contactX = useTransform(smoothTextProgress, [vp(1080), vp(1140), vp(1200)], ["-100vw", "0vw", "0vw"]);
  const contactOpacity = useTransform(smoothTextProgress, [vp(1080), vp(1140), vp(1200)], [0, 1, 1]);

  // Video Frame Offset Mapping
  // Shifts left (-4%) while Why Sanicare and Tech are on screen.
  // Holds until vFrame 810 (video frame 510, or "ezgif-frame-030.png" in video 3).
  // Transitions gracefully back to center (0%) from vFrame 810 to 870.
  const frameXOffset = useTransform(
    smoothTextProgress, 
    [vp(420), vp(480), vp(810), vp(870)], 
    [0, -4, -4, 0]
  );

  return (
    <main className="relative bg-void w-full">
      <Header />
      
      {/* Fixed Canvas Background */}
      <CanvasViewer progress={clampedVideoProgress} xOffsetPercent={frameXOffset} />

      {/* 
        1200vh Sticky Animation Container 
      */}
      <div ref={animationContainerRef} className="relative z-10 w-full h-[1200vh] pointer-events-none">
        
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">
          
          {/* --- 1. The Problem --- */}
          <motion.div 
            style={{ x: problemX, opacity: problemOpacity }}
            className="absolute inset-0 flex flex-col items-start justify-start pt-[15vh] text-left max-w-7xl mx-auto px-6 w-full"
          >
            <div className="w-full flex flex-col items-start pointer-events-auto">
              <span className="inline-block px-3 py-1 bg-teal-soft text-teal-ink text-xs font-bold uppercase tracking-widest rounded-full mb-6 shadow-sm">
                The Problem
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-ink leading-[1.1] tracking-[-0.02em] mb-6">
                The Unseen Environmental Crisis
              </h1>
              <p className="text-muted text-base leading-relaxed mb-6 w-full">
                Every year, billions of conventional sanitary pads end up in landfills. Because they are packed with plastics and super-absorbent polymers, a single pad can take up to 800 years to decompose.
              </p>
              <p className="text-muted text-base leading-relaxed w-full">
                We can no longer afford to treat this as someone else's problem. The time for a fundamentally different approach is now.
              </p>
            </div>
          </motion.div>

          {/* --- 2. Introduction --- */}
          <motion.div 
            style={{ x: introX, opacity: introOpacity }}
            className="absolute inset-0 flex flex-col items-start justify-start pt-[15vh] text-left max-w-7xl mx-auto px-6 w-full"
          >
            <div className="w-full relative flex flex-col items-start pointer-events-auto">
              <div className="absolute inset-0 bg-void/40 blur-3xl -m-10 z-[-1] md:hidden rounded-full w-full" />
              
              <span className="inline-block px-3 py-1 bg-teal-soft text-teal-ink text-xs font-bold uppercase tracking-widest rounded-full mb-6 shadow-sm">
                Introduction
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-ink leading-[1.1] tracking-[-0.02em] mb-6">
                Revolutionizing Sanitary<br/>Waste Disposal.
              </h2>
              <p className="text-muted text-base leading-relaxed mb-10 w-full">
                A safe, hygienic, and environmentally friendly method for disposing of used sanitary pads at the source, eliminating the cost and logistics of traditional waste management.
              </p>
              <button 
                onClick={scrollToDiscover}
                className="px-8 py-4 bg-teal text-white font-semibold rounded-xl shadow-lg hover:bg-teal-700 transition-colors pointer-events-auto"
              >
                Discover SaniCare
              </button>
            </div>
          </motion.div>

          {/* --- 3. Why Sanicare --- */}
          <motion.div 
            style={{ x: whyX, opacity: whyOpacity }}
            className="absolute inset-0 flex flex-col justify-center max-w-7xl mx-auto px-6 w-full items-end text-left"
          >
            <div className="w-full md:w-[40%] mb-10 relative flex flex-col items-start pointer-events-auto">
              <div className="absolute inset-0 bg-void/60 blur-3xl -m-10 z-[-1] rounded-full" />
              <span className="inline-block px-3 py-1 bg-teal-soft text-teal-ink text-xs font-bold uppercase tracking-widest rounded-full mb-6 shadow-sm pointer-events-auto">
                Why Sanicare
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-ink leading-[1.1] tracking-[-0.02em] mb-6">
                The Silent Crisis
              </h2>
              <p className="text-muted text-base leading-relaxed mb-6">
                Current disposal methods like landfilling, burning, or flushing have adverse effects on our environment, public health, and society.
              </p>
            </div>
            
            <div className="flex flex-col gap-4 w-full md:w-[40%] relative z-10 text-left pointer-events-auto">
              <div className="bg-bg p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-line flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl border border-line flex items-center justify-center flex-shrink-0">
                  <Wind className="text-teal" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink mb-1 tracking-tight">Odour & Decomposition</h3>
                  <p className="text-muted text-base leading-relaxed">Pads held in bins breed bacteria and degrade washroom environments.</p>
                </div>
              </div>

              <div className="bg-bg p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-line flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl border border-line flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="text-teal" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink mb-1 tracking-tight">The Hygiene Threat</h3>
                  <p className="text-muted text-base leading-relaxed">Improper disposal presents severe health risks and increases infection likelihood.</p>
                </div>
              </div>

              <div className="bg-bg p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-line border-t-red border-t-[3px] flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl border border-line flex items-center justify-center flex-shrink-0">
                  <Brain className="text-teal" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink mb-1 tracking-tight">The Psychological Toll</h3>
                  <p className="text-muted text-base leading-relaxed">Individuals often face embarrassment and anxiety from fear of judgment.</p>
                </div>
              </div>

              <div className="bg-bg p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-line flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl border border-line flex items-center justify-center flex-shrink-0">
                  <Megaphone className="text-teal" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink mb-1 tracking-tight">Deep-Rooted Taboos</h3>
                  <p className="text-muted text-base leading-relaxed">Social myths and censorship delay proper waste management solutions.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- 4. Patented Technology --- */}
          <motion.div 
            style={{ x: techX, opacity: techOpacity }}
            className="absolute inset-0 flex flex-col items-end justify-center max-w-7xl mx-auto px-6 w-full text-left"
          >
            <div className="w-full md:w-[40%] relative flex flex-col items-start pointer-events-auto">
              <div className="absolute inset-0 bg-void/60 blur-[60px] -m-20 z-[-1] rounded-full mx-auto" />
              <span className="inline-block px-3 py-1 bg-teal-soft text-teal-ink text-xs font-bold uppercase tracking-widest rounded-full mb-6 shadow-sm">
                The Patented Technology
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-ink leading-[1.1] tracking-[-0.02em] mb-6 drop-shadow-md">
                Remove the SAP.<br/>Sanitise what&apos;s left.
              </h2>
              <p className="text-muted text-base leading-relaxed drop-shadow-sm mb-6">
                SaniCare&apos;s breakthrough is a single decisive step. The pad is opened and its blood-saturated super-absorbent polymer — the layer that traps fluid, odour, and pathogens — is separated from the pad, and the remaining material is sanitised on the spot. What was hazardous becomes dry, safe, ordinary waste.
              </p>
            </div>
          </motion.div>

          {/* --- 5. The Solution --- */}
          <motion.div 
            style={{ x: solutionX, opacity: solutionOpacity }}
            className="absolute inset-0 flex flex-col items-start justify-center text-left max-w-7xl mx-auto px-6 w-full"
          >
            <div className="max-w-lg mb-10 relative pointer-events-auto">
              <div className="absolute inset-0 bg-void/60 blur-3xl -m-10 z-[-1] rounded-full" />
              <span className="inline-block px-3 py-1 bg-teal-soft text-teal-ink text-xs font-bold uppercase tracking-widest rounded-full mb-6 shadow-sm">
                The Solution
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-ink leading-[1.1] tracking-[-0.02em] mb-6" id="product">
                The SaniCare Solution
              </h2>
              <p className="text-muted text-base leading-relaxed mb-6">
                By enabling immediate disposal where it happens, we break the chain of negative consequences.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-[45%] relative z-10 mb-12 pointer-events-auto">
              <div className="bg-bg-alt p-5 rounded-xl border-l-[4px] border-l-teal shadow-sm flex flex-col justify-center">
                <h3 className="text-lg font-bold text-teal-700 mb-1 tracking-tight">Eliminates Logistics Costs</h3>
                <p className="text-ink text-base leading-relaxed">Removes the need for maintaining exclusive channels for sanitary waste management and transport logistics.</p>
              </div>
              <div className="bg-bg-alt p-5 rounded-xl border-l-[4px] border-l-teal shadow-sm flex flex-col justify-center">
                <h3 className="text-lg font-bold text-teal-700 mb-1 tracking-tight">Environmentally Sustainable</h3>
                <p className="text-ink text-base leading-relaxed">Offers a safe, eco-friendly alternative to traditional methods, stopping harmful practices like landfilling.</p>
              </div>
              <div className="bg-bg-alt p-5 rounded-xl border-l-[4px] border-l-teal shadow-sm flex flex-col justify-center">
                <h3 className="text-lg font-bold text-teal-700 mb-1 tracking-tight">Promotes Well-being</h3>
                <p className="text-ink text-base leading-relaxed">Improves the overall health, dignity, and well-being of all stakeholders associated with waste management.</p>
              </div>
            </div>
          </motion.div>

          {/* --- 6. Contact Us --- */}
          <motion.div 
            style={{ x: contactX, opacity: contactOpacity }}
            className="absolute inset-0 flex flex-col items-start justify-center text-left max-w-7xl mx-auto px-6 w-full"
          >
            <div className="max-w-lg mb-10 relative pointer-events-auto">
              <div className="absolute inset-0 bg-void/60 blur-3xl -m-10 z-[-1] rounded-full" />
              <span className="inline-block px-3 py-1 bg-teal-soft text-teal-ink text-xs font-bold uppercase tracking-widest rounded-full mb-6 shadow-sm">
                Get In Touch
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-ink leading-[1.1] tracking-[-0.02em] mb-6" id="contact">
                Contact Us
              </h2>
              <p className="text-muted text-base leading-relaxed mb-6">
                Ready to revolutionize sanitary waste disposal at your organization?
              </p>
              <div className="bg-bg-alt p-6 rounded-2xl border border-line shadow-sm">
                <p className="text-muted text-base font-semibold uppercase tracking-wider mb-2">Email for more information</p>
                <a href="mailto:admin@benignlabs.com" className="text-base font-bold text-teal hover:text-teal-700 transition-colors">
                  admin@benignlabs.com
                </a>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </main>
  );
}
