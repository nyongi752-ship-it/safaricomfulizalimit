import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { faqs } from '@/data/content';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const ref = useReveal<HTMLElement>();
  const [open, setOpen] = useState<string | null>(faqs[0].id);

  return (
    <section id="faq" ref={ref} className="py-20 bg-slate-50/50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
          <p className="text-brand-600 font-semibold text-xs uppercase tracking-wider">FAQ</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === faq.id;
            return (
              <div
                key={faq.id}
                className="reveal rounded-xl bg-white border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors"
                style={{ transitionDelay: `${i * 0.03}s` }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-slate-900 text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
