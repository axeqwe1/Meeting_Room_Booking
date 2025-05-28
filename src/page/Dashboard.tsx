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
import { CircleAlert, X } from 'lucide-react';
import { useRoomContext  } from '../context/RoomContext';
import { useSettings } from '../context/SettingContext';

const Dashboard: React.FC = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [initialDate, setInitialDate] = useState<Date | undefined>(undefined);
  const [initialEndDate, setInitialEndDate] = useState<Date | undefined>(undefined);
  const [showRoomList, setShowRoomList] = useState(false);
  const [modalRoomlist,setModalRoomlist] = useState(false);
  const {defaultRoom} = useSettings()
  // const [roomColors, setRoomColors] = useState<{ [roomId: string]: string }>({});
  const {showAlert} = useAlert()
  const {
    allRooms,
    allBookings,
    setAllBookings,
    events,
    selectData,
    setSelectData,
    selectedRoom,
    setSelectedRoom,
    selectedBooking,
    setSelectedBooking,
    selectedEvent,
    setSelectedEvent,
    selectedEditRoom,
    setSelectedEditRoom,
    roomColors
  } = useRoomContext();
  
  useEffect(() => {
    if (defaultRoom) {
      console.log('Selecting default room:', defaultRoom);
      // เปลี่ยนห้องใหม่
      setSelectedRoom(defaultRoom);
      // แสดง event เฉพาะของห้องนี้
      const filtered = events.filter((event) => event.roomId === defaultRoom.id);
      setSelectData(filtered);
    } else {
      setSelectedRoom(undefined); 
      setSelectData(events); // แสดง event ทั้งหมด
    }
  }, [defaultRoom,events]);
  const handleSelectEvent = (event: CalendarEvent,view:string) => {
    // if(view != 'month'){
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
    // }

  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date;  }, view:string) => {
    
    const startDay = new Date(slotInfo.start)
    const endDay = new Date(slotInfo.end)
    console.log(view)

    const startDateOnly = new Date(startDay).setHours(0, 0, 0, 0);
    const endDateOnly = new Date(endDay).setHours(0, 0, 0, 0);
    if (endDateOnly > startDateOnly) {
        endDay.setDate(endDay.getDate() - 1);
        console.log(endDay); // ผลลัพธ์: "2023-10-31" (31 ตุลาคม 2023)
    }
    if(view != 'dayGridMonth'){
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
      setInitialDate(startDay);
      setInitialEndDate(endDay);
      setShowBookingForm(true);
    }
    else{
      // endDay.setDate(endDay.getDate() - 1)
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
      setInitialDate(startDay);
      setInitialEndDate(endDay);
      setShowBookingForm(true);
    }
  };
  
  const handleSelectRoom = (room: Room) => {
    setShowBookingForm(false);
    setShowRoomList(false);
    console.log(room)
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
    setModalRoomlist(false)
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
      setSelectedRoom(allRooms.find((item) => item.id == booking.roomId))
      setTimeout(() => {
        if(defaultRoom != null){
            setShowBookingForm(false);
            setInitialDate(undefined);
            setInitialEndDate(undefined);
        }
        else{
            setShowBookingForm(false);
            setInitialDate(undefined);
            setInitialEndDate(undefined);
            setSelectedRoom(undefined);
            setSelectedBooking(undefined);
            setSelectedEditRoom(undefined);
        }
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
      setSelectedRoom(allRooms.find((item) => item.id == booking.roomId))
      setAllBookings([...allBookings, newBooking]);
      setTimeout(() => {
        if(defaultRoom != null){
            setShowBookingForm(false);
            setInitialDate(undefined);
            setInitialEndDate(undefined);
        }
        else{
            setShowBookingForm(false);
            setInitialDate(undefined);
            setInitialEndDate(undefined);
            setSelectedRoom(undefined);
            setSelectedBooking(undefined);
            setSelectedEditRoom(undefined);
        }
      },100)
    }
  };

  const clearData = () => {
      setInitialDate(undefined);
      setInitialEndDate(undefined);
      setSelectedRoom(undefined);
      setSelectedBooking(undefined);
      setSelectedEditRoom(undefined);
      setSelectedRoom(undefined); 
      setSelectData(events); // แสดง event ทั้งหมด
  }
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
    // setSelectedRoom(undefined);
    setSelectedBooking(undefined);
    setShowEventDetails(false)
    setSelectedEditRoom(undefined);
  };

  const roomsWithColor = allRooms.map(room => ({
    ...room,
    color: roomColors[room.id] || '#999999'
  }));

  const handleModalRoomList = () => {
    setModalRoomlist(true)
  }

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
          <div className={`${showRoomList && !defaultRoom ? 'hidden' : 'block'} lg:block lg:flex-1 h-[calc(100vh-12rem)] lg:h-auto`}>
            <CalendarView 
              events={selectData}
              onClear={clearData}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              showSelectRoom = {handleModalRoomList}
            />
          </div>
          
          {/* Room List - Hidden on mobile when calendar is shown */}
          {defaultRoom == null && 
            <div className={`${!showRoomList ? 'hidden' : 'block'} lg:block lg:w-1/4`}>
              <RoomList 
                rooms={roomsWithColor}
                onSelectRoom={handleSelectRoom}
                selectedRoomId={selectedRoom?.id}
              />
            </div>
          }

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
                    // setSelectedRoom(undefined);
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

      {modalRoomlist && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50">
          {/* Modal container */}
          <div className="relative w-full max-w-4xl mx-4 bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Close button */}
            <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
              <button
                onClick={() => {setModalRoomlist(false)}}
                className="text-gray-400 hover:text-gray-500 hover:cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal header */}
            {/* <div className="p-4 border-b border-gray-200 flex flex-row  items-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900 pr-3">
                Select Room List
              </h3>
              <button className='btn btn-primary text-white'>
                Select Room
              </button>
            </div> */}

            {/* Calendar content */}
            <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(90vh - 64px)" }}>
              <RoomList 
                rooms={roomsWithColor}
                onSelectRoom={handleSelectRoom}
                selectedRoomId={selectedRoom?.id}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;