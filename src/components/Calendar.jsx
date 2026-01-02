import { useState, useEffect } from "react";
import SectionHeader from "./SectionHeader";
import googleCalendarService from "../services/googleCalendar";
import { CALENDAR_CONFIG, isConfigured } from "../config/calendar";

export default function Calendar() {
  const [eventsByDay, setEventsByDay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const today = new Date();

  // Mock data fallback
  const mockEventsByDay = [
    [
      {
        id: 1,
        summary: "School Pickup",
        time: "2:30 pm",
        duration: 30,
        formattedDuration: "30 minutes",
      },
      {
        id: 2,
        summary: "Grocery Run",
        time: "3:30 pm",
        duration: 45,
        formattedDuration: "45 minutes",
      },
      {
        id: 3,
        summary: "Soccer Practice",
        time: "5:00 pm",
        duration: 90,
        formattedDuration: "1h30",
      },
    ],
    [
      {
        id: 4,
        summary: "Therapy Session",
        time: "10:00 am",
        duration: 60,
        formattedDuration: "1h",
      },
      {
        id: 5,
        summary: "Zoom Meeting",
        time: "11:30 am",
        duration: 30,
        formattedDuration: "30 minutes",
      },
      {
        id: 6,
        summary: "Pizza Friday",
        time: "6:00 pm",
        duration: 60,
        formattedDuration: "1h",
      },
    ],
    [
      {
        id: 7,
        summary: "Morning Run",
        time: "7:00 am",
        duration: 45,
        formattedDuration: "45 minutes",
      },
      {
        id: 8,
        summary: "Book Club with Really Long Name That Might Overflow",
        time: "4:00 pm",
        duration: 90,
        formattedDuration: "1h30",
      },
      {
        id: 9,
        summary: "Date Night",
        time: "7:30 pm",
        duration: 120,
        formattedDuration: "2h",
      },
    ],
  ];

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try real API first, fall back to mock data if needed

        if (!isConfigured()) {
          setEventsByDay(mockEventsByDay);
          setUsingMockData(true);
          setLoading(false);
          return;
        }

        // Initialize the calendar service
        const initialized = await googleCalendarService.initialize(
          CALENDAR_CONFIG.API_KEY,
          CALENDAR_CONFIG.CLIENT_ID
        );

        if (!initialized) {
          throw new Error('Failed to initialize calendar service');
        }

        // Fetch events from Google Calendar
        const events = await googleCalendarService.getEvents(
          CALENDAR_CONFIG.CALENDAR_ID,
          CALENDAR_CONFIG.MAX_RESULTS
        );

        // Group events by day (today, tomorrow, day after)
        const groupedEvents = googleCalendarService.groupEventsByDay(events);
        
        setEventsByDay(groupedEvents);
        setUsingMockData(false);

      } catch (err) {
        console.error('Error fetching calendar events:', err);
        setError(err.message);
        // Fallback to mock data on error
        setEventsByDay(mockEventsByDay);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarEvents();
  }, []);

  return (
    <section className="w-full mb-8">
      <SectionHeader 
        title={`Calendar ${usingMockData ? '(Demo)' : ''}`} 
        className="mb-4" 
      />

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800">
            Calendar sync issue: {error}. Showing demo data.
          </p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl px-6 pt-6 pb-6 overflow-x-auto h-[350px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#48AF55] mx-auto mb-2"></div>
              <p className="text-gray-500">Loading calendar events...</p>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-300 h-full">
          {eventsByDay.map((events, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() + index);
            const dateLabel = date.toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
            });
            const dayName = date.toLocaleDateString(undefined, {
              weekday: "long",
            });

            return (
              <div key={index} className={`${index === 2 ? 'pl-6 pr-2' : 'px-6'} flex flex-col h-full`}>
                <div className="text-base text-gray-500 font-medium leading-none">
                  {dayName}
                </div>
                <div className="text-xl font-serif font-bold text-black mb-3">
                  {dateLabel}
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  <div className="flex flex-col gap-2 pb-6">
                    {events.length === 0 ? (
                      <p className="text-base text-gray-500 italic">No events</p>
                    ) : (
                      events.map((event) => {
                        const isAllDay = event.time === "All day";
                        const startTime = isAllDay
                          ? new Date(date)
                          : new Date(`${date.toDateString()} ${event.time}`);
                        if (isAllDay) startTime.setHours(0, 0, 0, 0);
                        const endTime = new Date(startTime);
                        endTime.setMinutes(endTime.getMinutes() + event.duration);

                        const isPast = endTime < new Date();

                        return (
                          <div
                            key={event.id}
                            className={`w-full bg-[#0B3D42] rounded-md px-2 py-4 text-base text-white ${
                              isPast ? "opacity-70" : ""
                            }`}
                          >
                            <div className="relative">
                              <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#0B3D42] to-transparent pointer-events-none z-10" />
                              <div className="font-semibold text-lg truncate whitespace-nowrap overflow-hidden pr-10">
                                {event.summary}
                              </div>
                            </div>
                            <div className="text-sm">
                              {isAllDay
                                ? "All day"
                                : `${event.time} | ${event.formattedDuration}`}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </section>
  );
}
