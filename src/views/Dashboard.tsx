import React, { useState, useEffect } from 'react';
import { Room, Booking, CalendarEvent } from '../types';
import { rooms, bookings } from '../data/dummyData';
import Layout from '../components/Layout';
import CalendarView from '../components/CalendarView';
import RoomList from '../components/RoomList';
import BookingForm from '../components/BookingForm';
import EventDetails from '../components/EventDetails';
import MobileMenu from '../components/MobileMenu';

const Dashboard: React.FC = () => {
  const [allRooms] = useState<Room[]>(rooms);
  const [allBookings, setAllBookings] = useState<Booking[]>(bookings);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>(undefined);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [initialDate, setInitialDate] = useState<Date | undefined>(undefined);
  const [initialEndDate, setInitialEndDate] = useState<Date | undefined>(undefined);
  const [showRoomList, setShowRoomList] = useState(false);

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
        roomName: room?.name
      };
    });
    setEvents(calendarEvents);
  }, [allBookings, allRooms]);

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    const booking = allBookings.find(b => b.id === event.id);
    if (booking) {
      setSelectedBooking(booking);
      const room = allRooms.find(r => r.id === booking.roomId);
      if (room) {
        setSelectedRoom(room);
      }
    }
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setInitialDate(slotInfo.start);
    setInitialEndDate(slotInfo.end);
    setShowBookingForm(true);
  };

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setShowBookingForm(true);
    setShowRoomList(false); // Close room list on mobile after selection
  };

  const handleCreateBooking = (booking: Partial<Booking>) => {
    const newBooking: Booking = {
      id: `booking_${Date.now()}`,
      roomId: booking.roomId || '',
      title: booking.title || 'Untitled Meeting',
      start: booking.start || new Date(),
      end: booking.end || new Date(),
      userId: 'current_user',
      description: booking.description,
      attendees: booking.attendees
    };
    
    setAllBookings([...allBookings, newBooking]);
    setShowBookingForm(false);
    setInitialDate(undefined);
    setInitialEndDate(undefined);
    setSelectedRoom(undefined);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowBookingForm(true);
    setInitialDate(booking.start);
    setInitialEndDate(booking.end);
    const room = allRooms.find(r => r.id === booking.roomId);
    if (room) {
      setSelectedRoom(room);
    }
  };

  const handleDeleteBooking = (bookingId: string) => {
    setAllBookings(allBookings.filter(b => b.id !== bookingId));
    setSelectedEvent(undefined);
    setSelectedBooking(undefined);
  };

  const handleCloseEventDetails = () => {
    setSelectedEvent(undefined);
    setSelectedBooking(undefined);
  };

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
              events={events}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
            />
          </div>
          
          {/* Room List - Hidden on mobile when calendar is shown */}
          <div className={`${!showRoomList ? 'hidden' : 'block'} lg:block lg:w-1/4`}>
            <RoomList 
              rooms={allRooms}
              onSelectRoom={handleSelectRoom}
              selectedRoomId={selectedRoom?.id}
            />
          </div>
        </div>
      </div>
      
      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom sm:align-middle sm:max-w-lg sm:w-full w-full max-w-md my-8 overflow-hidden text-left transform transition-all">
              <BookingForm 
                room={selectedRoom}
                initialDate={initialDate}
                initialEndDate={initialEndDate}
                onSubmit={handleCreateBooking}
                onCancel={() => {
                  setShowBookingForm(false);
                  setInitialDate(undefined);
                  setInitialEndDate(undefined);
                  setSelectedRoom(undefined);
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Event Details Modal */}
      {selectedEvent && selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={handleCloseEventDetails}></div>
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