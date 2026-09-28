import { Zap, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#00a859] via-[#008f8f] to-[#003c96] text-white/80 pt-14 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 pb-10 border-b border-white/15">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 font-display font-bold text-lg text-white mb-4">
              <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                <Zap className="w-4.5 h-4.5" strokeWidth={2.5} />
              </span>
              Fuliza<span className="text-white">Boost</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-white/70">
              Instantly increase your fuliza limit with a one-time fee. No subscriptions, no hidden charges.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3.5">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#how" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Reviews</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3.5">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-white/60 flex-shrink-0" /> support@fulizalimit.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-white/60 flex-shrink-0" /> 0720 000 000</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-white/60 flex-shrink-0" /> Nairobi, Kenya</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
            <p>&copy; 2026 safaricomfulizaboost. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
