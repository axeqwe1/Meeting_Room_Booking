// context/RoomContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Room, Booking, CalendarEvent } from '../types';
import { rooms, bookings } from '../data/dummyData';
import { GetAllRoom } from '../api/Room';
import { getConnection } from '../api/signalr/signalr';
import { GetAllBooking } from '../api/Booking';
import { useAuth } from './AuthContext';
import { useSettings } from './SettingContext';

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
  factorie:string,
  selectedFactories: (data:string) => void;
  loading:boolean,
  refreshBooking: () => void,
  refreshRoom: () => void
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {user} = useAuth()
  const {defaultRoom} = useSettings()
  const [allRooms,setAllRooms] = useState<Room[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectData, setSelectData] = useState<CalendarEvent[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(defaultRoom || undefined);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>();
  const [selectedEditRoom, setSelectedEditRoom] = useState<Room | undefined>();
  const [roomColors, setRoomColors] = useState<{ [roomId: string]: string }>({});
  const [message,setMessage] = useState<string[]>([]);
  const [factorie,selectedFactories] = useState<string>(user?.factorie ? user?.factorie : "All")
  const [loading,setLoading] = useState<boolean>(false)
  
  // Sync factorie with user change (for first login or user switch)
  useEffect(() => {
    if (user?.factorie && user.factorie !== factorie) {
      selectedFactories(user.factorie);
    }
  }, [user]);

  // Fetch room data, filter by factorie
  const fetchRoomData = useCallback(async (roomsData: any[]) : Promise<Room[]> => {
    const roomFilter = roomsData.filter((item: any) => {
      if(user?.factorie === "All") {
        if(factorie != "All"){
          return factorie === item.factory
        }
        return true
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
  },[user, factorie]);

  // Fetch booking data and filter by rooms
  const fetchBookingData = useCallback(async (rooms: Room[], bookingsData: any[]) : Promise<Booking[]> => {
    const filteredRoomIds = rooms.map(r => r.id);

    const filteredBookings = bookingsData.filter((item: any) =>
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
    return arrBooking
  },[]);

  const configEvent = async (bookData:Booking[],roomData:Room[],roomColors: { [roomId: string]: string }) => {
      const calendarEvents = bookData.map(booking => {
      const room = roomData.find(r => r.id === booking.roomId);
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
    if(defaultRoom){
      const filtered = calendarEvents.filter((event) => event.roomId === defaultRoom.id);
      setSelectData(filtered);
    }else{
      setSelectData(calendarEvents);
    }
  }

  const generateShuffledColors = () => {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#14B8A6'];
    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]];
    }
    return colors;
  };
  
  const generateRoomColors = (rooms: Room[]): { [roomId: string]: string } => {
    const shuffledColors = generateShuffledColors();
    const storedColors = JSON.parse(localStorage.getItem('roomColors') || '{}');
    const newColors: { [roomId: string]: string } = { ...storedColors };

    rooms.forEach((room, index) => {
      if (!newColors[room.id]) {
        newColors[room.id] = shuffledColors[index % shuffledColors.length];
      }
    });

    localStorage.setItem('roomColors', JSON.stringify(newColors));
    setRoomColors(newColors); // optional, for UI sync
    return newColors;
  };

  useEffect(() => {
    if(defaultRoom != null) setSelectedRoom(defaultRoom)
  },[defaultRoom])

  const refreshData = useCallback(async () => {
    console.log('refresh')
    setLoading(true);
    refreshEvent()
    setLoading(false);
  }, [fetchRoomData, fetchBookingData,defaultRoom]);

  const refreshEvent = async () => {
    const [roomsRes, bookingsRes] = await Promise.all([
      GetAllRoom(),
      GetAllBooking()
    ]);
    const roomData = await fetchRoomData(roomsRes.data);
    const bookingData = await fetchBookingData(roomData, bookingsRes.data);
    const genColor = generateRoomColors(roomData)
    if(defaultRoom){
      console.log(defaultRoom)
      bookingData.filter((item) => {
        return item.roomId == defaultRoom.id
      })
      setSelectedRoom(defaultRoom)
    }else{
      setSelectedRoom(undefined)
    }
    configEvent(bookingData,roomData,genColor)
  }
  const refreshBooking = async () => {
    const [bookres] = await Promise.all([
      GetAllBooking()
    ]);
    const bookData = bookres.data
    await fetchBookingData(allRooms,bookData)
  }

  const refreshRoom = async () => {
    const roomres = await GetAllRoom()
    await fetchRoomData(roomres.data)
  }

  useEffect(() => {
    const connection = getConnection();
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
      connection.on('ReceiveMessage', async (message: string) => {
        console.log(message);
        if (isMounted) {
          // await Promise.all([
          //   refreshRoom(),
          //   refreshBooking()
          // ]);
          // setEvent()
          const [roomsRes, bookingsRes] = await Promise.all([
            GetAllRoom(),
            GetAllBooking()
          ]);
          const roomData = await fetchRoomData(roomsRes.data);
          const bookingData = await fetchBookingData(roomData, bookingsRes.data);
          const genColor = generateRoomColors(roomData)
          if(defaultRoom){
            console.log(defaultRoom)
            bookingData.filter((item) => {
              return item.roomId == defaultRoom.id
            })
            setSelectedRoom(defaultRoom)
          }else{
            setSelectedRoom(undefined)
          }
          configEvent(bookingData,roomData,genColor)
        }
      });
    };
    connect();
    // Cleanup
    return () => {
      isMounted = false;
      connection.off('ReceiveMessage');
    };
  }, [refreshData]);


  // Refresh เมื่อ user หรือ factorie เปลี่ยน (หรือ mount รอบแรก)
  useEffect(() => {
    if (!user) return;
    refreshData();
  }, [user, factorie, refreshData]);

  // Sync selectedRoom กับ defaultRoom
  useEffect(() => {
    refreshEvent()
  },[defaultRoom]);


  // useEffect(() => {
  //   generateRoomColors(allRooms)
  // }, [allRooms]);


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
        factorie,
        selectedFactories,
        loading,
        refreshBooking,
        refreshRoom
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
