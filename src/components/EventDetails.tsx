import React from 'react';
import { Booking, Room } from '../types';
import { format } from 'date-fns';
import { X, Calendar, Clock, Users, MapPin } from 'lucide-react';
import { useScrollLock } from "../hook/useScrollLock"; // อ้างอิง path ตามโครงสร้างของคุณ

interface EventDetailsProps {
  booking: Booking;
  room: Room;
  onClose: () => void;
  onEdit: (booking: Booking) => void;
  onDelete: (bookingId: number) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  booking,
  room,
  onClose,
  onEdit,
  onDelete
}) => {
  useScrollLock()
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-fadeIn">
      <div className="px-6 py-4 bg-blue-500 text-white flex justify-between items-center">
        <h3 className="text-lg font-medium">Booking Details</h3>
        <button 
          onClick={onClose}
          className="text-white hover:bg-blue-600 rounded-full p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-6">
        <h4 className="text-xl font-bold text-gray-800">{booking.title}</h4>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="text-base text-gray-900">
                {format(booking.start, 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500">Time</p>
              <p className="text-base text-gray-900">
                {format(booking.start, 'h:mm a')} - {format(booking.end, 'h:mm a')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h5 className="text-sm font-medium text-gray-500">Room Information</h5>
          </div>
          <div className="px-4 py-3 flex items-start">
            <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden mr-4">
              <img 
                src={room.imageUrl} 
                alt={room.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h6 className="text-base font-medium text-gray-900">{room.name}</h6>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{room.location}</span>
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                <span>Capacity: {room.capacity}</span>
              </div>
            </div>
          </div>
        </div>
        
        {booking.description && (
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-500">Description</h5>
            <p className="mt-1 text-sm text-gray-700">{booking.description}</p>
          </div>
        )}
        
        {booking.attendees && booking.attendees.length > 0 && (
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-500">Attendees</h5>
            <div className="mt-1 flex flex-wrap gap-2">
              {booking.attendees.map((attendee, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {attendee}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => onDelete(booking.id)}
            className="hover:cursor-pointer inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Cancel Booking
          </button>
          <button
            onClick={() => onEdit(booking)}
            className="hover:cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;