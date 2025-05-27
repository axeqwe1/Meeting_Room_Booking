// context/RoomContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, Booking, CalendarEvent } from '../types';
import { rooms, bookings } from '../data/dummyData';

interface RoomContextType {
  allRooms: Room[];
  allBookings: Booking[];
  events: CalendarEvent[];
  selectData: CalendarEvent[];
  selectedRoom: Room | undefined;
  selectedBooking: Booking | undefined;
  selectedEvent: CalendarEvent | undefined;
  selectedEditRoom: Room | undefined;
  setAllBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  setSelectData: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  setSelectedRoom: (room: Room | undefined) => void;
  setSelectedEvent: (event: CalendarEvent | undefined) => void;
  setSelectedBooking: (booking: Booking | undefined) => void;
  setSelectedEditRoom: (room: Room | undefined) => void;
  roomColors: { [roomId: string]: string };
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allRooms] = useState<Room[]>(rooms);
  const [allBookings, setAllBookings] = useState<Booking[]>(bookings);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectData, setSelectData] = useState<CalendarEvent[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>();
  const [selectedEditRoom, setSelectedEditRoom] = useState<Room | undefined>();
  const [roomColors, setRoomColors] = useState<{ [roomId: string]: string }>({});

  const generateShuffledColors = () => {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#14B8A6'];
    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]];
    }
    return colors;
  };

  useEffect(() => {
    const shuffledColors = generateShuffledColors();
    const newColors: { [roomId: string]: string } = {};
    allRooms.forEach((room, index) => {
      newColors[room.id] = shuffledColors[index % shuffledColors.length];
    });
    setRoomColors(newColors);
  }, [allRooms]);

  useEffect(() => {
    const calendarEvents = allBookings.map(booking => {
      const room = allRooms.find(r => r.id === booking.roomId);
      return {
        id: booking.id,
        title: booking.title,
        start: booking.start,
        end: booking.end,
        roomId: booking.roomId,
        roomName: room?.name,
        color: roomColors[booking.roomId] || '#999999'
      };
    });
    setEvents(calendarEvents);
    setSelectData(calendarEvents);
  }, [allBookings, allRooms, roomColors]);

  return (
    <RoomContext.Provider
      value={{
        allRooms,
        allBookings,
        events,
        selectData,
        selectedRoom,
        selectedEvent,
        selectedBooking,
        selectedEditRoom,
        setAllBookings,
        setSelectData,
        setSelectedRoom,
        setSelectedEvent,
        setSelectedBooking,
        setSelectedEditRoom,
        roomColors
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoomContext must be used within a RoomProvider');
  }
  return context;
};
