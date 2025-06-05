import React, { useState, useEffect, useCallback } from 'react';
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
import { CircleAlert, CircleAlertIcon, CircleCheck, CircleCheckIcon, CircleX, X } from 'lucide-react';
import { useRoomContext  } from '../context/RoomContext';
import { useSettings } from '../context/SettingContext';
import { CreateBooking, DeleteBooking, UpdateBooking } from '../api/Booking';
import { CreateBookingRequest, UpdateBookingRequest } from '../types/RequestDTO';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import { DateTime } from 'luxon';
const Dashboard: React.FC = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [initialDate, setInitialDate] = useState<string | undefined>(undefined);
  const [initialEndDate, setInitialEndDate] = useState<string | undefined>(undefined);
  const [showRoomList, setShowRoomList] = useState(false);
  const [modalRoomlist,setModalRoomlist] = useState(false);
  const {defaultRoom,setDefaultRoom} = useSettings()
  const {user} = useAuth()
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
    roomColors,
    refreshData,
    refreshBooking
  } = useRoomContext();

  // useEffect(() => {
  //   refreshBooking()
  // },[selectedRoom])
  useEffect(() => {
      const storedRoom = localStorage.getItem('defaultRoom');
      if (storedRoom) {
          console.log(storedRoom)
          const objStoreRoom = JSON.parse(storedRoom)
          if(user?.factorie == objStoreRoom.factory || user?.factorie == "All"){
              setDefaultRoom(objStoreRoom);
          }else{
              localStorage.removeItem('defaultRoom');
              setDefaultRoom(null)
          }
      }
  }, []);
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
    
    const startDay = slotInfo.start;
    const endDay = slotInfo.end;
    console.log(startDay.toISOString())

    // ตั้งค่าเวลาเป็น 00:00:00 โดยตรงใน startDay และ endDay
    const startDateOnly = new Date(startDay).setHours(0, 0, 0, 0);
    const endDateOnly = new Date(endDay).setHours(0, 0, 0, 0);

    // ตรวจสอบและปรับ endDay ถ้าจำเป็น (อาจลบได้ถ้าไม่ต้องการ)
    if (endDateOnly > startDateOnly) {
        endDay.setDate(endDay.getDate() - 1);
        console.log(endDay.toISOString()); // ผลลัพธ์ตัวอย่าง: "2023-10-31"
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
      console.log(startDay.toISOString())
      setInitialDate(startDay.toISOString());
      setInitialEndDate(endDay.toISOString());
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
      console.log(startDay.toISOString())
      setInitialDate(startDay.toISOString());
      setInitialEndDate(endDay.toISOString());
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
 
function toUTCWithTimezone(date:any, timezone = 'Asia/Bangkok') {
  if (!date) return new Date().toISOString();
  
  // สร้าง Date ใน timezone ที่ต้องการ
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(date);
  const formattedDate = `${parts[0].value}-${parts[2].value}-${parts[4].value}T${parts[6].value}:${parts[8].value}:${parts[10].value}`;
  
  return new Date(formattedDate).toISOString();
}
  const handleCreateBooking = (booking: Partial<Booking>) => {
    console.log(booking)
    const start = booking.start 
      // ? DateTime.fromISO(booking.start, { zone: 'Asia/Bangkok' }).toUTC().toISO() 
      // : DateTime.now().setZone('Asia/Bangkok').toUTC().toISO();
    const end = booking.end 
      // ? DateTime.fromISO(booking.end, { zone: 'Asia/Bangkok' }).toUTC().toISO() 
      // : DateTime.now().setZone('Asia/Bangkok').toUTC().toISO();
    if(booking.id != null || booking.id != undefined){
      const updateData:UpdateBookingRequest = {
          bookingId:booking.id,
          roomId:booking.roomId || 0,
          user_id:user?.fullname || "",
          title:booking.title || "",
          description:booking.description || "",
          start_date: start || new Date().toISOString(),
          end_date: end || new Date().toISOString(),
          attendees:booking.attendees || []
      }
      const updateBooking = async (data:UpdateBookingRequest) => {
        const res = await UpdateBooking(data)
        
        if(res.status == 200){
            showAlert({
              title: 'Success',
              message: 'Update Booking Success',
              icon: CircleCheck,
              iconColor: 'text-green-500',
              iconSize: 80
            });
            // await refreshBooking()
        }
        if(res.data.error != null){
            showAlert({
              title: 'Failed',
              message: `Update Booking Failed : ${res.data.error}`,
              icon: CircleX,
              iconColor: 'text-red-500',
              iconSize: 80
            });
        }
      }
      updateBooking(updateData)
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
      
      const newBooking: CreateBookingRequest = {
        roomId: booking?.roomId || 0,
        title: booking.title || 'Untitled Meeting',
        start_date: start || new Date().toISOString(), 
        end_date: end || new Date().toISOString(),
        user_id: user?.fullname || "",
        description: booking.description || "",
        attendees: booking.attendees || []
      };
      console.log(newBooking)
      setSelectedRoom(allRooms.find((item) => item.id == booking.roomId))
      const createBooking = async (data:CreateBookingRequest) => {
        const res = await CreateBooking(data)
          if(res.status == 200){
              showAlert({
                title: 'Success',
                message: 'Add New Booking Success',
                icon: CircleCheck,
                iconColor: 'text-green-500',
                iconSize: 80
              });
              // await refreshBooking()
          }
          if(res.data.error != null)
            {
              showAlert({
                title: 'Failed',
                message: `Add New Booking Failed : ${res.data.error}`,
                icon: CircleX,
                iconColor: 'text-red-500',
                iconSize: 80
              });
          }
      }
      createBooking(newBooking)
      // setAllBookings([...allBookings, newBooking]);
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

    const handleDeleteBooking = (Id: number) => {
        showAlert({
        title: 'Warning',
        message: `Are you sure you want to delete this booking?`,
        icon: CircleAlertIcon,
        iconColor: 'text-yellow-500',
        iconSize: 80,
        mode: "confirm",
        onConfirm() {
          SubmitDeleteBooking(Id)
        },
      });
    };
    const SubmitDeleteBooking = async (Id:number) => {
        const res = await DeleteBooking(Id)
        console.log(res)
      if(res.status == 200){
        showAlert({
          title: 'Success',
          message: 'Delete Booking Success',
          icon: CircleCheckIcon,
          iconColor: 'text-green-500',
          iconSize: 80
        });
        setSelectedEvent(undefined);
        setSelectedBooking(undefined);
        
        // await refreshBooking()
      }
      else{
        showAlert({
          title: 'Failed',
          message: `Delete Booking Failed : ${res.message}`,
          icon: CircleX,
          iconColor: 'text-red-500',
          iconSize: 80
        });
      }
      if(res.data.error != null){
          showAlert({
            title: 'Failed',
            message: `Delete Booking Failed : ${res.data.error}`,
            icon: CircleX,
            iconColor: 'text-red-500',
            iconSize: 80
          });
      }
    }

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
        {defaultRoom == null && 
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowRoomList(!showRoomList)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center"
            >
              {showRoomList ? 'Show Calendar' : 'Show Rooms'}
            </button>
          </div>
        }


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
        <div className="fixed inset-0 z-20 overflow-y-auto">
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
        <div className="fixed inset-0 z-20 overflow-y-auto">
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