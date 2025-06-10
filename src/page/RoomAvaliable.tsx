import React, { Component, useRef, useState } from "react";
import { useRoomContext } from "../context/RoomContext";
import { format } from "date-fns";
import { bookings } from "../data/dummyData";
import { formatInTimeZone } from "date-fns-tz";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Booking {
  title: string;
  start: string; // ISO string
  end: string; // ISO string
}

interface Segment {
  start: Date;
  end: Date;
  isBooked: boolean;
  booking?: Booking;
}

const formatTime = (dateStr: string | Date) => {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return formatInTimeZone(date, "UTC", "HH:mm");
};

const RoomAvaliable: React.FC = () => {
  const { allBookings, allRooms, selectedFactories, factorie } =
    useRoomContext();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeSegmentKey, setActiveSegmentKey] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleSegment = (key: string) => {
    setActiveSegmentKey((prev) => (prev === key ? null : key));
  };

  const navigateDate = (direction: string) => {
    setSelectedDate((prev) => addDays(prev, direction === "next" ? 1 : -1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const addDays = (date: any, days: any) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const startOfDay = (date: any) => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  };

  const endOfDay = (date: any) => {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  };

  const getRoomBookings = (roomId: any) => {
    return allBookings.filter((item) => item.roomId == roomId);
  };

  const getListBookingToday = (roomId: any) => {
    const selectedDateStart = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        0,
        0,
        0,
        0
      )
    );

    const selectedDateEnd = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        23,
        59,
        59,
        999
      )
    );

    return allBookings.filter((item) => {
      const bookingStart = new Date(item.start);
      const bookingEnd = new Date(item.end);

      return (
        item.roomId == roomId &&
        bookingEnd >= selectedDateStart &&
        bookingStart <= selectedDateEnd
      );
    });
  };

  const getTimelineSegments = (roomId: any) => {
    const roomBookings = getRoomBookings(roomId);

    const parsedBookings = roomBookings.map((booking) => ({
      ...booking,
      start: new Date(booking.start), // ISO strings, so UTC by default
      end: new Date(booking.end),
    }));

    const segments = [];
    const totalMinutes = 11 * 60;

    // แปลง selectedDate เป็น UTC 00:00:00
    const utcDate = new Date(
      Date.UTC(
        selectedDate.getUTCFullYear(),
        selectedDate.getUTCMonth(),
        selectedDate.getUTCDate()
      )
    );

    for (let minute = 0; minute < totalMinutes; minute += 30) {
      const currentTime = new Date(utcDate);
      currentTime.setUTCHours(8, minute, 0, 0); // เริ่มที่ 08:00 UTC

      const nextTime = new Date(currentTime);
      nextTime.setUTCMinutes(nextTime.getUTCMinutes() + 30);

      const booking = parsedBookings.find(
        (b) => currentTime < b.end && nextTime > b.start
      );

      segments.push({
        start: currentTime,
        end: nextTime,
        isBooked: !!booking,
        booking: booking || null,
      });
    }

    return segments;
  };

  const handleSelectFactory = (factory: string) => {
    selectedFactories(factory);

    // โฟกัสกลับไปยังปุ่มแล้ว blur
    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
    }, 0);
  };

  return (
    <>
      <div className="container max-w-[1200px]">
        {/* Date Navigation */}
        <div className="flex items-center justify-center space-x-3 px-4 py-3 bg-white border-b">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Today
          </button>
          <input
            type="date"
            className="input w-40"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />

          <button
            onClick={() => navigateDate("prev")}
            className="p-1.5 rounded-md hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
          <span className="text-base font-semibold text-gray-800 text-center min-w-0 flex-1 lg:min-w-[200px] lg:flex-none">
            {format(selectedDate, "EEE, MMM d, yyyy")}
          </span>
          <button
            onClick={() => navigateDate("next")}
            className="p-1.5 rounded-md hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </button>
          {user?.factorie == "All" && (
            <div className="dropdown dropdown-bottom">
              <div
                tabIndex={0}
                role="button"
                className="hover:cursor-pointer px-3 py-1 text-sm bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 w-[80px] hover:text-black"
                ref={dropdownRef}
              >
                {" "}
                {factorie ? factorie : "Choose Factory"} ⬇️
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                {["All", "YPT", "GNX"].map((factory) => (
                  <li key={factory}>
                    <a
                      onClick={() => handleSelectFactory(factory)}
                      className={
                        factorie === factory
                          ? "active bg-primary text-white"
                          : ""
                      }
                    >
                      {factory}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {allRooms.map((item) => {
          const segments = getTimelineSegments(item.id);
          const roomBookingsForDay = getListBookingToday(item.id);
          return (
            <div className="card bg-base-100 shadow-sm mx-auto mb-3">
              <div className="card-body bg-white">
                <div className="flex flex-row">
                  <div className="flex pr-5">
                    <div className="max-h-28 max-w-40 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <h2 className="card-title">
                      {item.name}
                      <div className="badge badge-accent text-white">
                        {item.factory}
                      </div>
                    </h2>

                    <div className="flex flex-row py-2 mt-1 ">
                      {item.amenities.map((item) => {
                        return (
                          <div className="badge badge-primary text-white mr-1 text-xs">
                            {item}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row w-full">
                  <div className="flex flex-col w-full">
                    <div className="mt-3 w-full">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2"></div>
                      <div className=" w-full overflow-auto ">
                        <div className="flex h-6 min-w-[1100px] rounded overflow-hidden border border-gray-200 text-[10px] text-white">
                          {segments.map((segment, index) => {
                            const key = `${
                              item.id
                            }-${segment.start.toISOString()}`;
                            const isBooked = segment.isBooked;
                            const timeLabel = formatInTimeZone(
                              segment.start,
                              "UTC",
                              "HH:mm"
                            );

                            return (
                              <div
                                key={key}
                                onClick={() => toggleSegment(key)}
                                className={`flex-1 min-w-[48px] relative cursor-pointer flex items-center justify-center ${
                                  isBooked
                                    ? "bg-red-400 hover:bg-red-600"
                                    : "bg-green-400 hover:bg-green-600"
                                }`}
                                title={
                                  isBooked && segment.booking
                                    ? `${segment.booking.title} (${formatTime(
                                        segment.booking.start
                                      )} - ${formatTime(segment.booking.end)})`
                                    : `Available (${formatInTimeZone(
                                        segment.start,
                                        "UTC",
                                        "HH:mm"
                                      )} - ${formatInTimeZone(
                                        segment.end,
                                        "UTC",
                                        "HH:mm"
                                      )})`
                                }
                              >
                                {/* Label เวลา */}
                                {index % 4 === 0 && (
                                  <span className="absolute bottom-1/4 left-0 right-0 text-center text-[10px] leading-none text-black">
                                    {timeLabel}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* แสดงรายละเอียดเมื่อคลิก */}
                        {segments.map((segment) => {
                          const key = `${
                            item.id
                          }-${segment.start.toISOString()}`;
                          if (key !== activeSegmentKey) return null;

                          return (
                            <div
                              className="min-w-[1100px]"
                              key={`wrapper-${key}`}
                            >
                              <div
                                key={`detail-${key}`}
                                className="sticky bottom-0 left-0 bg-white px-2 py-1 shadow z-10 w-fit border rounded"
                                // หากอยากติดบนแทน ให้เปลี่ยน bottom-0 เป็น top-0
                              >
                                {segment.isBooked && segment.booking ? (
                                  <>
                                    <div>
                                      <strong>{segment.booking.title}</strong>
                                    </div>
                                    <div>
                                      {formatTime(segment.booking.start)} -{" "}
                                      {formatTime(segment.booking.end)}
                                    </div>
                                  </>
                                ) : (
                                  <div>
                                    Available:{" "}
                                    {formatInTimeZone(
                                      segment.start,
                                      "UTC",
                                      "HH:mm"
                                    )}{" "}
                                    -{" "}
                                    {formatInTimeZone(
                                      segment.end,
                                      "UTC",
                                      "HH:mm"
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/*  */}
                    {roomBookingsForDay.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Today's bookings:
                        </p>
                        <div className="space-y-1">
                          {roomBookingsForDay.slice(0, 2).map((booking) => (
                            <div
                              key={booking.id}
                              className="text-xs text-gray-600"
                            >
                              <span className="font-medium">
                                {booking.title}
                              </span>
                              <span className="ml-2">
                                {formatTime(booking.start)} -{" "}
                                {formatTime(booking.end)}
                              </span>
                            </div>
                          ))}
                          {roomBookingsForDay.length > 2 && (
                            <div className="dropdown">
                              <p
                                tabIndex={0}
                                role="button"
                                className="text-xs text-white bg-gray-400 rounded-md px-1 py-0.5 cursor-pointer"
                              >
                                +{roomBookingsForDay.length - 2} more
                              </p>
                              <div
                                tabIndex={0}
                                className="dropdown-content card card-sm bg-base-100 z-1 w-64 shadow-md"
                              >
                                <div className="card-body">
                                  {roomBookingsForDay.map(
                                    (item, index) =>
                                      index >= 2 && ( // ข้าม index 0 และ 1
                                        <div key={item.id}>
                                          {/* เนื้อหา JSX ของคุณ */}
                                          <span className="font-medium">
                                            {item.title}
                                          </span>
                                          <span className="ml-2">
                                            {formatTime(item.start)} -{" "}
                                            {formatTime(item.end)}
                                          </span>
                                        </div>
                                      )
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* {showDayModal && selectedDate && (
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
                {format(selectedDate, "MMMM d, yyyy")}
              </h3>
              {defaultRoom == null && (
                <button
                  className="btn btn-primary text-white ml-3"
                  onClick={showSelectRoom}
                >
                  Select Room
                </button>
              )}
            </div>

            <div
              className="p-4 overflow-y-auto h-[600px]"
              style={{ maxHeight: "calc(90vh - 64px)" }}
            >
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
                timeZone="Asia/Bangkok"
                // เพิ่มการตั้งค่ารูปแบบเวลาแบบ 24 ชั่วโมงที่นี่
                slotLabelFormat={{
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                  meridiem: false,
                  timeZone: "UTC", // ระบุ timezone ในรูปแบบเวลา
                }}
                eventTimeFormat={{
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                  meridiem: false,
                  timeZone: "UTC", // ระบุ timezone ในรูปแบบเวลา
                }}
                eventContent={(eventInfo: EventContentArg) => {
                  const foundEvent = fullCalendarEvents.find(
                    (item) => item.id == eventInfo.event.id
                  );

                  const isAllDay = eventInfo.event.allDay;

                  const timeFormat: Intl.DateTimeFormatOptions = {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "UTC",
                  };

                  let startStr = formatInTimeZone(
                    eventInfo.event.startStr,
                    "UTC",
                    "dd/MM HH:mm"
                  );
                  let endStr = formatInTimeZone(
                    eventInfo.event.endStr,
                    "UTC",
                    "dd/MM HH:mm"
                  );
                  let title = eventInfo.event.title
                    ? eventInfo.event.title
                    : "No Title";
                  if (foundEvent?.start) {
                    startStr = new Date(foundEvent.start)
                      .toLocaleString("en-GB", timeFormat)
                      .replace(",", "");
                  }

                  if (foundEvent?.end) {
                    const endDate = new Date(foundEvent.end);
                    if (isAllDay) {
                      endDate.setDate(endDate.getDate() - 1); // ✅ ลด 1 วันเฉพาะ allDay เพื่อไม่ให้เกิน
                    }
                    endStr = endDate
                      .toLocaleString("en-GB", timeFormat)
                      .replace(",", "");
                  }

                  return (
                    <div className="px-1 py-0.5 text-[14px] truncate leading-tight overflow-hidden bg-black/50">
                      {startStr} - {endStr} : {title}
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default RoomAvaliable;
