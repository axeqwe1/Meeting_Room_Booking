import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Room } from '../types';
import { rooms } from '../data/dummyData';
import { Users, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingContext';

const Settings: React.FC = () => {

  const {defaultRoom,setDefaultRoom} = useSettings()

  const handleSetDefaultRoom = (room: Room | null) => {
    
    if (room) {
        setDefaultRoom(room);
    } else {
        setDefaultRoom(null)
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Default Room Settings</h2>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={defaultRoom !== null}
                onChange={(e) => {
                  if (!e.target.checked) {
                    setDefaultRoom(null)
                  }
                }}
                className="rounded border-gray-300 text-blue-500 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-gray-700">Use Default Room</span>
            </label>
          </div>

          {defaultRoom === null && (
            <p className="text-gray-600 mb-4">
              When enabled, this room will be automatically selected for new bookings.
            </p>
          )}
          
          {defaultRoom === null && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleSetDefaultRoom(room)}
                  className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-20 h-16 rounded-md overflow-hidden">
                      <img 
                        src={room.imageUrl} 
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">{room.name}</h3>
                      <div className="mt-1 text-sm text-gray-500 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>Capacity: {room.capacity}</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{room.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {defaultRoom && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current Default Room:</h3>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-20 h-16 rounded-md overflow-hidden">
                    <img 
                      src={defaultRoom.imageUrl} 
                      alt={defaultRoom.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{defaultRoom.name}</h3>
                    <div className="mt-1 text-sm text-gray-500 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Capacity: {defaultRoom.capacity}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{defaultRoom.location}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleSetDefaultRoom(null)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;