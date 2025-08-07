import SectionHeader from "./SectionHeader";

export default function Calendar() {
  const today = new Date();

  const eventsByDay = [
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

  return (
    <section className="w-full mb-8">
      <SectionHeader title="Calendar" className="mb-4" />

      <div className="bg-white rounded-[16px] shadow-calendar px-6 pt-4 pb-6 overflow-x-auto h-[350px]">
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
              <div key={index} className="px-6 flex flex-col h-full">
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
                        const startTime = new Date(
                          `${date.toDateString()} ${event.time}`
                        );
                        const endTime = new Date(startTime);
                        endTime.setMinutes(endTime.getMinutes() + event.duration);

                        const isPast = endTime < new Date();

                        return (
                          <div
                            key={event.id}
                            className={`bg-[#DED2CF] rounded-md px-4 py-4 text-base text-black ${
                              isPast ? "opacity-70" : ""
                            }`}
                          >
                            <div className="relative">
                              <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#DED2CF] to-transparent pointer-events-none z-10" />
                              <div className="font-semibold text-lg truncate whitespace-nowrap overflow-hidden pr-10">
                                {event.summary}
                              </div>
                            </div>
                            <div className="text-sm">
                              {event.time} | {event.formattedDuration}
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
      </div>
    </section>
  );
}
