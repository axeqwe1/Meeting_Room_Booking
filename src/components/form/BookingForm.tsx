import React, { useState } from 'react';
import { Room, Booking } from '../../types';
import { format } from 'date-fns';
import { X, Users, Clock, CalendarDays } from 'lucide-react';

interface BookingFormProps {
  room?: Room;
  initialDate?: Date;
  initialEndDate?: Date;
  onSubmit: (booking: Partial<Booking>) => void;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  room,
  initialDate,
  initialEndDate,
  onSubmit,
  onCancel
}) => {
  const [booking, setBooking] = useState<Partial<Booking>>({
    roomId: room?.id,
    title: '',
    description: '',
    start: initialDate,
    end: initialEndDate || (initialDate ? new Date(initialDate.getTime() + 60 * 60 * 1000) : undefined),
    attendees: []
  });

  const [attendeeInput, setAttendeeInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(booking);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBooking(prev => ({ ...prev, [name]: new Date(value) }));
  };

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
      
      {room && (
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
                  value={booking.start ? format(booking.start, "yyyy-MM-dd'T'HH:mm") : ''}
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
                  value={booking.end ? format(booking.end, "yyyy-MM-dd'T'HH:mm") : ''}
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