import React, { useEffect, useState } from 'react';
import { Room, Booking } from '../../types';
// import { bookings } from '../../data/dummyData';
import { format } from 'date-fns';
import { X, Users, Clock, CalendarDays, CircleCheck, CircleOff } from 'lucide-react';
import { resolve } from 'path';
import { rejects } from 'assert';
import CustomAlert from '../CustomeAlert';
import { useAlert } from '../../context/AlertContext';
import { useScrollLock } from "../../hook/useScrollLock"; // อ้างอิง path ตามโครงสร้างของคุณ
import { useAuth } from '../../context/AuthContext';
import { useRoomContext } from '../../context/RoomContext';
import { parse } from 'date-fns';
import { DateTime } from 'luxon';
interface BookingFormProps {
  room?: Room;
  initialDate?: string;
  initialEndDate?: string;
  SelectedRoom?: Room;
  BookingData?: Booking;
  onSubmit: (booking: Partial<Booking>) => void;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  room,
  initialDate,
  initialEndDate,
  SelectedRoom,
  BookingData,
  onSubmit,
  onCancel
}) => {
  useScrollLock()
  const [booking, setBooking] = useState<Partial<Booking>>({
    id: undefined,
    roomId: room?.id,
    title: '',
    description: '',
    start: initialDate,
    end: initialEndDate,
    attendees: []
  });

  const {showAlert} = useAlert();
  const [validationAlert,setValidationAlert] = useState<boolean>(false);
  const [attendeeInput, setAttendeeInput] = useState('');
  const {allBookings} = useRoomContext()
  
  useEffect(() => {
    if(BookingData != null){
      console.log(BookingData)
      setBooking({
        id:BookingData.id,
        roomId:BookingData.roomId,
        start:BookingData.start,
        end:BookingData.end,
        description:BookingData.description,
        attendees:BookingData.attendees,
        title:BookingData.title
      })
    }
    else{
      console.log(`start : ${initialDate} - end : ${initialEndDate}`)
      setBooking({
        id:undefined,
        roomId: SelectedRoom?.id,
        start: initialDate,
        end: initialEndDate,
        description: '',
        attendees: [...([]), user?.fullname? user?.fullname : ""]  ,
        title: '',
      })
    }
    console.log(booking)
  },[])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(BookingData != null){
      const isValid =  await validation()
      if(isValid.success){
        showAlert({
          title: 'Success',
          message: isValid.message,
          icon: CircleCheck,
          iconColor: 'text-green-500',
          iconSize: 80
        });
      }else{
        showAlert({
          title: 'Failed',
          message: isValid.message,
          icon: CircleOff,
          iconColor: 'text-red-500',
          iconSize: 80
        });
      }
      
    }else{
      const isValid =  await validation()
      setValidationAlert(isValid.success)
      if(isValid.success){
        showAlert({
          title: 'Success',
          message: isValid.message,
          icon: CircleCheck,
          iconColor: 'text-green-500',
          iconSize: 80
        });
      }else{
        showAlert({
          title: 'Failed',
          message: isValid.message,
          icon: CircleOff,
          iconColor: 'text-red-500',
          iconSize: 80
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(value)
    setBooking(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const {user} = useAuth()

  const handleAddAttendee = () => {
    if (attendeeInput.trim() && booking.attendees) {
      setBooking(prev => ({
        ...prev,
        attendees: [...(prev.attendees || []), attendeeInput.trim()]
      }));
      setAttendeeInput('');
    }
  };

  const handleRemoveAttendee = (index: number) => {
    setBooking(prev => ({
      ...prev,
      attendees: prev.attendees?.filter((_, i) => i !== index)
    }));
  };

const validation = (): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve, reject) => {
    try {
      console.log(booking)
      function isSameDay(d1: Date, d2: Date) {
        return d1.getFullYear() === d2.getFullYear() &&
              d1.getMonth() === d2.getMonth() &&
              d1.getDate() === d2.getDate();
      }

      function isDateInRange(date: Date, start: Date, end: Date) {
        return date.getTime() >= start.getTime() && date.getTime() < end.getTime();
      }

      const isAllDay = (start: Date, end: Date) =>
        start.getHours() === 0 && start.getMinutes() === 0 &&
        (end.getHours() === 23 && end.getMinutes() === 59 || end.getHours() >= 21);
      console.log(initialDate)
      console.log(initialEndDate)
      const isoStart =   DateTime.fromFormat( booking.start!!, "yyyy-MM-dd'T'HH:mm", { zone: 'utc' }).toUTC().toISO();
      const isoEnd =   DateTime.fromFormat( booking.end!!, "yyyy-MM-dd'T'HH:mm", { zone: 'utc' }).toUTC().toISO();

      const iniStartDate =
        isoStart ? new Date(isoStart)
        : initialDate ? new Date(initialDate)
        : new Date();

      const iniEndDate =
        isoEnd ? new Date(isoEnd)
        : initialEndDate ? new Date(initialEndDate)
        : new Date();
      console.log('initialDate:', iniStartDate);
      console.log('initialEndDate:', iniEndDate);
      const bookData = allBookings.filter(item => item.roomId == SelectedRoom?.id);

      if (!iniStartDate || !iniEndDate || isNaN(iniStartDate.getTime()) || isNaN(iniEndDate.getTime())) {
        return resolve({
          success: false,
          message: "Please select a valid start and end date.",
        });
      }

      console.log('iniStartDate', iniStartDate, iniStartDate.getTime());
      console.log('iniEndDate', iniEndDate, iniEndDate.getTime());

      const wrongFormat: boolean = iniEndDate.getTime() <= iniStartDate.getTime();
      console.log(wrongFormat)
      if(wrongFormat){
        return resolve({
          success: false,
          message: "End date cant Greater than Start date.",
        });
      }
      // 1. ถ้ามี booking รายชั่วโมงในวันนั้น ห้ามจอง all-day หรือข้ามวันที่ครอบวันนั้น
      if (isAllDay(iniStartDate, iniEndDate) || iniStartDate.toDateString() !== iniEndDate.toDateString()) {
        const hasPartialBooking = bookData.some(booking => {
          const bookingStart = new Date(booking.start);
          const bookingEnd = new Date(booking.end);
          // มีจองใดๆ ในวันเดียวกับ all-day หรือช่วงข้ามวันนี้
          for (
            let d = new Date(iniStartDate);
            d <= iniEndDate;
            d.setDate(d.getDate() + 1)
          ) {
            // ถ้า booking นั้นครอบวัน d
            if (
              isDateInRange(d, bookingStart, bookingEnd) ||
              isSameDay(d, bookingStart) ||
              isSameDay(d, bookingEnd)
            ) {
              // แต่ booking นั้นไม่ใช่ all-day
              if (!isAllDay(bookingStart, bookingEnd)) return true;
            }
          }
          return false;
        });
        if (hasPartialBooking) {
          // มีรายชั่วโมงอยู่แล้ว ห้ามจอง all-day หรือข้ามวัน
          return resolve({
            success: false,
            message: "Partial bookings already exist on this day. Cannot book all-day or multi-day.",
          });
        }
      }

      // 2. ถ้ามี booking all-day หรือข้ามวันในวันนั้น ห้ามจองรายชั่วโมงหรือช่วงใด ๆ ซ้ำวันนั้น
      const hasAllDayOrCrossDayBooking = bookData.some(booking => {
        const bookingStart = new Date(booking.start);
        const bookingEnd = new Date(booking.end);
        if (isAllDay(bookingStart, bookingEnd) || bookingStart.toDateString() !== bookingEnd.toDateString()) {
          // ถ้าช่วงใหม่มีวันใดอยู่ในช่วง booking นี้
          for (
            let d = new Date(iniStartDate);
            d <= iniEndDate;
            d.setDate(d.getDate() + 1)
          ) {
            if (
              isDateInRange(d, bookingStart, bookingEnd) ||
              isSameDay(d, bookingStart) ||
              isSameDay(d, bookingEnd)
            ) {
              return true;
            }
          }
        }
        return false;
      });
      if (hasAllDayOrCrossDayBooking) {
        return resolve({
          success: false,
          message: "All-day or cross-day bookings already exist on this day. Cannot book partial time.",
        });
      }

      // 3. เช็ค overlap ปกติ (timestamp) เผื่อกรณีจองช่วงเวลาเดียวกัน
      const isOverlapping = bookData.some((booking) => {
        const bookingStart = new Date(booking.start).getTime();
        const bookingEnd = new Date(booking.end).getTime();
        const newStart = iniStartDate.getTime();
        const newEnd = iniEndDate.getTime();
        return !(newEnd <= bookingStart || newStart >= bookingEnd);
      });

      if (isOverlapping) {
        return resolve({
          success: false,
          message: "This room is already booked for the selected time period. Please choose a different time slot.",
        });
      }


      onSubmit(booking);
      resolve({
        success: true,
        message: "Booking Success",
      });
    } catch (err: any) {
      reject(new Error(err));
    }
  });
};
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-fadeIn">
      <div className="px-6 py-4 bg-blue-500 text-white flex justify-between items-center">
        <h3 className="text-lg font-medium">Book a Room</h3>
        <button 
          onClick={onCancel}
          className="hover:cursor-pointer text-white hover:bg-blue-600 rounded-full p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      {room && !SelectedRoom &&(
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-center">
          <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden mr-3">
            <img 
              src={room.imageUrl}
              alt={room.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{room.name}</h4>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              <span>Capacity: {room.capacity}</span>
            </div>
          </div>
        </div>
      )}
      {SelectedRoom && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-center">
          <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden mr-3">
            <img 
              src={SelectedRoom.imageUrl} 
              alt={SelectedRoom.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{SelectedRoom.name}</h4>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              <span>Capacity: {SelectedRoom.capacity}</span>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Meeting Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={booking.title}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter meeting title"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start" className="block text-sm font-medium text-gray-700">
                Start Time*
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarDays className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  id="start"
                  name="start"
                  required
                  value={booking.start
                    ? DateTime.fromISO(booking.start, { zone: 'utc' }).toFormat("yyyy-MM-dd'T'HH:mm")
                    : ''
                  }
                  onChange={handleDateChange}
                  className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="end" className="block text-sm font-medium text-gray-700">
                End Time*
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  id="end"
                  name="end"
                  required
                  value={booking.end
                    ? DateTime.fromISO(booking.end, { zone: 'utc' }).toFormat("yyyy-MM-dd'T'HH:mm")
                    : ''
                  }
                  onChange={handleDateChange}
                  className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={booking.description}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter meeting description"
            />
          </div>
          
          <div>
            <label htmlFor="attendees" className="block text-sm font-medium text-gray-700">
              Attendees
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="attendees"
                value={attendeeInput}
                onChange={(e) => setAttendeeInput(e.target.value)}
                className="flex-1 min-w-0 block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter attendee name"
              />
              <button
                type="button"
                onClick={handleAddAttendee}
                className="hover:cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
            
            {booking.attendees && booking.attendees.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {booking.attendees.map((attendee, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {attendee}
                    <button
                      type="button"
                      onClick={() => handleRemoveAttendee(index)}
                      className="hover:cursor-pointer ml-1.5 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="hover:cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="hover:cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Book Room
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;