import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useGetEventById, useCreateEvent, useUpdateEvent } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

interface EventFormData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  eventDate: string;
  eventTime: string;
  ticketPrice: string;
  posterImage: string;
  galleryImages: string[];
  videoUrl: string;
}

const EMPTY_FORM: EventFormData = {
  title: '',
  shortDescription: '',
  fullDescription: '',
  eventDate: '',
  eventTime: '21:00',
  ticketPrice: '',
  posterImage: '',
  galleryImages: [],
  videoUrl: '',
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function dateTimeToNanoseconds(date: string, time: string): bigint {
  const dt = new Date(`${date}T${time}:00`);
  return BigInt(dt.getTime()) * BigInt(1_000_000);
}

interface AdminEventFormPageProps {
  mode: 'add' | 'edit';
}

export default function AdminEventFormPage({ mode }: AdminEventFormPageProps) {
  const navigate = useNavigate();
  // useParams with strict: false to work in both add and edit routes
  const params = useParams({ strict: false }) as { eventId?: string };
  const eventId = mode === 'edit' && params.eventId ? BigInt(params.eventId) : null;

  const { data: existingEvent, isLoading: eventLoading } = useGetEventById(eventId);
  const { mutate: createEvent, isPending: isCreating } = useCreateEvent();
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();

  const [form, setForm] = useState<EventFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});
  const [submitError, setSubmitError] = useState('');

  const isPending = isCreating || isUpdating;

  // Pre-populate form for edit mode
  useEffect(() => {
    if (mode === 'edit' && existingEvent) {
      const ms = Number(existingEvent.eventDateTime) / 1_000_000;
      const dt = new Date(ms);
      const pad = (n: number) => String(n).padStart(2, '0');
      const dateStr = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
      const timeStr = `${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
      setForm({
        title: existingEvent.title,
        shortDescription: existingEvent.shortDescription,
        fullDescription: existingEvent.fullDescription,
        eventDate: dateStr,
        eventTime: timeStr,
        ticketPrice: existingEvent.ticketPrice.toString(),
        posterImage: existingEvent.posterImage,
        galleryImages: [...existingEvent.galleryImages],
        videoUrl: existingEvent.videoUrl,
      });
    }
  }, [existingEvent, mode]);

  const setField = (field: keyof EventFormData, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!form.fullDescription.trim()) newErrors.fullDescription = 'Full description is required';
    if (!form.eventDate) newErrors.eventDate = 'Event date is required';
    if (!form.ticketPrice || isNaN(Number(form.ticketPrice))) {
      newErrors.ticketPrice = 'Valid ticket price is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setField('posterImage', base64);
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const base64s = await Promise.all(files.map(fileToBase64));
    setField('galleryImages', [...form.galleryImages, ...base64s]);
  };

  const removeGalleryImage = (index: number) => {
    setField('galleryImages', form.galleryImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError('');

    const eventDateTime = dateTimeToNanoseconds(form.eventDate, form.eventTime);
    const ticketPrice = parseFloat(form.ticketPrice);

    if (mode === 'add') {
      createEvent(
        {
          title: form.title,
          shortDescription: form.shortDescription,
          fullDescription: form.fullDescription,
          eventDateTime,
          ticketPrice,
          posterImage: form.posterImage,
          galleryImages: form.galleryImages,
          videoUrl: form.videoUrl,
        },
        {
          onSuccess: () => navigate({ to: '/admin' }),
          onError: (err) => setSubmitError((err as Error).message || 'Failed to create event'),
        }
      );
    } else if (mode === 'edit' && eventId !== null) {
      updateEvent(
        {
          eventId,
          title: form.title,
          shortDescription: form.shortDescription,
          fullDescription: form.fullDescription,
          eventDateTime,
          ticketPrice,
          posterImage: form.posterImage,
          galleryImages: form.galleryImages,
          videoUrl: form.videoUrl,
        },
        {
          onSuccess: () => navigate({ to: '/admin' }),
          onError: (err) => setSubmitError((err as Error).message || 'Failed to update event'),
        }
      );
    }
  };

  if (mode === 'edit' && eventLoading) {
    return (
      <div className="min-h-screen bg-black-primary p-8 pt-24">
        <Skeleton className="h-8 w-48 bg-black-card mb-8" />
        <div className="space-y-4 max-w-4xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full bg-black-card" />
          ))}
        </div>
      </div>
    );
  }

  const inputClass =
    'w-full px-4 py-3 bg-black-card border border-gold/20 text-foreground placeholder-foreground/30 text-sm focus:border-gold transition-colors';
  const labelClass = 'block font-cinzel text-gold text-xs tracking-widest uppercase mb-2';
  const errorClass = 'text-destructive text-xs mt-1';

  return (
    <div className="min-h-screen bg-black-primary">
      {/* Header */}
      <div className="bg-black-secondary border-b border-gold/20 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-foreground/40 hover:text-gold transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-cinzel font-bold text-foreground tracking-wider">
              {mode === 'add' ? 'Add New Event' : 'Edit Event'}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {submitError && (
            <div className="border border-destructive/40 bg-destructive/10 px-4 py-3 text-destructive text-sm">
              {submitError}
            </div>
          )}

          {/* Basic Info */}
          <div className="card-luxury p-6 space-y-6">
            <h2 className="font-cinzel text-gold text-sm tracking-widest uppercase border-b border-gold/20 pb-4">
              Event Details
            </h2>

            <div>
              <label className={labelClass}>Event Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="Enter event title"
                className={inputClass}
              />
              {errors.title && <p className={errorClass}>{errors.title}</p>}
            </div>

            <div>
              <label className={labelClass}>Short Description *</label>
              <input
                type="text"
                value={form.shortDescription}
                onChange={(e) => setField('shortDescription', e.target.value)}
                placeholder="Brief description for event cards"
                className={inputClass}
              />
              {errors.shortDescription && <p className={errorClass}>{errors.shortDescription}</p>}
            </div>

            <div>
              <label className={labelClass}>Full Description *</label>
              <textarea
                value={form.fullDescription}
                onChange={(e) => setField('fullDescription', e.target.value)}
                placeholder="Detailed event description"
                rows={5}
                className={`${inputClass} resize-none`}
              />
              {errors.fullDescription && <p className={errorClass}>{errors.fullDescription}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Event Date *</label>
                <input
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => setField('eventDate', e.target.value)}
                  className={`${inputClass} [color-scheme:dark]`}
                />
                {errors.eventDate && <p className={errorClass}>{errors.eventDate}</p>}
              </div>
              <div>
                <label className={labelClass}>Time</label>
                <input
                  type="time"
                  value={form.eventTime}
                  onChange={(e) => setField('eventTime', e.target.value)}
                  className={`${inputClass} [color-scheme:dark]`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Ticket Price (₹) *</label>
              <input
                type="number"
                value={form.ticketPrice}
                onChange={(e) => setField('ticketPrice', e.target.value)}
                placeholder="e.g. 999"
                min="0"
                step="0.01"
                className={inputClass}
              />
              {errors.ticketPrice && <p className={errorClass}>{errors.ticketPrice}</p>}
            </div>

            <div>
              <label className={labelClass}>Video URL</label>
              <input
                type="url"
                value={form.videoUrl}
                onChange={(e) => setField('videoUrl', e.target.value)}
                placeholder="YouTube or direct video URL"
                className={inputClass}
              />
            </div>
          </div>

          {/* Media */}
          <div className="card-luxury p-6 space-y-6">
            <h2 className="font-cinzel text-gold text-sm tracking-widest uppercase border-b border-gold/20 pb-4">
              Media
            </h2>

            {/* Poster */}
            <div>
              <label className={labelClass}>Event Poster</label>
              <div className="flex gap-4 items-start">
                {form.posterImage && (
                  <div className="relative flex-shrink-0">
                    <img
                      src={form.posterImage}
                      alt="Poster preview"
                      className="w-24 h-32 object-cover border border-gold/20"
                    />
                    <button
                      type="button"
                      onClick={() => setField('posterImage', '')}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white flex items-center justify-center rounded-full"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}
                <label className="flex-1 flex flex-col items-center justify-center h-32 border border-dashed border-gold/30 hover:border-gold cursor-pointer transition-colors bg-black-card">
                  <Upload size={20} className="text-gold/50 mb-2" />
                  <span className="font-cinzel text-xs text-foreground/40 tracking-widest uppercase">
                    {form.posterImage ? 'Replace Poster' : 'Upload Poster'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Gallery */}
            <div>
              <label className={labelClass}>Gallery Images</label>
              <div className="space-y-3">
                {form.galleryImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {form.galleryImages.map((img, i) => (
                      <div key={i} className="relative aspect-square">
                        <img
                          src={img}
                          alt={`Gallery ${i + 1}`}
                          className="w-full h-full object-cover border border-gold/20"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-white flex items-center justify-center rounded-full"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex flex-col items-center justify-center h-24 border border-dashed border-gold/30 hover:border-gold cursor-pointer transition-colors bg-black-card">
                  <Upload size={18} className="text-gold/50 mb-1" />
                  <span className="font-cinzel text-xs text-foreground/40 tracking-widest uppercase">
                    Add Gallery Images
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 justify-end pb-10">
            <Link
              to="/admin"
              className="px-8 py-3 btn-outline-gold text-sm tracking-widest uppercase"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="px-10 py-3 btn-gold text-sm tracking-widest uppercase disabled:opacity-50"
            >
              {isPending
                ? mode === 'add'
                  ? 'Creating...'
                  : 'Saving...'
                : mode === 'add'
                ? 'Create Event'
                : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
