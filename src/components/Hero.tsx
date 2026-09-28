import { useEffect, useState } from 'react';
import { ShieldCheck, Zap, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { activityFeed } from '@/data/content';

export default function Hero() {
  const [activityIndex, setActivityIndex] = useState(0);
  const liveActivity = activityFeed[activityIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivityIndex((current) => (current + 1) % activityFeed.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-28 pb-16 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/60 via-white to-white" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="order-2 animate-fade-up lg:order-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-medium mb-5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure &amp; Verified
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 leading-[1.08] tracking-tight">
            Boost Your limit
            <br />
            Limit <span className="text-brand-600">Instantly</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-md leading-relaxed">
            Complete a quick eligibility check, choose your target, and activate with a one-time fee. No subscriptions, no hidden charges.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <a href="#pricing" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors shadow-brand focus-ring">
              Check Eligibility <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#how" className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors focus-ring">
              How It Works
            </a>
          </div>

          <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-brand-500" />Same-day activation</div>
            <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-brand-500" />Up to KSh 70,000</div>
          </div>
        </div>

        <div className="order-1 animate-fade-up lg:order-2" style={{ animationDelay: '0.1s' }}>
          <div className="relative pt-4 sm:pt-0">
            <div
              key={liveActivity.id}
              className="fixed bottom-4 left-3.5 sm:bottom-6 sm:left-6 z-50 w-[calc(100vw-2rem)] max-w-[260px] bg-brand-50 rounded-2xl shadow-lift border border-brand-200 overflow-hidden animate-fade-up"
              aria-live="polite"
            >
              <div className="bg-brand-600 text-white px-4 py-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Live Successful Boost
              </div>
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-mono text-slate-600">{liveActivity.phone}</p>
                  <p className="text-base font-display font-bold text-brand-600 mt-1">+{liveActivity.amount}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Fuliza Limit Boosted Successfully</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 whitespace-nowrap">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" /> {liveActivity.time}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-card">
              <img
                src="/image.png"
                alt="Fuliza limit increase notification and Safaricom mobile money promotion"
                className="block w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
