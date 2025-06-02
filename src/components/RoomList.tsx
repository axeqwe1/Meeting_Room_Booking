import React, { useEffect, useState } from 'react';
import { Room } from '../types';
import { Users, MapPin, MonitorSmartphone } from 'lucide-react';
import { GetAllRoom } from '../api/Room';

interface RoomListProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
  selectedRoomId?: number;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onSelectRoom, selectedRoomId }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">Available Rooms</h3>
      </div>
      
      <div className="divide-y divide-gray-200 max-h-[calc(100vh-240px)] overflow-y-auto">
        {rooms.map((room) => (
          <div 
            key={room.id}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${room.id === selectedRoomId ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
            onClick={() => onSelectRoom(room)}
          >
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-20 h-16 rounded-md overflow-hidden">
                <img 
                  src={room.imageUrl} 
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                
                <h4 className="text-base font-semibold text-gray-800 truncate"><span className='inline-block w-3 h-3 mr-1 rounded-full' style={{backgroundColor: room.color }}></span> {room.name}</h4>
                
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Capacity: {room.capacity}</span>
                </div>
                
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{room.location}</span>
                </div>

                <div className="">
                  <div className="flex flex-wrap gap-1 mt-1">
                    {room.amenities.slice(0, 2).map((amenity, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        <MonitorSmartphone className="h-3 w-3 mr-1" />
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 2 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{room.amenities.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;