export interface Room {
  id: number;
  name: string;
  capacity: number | string;
  location: string;
  amenities: string[];
  imageUrl: string;
  color: string;
  factory: string;
}

export interface Booking {
  id: number;
  roomId: number;
  title: string;
  start: string;
  end: string;
  userId: string;
  description?: string;
  attendees?: string[];
}

export interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  end: string;
  roomId: number;
  resourceId?: string;
  roomName?: string;
}

export type View = "day" | "week" | "month" | "agenda";
