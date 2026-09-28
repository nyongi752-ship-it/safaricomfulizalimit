import { useReveal } from '@/hooks/useReveal';
import { testimonials } from '@/data/content';
import { Star, BadgeCheck } from 'lucide-react';

export default function Testimonials() {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="reviews" ref={ref} className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
          <p className="text-brand-600 font-semibold text-xs uppercase tracking-wider">Testimonials</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mt-2">
            What Our Users Say
          </h2>
          <p className="text-slate-600 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Thousands of users have already boosted their limits. Here is what some of them have to say.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <figure
              key={t.id}
              className="reveal rounded-2xl bg-slate-50/80 border border-slate-200/70 p-6 hover:border-brand-200 hover:shadow-card transition-all"
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-3.5 h-3.5 ${
                      idx < t.rating ? 'text-accent-400 fill-accent-400' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <blockquote className="text-slate-700 text-sm leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.location}</p>
                </div>
                <BadgeCheck className="w-4 h-4 text-brand-500" />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
