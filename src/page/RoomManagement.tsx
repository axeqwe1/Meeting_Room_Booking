import React, { useEffect, useState } from 'react';
import { Room } from '../types';
import { rooms as initialRooms } from '../data/dummyData';
import Layout from '../components/Layout';
import { Plus, Pencil, Trash2, Users, MapPin, CircleCheck, CircleCheckIcon, CircleX, CircleAlertIcon } from 'lucide-react';
import RoomForm from '../components/form/RoomForm';
import { createPortal } from 'react-dom';
import { CreateRoom, DeleteRoom, GetAllRoom, UpdateRoom } from '../api/Room';
import { CreateRoomRequest, UpdateRoomRequest } from '../types/RequestDTO';
import CustomAlert from '../components/CustomeAlert';
import {useAlert} from '../context/AlertContext'
import { useRoomContext } from '../context/RoomContext';
const RoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const {allRooms,refreshData} = useRoomContext()
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const {showAlert} = useAlert()

  const handleAddRoom = async (room: Room) => {
    
    const data:CreateRoomRequest = {
      roomname:room.name,
      capacity:room.capacity,
      location:room.location,
      factory:room.factory,
      imageUrl:room.imageUrl,
      amentities:room.amenities
    }
    const res = await CreateRoom(data)
    if(res.status == 200){
        showAlert({
          title: 'Success',
          message: 'Add New Room Success',
          icon: CircleCheckIcon,
          iconColor: 'text-green-500',
          iconSize: 80
        });
        refreshData()
    }
    if(res.data.error != null)
      {
        showAlert({
          title: 'Failed',
          message: `Add New Room Failed : ${res.data.error}`,
          icon: CircleX,
          iconColor: 'text-red-500',
          iconSize: 80
        });
    }
    setShowRoomForm(false);
  };

  const handleEditRoom = async (room: Room) => {
    const data:UpdateRoomRequest = {
      roomid:room.id,
      roomname:room.name,
      capacity:room.capacity,
      location:room.location,
      factory:room.factory,
      imageUrl:room.imageUrl,
      amentities:room.amenities
    }
    const res = await UpdateRoom(data)
    console.log(res)
    if(res.status == 200){
        showAlert({
          title: 'Success',
          message: 'Update Room Success',
          icon: CircleCheckIcon,
          iconColor: 'text-green-500',
          iconSize: 80
        });
        refreshData()
    }else{
      showAlert({
        title: 'Failed',
        message: `Update Room Failed : ${res.message}`,
        icon: CircleX,
        iconColor: 'text-red-500',
        iconSize: 80
      });
    }

    if(res.data.error != null){
        showAlert({
          title: 'Failed',
          message: `Update Room Failed : ${res.data.error}`,
          icon: CircleX,
          iconColor: 'text-red-500',
          iconSize: 80
        });
    }
    setShowRoomForm(false);
    setSelectedRoom(undefined);
  };

  const handleDeleteRoom = (roomId: number) => {
      showAlert({
      title: 'Warning',
      message: `Are you sure you want to delete this room?`,
      icon: CircleAlertIcon,
      iconColor: 'text-yellow-500',
      iconSize: 80,
      mode: "confirm",
      onConfirm() {
        SubmitDeleteRoom(roomId)
      },
    });
  };
  const SubmitDeleteRoom = async (roomId:number) => {
      console.log(roomId)
      const res = await DeleteRoom(roomId)
      console.log(res)
    if(res.status == 200){
      showAlert({
        title: 'Success',
        message: 'Delete Room Success',
        icon: CircleCheckIcon,
        iconColor: 'text-green-500',
        iconSize: 80
      });
      refreshData()
    }
    else{
      showAlert({
        title: 'Failed',
        message: `Delete Room Failed : ${res.message}`,
        icon: CircleX,
        iconColor: 'text-red-500',
        iconSize: 80
      });
    }
    if(res.data.error != null){
        showAlert({
          title: 'Failed',
          message: `Delete Room Failed : ${res.data.error}`,
          icon: CircleX,
          iconColor: 'text-red-500',
          iconSize: 80
        });
    }
  }
  const handleShowRoomForm = () => {
    setShowRoomForm(false)
  }


  return (
    <>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Room Management</h1>
          <button
            onClick={() => {
              setSelectedRoom(undefined);
              setShowRoomForm(true);
            }}
            className="hover:cursor-pointer flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Room
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allRooms.map(room => (
            <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={room.imageUrl}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{room.name}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Capacity: {room.capacity}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{room.location}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              <div className='p-4 pt-0'>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setSelectedRoom(room);
                      setShowRoomForm(true);
                    }}
                    className=" hover:cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="hover:cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
  {showRoomForm &&
      createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75 z-40"></div>
          <div className="z-50 w-full max-w-md bg-white rounded-lg shadow-lg animate-fadeIn">
            <RoomForm
              room={selectedRoom}
              onSubmit={selectedRoom ? handleEditRoom : handleAddRoom}
              onCancel={() => {
                setShowRoomForm(false);
                setSelectedRoom(undefined);
              }}
            />
          </div>
        </div>,
        document.body
      )}
      </div>
    </>
  );
};

export default RoomManagement;