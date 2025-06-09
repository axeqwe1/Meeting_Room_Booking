import { User } from "./user";

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface CreateRoomRequest {
  roomname: string;
  capacity: number | string;
  location: string;
  factory: string;
  imageUrl: string;
  amentities: string[];
}

export interface UpdateRoomRequest {
  roomid: number;
  roomname: string;
  capacity: number | string;
  location: string;
  factory: string;
  imageUrl: string;
  amentities: string[];
}

export interface CreateBookingRequest {
  roomId: number;
  user_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  attendees: string[];
}

export interface UpdateBookingRequest {
  bookingId: number;
  roomId: number;
  user_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  attendees: string[];
}
