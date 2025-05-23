export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
  amenities: string[];
  imageUrl: string;
  color:string;
}

export interface Booking {
  id: string;
  roomId: string;
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
  roomId: string;
  resourceId?: string;
  roomName?: string;
}

export type View = 'day' | 'week' | 'month' | 'agenda';