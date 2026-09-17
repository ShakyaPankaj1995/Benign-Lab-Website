import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-void border-t border-line py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="font-extrabold text-lg text-ink">Benign Labs</p>
          <p className="text-muted text-sm mt-1">Innovating for a healthier, more sustainable future.</p>
        </div>
        <nav className="flex gap-6 text-sm font-medium text-muted">
          <Link href="/" className="hover:text-ink">Home</Link>
          <Link href="#product" className="hover:text-ink">Product</Link>
          <Link href="#about" className="hover:text-ink">About Us</Link>
          <Link href="#contact" className="hover:text-ink">Contact Us</Link>
        </nav>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-8 text-center md:text-left text-xs text-muted/60">
        &copy; 2026 Benign Labs. All rights reserved.
      </div>
    </footer>
  );
}
