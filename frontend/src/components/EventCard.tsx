import { Link } from '@tanstack/react-router';
import { Calendar, Clock, Tag } from 'lucide-react';
import type { Event } from '../backend';
import { EventStatus } from '../backend';

interface EventCardProps {
  event: Event;
  delay?: number;
  className?: string;
}

function formatEventDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatEventTime(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function EventCard({ event, delay = 0, className = '' }: EventCardProps) {
  const isPast = event.status === EventStatus.past;

  const delayClass = delay === 1 ? 'reveal-delay-1'
    : delay === 2 ? 'reveal-delay-2'
    : delay === 3 ? 'reveal-delay-3'
    : '';

  return (
    <div className={`card-luxury overflow-hidden group ${delayClass} ${className}`}>
      {/* Poster Image */}
      <div className="relative overflow-hidden aspect-[3/4]">
        {event.posterImage ? (
          <img
            src={event.posterImage}
            alt={event.title}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              isPast ? 'grayscale opacity-60' : ''
            }`}
          />
        ) : (
          <div className="w-full h-full bg-black-secondary flex items-center justify-center">
            <span className="text-gold/30 font-cinzel text-sm tracking-widest">NO IMAGE</span>
          </div>
        )}
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 text-xs font-cinzel tracking-widest uppercase ${
              isPast
                ? 'bg-black-primary/80 text-foreground/50 border border-foreground/20'
                : 'bg-gold text-black-primary'
            }`}
          >
            {isPast ? 'Past' : 'Upcoming'}
          </span>
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black-primary via-transparent to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="font-cinzel font-bold text-lg text-foreground group-hover:text-gold transition-colors duration-300 line-clamp-2">
          {event.title}
        </h3>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-foreground/50">
            <Calendar size={12} className="text-gold/70 flex-shrink-0" />
            <span>{formatEventDate(event.eventDateTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-foreground/50">
            <Clock size={12} className="text-gold/70 flex-shrink-0" />
            <span>{formatEventTime(event.eventDateTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gold">
            <Tag size={12} className="flex-shrink-0" />
            <span>₹{event.ticketPrice.toFixed(0)}</span>
          </div>
        </div>

        <p className="text-foreground/50 text-sm leading-relaxed line-clamp-2">
          {event.shortDescription}
        </p>

        <div className="divider-gold opacity-30" />

        <Link
          to="/events/$eventId"
          params={{ eventId: event.id.toString() }}
          className="block w-full text-center py-2.5 text-xs font-cinzel tracking-widest uppercase btn-outline-gold"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
