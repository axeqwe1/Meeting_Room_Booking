// context/RoomContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, Booking, CalendarEvent } from '../types';
import { rooms, bookings } from '../data/dummyData';
import { GetAllRoom } from '../api/Room';
import { getConnection } from '../api/signalr/signalr';
import { GetAllBooking } from '../api/Booking';
import { useAuth } from './AuthContext';

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
  refreshData: () => void
  selectedFactories: (data:string) => void
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allRooms,setAllRooms] = useState<Room[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectData, setSelectData] = useState<CalendarEvent[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>();
  const [selectedEditRoom, setSelectedEditRoom] = useState<Room | undefined>();
  const [roomColors, setRoomColors] = useState<{ [roomId: string]: string }>({});
  const [message,setMessage] = useState<string[]>([]);
  const [factorie,selectedFactories] = useState<string>("All")
  const {user} = useAuth()
  
  const fetchRoomData = async () => {
    const res = await GetAllRoom();
    const roomsData = res.data;
    console.log(factorie)
    const roomFilter = roomsData.filter((item: any) => {
      if(user?.factorie === "All") {
        if(factorie != "All"){
          return factorie === item.factory
        }else{
          return true
        }
      }else{
        return item.factory === user?.factorie
      } 
    });

    const arrRoom: Room[] = roomFilter.map((item: any) => {
      const amenitiesArr = item.amentities.map((a: any) => a.amenity_name);
      return {
        id: item.roomId,
        name: item.roomname,
        capacity: item.capacity,
        location: item.location,
        factory: item.factory,
        amenities: amenitiesArr,
        imageUrl: item.imageUrl,
        color: '',
      };
    });

    setAllRooms(arrRoom);
    return arrRoom; // <-- เพิ่ม return เพื่อใช้ใน fetchBookingData
  };

  const fetchBookingData = async (rooms: Room[]) => {
    const res = await GetAllBooking();
    const bookings = res.data;

    // Filter bookings by roomIds from the filtered rooms
    const filteredRoomIds = rooms.map(r => r.id);

    const filteredBookings = bookings.filter((item: any) =>
      filteredRoomIds.includes(item.roomId)
    );

    const arrBooking: Booking[] = filteredBookings.map((item: any) => {
      const attendees = item.attendeess.map((a: any) => a.user_name);
      return {
        id: item.bookingId,
        roomId: item.roomId,
        title: item.title,
        start: item.start,
        end: item.end,
        userId: item.userId,
        description: item.description,
        attendees: attendees,
      };
    });

    setAllBookings(arrBooking);
  };

  const connection = getConnection();

  useEffect(() => {
    let isMounted = true;

    const connect = async () => {
      if (connection.state === 'Disconnected') {
        try {
          await connection.start();
          console.log('SignalR connected.');
        } catch (err) {
          console.error('SignalR connection error:', err);
        }
      }

      connection.on('ReceiveMessage', (message: string) => {
        if (isMounted) {
          setMessage(prev => [...prev, message]);
        }
      });
    };

    connect();

    // Cleanup
    return () => {
      isMounted = false;
      connection.off('ReceiveMessage');
    };
  }, [connection]);


  const refreshData = async () => {
    const rooms = await fetchRoomData();
    await fetchBookingData(rooms);
  }
  const generateShuffledColors = () => {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#14B8A6'];
    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]];
    }
    return colors;
  };

  useEffect(() => {
    refreshData()
    console.log('refresh')
  },[factorie])

  useEffect(() => {
    const shuffledColors = generateShuffledColors();
    const storedColors = JSON.parse(localStorage.getItem('roomColors') || '{}');
    const newColors: { [roomId: string]: string } = { ...storedColors };

    allRooms.forEach((room, index) => {
      if (!newColors[room.id]) {
        newColors[room.id] = shuffledColors[index % shuffledColors.length];
      }
    });

    setRoomColors(newColors);
    localStorage.setItem('roomColors', JSON.stringify(newColors));
  }, [allRooms]);

  useEffect(() => {
    const calendarEvents = allBookings.map(booking => {
      const room = allRooms.find(r => r.id === booking.roomId);
      return {
        id: booking.id,
        title: booking.title,
        start: new Date(booking.start),
        end: new Date(booking.end),
        roomId: booking.roomId,
        roomName: room?.name,
        color: roomColors[booking.roomId] || '#999999'
      };
    });
    console.log(calendarEvents)
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
        roomColors,
        refreshData,
        selectedFactories
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
