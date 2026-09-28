import { useEffect, useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const ids = ['how', 'pricing', 'reviews', 'faq'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const links = [
    { label: 'How It Works', href: '#how', id: 'how' },
    { label: 'Pricing', href: '#pricing', id: 'pricing' },
    { label: 'Reviews', href: '#reviews', id: 'reviews' },
    { label: 'FAQ', href: '#faq', id: 'faq' },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#00a859] via-[#008f8f] to-[#003c96] shadow-soft"
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 font-display font-bold text-lg text-white">
          <span className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Zap className="w-4.5 h-4.5" strokeWidth={2.5} />
          </span>
          Fuliza<span className="text-white">Limit</span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === l.id ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#pricing"
            className="ml-2 px-5 py-2 rounded-lg bg-white text-[#008f8f] text-sm font-semibold hover:bg-white/90 transition-colors shadow-soft"
          >
            Increase Fuliza Limit Now
          </a>
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-white hover:text-white/80"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-gradient-to-r from-[#00a859] via-[#008f8f] to-[#003c96] border-t border-white/10 px-4 py-3 space-y-1 animate-fade-in">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === l.id ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#pricing"
            onClick={() => setOpen(false)}
            className="block text-center mt-2 px-5 py-2.5 rounded-lg bg-white text-[#008f8f] text-sm font-semibold"
          >
            Increase Fuliza Limit Now
          </a>
        </div>
      )}
    </header>
  );
}
