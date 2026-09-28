import { useReveal } from '@/hooks/useReveal';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal relative rounded-4xl overflow-hidden bg-brand-700 p-10 sm:p-14 text-center">
          <div className="absolute inset-0 bg-brand-800/30" />

          <div className="relative">
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white leading-tight max-w-xl mx-auto">
              Ready to Increase Your Fuliza Limit?
            </h2>
            <p className="mt-4 text-brand-100 text-sm sm:text-base max-w-md mx-auto">
              Join thousands who have already increased their fuliza limit. One-time fee, instant activation, no subscriptions.
            </p>
            <a
              href="#pricing"
              className="mt-7 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-brand-700 font-semibold hover:bg-brand-50 transition-colors shadow-lg"
            >
              Increase Fuliza Limit Now <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
