import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Lightbox from './Lightbox';

interface PhotoGallerySliderProps {
  images: string[];
}

export default function PhotoGallerySlider({ images }: PhotoGallerySliderProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 border border-gold/20 bg-black-card">
        <p className="text-foreground/30 font-cinzel text-sm tracking-widest">No Gallery Images</p>
      </div>
    );
  }

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % images.length);
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {images.map((img, i) => (
          <div
            key={i}
            className="aspect-square overflow-hidden cursor-pointer group border border-gold/10 hover:border-gold/40 transition-all duration-300"
            onClick={() => setLightboxIndex(i)}
          >
            <img
              src={img}
              alt={`Gallery ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
