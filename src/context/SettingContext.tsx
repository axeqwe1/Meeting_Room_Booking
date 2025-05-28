// context/RoomContext.tsx
import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction, ReactNode } from 'react';
import { Room, Booking, CalendarEvent } from '../types';
import { rooms, bookings } from '../data/dummyData';

interface SettingContextType {
  defaultRoom: Room | null;
  setDefaultRoom: Dispatch<SetStateAction<Room | null>>;
//   defaultMode: boolean;
//   setDefaultMode: (mode: boolean) => void;
}

const SettingsContext = createContext<SettingContextType | undefined>(undefined)

interface SettingProviderProps {
    children:ReactNode
}

export const SettingProvider:React.FC<SettingProviderProps> = ({children}) => {
    const [defaultRoom, setDefaultRoom] = useState<Room | null>(null)
    // const [defaultMode, setDefaultMode] = useState<boolean>(false)

    // โหลดค่าจาก localStorage ตอน mount
    useEffect(() => {
        const storedRoom = localStorage.getItem('defaultRoom');
        if (storedRoom) {
        setDefaultRoom(JSON.parse(storedRoom));
        }
    }, []);

    // ทุกครั้งที่ defaultRoom เปลี่ยน ให้บันทึกลง localStorage
    useEffect(() => {
        if (defaultRoom) {
        localStorage.setItem('defaultRoom', JSON.stringify(defaultRoom));
        } else {
        localStorage.removeItem('defaultRoom');
        }
    }, [defaultRoom]);


    return (
        <SettingsContext.Provider value={{ defaultRoom, setDefaultRoom }}>
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettings = () => {
    const context = useContext(SettingsContext)
    if(!context) throw new Error('useSetting must be used within a SettingProvider')
    return context
}