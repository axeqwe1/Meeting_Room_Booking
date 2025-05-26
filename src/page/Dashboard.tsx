import React, { useState, useEffect } from 'react';
import { Room, Booking, CalendarEvent } from '../types';
import { rooms, bookings } from '../data/dummyData';
import Layout from '../components/Layout';
import CalendarView from '../components/CalendarView';
import RoomList from '../components/RoomList';
import BookingForm from '../components/form/BookingForm';
import EventDetails from '../components/EventDetails';
import MobileMenu from '../components/MobileMenu';
import { pre } from 'motion/react-client';
import { useAlert } from '../context/AlertContext';
import { CircleAlert } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [allRooms] = useState<Room[]>(rooms);
  const [allBookings, setAllBookings] = useState<Booking[]>(bookings);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectData, setSelectData] = useState<CalendarEvent[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>(undefined);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [initialDate, setInitialDate] = useState<Date | undefined>(undefined);
  const [initialEndDate, setInitialEndDate] = useState<Date | undefined>(undefined);
  const [showRoomList, setShowRoomList] = useState(false);
  const [roomColors, setRoomColors] = useState<{ [roomId: string]: string }>({});
  const [selectedEditRoom,setSelectedEditRoom] = useState<any>()
  const {showAlert} = useAlert()
  const generateShuffledColors = () => {
    const colors = [
      '#EF4444', // Red-500
      '#F59E0B', // Amber-500
      '#10B981', // Emerald-500
      '#3B82F6', // Blue-500
      '#8B5CF6', // Violet-500
      '#EC4899', // Pink-500
      '#F97316', // Orange-500
      '#14B8A6', // Teal-500
    ];

    // Fisher–Yates Shuffle
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
      newColors[room.id] = shuffledColors[index % shuffledColors.length]; // เผื่อห้อง > สี
    });

    setRoomColors(newColors);
  }, [allRooms]);
  // Convert bookings to calendar events
  
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
    setSelectData(calendarEvents)
    console.log('trigger')
  }, [allBookings, allRooms, roomColors]);
  
  const handleSelectEvent = (event: CalendarEvent) => {
    
    setSelectedEvent(event);
    setShowEventDetails(true)
    const booking = allBookings.find(b => b.id === event.id);
    if (booking) {
      setSelectedBooking(booking);
      // const room = allRooms.find(r => r.id === booking.roomId);
      // if (room) {
      //   setSelectedRoom(room);
      // }
    }
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    if(selectedRoom == null){
        showAlert({
          title: 'Warning',
          message: 'Please Select Room for Booking',
          icon: CircleAlert,
          iconColor: 'text-yellow-500',
          iconSize: 80
        });
        return;
    }
    setInitialDate(slotInfo.start);
    setInitialEndDate(slotInfo.end);
    setShowBookingForm(true);
  };

  
const handleSelectRoom = (room: Room) => {
  setShowBookingForm(false);
  setShowRoomList(false);
  // ถ้าห้องที่คลิกซ้ำ == ห้องที่เลือกอยู่
  if (selectedRoom && selectedRoom.id === room.id) {
    // ยกเลิกการเลือกห้อง
    setSelectedRoom(undefined); 
    setSelectData(events); // แสดง event ทั้งหมด
  } else {
    // เปลี่ยนห้องใหม่
    setSelectedRoom(room);
    // แสดง event เฉพาะของห้องนี้
    const filtered = events.filter((event) => event.roomId === room.id);
    setSelectData(filtered);
  }
};
 
  const handleCreateBooking = (booking: Partial<Booking>) => {
    if(booking.id != null && booking.id != ''){
      console.log(booking)
      setAllBookings((prev) => {
        const excludeBookId = prev.filter((item) => item.id != booking.id)
        const existBooking = prev.find((item) => item.id == booking.id)
        if(existBooking != null){
          existBooking.id = booking.id ? booking.id : 'null';
          existBooking.roomId = booking.roomId ? booking.roomId : 'null';
          existBooking.description = booking.description;
          existBooking.attendees = booking.attendees;
          existBooking.start = booking.start ? booking.start : new Date
          existBooking.end = booking.end ? booking.end : new Date
          existBooking.title = booking.title ? booking.title : 'null'
          
          return [...excludeBookId,existBooking]
        }else{
          return prev
        }
      });
      setSelectedRoom(() => allRooms.find((item) => item.id == booking.roomId))
      setTimeout(() => {
        setShowBookingForm(false);
        setInitialDate(undefined);
        setInitialEndDate(undefined);
        setSelectedRoom(undefined);
        setSelectedBooking(undefined);
        setSelectedEditRoom(undefined);
      },100)
    }else{
      const newBooking: Booking = {
        id: `booking_${Date.now()}`,
        roomId: booking?.roomId || '',
        title: booking.title || 'Untitled Meeting',
        start: booking.start || new Date(),
        end: booking.end || new Date(),
        userId: 'current_user',
        description: booking.description,
        attendees: booking.attendees
      };
      setSelectedRoom(() => allRooms.find((item) => item.id == booking.roomId))
      setAllBookings([...allBookings, newBooking]);
      setTimeout(() => {
        setShowBookingForm(false);
        setInitialDate(undefined);
        setInitialEndDate(undefined);
        setSelectedRoom(undefined);
        setSelectedEditRoom(undefined);
      },100)
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowBookingForm(true);
    setInitialDate(booking.start);
    setInitialEndDate(booking.end);
    setShowEventDetails(false)
    const room = allRooms.find(r => r.id === booking.roomId);
    if (room) {
      setSelectedEditRoom(room);
    }
  };

  const handleDeleteBooking = (bookingId: string) => {
    setAllBookings(allBookings.filter(b => b.id !== bookingId));
    setSelectedEvent(undefined);
    setSelectedBooking(undefined);
  };

  const handleCloseEventDetails = () => {
    // setSelectedEvent(undefined);
    // setSelectedBooking(undefined);
    setShowBookingForm(false);
    setInitialDate(undefined);
    setInitialEndDate(undefined);
    setSelectedRoom(undefined);
    setSelectedBooking(undefined);
    setShowEventDetails(false)
    setSelectedEditRoom(undefined);
  };

  const roomsWithColor = allRooms.map(room => ({
    ...room,
    color: roomColors[room.id] || '#999999'
  }));
  return (
    <>
      <div className="h-full flex flex-col">
        {/* Mobile Room Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowRoomList(!showRoomList)}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center"
          >
            {showRoomList ? 'Show Calendar' : 'Show Rooms'}
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-4">
          {/* Calendar View - Hidden on mobile when room list is shown */}
          <div className={`${showRoomList ? 'hidden' : 'block'} lg:block lg:w-3/4 h-[calc(100vh-12rem)] lg:h-auto`}>
            <CalendarView 
              events={selectData}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
            />
          </div>
          
          {/* Room List - Hidden on mobile when calendar is shown */}
          <div className={`${!showRoomList ? 'hidden' : 'block'} lg:block lg:w-1/4`}>
            <RoomList 
              rooms={roomsWithColor}
              onSelectRoom={handleSelectRoom}
              selectedRoomId={selectedRoom?.id}
            />
          </div>
        </div>
      </div>
      
      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-40 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom sm:align-middle sm:max-w-lg sm:w-full w-full max-w-md my-8 overflow-hidden text-left transform transition-all">
              <BookingForm 
                room={selectedEditRoom}
                SelectedRoom={selectedRoom}
                BookingData={selectedBooking}
                initialDate={initialDate}
                initialEndDate={initialEndDate}
                onSubmit={handleCreateBooking}
                onCancel={() => {
                    setShowBookingForm(false);
                    setInitialDate(undefined);
                    setInitialEndDate(undefined);
                    setSelectedRoom(undefined);
                    setSelectedBooking(undefined);
                    setSelectedEditRoom(undefined);
                  // setSelectedRoom(undefined);
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Event Details Modal */}
      {selectedEvent && selectedBooking && showEventDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom sm:align-middle sm:max-w-lg sm:w-full w-full max-w-md my-8 overflow-hidden text-left transform transition-all">
              <EventDetails 
                booking={selectedBooking}
                room={allRooms.find(r => r.id === selectedBooking.roomId) || allRooms[0]}
                onClose={handleCloseEventDetails}
                onEdit={handleEditBooking}
                onDelete={handleDeleteBooking}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;