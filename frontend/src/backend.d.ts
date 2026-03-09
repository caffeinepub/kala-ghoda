import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    email: string;
}
export interface Event {
    id: bigint;
    galleryImages: Array<string>;
    status: EventStatus;
    title: string;
    creationTimestamp: bigint;
    shortDescription: string;
    eventDateTime: bigint;
    posterImage: string;
    fullDescription: string;
    videoUrl: string;
    ticketPrice: number;
}
export enum EventStatus {
    upcoming = "upcoming",
    past = "past"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createEvent(title: string, shortDescription: string, fullDescription: string, eventDateTime: bigint, ticketPrice: number, posterImage: string, galleryImages: Array<string>, videoUrl: string): Promise<bigint>;
    deleteEvent(eventId: bigint): Promise<void>;
    getAllEvents(): Promise<Array<Event>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEventById(eventId: bigint): Promise<Event | null>;
    getRecentUpcomingEvents(): Promise<Array<Event>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listSubscribers(): Promise<Array<string>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    subscribeNewsletter(email: string): Promise<void>;
    toggleEventStatus(eventId: bigint): Promise<void>;
    updateEvent(eventId: bigint, title: string, shortDescription: string, fullDescription: string, eventDateTime: bigint, ticketPrice: number, posterImage: string, galleryImages: Array<string>, videoUrl: string): Promise<void>;
}
