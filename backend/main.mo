import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type EventStatus = { #upcoming; #past };

  type Event = {
    id : Nat;
    title : Text;
    shortDescription : Text;
    fullDescription : Text;
    eventDateTime : Int;
    ticketPrice : Float;
    posterImage : Text;
    galleryImages : [Text];
    videoUrl : Text;
    status : EventStatus;
    creationTimestamp : Int;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  module Event {
    public func compareByEventDateTime(a : Event, b : Event) : Order.Order {
      Int.compare(a.eventDateTime, b.eventDateTime);
    };
  };

  let events = Map.empty<Nat, Event>();
  let newsletterSubscribers = List.empty<Text>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let seedEvents = [
    {
      id = 1;
      title = "Crypto Conference 2024";
      shortDescription = "Join top experts in the crypto industry.";
      fullDescription = "An in-depth look at the latest trends in blockchain technology, featuring keynote speakers, workshops, and networking opportunities.";
      eventDateTime = Time.now() + 120_000_000_000;
      ticketPrice = 199.99;
      posterImage = "https://example.com/poster1.jpg";
      galleryImages = [
        "https://example.com/gallery1.jpg",
        "https://example.com/gallery2.jpg",
      ];
      videoUrl = "https://youtube.com/examplevideo1";
      status = #upcoming;
      creationTimestamp = Time.now();
    },
    {
      id = 2;
      title = "Music Festival";
      shortDescription = "Experience live performances from top artists.";
      fullDescription = "Enjoy a weekend of music, food, and fun with performances from renowned bands and solo artists across multiple genres.";
      eventDateTime = Time.now() + 240_000_000_000;
      ticketPrice = 99.99;
      posterImage = "https://example.com/poster2.jpg";
      galleryImages = [
        "https://example.com/gallery3.jpg",
        "https://example.com/gallery4.jpg",
      ];
      videoUrl = "https://youtube.com/examplevideo2";
      status = #upcoming;
      creationTimestamp = Time.now();
    },
    {
      id = 3;
      title = "Art Expo 2024";
      shortDescription = "Explore contemporary art from global artists.";
      fullDescription = "An exhibition featuring modern artworks, sculptures, and interactive installations by artists from around the world.";
      eventDateTime = Time.now() + 360_000_000_000;
      ticketPrice = 49.99;
      posterImage = "https://example.com/poster3.jpg";
      galleryImages = [
        "https://example.com/gallery5.jpg",
        "https://example.com/gallery6.jpg",
      ];
      videoUrl = "https://youtube.com/examplevideo3";
      status = #upcoming;
      creationTimestamp = Time.now();
    },
  ];

  let accessControlState = AccessControl.initState();
  var isSeeded = false;
  var nextEventId = 4;

  include MixinAuthorization(accessControlState);

  // Seed demo events on first initialization - admin only to prevent unauthorized calls
  public shared ({ caller }) func initialize() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    if (not isSeeded) {
      for (event in seedEvents.values()) {
        events.add(event.id, event);
      };
      isSeeded := true;
    };
  };

  // User profile functions (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Event CRUD operations - admin only
  public shared ({ caller }) func createEvent(
    title : Text,
    shortDescription : Text,
    fullDescription : Text,
    eventDateTime : Int,
    ticketPrice : Float,
    posterImage : Text,
    galleryImages : [Text],
    videoUrl : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };

    let eventId = nextEventId;
    let newEvent : Event = {
      id = eventId;
      title;
      shortDescription;
      fullDescription;
      eventDateTime;
      ticketPrice;
      posterImage;
      galleryImages;
      videoUrl;
      status = #upcoming;
      creationTimestamp = Time.now();
    };

    events.add(eventId, newEvent);
    nextEventId += 1;
    eventId;
  };

  public shared ({ caller }) func updateEvent(
    eventId : Nat,
    title : Text,
    shortDescription : Text,
    fullDescription : Text,
    eventDateTime : Int,
    ticketPrice : Float,
    posterImage : Text,
    galleryImages : [Text],
    videoUrl : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };

    switch (events.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?existingEvent) {
        let updatedEvent : Event = {
          id = eventId;
          title;
          shortDescription;
          fullDescription;
          eventDateTime;
          ticketPrice;
          posterImage;
          galleryImages;
          videoUrl;
          status = existingEvent.status;
          creationTimestamp = existingEvent.creationTimestamp;
        };
        events.add(eventId, updatedEvent);
      };
    };
  };

  public shared ({ caller }) func deleteEvent(eventId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };

    if (not events.containsKey(eventId)) {
      Runtime.trap("Event not found");
    };
    events.remove(eventId);
  };

  public shared ({ caller }) func toggleEventStatus(eventId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };

    switch (events.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?existingEvent) {
        let newStatus = switch (existingEvent.status) {
          case (#upcoming) { #past };
          case (#past) { #upcoming };
        };
        let updatedEvent = { existingEvent with status = newStatus };
        events.add(eventId, updatedEvent);
      };
    };
  };

  // Public query functions - no auth required, events are public information
  public query func getAllEvents() : async [Event] {
    events.values().toArray();
  };

  public query func getEventById(eventId : Nat) : async ?Event {
    events.get(eventId);
  };

  public query func getRecentUpcomingEvents() : async [Event] {
    let upcomingEvents = events.values().toArray().filter(
      func(event : Event) : Bool {
        event.status == #upcoming and event.eventDateTime > Time.now();
      }
    );

    let sortedEvents = upcomingEvents.sort(Event.compareByEventDateTime);

    let length = if (sortedEvents.size() > 3) { 3 } else {
      sortedEvents.size();
    };

    Array.tabulate(length, func(i : Nat) : Event { sortedEvents[i] });
  };

  // Newsletter subscription - open to all (no auth required for subscribing)
  public shared func subscribeNewsletter(email : Text) : async () {
    if (newsletterSubscribers.contains(email)) {
      Runtime.trap("Email already subscribed");
    };
    newsletterSubscribers.add(email);
  };

  // List subscribers - admin only
  public query ({ caller }) func listSubscribers() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admin access required");
    };
    newsletterSubscribers.toArray();
  };
};
