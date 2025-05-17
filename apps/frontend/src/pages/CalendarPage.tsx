import React, { useEffect, useState } from "react";
import { getMyDates } from "@/services/dateService";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Tooltip } from "@radix-ui/react-tooltip";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await getMyDates();
        const acceptedDates = response.data.filter(
          (date) => date.status === "accepted",
        );

        const calendarEvents = acceptedDates.map((date) => ({
          id: date.id,
          title: date.title,
          start: new Date(date.proposed_date),
          end: new Date(
            new Date(date.proposed_date).getTime() + 2 * 60 * 60 * 1000,
          ),
          allDay: false,
          resource: {
            location: date.location,
            description: date.description,
            with:
              auth.user.id === date.recipient_id
                ? `${date.proposer_first_name} ${date.proposer_last_name}`
                : `${date.recipient_first_name} ${date.recipient_last_name}`,
            status: date.status,
          },
        }));

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Failed to fetch dates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, [auth.user.id]);

  const eventStyleGetter = (event) => {
    let backgroundColor = "#4299e1"; // blue-500
    if (event.resource.status === "pending") backgroundColor = "#ecc94b"; // yellow-500
    if (event.resource.status === "declined") backgroundColor = "#f56565"; // red-500

    const style = {
      backgroundColor,
      borderRadius: "6px",
      opacity: 0.9,
      color: "white",
      border: "0px",
      display: "block",
      fontSize: "0.875rem",
      padding: "2px 4px",
      marginBottom: "2px",
      overflow: "hidden",
      textOverflow: "ellipsis",
    };
    return { style };
  };

  const CustomTooltip = ({ event }) => (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
      <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
      <p className="text-sm text-gray-600 mt-1">
        <strong>With:</strong> {event.resource.with}
      </p>
      <p className="text-sm text-gray-600">
        <strong>When:</strong> {moment(event.start).format("LLLL")}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Location:</strong> {event.resource.location}
      </p>
      {event.resource.description && (
        <p className="text-sm text-gray-600 mt-2">
          <strong>Details:</strong> {event.resource.description}
        </p>
      )}
    </div>
  );

  const CustomEvent = ({ event }) => (
    <Tooltip content={<CustomTooltip event={event} />}>
      <div className="p-1 h-full">
        <div className="font-medium truncate">{event.title}</div>
        <div className="text-xs opacity-80 truncate">
          {moment(event.start).format("h:mm A")}
        </div>
      </div>
    </Tooltip>
  );

  const CustomWeekViewEvent = ({ event }) => (
    <Tooltip content={<CustomTooltip event={event} />}>
      <div className="p-1 h-full">
        <div className="font-medium truncate text-sm">{event.title}</div>
      </div>
    </Tooltip>
  );

  const CustomAgendaViewEvent = ({ event }) => (
    <div className="p-2 border-b border-gray-100">
      <h4 className="font-medium text-gray-900">{event.title}</h4>
      <p className="text-sm text-gray-600">
        {moment(event.start).format("h:mm A")} -{" "}
        {moment(event.end).format("h:mm A")}
      </p>
      <p className="text-sm text-gray-500">
        With {event.resource.with} at {event.resource.location}
      </p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Date Calendar</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setView(Views.MONTH)}
            className={`px-3 py-1 rounded-md ${view === Views.MONTH ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Month
          </button>
          <button
            onClick={() => setView(Views.WEEK)}
            className={`px-3 py-1 rounded-md ${view === Views.WEEK ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Week
          </button>
          <button
            onClick={() => setView(Views.DAY)}
            className={`px-3 py-1 rounded-md ${view === Views.DAY ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Day
          </button>
          <button
            onClick={() => setView(Views.AGENDA)}
            className={`px-3 py-1 rounded-md ${view === Views.AGENDA ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Agenda
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="p-4">
            <div style={{ height: 700 }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                eventPropGetter={eventStyleGetter}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                defaultView={Views.WEEK}
                components={{
                  event:
                    view === Views.AGENDA
                      ? CustomAgendaViewEvent
                      : view === Views.WEEK
                        ? CustomWeekViewEvent
                        : CustomEvent,
                }}
                onSelectEvent={(event) => {
                  setSelectedEvent(event);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {selectedEvent && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {selectedEvent.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {moment(selectedEvent.start).format("dddd, MMMM D [at] h:mm A")}
              </p>
              <p className="text-sm text-gray-600">
                With {selectedEvent.resource.with}
              </p>
              <p className="text-sm text-gray-600">
                Location: {selectedEvent.resource.location}
              </p>
              {selectedEvent.resource.description && (
                <p className="text-sm text-gray-600 mt-2">
                  {selectedEvent.resource.description}
                </p>
              )}
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Upcoming Dates ({events.filter((e) => e.start > new Date()).length})
        </h2>
        {events.filter((e) => e.start > new Date()).length === 0 ? (
          <p className="text-gray-500">No upcoming dates scheduled.</p>
        ) : (
          <div className="space-y-3">
            {events
              .filter((event) => event.start > new Date())
              .sort((a, b) => a.start - b.start)
              .slice(0, 5)
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div
                    className={`w-3 h-3 rounded-full mt-1.5 mr-3 ${event.resource.status === "accepted" ? "bg-green-500" : "bg-yellow-500"}`}
                  ></div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600">
                      {moment(event.start).format("dddd, MMMM D [at] h:mm A")}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      With {event.resource.with} • {event.resource.location}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
