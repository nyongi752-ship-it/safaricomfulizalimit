import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { packages } from '@/data/content';
import {
  Check,
  ArrowRight,
  X,
  Loader2,
  AlertCircle,
  PartyPopper,
  ShieldCheck,
  Smartphone,
  UserRound,
  Mail,
  WalletCards,
  BriefcaseBusiness,
  ChevronRight,
  LockKeyhole,
  AlertTriangle,
} from 'lucide-react';

type CheckoutState = 'form' | 'processing' | 'success' | 'error';
type ApplicationStage = 'application' | 'checking' | 'approved' | 'confirm' | 'payment';

export default function Pricing() {
  const ref = useReveal<HTMLElement>();
  const [selected, setSelected] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [applicationStage, setApplicationStage] = useState<ApplicationStage>('application');
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentLimit, setCurrentLimit] = useState('');
  const [occupation, setOccupation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paying, setPaying] = useState(false);

  const selectedPkg = packages.find((pkg) => pkg.id === selected);

  const handleSelect = () => {
    setSelected(null);
    setApplicationStage('application');
    setCheckoutState('form');
    setErrorMsg('');
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setApplicationStage('application');
    setCheckoutState('form');
    setSelected(null);
    setErrorMsg('');
    setPaying(false);
  };

  const validateApplication = () => {
    const nextErrors: Record<string, string> = {};
    const normalizedPhone = phone.replace(/\s/g, '');
    if (fullName.trim().split(/\s+/).length < 2 || fullName.trim().length < 4) {
      nextErrors.fullName = 'Please enter your first and last name.';
    }
    if (!/^(?:\+254|0)?7\d{8}$/.test(normalizedPhone)) {
      nextErrors.phone = 'Please enter a valid Safaricom number (07XX XXX XXX).';
    }
    if (currentLimit.trim() === '' || Number(currentLimit) < 0) {
      nextErrors.currentLimit = 'Please enter your current limit.';
    }
    if (!occupation) nextErrors.occupation = 'Please select your occupation.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleApplicationSubmit = () => {
    if (!validateApplication()) return;
    setApplicationStage('checking');
    window.setTimeout(() => {
      setApplicationStage('approved');
    }, 2200);
  };

  const chooseTarget = (id: string) => {
    setSelected(id);
    setApplicationStage('confirm');
  };

  const confirmTarget = () => {
    setApplicationStage('payment');
    setCheckoutState('form');
  };

  const handlePayment = async () => {
    if (!selectedPkg) return;
    setPaying(true);
    setCheckoutState('processing');
    setErrorMsg('');

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paystack`;
      const headers = {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const initRes = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'initialize',
          package_id: selectedPkg.id,
          limit_label: selectedPkg.limit,
          fee_label: selectedPkg.fee,
          fee_kobo: selectedPkg.feeKobo,
          email,
          phone,
          full_name: fullName.trim(),
          current_limit: currentLimit,
          occupation,
        }),
      });

      if (!initRes.ok) {
        const err = await initRes.json().catch(() => ({}));
        throw new Error(err.error || `Initialization failed (${initRes.status})`);
      }

      const initData = await initRes.json();
      if (!initData.reference || !initData.order_id) {
        throw new Error('Invalid response from payment server.');
      }

      const publishableKey = import.meta.env.VITE_PAYSTACK_PUBLISHABLE_KEY;
      if (!publishableKey || publishableKey === 'pk_test_xxx') {
        throw new Error('Paystack publishable key not configured. Add it to your .env file.');
      }

      await new Promise<void>((resolve, reject) => {
        const handler = window.PaystackPop!.setup({
          key: publishableKey,
          email,
          amount: selectedPkg.feeKobo,
          currency: 'KES',
          ref: initData.reference,
          metadata: {
            order_id: initData.order_id,
            package_id: selectedPkg.id,
            full_name: fullName.trim(),
            current_limit: currentLimit,
            occupation,
          },
          onClose: () => reject(new Error('Payment window closed.')),
          callback: () => resolve(),
        });
        handler.openIframe();
      });

      const verifyRes = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'verify',
          reference: initData.reference,
          order_id: initData.order_id,
        }),
      });

      if (!verifyRes.ok) {
        const err = await verifyRes.json().catch(() => ({}));
        throw new Error(err.error || `Verification failed (${verifyRes.status})`);
      }

      const verifyData = await verifyRes.json();
      if (verifyData.status === 'paid') {
        setCheckoutState('success');
      } else {
        throw new Error('Payment was not successful.');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
      setCheckoutState('error');
    } finally {
      setPaying(false);
    }
  };

  const fieldClass = (field: string) =>
    `w-full pl-11 pr-4 py-3.5 rounded-xl border outline-none transition-all text-slate-900 text-sm ${
      errors[field]
        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-50'
    }`;

  return (
    <section id="pricing" ref={ref} className="py-20 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
          <p className="text-brand-600 font-semibold text-xs uppercase tracking-wider">Pricing</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mt-2">
            Select Your New Approved Limit
          </h2>
          <p className="text-slate-600 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Complete the quick eligibility form first. Once approved, choose a target limit and review the one-time activation fee.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg, i) => (
            <div
              key={pkg.id}
              className={`reveal relative rounded-2xl p-6 transition-all ${
                pkg.popular
                  ? 'bg-brand-600 text-white shadow-card-hover lg:scale-[1.03] ring-1 ring-brand-600'
                  : 'bg-white text-slate-900 border border-slate-200 hover:border-brand-300 hover:shadow-card'
              }`}
              style={{ transitionDelay: `${i * 0.04}s` }}
            >
              {pkg.badge && (
                <span className={`absolute -top-2.5 left-6 px-3 py-1 rounded-full text-xs font-semibold ${pkg.popular ? 'bg-white text-brand-700' : 'bg-brand-50 text-brand-700 border border-brand-200'}`}>
                  {pkg.badge}
                </span>
              )}
              <p className={`text-xs font-medium ${pkg.popular ? 'text-brand-100' : 'text-slate-500'}`}>
                FULIZA {pkg.limit.replace('KSh ', '').replace(',', '')}
              </p>
              <p className={`font-display font-bold text-2xl mt-1 ${pkg.popular ? 'text-white' : 'text-slate-900'}`}>
                {pkg.limit}
              </p>
              <div className={`mt-3 flex items-baseline gap-1.5 ${pkg.popular ? 'text-brand-50' : 'text-slate-600'}`}>
                <span className="text-xs">Activation fee:</span>
                <span className="font-display font-bold text-xl">{pkg.fee}</span>
              </div>
              <ul className={`mt-5 space-y-2.5 text-sm ${pkg.popular ? 'text-brand-50' : 'text-slate-600'}`}>
                <li className="flex items-center gap-2"><Check className={`w-4 h-4 flex-shrink-0 ${pkg.popular ? 'text-brand-200' : 'text-brand-500'}`} />Eligibility check included</li>
                <li className="flex items-center gap-2"><Check className={`w-4 h-4 flex-shrink-0 ${pkg.popular ? 'text-brand-200' : 'text-brand-500'}`} />One-time fee, no subscription</li>
                <li className="flex items-center gap-2"><Check className={`w-4 h-4 flex-shrink-0 ${pkg.popular ? 'text-brand-200' : 'text-brand-500'}`} />No PIN required on this site</li>
              </ul>
              <button
                onClick={handleSelect}
                className={`mt-6 w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 focus-ring ${pkg.popular ? 'bg-white text-brand-700 hover:bg-brand-50' : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand'}`}
              >
                Check Eligibility <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in"
          onClick={checkoutState === 'processing' ? undefined : closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-title"
        >
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[92vh] overflow-y-auto p-7 sm:p-8 animate-scale-in"
            onClick={(event) => event.stopPropagation()}
          >
            {checkoutState !== 'processing' && applicationStage !== 'checking' && (
              <button onClick={closeModal} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors focus-ring" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Stage: Application form */}
            {applicationStage === 'application' && checkoutState === 'form' && (
              <>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4">
                    <UserRound className="w-6 h-6 text-brand-700" />
                  </div>
                  <h3 id="checkout-title" className="font-display font-bold text-2xl text-slate-900">Check Your Eligibility</h3>
                  <p className="text-slate-600 mt-2 text-sm">Enter your details to receive an eligibility result before choosing a target limit.</p>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="checkout-full-name" className="text-sm font-semibold text-slate-700">Full Name</label>
                    <div className="relative mt-1.5"><UserRound className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" /><input id="checkout-full-name" type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Enter your full name" autoComplete="name" className={fieldClass('fullName')} /></div>
                    {errors.fullName && <p className="mt-1.5 text-xs text-red-500">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label htmlFor="checkout-phone" className="text-sm font-semibold text-slate-700">Safaricom Phone Number</label>
                    <div className="relative mt-1.5"><Smartphone className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" /><input id="checkout-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="07XXXXXXXX" autoComplete="tel" className={fieldClass('phone')} /></div>
                    {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="checkout-current-limit" className="text-sm font-semibold text-slate-700">Your Current Fuliza Limit (KSh)</label>
                    <div className="relative mt-1.5"><WalletCards className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" /><input id="checkout-current-limit" type="number" min="0" value={currentLimit} onChange={(event) => setCurrentLimit(event.target.value)} placeholder="e.g. 4,000" className={fieldClass('currentLimit')} /></div>
                    {errors.currentLimit && <p className="mt-1.5 text-xs text-red-500">{errors.currentLimit}</p>}
                  </div>
                  <div>
                    <label htmlFor="checkout-occupation" className="text-sm font-semibold text-slate-700">Occupation</label>
                    <div className="relative mt-1.5"><BriefcaseBusiness className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" /><select id="checkout-occupation" value={occupation} onChange={(event) => setOccupation(event.target.value)} className={`${fieldClass('occupation')} bg-white`}><option value="">Select your occupation</option><option value="employed">Employed</option><option value="self-employed">Self-employed</option><option value="business-owner">Business owner</option><option value="student">Student</option><option value="other">Other</option></select></div>
                    {errors.occupation && <p className="mt-1.5 text-xs text-red-500">{errors.occupation}</p>}
                  </div>
                  <div>
                    <label htmlFor="checkout-email" className="text-sm font-semibold text-slate-700">Email for Receipt</label>
                    <div className="relative mt-1.5"><Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" /><input id="checkout-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" className={fieldClass('email')} /></div>
                    {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <button onClick={handleApplicationSubmit} className="mt-6 w-full py-3.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors shadow-brand focus-ring flex items-center justify-center gap-2">
                  Check Eligibility
                </button>
                <p className="mt-3 text-center text-xs text-slate-400">This site does not request a National ID or M-Pesa PIN.</p>
              </>
            )}

            {/* Stage: Checking (loading) */}
            {applicationStage === 'checking' && (
              <div className="text-center py-12">
                <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto mb-5" />
                <h3 className="font-display font-semibold text-lg text-slate-900">Checking Eligibility...</h3>
                <p className="text-slate-600 mt-2 text-sm">Verifying your details against mobile money records. This will take a moment.</p>
              </div>
            )}

            {/* Stage: Approved — choose target */}
            {applicationStage === 'approved' && (
              <>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4"><Check className="w-7 h-7 text-brand-700" /></div>
                  <h3 id="checkout-title" className="font-display font-bold text-2xl text-slate-900">Eligibility Approved</h3>
                  <p className="text-slate-600 mt-2 text-sm">You are eligible to increase your limit. Choose your target limit below to continue.</p>
                </div>
                <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-between">
                  <div><p className="text-xs text-slate-500">Current limit</p><p className="font-display font-bold text-slate-900">KSh {Number(currentLimit).toLocaleString()}</p></div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                  <div className="text-right"><p className="text-xs text-slate-500">Applicant</p><p className="font-semibold text-slate-900 text-sm">{fullName}</p></div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  {packages.map((pkg) => (
                    <button key={pkg.id} onClick={() => chooseTarget(pkg.id)} className={`relative rounded-xl border p-3 text-center transition-all hover:border-brand-500 hover:shadow-card focus-ring ${pkg.popular ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white'}`}>
                      {pkg.popular && <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-600 px-2 py-0.5 text-[9px] font-bold text-white">RECOMMENDED</span>}
                      <p className="font-display font-bold text-sm text-slate-900">{pkg.limit}</p>
                      <p className="mt-1 text-[10px] text-slate-500">Activation fee</p>
                      <p className="mt-1 text-sm font-bold text-brand-600">{pkg.fee}</p>
                    </button>
                  ))}
                </div>
                <p className="mt-5 text-center text-xs text-slate-400">One-time activation fees shown above. Maximum target limit: KSh 70,000.</p>
              </>
            )}

            {/* Stage: Confirm target selection */}
            {applicationStage === 'confirm' && selectedPkg && (
              <>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-7 h-7 text-amber-500" />
                  </div>
                  <h3 id="checkout-title" className="font-display font-bold text-2xl text-slate-900">Confirm Your Selection</h3>
                  <p className="text-slate-600 mt-2 text-sm">Please confirm you want to boost your limit to the selected target.</p>
                </div>

                <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Current limit</span><span className="font-semibold text-slate-900">KSh {Number(currentLimit).toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">New target limit</span><span className="font-semibold text-brand-600 text-base">{selectedPkg.limit}</span></div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between text-sm"><span className="text-slate-500">Activation fee</span><span className="font-display font-bold text-brand-600">{selectedPkg.fee}</span></div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button onClick={() => setApplicationStage('approved')} className="flex-1 py-3.5 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 hover:bg-slate-50 transition-colors focus-ring">
                    Cancel
                  </button>
                  <button onClick={confirmTarget} className="flex-1 py-3.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors shadow-brand focus-ring">
                    Confirm &amp; Continue
                  </button>
                </div>
              </>
            )}

            {/* Stage: Payment */}
            {applicationStage === 'payment' && checkoutState === 'form' && selectedPkg && (
              <>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4"><LockKeyhole className="w-6 h-6 text-brand-700" /></div>
                  <h3 id="checkout-title" className="font-display font-bold text-2xl text-slate-900">Activate Your Fuliza Limit</h3>
                  <p className="text-slate-600 mt-2 text-sm">Your eligibility is approved. Review the activation details before paying.</p>
                </div>
                <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Current limit</span><span className="font-semibold text-slate-900">KSh {Number(currentLimit).toLocaleString()}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Selected limit</span><span className="font-semibold text-brand-600">{selectedPkg.limit}</span></div>
                  <div className="border-t border-slate-200 pt-3 flex justify-between text-sm"><span className="text-slate-500">Activation fee</span><span className="font-display font-bold text-brand-600">{selectedPkg.fee}</span></div>
                </div>
                <div className="mt-5">
                  <label htmlFor="payment-phone" className="text-sm font-semibold text-slate-700">M-Pesa Phone Number</label>
                  <div className="relative mt-1.5"><Smartphone className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" /><input id="payment-phone" type="tel" value={phone} readOnly className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm" /></div>
                </div>
                <div className="mt-5 rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2.5">
                  <div className="flex items-start gap-2.5 text-xs text-slate-600"><Smartphone className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" /><span>An M-Pesa STK push will appear on this phone to authorize the payment.</span></div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600"><ShieldCheck className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" /><span>Enter your PIN only on the official phone prompt. We never see or store it.</span></div>
                </div>
                <button onClick={handlePayment} disabled={paying} className="mt-5 w-full py-3.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors shadow-brand focus-ring disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {paying ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <>Pay {selectedPkg.fee} &amp; Activate</>}
                </button>
                <button onClick={() => setApplicationStage('approved')} disabled={paying} className="mt-3 w-full py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors focus-ring disabled:opacity-50">
                  Choose a different limit
                </button>
              </>
            )}

            {/* Processing */}
            {checkoutState === 'processing' && (
              <div className="text-center py-10"><Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto mb-5" /><h3 className="font-display font-semibold text-lg text-slate-900">Processing Payment</h3><p className="text-slate-600 mt-2 text-sm">Please wait while we confirm your payment...</p></div>
            )}
            {/* Success */}
            {checkoutState === 'success' && selectedPkg && (
              <div className="text-center py-10"><div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-5"><PartyPopper className="w-7 h-7 text-brand-600" /></div><h3 className="font-display font-bold text-xl text-slate-900">Payment Successful!</h3><p className="text-slate-600 mt-2 text-sm">Your limit has been activated at <span className="font-semibold text-brand-600">{selectedPkg.limit}</span>.</p><button onClick={closeModal} className="mt-6 w-full py-3.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors focus-ring">Done</button></div>
            )}
            {/* Error */}
            {checkoutState === 'error' && (
              <div className="text-center py-10"><div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-5"><AlertCircle className="w-7 h-7 text-red-500" /></div><h3 className="font-display font-bold text-xl text-slate-900">Payment Failed</h3><p className="text-slate-600 mt-2 text-sm">{errorMsg}</p><button onClick={() => { setCheckoutState('form'); setApplicationStage('payment'); }} className="mt-6 w-full py-3.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors focus-ring">Try Again</button></div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
