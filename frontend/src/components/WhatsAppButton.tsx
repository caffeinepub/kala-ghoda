import { SiWhatsapp } from 'react-icons/si';

export default function WhatsAppButton() {
  const message = encodeURIComponent("Hi, I'd like to book a table at Kala Ghoda");
  const url = `https://wa.me/919999999999?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-[#25D366] border-2 border-gold shadow-gold-sm hover:shadow-gold transition-all duration-300 hover:scale-110 animate-gold-pulse"
      aria-label="Book via WhatsApp"
    >
      <SiWhatsapp size={26} className="text-white" />
    </a>
  );
}
