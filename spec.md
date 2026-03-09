# Specification

## Summary
**Goal:** Build "Kala Ghoda," a premium dark-themed nightclub website with a public-facing frontend, event management backend, and a secure admin dashboard — all using a black-and-gold luxury design language.

**Planned changes:**

**Design System**
- Black-and-gold luxury theme (#0a0a0a/#111111 backgrounds, #C9A84C gold accents) across all pages
- Cinzel or Playfair Display for headings (Google Fonts), modern sans-serif for body
- Gold hover/glow effects on interactive elements, smooth fade/slide page transitions
- Scroll-reveal animations (fade + upward translate) on About, Events, Gallery, and Contact sections

**Home Page (`/`)**
- Full-screen hero with auto-playing looped background video, "Kala Ghoda" logo/wordmark, tagline "Where Nights Come Alive," and CTAs: "View Upcoming Events" and "Book Now"
- About section with club intro text
- Upcoming Events preview: 3 most recent upcoming event cards (poster, title, date, short description)
- Gallery preview: 6-image responsive grid
- Newsletter section ("Stay in the Loop") with email input, Subscribe button, and backend storage
- Contact section: static Google Maps iframe placeholder, phone number, Instagram link
- Footer with Instagram, Facebook, WhatsApp icons

**Events Page (`/events`)**
- Responsive grid of all events fetched from backend
- Each card: poster image, title, date/time, short description, "View Details" button
- Upcoming events sorted first; past events visually desaturated/labeled

**Event Detail Page (`/events/:id`)**
- Full-width banner image, full description
- Horizontal photo gallery slider with lightbox on click
- Embedded video player from event's video URL
- Ticket price display
- Prominent gold "Book Now" button
- Live countdown timer (days/hours/minutes/seconds) to event date

**Floating WhatsApp Button**
- Fixed bottom-right on all pages, links to `wa.me/` with pre-filled booking message
- WhatsApp green icon with gold border

**Admin Dashboard (`/admin`)**
- Login screen with hardcoded credentials; session token stored in localStorage
- Unauthenticated visits to `/admin` redirect to `/admin/login`
- Dashboard lists all events with Edit, Delete (with confirmation), and Toggle Status actions
- Add/Edit event form: all fields (title, descriptions, date/time, price, poster, gallery photos, video URL, status)
- Multi-image upload (base64/data URLs) for gallery photos
- Subscriber list/count visible in dashboard

**Backend (Motoko)**
- Event data model: title, short description, full description, date/time, ticket price, poster image, photo gallery array, video URL, status (Upcoming | Past), createdAt
- Queries: `listEvents`, `getEvent(id)`, `getUpcomingEvents(limit)`
- Mutations: `createEvent`, `updateEvent`, `deleteEvent`, `toggleEventStatus` (admin-only)
- Newsletter: `subscribeNewsletter(email)`, `listSubscribers`
- Admin credential validation function returning a session token
- Seed 3 demo events on first initialization (no duplication on upgrade)

**User-visible outcome:** Visitors can browse a visually rich nightclub website with event listings, detailed event pages with countdowns and galleries, and a newsletter signup. Admins can log in at `/admin` to create, edit, delete, and manage events that immediately appear across all public pages.
