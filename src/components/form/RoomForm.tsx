import React, { useEffect, useState } from 'react';
import { Room } from '../../types/index';
import { X, Plus, ChevronDown } from 'lucide-react';
import { useScrollLock } from "../../hook/useScrollLock"; // อ้างอิง path ตามโครงสร้างของคุณ
import { useAuth } from '../../context/AuthContext';
interface RoomFormProps {
  room?: Room;
  onSubmit: (room: Room) => void;
  onCancel: () => void;
}

const RoomForm: React.FC<RoomFormProps> = ({ room, onSubmit, onCancel }) => {
  useScrollLock()
  const {user} = useAuth()
  const [showDropdown,setShowDropdown] = useState<boolean>(true)
  const [isFactoryDropdownOpen, setIsFactoryDropdownOpen] = useState<boolean>(false)
  const factoryOptions = ['All', 'GNX', 'YPT']
  useEffect(() => {
    if(user != null){
      if(user.factorie.toLowerCase() == 'all'){
        setShowDropdown(true)
        
      }
    }else{
      console.warn('loading user ....')
    }
  },[])
  const [formData, setFormData] = useState<Partial<Room>>({
    id: room?.id || '',
    name: room?.name || '',
    capacity: room?.capacity || 0,
    location: room?.location || '',
    imageUrl: room?.imageUrl || '',
    amenities: room?.amenities || [],
    factory: room?.factory || 'All' // เพิ่ม factory field
  });

  const [amenityInput, setAmenityInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

    const handleFactorySelect = (factory: string) => {
    setFormData(prev => ({
      ...prev,
      factory: factory
    }));
    setIsFactoryDropdownOpen(false);
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim() && formData.amenities) {
      setFormData(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Room);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden" 
      onClick={() => {
        if(isFactoryDropdownOpen){
          setIsFactoryDropdownOpen(false)
        }
      }}
    >
      <div className="px-6 py-4 bg-blue-500 text-white flex justify-between items-center">
        <h3 className="text-lg font-medium">{room ? 'Edit Room' : 'Add New Room'}</h3>
        <button
          onClick={onCancel}
          className="text-white hover:bg-blue-600 rounded-full p-1 hover:cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Room Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              Capacity*
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              required
              min="1"
              value={formData.capacity}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location*
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Factory Dropdown - แสดงเฉพาะเมื่อ showDropdown เป็น true */}
          {showDropdown && (
            <div>
              <label htmlFor="factory" className="block text-sm font-medium text-gray-700">
                Factory*
              </label>
              <div className="relative mt-1">
                <button
                  type="button"
                  onClick={() => setIsFactoryDropdownOpen(!isFactoryDropdownOpen)}
                  className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-left cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <span className="block truncate">{formData.factory}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                        isFactoryDropdownOpen ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </span>
                </button>

                {isFactoryDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {factoryOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleFactorySelect(option)}
                        className={`w-full text-left cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${
                          formData.factory === option 
                            ? 'text-blue-900 bg-blue-100' 
                            : 'text-gray-900'
                        }`}
                      >
                        <span className={`block truncate ${
                          formData.factory === option ? 'font-medium' : 'font-normal'
                        }`}>
                          {option}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              Image URL*
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              required
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">
              Amenities
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="amenities"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                className="flex-1 min-w-0 block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter amenity"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="hover:cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {formData.amenities && formData.amenities.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(index)}
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
            {room ? 'Save Changes' : 'Add Room'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomForm;