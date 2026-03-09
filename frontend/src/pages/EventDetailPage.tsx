import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, Ticket, Calendar, Clock } from 'lucide-react';
import { useGetEventById } from '../hooks/useQueries';
import CountdownTimer from '../components/CountdownTimer';
import PhotoGallerySlider from '../components/PhotoGallerySlider';
import Footer from '../components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { EventStatus } from '../backend';

function formatEventDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatEventTime(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function EventDetailPage() {
  const { eventId } = useParams({ from: '/events/$eventId' });
  const eventIdBigInt = eventId ? BigInt(eventId) : null;
  const { data: event, isLoading, error } = useGetEventById(eventIdBigInt);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black-primary">
        <div className="h-[60vh] bg-black-secondary animate-pulse" />
        <div className="max-w-5xl mx-auto px-4 py-16 space-y-8">
          <Skeleton className="h-12 w-2/3 bg-black-card" />
          <Skeleton className="h-4 w-full bg-black-card" />
          <Skeleton className="h-4 w-5/6 bg-black-card" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-black-primary flex items-center justify-center">
        <div className="text-center space-y-6">
          <p className="font-cinzel text-foreground/30 text-xl tracking-widest">Event Not Found</p>
          <Link to="/events" className="inline-block btn-outline-gold px-8 py-3 text-sm font-cinzel tracking-widest uppercase">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const isPast = event.status === EventStatus.past;
  const bookingUrl = `https://wa.me/919999999999?text=${encodeURIComponent(`Hi, I'd like to book tickets for ${event.title} at Kala Ghoda`)}`;

  return (
    <div className="min-h-screen bg-black-primary">
      {/* Banner */}
      <div className="relative h-[65vh] min-h-[400px] overflow-hidden">
        {event.posterImage ? (
          <img
            src={event.posterImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-black-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black-primary via-black-primary/40 to-transparent" />

        {/* Back button */}
        <div className="absolute top-24 left-4 sm:left-8 z-10">
          <Link
            to="/events"
            className="flex items-center gap-2 text-foreground/60 hover:text-gold transition-colors font-cinzel text-xs tracking-widest uppercase"
          >
            <ArrowLeft size={16} />
            All Events
          </Link>
        </div>

        {/* Status badge */}
        <div className="absolute top-24 right-4 sm:right-8 z-10">
          <span className={`px-4 py-2 text-xs font-cinzel tracking-widest uppercase ${
            isPast
              ? 'bg-black-primary/80 text-foreground/50 border border-foreground/20'
              : 'bg-gold text-black-primary'
          }`}>
            {isPast ? 'Past Event' : 'Upcoming'}
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-cinzel font-bold text-4xl md:text-6xl text-foreground leading-tight mb-4">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-sm text-foreground/60">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-gold" />
                <span>{formatEventDate(event.eventDateTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gold" />
                <span>{formatEventTime(event.eventDateTime)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Countdown + Ticket */}
        {!isPast && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="font-cinzel text-gold text-xs tracking-[0.4em] uppercase">Countdown to Event</p>
              <CountdownTimer targetTimestamp={event.eventDateTime} />
            </div>
            <div className="card-luxury p-8 text-center space-y-6">
              <div>
                <p className="font-cinzel text-gold text-xs tracking-[0.4em] uppercase mb-2">Ticket Price</p>
                <div className="flex items-center justify-center gap-2">
                  <Ticket size={20} className="text-gold" />
                  <span className="font-cinzel font-bold text-4xl text-gold">
                    ₹{event.ticketPrice.toFixed(0)}
                  </span>
                </div>
                <p className="text-foreground/40 text-xs mt-1">per person</p>
              </div>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 btn-gold text-sm tracking-widest uppercase text-center"
              >
                Book Now
              </a>
            </div>
          </div>
        )}

        {isPast && (
          <div className="card-luxury p-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Ticket size={18} className="text-foreground/30" />
              <span className="font-cinzel text-foreground/40 tracking-wider">
                Ticket Price: ₹{event.ticketPrice.toFixed(0)}
              </span>
            </div>
            <span className="font-cinzel text-foreground/30 text-sm tracking-widest uppercase">Event Ended</span>
          </div>
        )}

        {/* Description */}
        <div className="space-y-6">
          <div>
            <p className="font-cinzel text-gold text-xs tracking-[0.4em] uppercase mb-4">About This Event</p>
            <div className="divider-gold w-16 mb-6" />
          </div>
          <p className="text-foreground/70 leading-relaxed text-base whitespace-pre-line">
            {event.fullDescription}
          </p>
        </div>

        {/* Video */}
        {event.videoUrl && (
          <div className="space-y-6">
            <div>
              <p className="font-cinzel text-gold text-xs tracking-[0.4em] uppercase mb-4">Event Video</p>
              <div className="divider-gold w-16 mb-6" />
            </div>
            <div className="aspect-video border border-gold/20 overflow-hidden">
              {event.videoUrl.includes('youtube.com') || event.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={event.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  className="w-full h-full"
                  allowFullScreen
                  title={`${event.title} Video`}
                />
              ) : (
                <video
                  src={event.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        )}

        {/* Gallery */}
        {event.galleryImages && event.galleryImages.length > 0 && (
          <div className="space-y-6">
            <div>
              <p className="font-cinzel text-gold text-xs tracking-[0.4em] uppercase mb-4">Photo Gallery</p>
              <div className="divider-gold w-16 mb-6" />
            </div>
            <PhotoGallerySlider images={event.galleryImages} />
          </div>
        )}

        {/* Book Now CTA (bottom) */}
        {!isPast && (
          <div className="text-center py-8 border-t border-gold/20">
            <p className="font-cinzel text-foreground/40 text-sm tracking-widest mb-6">
              Ready for an unforgettable night?
            </p>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-16 py-5 btn-gold text-sm tracking-widest uppercase"
            >
              Book Your Spot Now
            </a>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
