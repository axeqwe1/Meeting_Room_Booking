import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, Views, momentLocalizer, View, DateLocalizer, Formats } from 'react-big-calendar';
import moment from 'moment';
import { format } from 'date-fns';
import { CalendarEvent, Room } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { rooms, bookings } from '../data/dummyData';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import CustomWeekWithoutSunday from '../data/CustomWeekView';
interface CalendarViewProps {
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onSelectSlot: (slotInfo: any) => void;
  onSelectRoomId : (roomId:any) => void;
}

const localizer: DateLocalizer = momentLocalizer(moment);


interface TimeRangeFormatArgs {
  start: Date;
  end: Date;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  events, 
  onSelectEvent, 
  onSelectSlot,
  onSelectRoomId,
}) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK as View);
  const [date, setDate] = useState(new Date());
  const [selectedRoomIdFilter, setSelectedRoomIdFilter] = useState<string | undefined>(undefined);
  const [allRooms] = useState<Room[]>(rooms);

  const filteredEvents = selectedRoomIdFilter
    ? events.filter(event => event.roomId === selectedRoomIdFilter)
    : events;

    useEffect(() => {
      const data = rooms.filter((item) => {
        return item.id == selectedRoomIdFilter
      })[0]
      onSelectRoomId(data)
    },[filteredEvents])
  // ประกาศรูปแบบที่ถูกต้อง
  const calendarFormats: Formats = {
    timeGutterFormat: 'HH:mm',
    eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
    agendaTimeFormat: 'HH:mm',
    agendaTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
    dayFormat: 'D MMMM YYYY',
    weekdayFormat: 'dddd',
    monthHeaderFormat: 'MMMM YYYY'
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    const newDate = new Date(date);
    
    if (action === 'PREV') {
      if (view === 'day') newDate.setDate(date.getDate() - 1);
      else if (view === 'week') newDate.setDate(date.getDate() - 7);
      else if (view === 'month') newDate.setMonth(date.getMonth() - 1);
    } else if (action === 'NEXT') {
      if (view === 'day') newDate.setDate(date.getDate() + 1);
      else if (view === 'week') newDate.setDate(date.getDate() + 7);
      else if (view === 'month') newDate.setMonth(date.getMonth() + 1);
    } else if (action === 'TODAY') {
      newDate.setDate(new Date().getDate());
    }
    
    setDate(newDate);
  };

const eventStyleGetter = (event: any) => {
  const baseColor = event.color

  return {
    style: {
      backgroundColor: baseColor,
      color:  'white', // white text or grey text
      borderRadius: '6px',
      border: '1px solid #c7c7c7',
      padding: '4px',
      opacity: 1 ,
      transition: 'all 0.2s',
    },
  };
};


  const {defaultDate} = useMemo(() => ({
    defaultDate: new Date()
  }), [])
  const onView = useCallback((newView:View) => setView(newView), [setView])
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleNavigate('TODAY')}
            className="hover:cursor-pointer px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Today
          </button>
          <button 
            onClick={() => handleNavigate('PREV')}
            className="hover:cursor-pointer p-1.5 rounded-md hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
          <button 
            onClick={() => handleNavigate('NEXT')}
            className="hover:cursor-pointer p-1.5 rounded-md hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {format(date, view === 'day' ? 'MMMM d, yyyy' : view === 'week' ? 'MMMM yyyy' : 'MMMM yyyy')}
          </h2>
          <div className="mb-2">
            <select
              className="hover:cursor-pointer select select-primary"
              value={selectedRoomIdFilter || ''}
              onChange={e => setSelectedRoomIdFilter(e.target.value || undefined)}
            >
              <option value="">All Rooms</option>
              {allRooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex border border-gray-300 rounded-md overflow-hidden w-full sm:w-auto">
          <button 
            onClick={() => handleViewChange('day')}
            className={`hover:cursor-pointer flex-1 sm:flex-none px-3 py-1.5 text-sm ${view === 'day' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Day
          </button>
          <button 
            onClick={() => handleViewChange('work_week')}
            className={`hover:cursor-pointer flex-1 sm:flex-none px-3 py-1.5 text-sm ${view === 'work_week' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Week
          </button>
          <button 
            onClick={() => handleViewChange('month')}
            className={`hover:cursor-pointer flex-1 sm:flex-none px-3 py-1.5 text-sm ${view === 'month' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Month
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
        <div className="h-full calendar-container">
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={{
              day: true,
              week: true,
              month: true,
              work_week:true,
            }}
            view={view}
            date={date}
            onNavigate={(newDate:Date) => setDate(newDate)}
            defaultDate={defaultDate}
            defaultView={window.innerWidth < 768 ? 'day' : 'work_week'}
            onView={onView}
            onSelectEvent={onSelectEvent}
            onSelectSlot={onSelectSlot}
            selectable
            eventPropGetter={eventStyleGetter}
            toolbar={false}
            // ตั้งค่าเวลาเริ่มต้น (8:00 น.)
            min={new Date(0, 0, 0, 8, 0, 0)}
            // ตั้งค่าเวลาสิ้นสุด (19:00 น.)
            max={new Date(0, 0, 0, 19, 0, 0)}
            // ตั้งค่าช่วงเวลาที่แสดงในแต่ละช่อง (30 นาที)
            timeslots={2} // 2 = 30 นาที (60/2)
            formats={calendarFormats}
            components={{
              event: (props) => (
                <div className="p-1 text-sm truncate">
                  {props.title}
                </div>
              )
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;