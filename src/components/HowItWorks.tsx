import { useReveal } from '@/hooks/useReveal';
import { Activity, Send, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: Activity,
    title: 'Select Your Plan',
    description: 'Choose the overdraft limit you want from our range of packages, starting at KSh 3,000 up to KSh 100,000+.',
  },
  {
    icon: Send,
    title: 'Pay One-Time Fee',
    description: 'Pay a small activation fee via mobile money. You will receive a prompt on your phone to confirm the payment securely.',
  },
  {
    icon: CheckCircle2,
    title: 'Limit Activated',
    description: 'Your new limit is applied within minutes. You will receive a confirmation notification and can start using it right away.',
  },
];

export default function HowItWorks() {
  const ref = useReveal<HTMLElement>();

  return (
    <section id="how" ref={ref} className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
          <p className="text-brand-600 font-semibold text-xs uppercase tracking-wider">Simple Process</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mt-2">
            How It Works
          </h2>
          <p className="text-slate-600 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Three simple steps to unlock a higher fuliza limit. No paperwork, no waiting days for approval.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-px bg-slate-200" />

          {steps.map((step, i) => (
            <div
              key={i}
              className="reveal relative"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="relative bg-white rounded-2xl border border-slate-200 p-6 h-full hover:border-brand-300 hover:shadow-card-hover transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-brand z-10">
                    <step.icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <span className="font-display font-bold text-sm text-brand-600 tabular-nums">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
