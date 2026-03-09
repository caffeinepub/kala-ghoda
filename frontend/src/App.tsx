import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import Navbar from './components/Navbar';
import WhatsAppButton from './components/WhatsAppButton';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminEventFormPage from './pages/AdminEventFormPage';
import AdminRoute from './components/AdminRoute';

// ─── Root Layout ──────────────────────────────────────────────────────────────

function RootLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <WhatsAppButton />
    </>
  );
}

// ─── Routes ───────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => (
    <div className="min-h-screen bg-black-primary flex items-center justify-center">
      <div className="text-center space-y-6">
        <p className="font-cinzel text-gold text-6xl font-bold">404</p>
        <p className="font-cinzel text-foreground/40 tracking-widest">Page Not Found</p>
        <a href="/" className="inline-block btn-outline-gold px-8 py-3 text-sm font-cinzel tracking-widest uppercase">
          Go Home
        </a>
      </div>
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events',
  component: EventsPage,
});

const eventDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/$eventId',
  component: EventDetailPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/login',
  component: AdminLoginPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminRoute>
      <AdminDashboardPage />
    </AdminRoute>
  ),
});

const adminAddEventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/events/add',
  component: () => (
    <AdminRoute>
      <AdminEventFormPage mode="add" />
    </AdminRoute>
  ),
});

const adminEditEventRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/events/edit/$eventId',
  component: () => (
    <AdminRoute>
      <AdminEventFormPage mode="edit" />
    </AdminRoute>
  ),
});

// ─── Route Tree ───────────────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  indexRoute,
  eventsRoute,
  eventDetailRoute,
  adminLoginRoute,
  adminDashboardRoute,
  adminAddEventRoute,
  adminEditEventRoute,
]);

// ─── Router ───────────────────────────────────────────────────────────────────

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return <RouterProvider router={router} />;
}
