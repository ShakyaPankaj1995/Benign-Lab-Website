"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      
      setScrolled(y > 40);

      // Determine active section based on precise vh timeline
      if (y >= 10.8 * vh) {
        setActiveTab("contact");
      } else if (y >= 9.0 * vh) {
        setActiveTab("solution");
      } else if (y >= 6.6 * vh) {
        setActiveTab("tech");
      } else if (y >= 4.2 * vh) {
        setActiveTab("why");
      } else {
        setActiveTab("home");
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    // Call once on mount
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-void/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl tracking-tight text-ink">
          Benign Labs
        </Link>
        <nav className="hidden md:flex gap-8 text-base font-semibold text-muted">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className={`transition-colors ${activeTab === 'home' ? 'text-teal' : 'hover:text-ink'}`}
          >
            Home
          </button>
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight * 4.8, behavior: 'smooth' })} 
            className={`transition-colors ${activeTab === 'why' ? 'text-teal' : 'hover:text-ink'}`}
          >
            Why SaniCare
          </button>
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight * 7.2, behavior: 'smooth' })} 
            className={`transition-colors ${activeTab === 'tech' ? 'text-teal' : 'hover:text-ink'}`}
          >
            Technology
          </button>
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight * 9.6, behavior: 'smooth' })} 
            className={`transition-colors ${activeTab === 'solution' ? 'text-teal' : 'hover:text-ink'}`}
          >
            Solution
          </button>
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight * 11.4, behavior: 'smooth' })} 
            className={`transition-colors ${activeTab === 'contact' ? 'text-teal' : 'hover:text-ink'}`}
          >
            Contact
          </button>
        </nav>
      </div>
    </header>
  );
}
