import { useMemo } from 'react';
import { useGetAllEvents } from '../hooks/useQueries';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { EventStatus } from '../backend';
import { useScrollReveal } from '../hooks/useScrollReveal';

function EventsGrid() {
  const { data: events, isLoading } = useGetAllEvents();
  const { ref, isVisible } = useScrollReveal(0.05);

  const { upcoming, past } = useMemo(() => {
    if (!events) return { upcoming: [], past: [] };
    const sorted = [...events].sort((a, b) => Number(a.eventDateTime) - Number(b.eventDateTime));
    return {
      upcoming: sorted.filter((e) => e.status === EventStatus.upcoming),
      past: sorted.filter((e) => e.status === EventStatus.past),
    };
  }, [events]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
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
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`space-y-16 reveal-hidden ${isVisible ? 'reveal-visible' : ''}`}
    >
      {upcoming.length > 0 && (
        <div>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-cinzel font-bold text-2xl text-foreground tracking-wider">Upcoming</h2>
            <span className="px-3 py-1 bg-gold text-black-primary text-xs font-cinzel tracking-widest">
              {upcoming.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {upcoming.map((event, i) => (
              <EventCard key={event.id.toString()} event={event} delay={(i % 4) + 1} />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-cinzel font-bold text-2xl text-foreground/50 tracking-wider">Past Events</h2>
            <span className="px-3 py-1 border border-foreground/20 text-foreground/40 text-xs font-cinzel tracking-widest">
              {past.length}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {past.map((event, i) => (
              <EventCard key={event.id.toString()} event={event} delay={(i % 4) + 1} />
            ))}
          </div>
        </div>
      )}

      {upcoming.length === 0 && past.length === 0 && (
        <div className="text-center py-24">
          <p className="font-cinzel text-foreground/30 tracking-widest text-lg">No events found.</p>
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-black-primary">
      {/* Page Header */}
      <div className="relative pt-32 pb-20 bg-black-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/generated/hero-fallback.dim_1920x1080.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black-primary/50 to-black-secondary" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-cinzel text-gold text-xs tracking-[0.4em] uppercase mb-4">All Events</p>
          <h1 className="font-cinzel font-bold text-5xl md:text-6xl text-foreground tracking-wider">
            Events
          </h1>
          <div className="divider-gold w-24 mx-auto mt-6" />
        </div>
      </div>

      {/* Events Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EventsGrid />
      </section>

      <Footer />
    </div>
  );
}
