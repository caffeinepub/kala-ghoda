import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Users, Calendar } from 'lucide-react';
import { useGetAllEvents, useDeleteEvent, useToggleEventStatus, useListSubscribers } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { EventStatus } from '../backend';
import type { Event } from '../backend';
import { Skeleton } from '@/components/ui/skeleton';

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: events, isLoading: eventsLoading } = useGetAllEvents();
  const { data: subscribers, isLoading: subsLoading } = useListSubscribers();
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();
  const { mutate: toggleStatus, isPending: isToggling } = useToggleEventStatus();

  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleDelete = (event: Event) => setDeleteTarget(event);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteEvent(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const sortedEvents = events
    ? [...events].sort((a, b) => Number(b.creationTimestamp) - Number(a.creationTimestamp))
    : [];

  return (
    <div className="min-h-screen bg-black-primary">
      {/* Header */}
      <div className="bg-black-secondary border-b border-gold/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/assets/generated/logo-wordmark.dim_600x200.png"
              alt="Kala Ghoda"
              className="h-8 w-auto object-contain"
            />
            <span className="text-gold/40 text-xs font-cinzel tracking-widest">/ Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-foreground/40 hover:text-gold text-xs font-cinzel tracking-widest uppercase transition-colors">
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 btn-outline-gold text-xs tracking-widest uppercase"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="card-luxury p-6 flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center border border-gold/30 text-gold">
              <Calendar size={20} />
            </div>
            <div>
              <p className="font-cinzel text-gold text-2xl font-bold">{events?.length ?? 0}</p>
              <p className="text-foreground/40 text-xs font-cinzel tracking-widest uppercase">Total Events</p>
            </div>
          </div>
          <div className="card-luxury p-6 flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center border border-gold/30 text-gold">
              <ToggleRight size={20} />
            </div>
            <div>
              <p className="font-cinzel text-gold text-2xl font-bold">
                {events?.filter((e) => e.status === EventStatus.upcoming).length ?? 0}
              </p>
              <p className="text-foreground/40 text-xs font-cinzel tracking-widest uppercase">Upcoming</p>
            </div>
          </div>
          <div className="card-luxury p-6 flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center border border-gold/30 text-gold">
              <Users size={20} />
            </div>
            <div>
              <p className="font-cinzel text-gold text-2xl font-bold">{subscribers?.length ?? 0}</p>
              <p className="text-foreground/40 text-xs font-cinzel tracking-widest uppercase">Subscribers</p>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-cinzel font-bold text-xl text-foreground tracking-wider">Events</h2>
            <Link
              to="/admin/events/add"
              className="flex items-center gap-2 px-5 py-2.5 btn-gold text-xs tracking-widest uppercase"
            >
              <Plus size={14} />
              Add Event
            </Link>
          </div>

          <div className="card-luxury overflow-hidden">
            {eventsLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full bg-black-secondary" />
                ))}
              </div>
            ) : sortedEvents.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-cinzel text-foreground/30 tracking-widest">No events yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold/20">
                      <th className="text-left px-6 py-4 font-cinzel text-gold text-xs tracking-widest uppercase">Event</th>
                      <th className="text-left px-6 py-4 font-cinzel text-gold text-xs tracking-widest uppercase hidden md:table-cell">Date</th>
                      <th className="text-left px-6 py-4 font-cinzel text-gold text-xs tracking-widest uppercase hidden sm:table-cell">Price</th>
                      <th className="text-left px-6 py-4 font-cinzel text-gold text-xs tracking-widest uppercase">Status</th>
                      <th className="text-right px-6 py-4 font-cinzel text-gold text-xs tracking-widest uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEvents.map((event) => (
                      <tr key={event.id.toString()} className="border-b border-gold/10 hover:bg-gold/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {event.posterImage && (
                              <img
                                src={event.posterImage}
                                alt={event.title}
                                className="w-10 h-12 object-cover border border-gold/20 flex-shrink-0"
                              />
                            )}
                            <div>
                              <p className="font-cinzel text-foreground text-sm font-semibold line-clamp-1">{event.title}</p>
                              <p className="text-foreground/40 text-xs line-clamp-1 mt-0.5">{event.shortDescription}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-foreground/50 text-sm hidden md:table-cell">
                          {formatDate(event.eventDateTime)}
                        </td>
                        <td className="px-6 py-4 text-gold text-sm hidden sm:table-cell">
                          ₹{event.ticketPrice.toFixed(0)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-cinzel tracking-widest ${
                            event.status === EventStatus.upcoming
                              ? 'bg-gold/20 text-gold border border-gold/30'
                              : 'bg-foreground/5 text-foreground/40 border border-foreground/20'
                          }`}>
                            {event.status === EventStatus.upcoming ? 'Upcoming' : 'Past'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => toggleStatus(event.id)}
                              disabled={isToggling}
                              title="Toggle Status"
                              className="w-8 h-8 flex items-center justify-center border border-gold/20 text-foreground/40 hover:text-gold hover:border-gold transition-all disabled:opacity-50"
                            >
                              {event.status === EventStatus.upcoming
                                ? <ToggleRight size={14} />
                                : <ToggleLeft size={14} />
                              }
                            </button>
                            <Link
                              to="/admin/events/edit/$eventId"
                              params={{ eventId: event.id.toString() }}
                              className="w-8 h-8 flex items-center justify-center border border-gold/20 text-foreground/40 hover:text-gold hover:border-gold transition-all"
                            >
                              <Edit size={14} />
                            </Link>
                            <button
                              onClick={() => handleDelete(event)}
                              className="w-8 h-8 flex items-center justify-center border border-destructive/20 text-destructive/50 hover:text-destructive hover:border-destructive transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Subscribers */}
        <div className="space-y-4">
          <h2 className="font-cinzel font-bold text-xl text-foreground tracking-wider">Newsletter Subscribers</h2>
          <div className="card-luxury p-6">
            {subsLoading ? (
              <Skeleton className="h-20 w-full bg-black-secondary" />
            ) : !subscribers || subscribers.length === 0 ? (
              <p className="text-foreground/30 font-cinzel text-sm tracking-widest text-center py-4">No subscribers yet.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {subscribers.map((email, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-gold/10 last:border-0">
                    <div className="w-2 h-2 bg-gold rounded-full flex-shrink-0" />
                    <span className="text-foreground/60 text-sm">{email}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDeleteModal
          open={!!deleteTarget}
          eventTitle={deleteTarget.title}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
