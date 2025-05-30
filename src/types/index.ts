export interface Room {
  id: number;
  name: string;
  capacity: number;
  location: string;
  amenities: string[];
  imageUrl: string;
  color:string;
  factory:string;
}

export interface Booking {
  id: string;
  roomId: number;
  title: string;
  start: Date;
  end: Date;
  userId: string;
  description?: string;
  attendees?: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  roomId: number;
  resourceId?: string;
  roomName?: string;
}

export type View = 'day' | 'week' | 'month' | 'agenda';