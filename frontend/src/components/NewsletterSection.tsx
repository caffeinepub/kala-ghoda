import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSubscribeNewsletter } from '../hooks/useQueries';
import { Mail, CheckCircle } from 'lucide-react';

export default function NewsletterSection() {
  const { ref, isVisible } = useScrollReveal();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { mutate: subscribe, isPending, error } = useSubscribeNewsletter();

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');
    subscribe(email, {
      onSuccess: () => {
        setSubscribed(true);
        setEmail('');
      },
    });
  };

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-24 bg-black-secondary relative overflow-hidden reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-gold" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-gold" />
      </div>

      <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 flex items-center justify-center border border-gold/40 text-gold">
            <Mail size={20} />
          </div>
        </div>

        <h2 className="font-cinzel font-bold text-3xl md:text-4xl text-foreground mb-4 tracking-wider">
          Stay in the <span className="gold-shimmer">Loop</span>
        </h2>
        <p className="text-foreground/50 mb-10 leading-relaxed">
          Be the first to know about exclusive events, VIP nights, and special offers at Kala Ghoda.
        </p>

        {subscribed ? (
          <div className="flex items-center justify-center gap-3 py-4 border border-gold/30 bg-gold/5">
            <CheckCircle size={20} className="text-gold" />
            <p className="font-cinzel text-gold tracking-wider">You're on the list. See you at the club!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-5 py-3.5 bg-black-card border border-gold/30 text-foreground placeholder-foreground/30 text-sm font-sans focus:border-gold transition-colors"
              />
              {emailError && (
                <p className="text-destructive text-xs mt-1 text-left">{emailError}</p>
              )}
              {error && (
                <p className="text-destructive text-xs mt-1 text-left">
                  {(error as Error).message?.includes('already subscribed')
                    ? 'This email is already subscribed.'
                    : 'Something went wrong. Please try again.'}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-3.5 btn-gold text-sm whitespace-nowrap disabled:opacity-50"
            >
              {isPending ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
