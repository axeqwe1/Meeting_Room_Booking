import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { CalendarEvent, Room } from '../types';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { rooms, bookings } from '../data/dummyData';
import CustomAlert from './CustomeAlert';
import { useScrollLock } from "../hook/useScrollLock";
import { EventContentArg } from '@fullcalendar/core/index.js';
import { useOutletContext } from 'react-router-dom';
import '../style/custom-select.css'; // import css ที่เราเขียน
import { useSettings } from '../context/SettingContext';
import { useRoomContext } from '../context/RoomContext';


interface CalendarViewProps {
  events: any[];
  onSelectEvent: (event: CalendarEvent, view: string) => void;
  onSelectSlot: (slotInfo: any, view: string) => void;
  onClear: () => void;
  showSelectRoom: () => void
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  events, 
  onSelectEvent, 
  onSelectSlot,
  onClear,
  showSelectRoom
}) => {
  useScrollLock();
  const { collapsed } = useOutletContext<{ collapsed: boolean }>();
  const calendarRef = useRef<FullCalendar>(null);
  const [view, setView] = useState<string>('timeGridWeek');
  const [date, setDate] = useState(new Date());
  const [selectedRoomIdFilter, setSelectedRoomIdFilter] = useState<string | undefined>(undefined);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [allRooms] = useState<Room[]>(rooms);
  const { defaultRoom } = useSettings()
  const {selectedFactories} = useRoomContext()
  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    setTimeout(() => {
      calendarRef.current?.getApi().updateSize();
    }, 300); // match Sidebar transition
  }, [collapsed]);
  // แปลง events ให้เป็นรูปแบบของ FullCalendar

  const handleSelectFactory = (factory: string) => {
    selectedFactories(factory);
    console.log('Selected factory:', factory);

    // โฟกัสกลับไปยังปุ่มแล้ว blur
    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
    }, 0);
  };

  const fullCalendarEvents = useMemo(() => {
    const filteredEvents = selectedRoomIdFilter
      ? events.filter(event => event.roomId === selectedRoomIdFilter)
      : events;
    return filteredEvents.map(event => {
      const isAllDay = new Date(event.end).getDate() !== new Date(event.start).getDate(); // ข้ามวันหรือไม่
      const exclusiveEnd = new Date(event.end)
      if(isAllDay){
        exclusiveEnd.setDate(exclusiveEnd.getDate() + 1)
      }
      return {
        id: event.id?.toString() || '',
        title: event.title,
        start: event.start,
        end: exclusiveEnd,
        allDay: isAllDay, // ✅ ใส่ allDay เฉพาะ event ข้ามวัน
        backgroundColor: event.color || '#d4d4d4',
        borderColor: event.color || '#d4d4d4',
        textColor: '#ffffff',
        extendedProps: {
          roomId: event.roomId,
          originalEvent: event
        }
      };
    });
    
  }, [events, selectedRoomIdFilter]);


  const handleViewChange = (newView: string) => {
    setView(newView);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(newView);
    }
  };

  const handleNavigate = (action: 'prev' | 'next' | 'today') => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      
      if (action === 'prev') {
        calendarApi.prev();
      } else if (action === 'next') {
        calendarApi.next();
      } else if (action === 'today') {
        calendarApi.today();
        onClear();
      }
      
      // อัพเดท state date
      setDate(calendarApi.getDate());
    }
  };

  // Handle event click
  const handleEventClick = (clickInfo: any) => {
    const originalEvent = clickInfo.event.extendedProps.originalEvent;
    onSelectEvent(originalEvent, view);
  };

  // Handle date/slot selection
  const handleDateSelect = (selectInfo: any) => {
    if (view === 'dayGridMonth') {
      // ถ้าเป็น month view แล้วคลิกวันเดียว ให้เปิด day modal
      if (selectInfo.start.getTime() === selectInfo.end.getTime() - 86400000) {
        setSelectedDate(selectInfo.start);
        setShowDayModal(true);
        return;
      }
    }
    
    // สำหรับการเลือก time slot
    const slotInfo = {
      start: selectInfo.start,
      end: selectInfo.end,
      action: 'select'
    };
    onSelectSlot(slotInfo, view);
  };

  // Handle date click (สำหรับ month view)
  const handleDateClick = (dateInfo: any) => {
    if (view === 'dayGridMonth') {
      setSelectedDate(dateInfo.date);
      setShowDayModal(true);
    }
  };

  // Format title based on view
  const getTitle = () => {
    if (view === 'timeGridDay') {
      return format(date, 'MMMM d, yyyy');
    } else if (view === 'timeGridWeek') {
      return format(date, 'MMMM yyyy');
    } else {
      return format(date, 'MMMM yyyy');
    }
  };

  useEffect(() => {
    console.log(calendarRef.current)
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView('dayGridMonth');
      setView('dayGridMonth')
    }
  }, [])

  const [isShowAlert, setIsShowAlert] = useState<boolean>(false);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4">
        {/* {isShowAlert && (
          <CustomAlert
            title='TEST'
            message='for test'
            mode='ok'
            onConfirm={() => {setIsShowAlert(false)}}
          />
        )} */}
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleNavigate('today')}
            className="hover:cursor-pointer px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Today
          </button>
          {/* <button 
            onClick={() => {setIsShowAlert(true)}}
            className='hover:cursor-pointer p-1.5 rounded-md hover:bg-gray-100'
          >
            test
          </button> */}

          <button 
            onClick={() => handleNavigate('prev')}
            className="hover:cursor-pointer p-1.5 rounded-md hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
          <button 
            onClick={() => handleNavigate('next')}
            className="hover:cursor-pointer p-1.5 rounded-md hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {getTitle()}
          </h2>
          <div className="dropdown dropdown-bottom">
            <div tabIndex={0} role="button" className="btn btn-accent text-white m-1" ref={dropdownRef}>Choose Factory ⬇️</div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              {['All', 'YPT', 'GNX'].map((factory) => (
                <li key={factory}>
                  <a onClick={() => handleSelectFactory(factory)}>{factory}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="flex border border-gray-300 rounded-md overflow-hidden w-full sm:w-auto">
          <button 
            onClick={() => handleViewChange('timeGridDay')}
            className={`hover:cursor-pointer flex-1 sm:flex-none px-3 py-1.5 text-sm ${view === 'timeGridDay' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Day
          </button>
          {/* <button 
            onClick={() => handleViewChange('timeGridWeek')}
            className={`hover:cursor-pointer flex-1 sm:flex-none px-3 py-1.5 text-sm ${view === 'timeGridWeek' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Week
          </button> */}
          <button 
            onClick={() => handleViewChange('dayGridMonth')}
            className={`hover:cursor-pointer flex-1 sm:flex-none px-3 py-1.5 text-sm ${view === 'dayGridMonth' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Month
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={'dayGridMonth'}
            initialDate={date}
            events={fullCalendarEvents}
            
            longPressDelay={300}
            // Header settings
            headerToolbar={false}
            
            // Time settings
            slotMinTime="08:00:00"
            slotMaxTime="19:00:00"
            slotDuration="00:30:00"
            
            // Interaction settings
            selectable={true}
            selectMirror={true}
            editable={false} // ปิดการลาก event เพื่อหลีกเลี่ยงปัญหา touch
            
            // Event handlers
            eventClick={handleEventClick}
            select={handleDateSelect}
            dateClick={handleDateClick}

            // Touch settings สำหรับ mobile
            eventDisplay="block"
            dayMaxEvents={1}
            moreLinkClick="popover"
            
            // Responsive settings
            height="100%"
            // contentHeight="100%"
            
            // Custom styling
            eventClassNames="cursor-pointer"
            
            // Fixed grid settings for month view
            dayMaxEventRows={false} // หรือเป็นตัวเลข เช่น 2

            aspectRatio={window.innerWidth < 1024 ? 1.5 : 1.65}
            
            // Locale settings
            locale="en-US"
            firstDay={1} // เริ่มต้นที่วันจันทร์
            nowIndicator={true}
            // เพิ่มการตั้งค่ารูปแบบเวลาแบบ 24 ชั่วโมงที่นี่
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
              meridiem: false
            }}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
              meridiem: false
            }}
            // Hide weekends in week view (work week)
            weekends={view !== 'timeGridWeek'}
            
            // Custom event rendering
            eventContent={(eventInfo: EventContentArg) => {
              const start = fullCalendarEvents.find((item) => item.id == eventInfo.event.id)?.start;
              const originalEnd = fullCalendarEvents.find((item) => item.id == eventInfo.event.id)?.end;
              const isAllDay = eventInfo.event.allDay;
              let displayEnd = originalEnd ? new Date(originalEnd) : undefined;

              if (isAllDay && displayEnd) {
                displayEnd.setDate(displayEnd.getDate() - 1); // ✅ ลด 1 วันเฉพาะตอนแสดงผล
              }

              const timeFormat: Intl.DateTimeFormatOptions = {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              };

              return (
                <div className="px-1 py-0.5 text-[14px] truncate leading-tight overflow-hidden">
                  {start?.toLocaleTimeString([], timeFormat)? start?.toLocaleTimeString([], timeFormat) : eventInfo.event.start?.toLocaleTimeString([], timeFormat)} - {displayEnd?.toLocaleTimeString([], timeFormat)? displayEnd?.toLocaleTimeString([], timeFormat) : eventInfo.event.end?.toLocaleTimeString([], timeFormat)} : {eventInfo.event.title}
                </div>
              );
            }}
            
            // View specific settings
            views={{
              // timeGridWeek: {
              //   weekends: false, // Hide weekends for work week
              // }
            }}
          />
      </div>
            {/* <div className="flex-1 bg-white rounded-lg shadow overflow-hidden z-20">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          headerToolbar={false}
          events={fullCalendarEvents}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          initialDate={date}
          select={handleDateSelect}
          eventClick={(info) => {
            const event = events.find(e => e.id === info.event.id);
            if (event) {
              onSelectEvent(event, view);
            }
          }}
          height="100%"
          slotMinTime="08:00:00"
          slotMaxTime="19:00:00"
          allDaySlot={true}
          slotDuration="00:30:00"
          selectConstraint={{
            startTime: '08:00',
            endTime: '19:00'
          }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          selectOverlap={false}
          eventOverlap={false}
          longPressDelay={300}
          eventContent={(arg) => (
            <div className="p-1 text-sm truncate">
              {arg.timeText && <span className="font-medium mr-1">{arg.timeText}</span>}
              {arg.event.title}
            </div>
          )}
        />
      </div> */}

      {/* Day Modal */}
      {showDayModal && selectedDate && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-4xl mx-4 bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
                <button
                  onClick={() => setShowDayModal(false)}
                  className="text-gray-400 hover:text-gray-500 cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>           
            </div>

            <div className="p-4 pb-0 border-b border-gray-200 flex flex-row items-center">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {format(selectedDate, 'MMMM d, yyyy')}
              </h3>
              {defaultRoom == null && 
                <button className='btn btn-primary text-white ml-3' onClick={showSelectRoom}>
                  Select Room
                </button>
              }
            </div>

            <div className="p-4 overflow-y-auto h-[600px]" style={{ maxHeight: "calc(90vh - 64px)" }}>
                <FullCalendar
                  plugins={[timeGridPlugin, interactionPlugin]}
                  initialView="timeGridDay"
                  initialDate={selectedDate}
                  events={fullCalendarEvents}
                  headerToolbar={false}
                  slotMinTime="08:00:00"
                  slotMaxTime="19:00:00"
                  slotDuration="00:30:00"
                  selectable={true}
                  longPressDelay={300}
                  eventClick={handleEventClick}
                  select={handleDateSelect}
                  selectMirror={true}
                  height="100%"
                  nowIndicator={true}
                  // เพิ่มการตั้งค่ารูปแบบเวลาแบบ 24 ชั่วโมงที่นี่
                  slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    meridiem: false
                  }}
                  eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    meridiem: false
                  }}
                  eventContent={(eventInfo:EventContentArg) => {
                    const start = fullCalendarEvents.find((item) => item.id == eventInfo.event.id)?.start
                    const end = fullCalendarEvents.find((item) => item.id == eventInfo.event.id)?.end

                    const timeFormat: Intl.DateTimeFormatOptions = {
                      day: '2-digit',      // แสดงเลขวัน เช่น 27
                      month: '2-digit',    // แสดงเลขเดือน เช่น 05
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,        // ใช้เวลาแบบ 12 ชั่วโมง (AM/PM)
                    };

                    return (
                      <div className="px-1 py-0.5 text-[14px] truncate leading-tight overflow-hidden bg-black/50">
                        {start?.toLocaleTimeString([], timeFormat)? start?.toLocaleTimeString([], timeFormat) : eventInfo.event.start?.toLocaleTimeString([], timeFormat)} - {end?.toLocaleTimeString([], timeFormat)? end?.toLocaleTimeString([], timeFormat) : eventInfo.event.end?.toLocaleTimeString([], timeFormat)} : {eventInfo.event.title}
                      </div>
                    );
                  }}
                />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;