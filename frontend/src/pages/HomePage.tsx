import { useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronDown, MapPin, Phone, Instagram } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useGetRecentUpcomingEvents } from '../hooks/useQueries';
import EventCard from '../components/EventCard';
import NewsletterSection from '../components/NewsletterSection';
import Footer from '../components/Footer';
import { Skeleton } from '@/components/ui/skeleton';

const GALLERY_IMAGES = [
  '/assets/generated/gallery-1.dim_800x600.png',
  '/assets/generated/gallery-2.dim_800x600.png',
  '/assets/generated/gallery-3.dim_800x600.png',
  '/assets/generated/gallery-4.dim_800x600.png',
  '/assets/generated/gallery-5.dim_800x600.png',
  '/assets/generated/gallery-6.dim_800x600.png',
];

function HeroSection() {
  const scrollToContent = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/assets/generated/hero-fallback.dim_1920x1080.png"
      >
        <source src="" type="video/mp4" />
      </video>

      {/* Fallback image shown when video fails */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/generated/hero-fallback.dim_1920x1080.png')" }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-black-primary/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-black-primary/30 via-transparent to-black-primary" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 animate-fade-in-up">
        <div className="mb-8">
          <img
            src="/assets/generated/logo-wordmark.dim_600x200.png"
            alt="Kala Ghoda"
            className="h-20 md:h-28 w-auto mx-auto object-contain drop-shadow-2xl"
          />
        </div>

        <div className="divider-gold w-32 mx-auto mb-6 opacity-60" />

        <p className="font-cinzel text-lg md:text-2xl text-foreground/80 tracking-[0.3em] uppercase mb-2">
          Where Nights Come Alive
        </p>

        <p className="text-foreground/40 text-sm tracking-widest uppercase mb-12 font-sans">
          Mumbai's Premier Nightclub Experience
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/events"
            className="px-10 py-4 btn-gold text-sm tracking-widest uppercase"
          >
            View Upcoming Events
          </Link>
          <a
            href="https://wa.me/919999999999?text=Hi%2C%20I%27d%20like%20to%20book%20a%20table%20at%20Kala%20Ghoda"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 btn-outline-gold text-sm tracking-widest uppercase"
          >
            Book Now
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/50 hover:text-gold transition-colors animate-bounce"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  );
}

function AboutSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      id="about"
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-28 bg-black-primary reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div>
              <p className="font-cinzel text-gold text-xs tracking-[0.4em] uppercase mb-4">About Us</p>
              <h2 className="font-cinzel font-bold text-4xl md:text-5xl text-foreground leading-tight">
                The Art of the <span className="gold-shimmer">Night</span>
              </h2>
            </div>
            <div className="divider-gold w-16" />
            <p className="text-foreground/60 leading-relaxed text-base">
              Nestled in the heart of Mumbai's iconic Kala Ghoda district, we are more than a nightclub — we are an experience. Born from a passion for music, art, and the electric energy of the night, Kala Ghoda brings together the city's finest in an atmosphere of unparalleled luxury.
            </p>
            <p className="text-foreground/60 leading-relaxed text-base">
              From world-class DJs to curated cocktail menus, every detail is crafted to perfection. Our intimate yet grand space is designed to make every night unforgettable — whether you're celebrating a milestone or simply surrendering to the music.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4">
              {[
                { value: '10+', label: 'Years of Excellence' },
                { value: '500+', label: 'Events Hosted' },
                { value: '50K+', label: 'Happy Guests' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-cinzel font-bold text-2xl text-gold">{stat.value}</p>
                  <p className="text-foreground/40 text-xs mt-1 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden border border-gold/20">
              <img
                src="/assets/generated/gallery-3.dim_800x600.png"
                alt="Kala Ghoda Interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-gold/30 -z-10" />
            <div className="absolute -top-4 -right-4 w-32 h-32 border border-gold/30 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}

function UpcomingEventsSection() {
  const { ref, isVisible } = useScrollReveal();
  const { data: events, isLoading } = useGetRecentUpcomingEvents();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-28 bg-black-secondary reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-cinzel text-gold text-xs tracking-[0.4em] uppercase mb-4">What's On</p>
          <h2 className="font-cinzel font-bold text-4xl md:text-5xl text-foreground tracking-wider">
            Upcoming <span className="gold-shimmer">Events</span>
          </h2>
          <div className="divider-gold w-24 mx-auto mt-6" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-luxury overflow-hidden">
                <Skeleton className="aspect-[3/4] w-full bg-black-card" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4 bg-black-card" />
                  <Skeleton className="h-4 w-1/2 bg-black-card" />
                  <Skeleton className="h-4 w-full bg-black-card" />
                </div>
              </div>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event, i) => (
              <EventCard key={event.id.toString()} event={event} delay={i + 1} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-cinzel text-foreground/30 tracking-widest">No upcoming events at this time.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/events"
            className="inline-block px-10 py-4 btn-outline-gold text-sm tracking-widest uppercase"
          >
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-28 bg-black-primary reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-cinzel text-gold text-xs tracking-[0.4em] uppercase mb-4">The Experience</p>
          <h2 className="font-cinzel font-bold text-4xl md:text-5xl text-foreground tracking-wider">
            Gallery
          </h2>
          <div className="divider-gold w-24 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`overflow-hidden group border border-gold/10 hover:border-gold/40 transition-all duration-500 ${
                i === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className={`${i === 0 ? 'aspect-square md:aspect-auto md:h-full' : 'aspect-square'} overflow-hidden`}>
                <img
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-28 bg-black-secondary reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="font-cinzel text-gold text-xs tracking-[0.4em] uppercase mb-4">Find Us</p>
          <h2 className="font-cinzel font-bold text-4xl md:text-5xl text-foreground tracking-wider">
            Contact
          </h2>
          <div className="divider-gold w-24 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Map */}
          <div className="border border-gold/20 overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.9!2d72.8347!3d18.9281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1c73a0b0001%3A0x0!2sKala+Ghoda%2C+Fort%2C+Mumbai!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="400"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kala Ghoda Location"
            />
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center border border-gold/30 text-gold flex-shrink-0 mt-1">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="font-cinzel text-gold text-xs tracking-widest uppercase mb-1">Address</p>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    Kala Ghoda, Fort<br />
                    Mumbai, Maharashtra 400001<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center border border-gold/30 text-gold flex-shrink-0 mt-1">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="font-cinzel text-gold text-xs tracking-widest uppercase mb-1">Phone</p>
                  <a
                    href="tel:+919999999999"
                    className="text-foreground/60 hover:text-gold transition-colors text-sm"
                  >
                    +91 99999 99999
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center border border-gold/30 text-gold flex-shrink-0 mt-1">
                  <Instagram size={16} />
                </div>
                <div>
                  <p className="font-cinzel text-gold text-xs tracking-widest uppercase mb-1">Instagram</p>
                  <a
                    href="https://instagram.com/kalaghoda"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/60 hover:text-gold transition-colors text-sm"
                  >
                    @kalaghoda
                  </a>
                </div>
              </div>
            </div>

            <div className="divider-gold" />

            <div>
              <p className="font-cinzel text-gold text-xs tracking-widest uppercase mb-3">Opening Hours</p>
              <div className="space-y-2 text-sm text-foreground/50">
                <div className="flex justify-between">
                  <span>Wednesday – Thursday</span>
                  <span className="text-gold/70">9 PM – 3 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday – Saturday</span>
                  <span className="text-gold/70">9 PM – 5 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-gold/70">8 PM – 2 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <UpcomingEventsSection />
      <GallerySection />
      <ContactSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
