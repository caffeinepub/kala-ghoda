import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Event, UserProfile } from '../backend';

// ─── Events ───────────────────────────────────────────────────────────────────

export function useGetAllEvents() {
  const { actor, isFetching } = useActor();
  return useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRecentUpcomingEvents() {
  const { actor, isFetching } = useActor();
  return useQuery<Event[]>({
    queryKey: ['events', 'upcoming'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentUpcomingEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEventById(eventId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Event | null>({
    queryKey: ['events', eventId?.toString()],
    queryFn: async () => {
      if (!actor || eventId === null) return null;
      return actor.getEventById(eventId);
    },
    enabled: !!actor && !isFetching && eventId !== null,
  });
}

export function useCreateEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      shortDescription: string;
      fullDescription: string;
      eventDateTime: bigint;
      ticketPrice: number;
      posterImage: string;
      galleryImages: string[];
      videoUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createEvent(
        data.title,
        data.shortDescription,
        data.fullDescription,
        data.eventDateTime,
        data.ticketPrice,
        data.posterImage,
        data.galleryImages,
        data.videoUrl
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      eventId: bigint;
      title: string;
      shortDescription: string;
      fullDescription: string;
      eventDateTime: bigint;
      ticketPrice: number;
      posterImage: string;
      galleryImages: string[];
      videoUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEvent(
        data.eventId,
        data.title,
        data.shortDescription,
        data.fullDescription,
        data.eventDateTime,
        data.ticketPrice,
        data.posterImage,
        data.galleryImages,
        data.videoUrl
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useDeleteEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteEvent(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useToggleEventStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleEventStatus(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// ─── Newsletter ────────────────────────────────────────────────────────────────

export function useSubscribeNewsletter() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.subscribeNewsletter(email);
    },
  });
}

export function useListSubscribers() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ['subscribers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSubscribers();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Admin ─────────────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useInitialize() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.initialize();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// ─── User Profile ──────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}
