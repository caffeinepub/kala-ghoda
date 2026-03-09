import { Link } from '@tanstack/react-router';
import { SiInstagram, SiFacebook, SiWhatsapp } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'kala-ghoda');

  return (
    <footer className="bg-black-primary border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <img
              src="/assets/generated/logo-wordmark.dim_600x200.png"
              alt="Kala Ghoda"
              className="h-12 w-auto object-contain"
            />
            <p className="text-foreground/50 text-sm leading-relaxed">
              Where luxury meets the night. Experience the finest in entertainment, music, and nightlife.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-gold/30 text-gold/70 hover:text-gold hover:border-gold hover:shadow-gold-sm transition-all duration-300"
              >
                <SiInstagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-gold/30 text-gold/70 hover:text-gold hover:border-gold hover:shadow-gold-sm transition-all duration-300"
              >
                <SiFacebook size={18} />
              </a>
              <a
                href="https://wa.me/919999999999?text=Hi%2C%20I%27d%20like%20to%20book%20a%20table%20at%20Kala%20Ghoda"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-gold/30 text-gold/70 hover:text-gold hover:border-gold hover:shadow-gold-sm transition-all duration-300"
              >
                <SiWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-gold text-sm tracking-widest uppercase">Quick Links</h4>
            <div className="divider-gold w-12 mb-4" />
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/events', label: 'Events' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-foreground/50 hover:text-gold text-sm transition-colors duration-300 font-cinzel tracking-wider"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-gold text-sm tracking-widest uppercase">Contact</h4>
            <div className="divider-gold w-12 mb-4" />
            <div className="space-y-3 text-sm text-foreground/50">
              <p>📍 Kala Ghoda, Fort, Mumbai 400001</p>
              <p>📞 +91 99999 99999</p>
              <p>
                <a
                  href="https://instagram.com/kalaghoda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  @kalaghoda
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="divider-gold my-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-foreground/30">
          <p className="font-cinzel tracking-wider">
            © {year} Kala Ghoda. All Rights Reserved.
          </p>
          <p className="flex items-center gap-1">
            Built with <Heart size={12} className="text-gold fill-gold" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-bright transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
