import { useState } from "react";
import { format } from "date-fns";
import DateResponseForm from "./DateResponseForm";
import { useAuth } from "@/hooks/useAuth";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const DateProposalItem = ({ proposal, onResponse }) => {
  const { auth } = useAuth();
  const currentUser = auth.user;
  const [showResponseForm, setShowResponseForm] = useState(false);

  const isRecipient = currentUser.id === proposal.recipient_id;
  const isPending = proposal.status === "pending";

  const handleAddToCalendar = () => {
    const startDate = new Date(proposal.proposed_date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours

    const calendarEvent = {
      title: proposal.title,
      description: proposal.description,
      location: proposal.location,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    };

    // Create Google Calendar link
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarEvent.title)}&dates=${format(startDate, "yyyyMMdd'T'HHmmss")}/${format(endDate, "yyyyMMdd'T'HHmmss")}&details=${encodeURIComponent(calendarEvent.description)}&location=${encodeURIComponent(calendarEvent.location)}`;

    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col">
        <div className="flex justify-between items-start flex-wrap">
          <h3 className="text-lg font-medium text-gray-900 break-words max-w-full">
            {proposal.title}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              statusColors[proposal.status]
            }`}
          >
            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
          </span>
        </div>

        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-gray-400 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-gray-600">
              {format(
                new Date(proposal.proposed_date),
                "EEEE, MMMM d, yyyy 'at' h:mm a",
              )}
            </span>
          </div>

          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-gray-400 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="break-all text-sm text-gray-600 whitespace-pre-wrap">
              {proposal.location}
            </span>
          </div>
        </div>

        {proposal.description && (
          <div className="mt-3 max-h-32 overflow-auto pr-2">
            <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
              {proposal.description}
            </p>
          </div>
        )}

        <div className="mt-3  pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            {isRecipient ? (
              <div className="flex items-center w-full ">
                <div className="flex-1">
                  <span className="font-medium text-gray-900">
                    Proposed by:{" "}
                  </span>
                  <span className="font-medium ">
                    {proposal.proposer_first_name} {proposal.proposer_last_name}
                  </span>
                </div>
                <a href={`/profile/${proposal.proposer_id}`} className="block">
                  <img
                    src={
                      proposal.proposer_profile_picture.startsWith("/")
                        ? `/api${proposal.proposer_profile_picture}`
                        : proposal.proposer_profile_picture
                    }
                    alt={proposal.username}
                    className="w-16 h-16 shadow-md rounded-full object-cover border-2 border-primary shadow-md"
                  />
                </a>
              </div>
            ) : (
              <div className="flex items-center w-full ">
                <div className="flex-1">
                  <span className="font-medium text-gray-900">
                    Proposed to:{" "}
                  </span>
                  <span className="font-medium ">
                    {proposal.recipient_first_name}{" "}
                    {proposal.recipient_last_name}
                  </span>
                </div>
                <a href={`/profile/${proposal.recipient_id}`} className="block">
                  <img
                    src={
                      proposal.recipient_profile_picture.startsWith("/")
                        ? `/api${proposal.recipient_profile_picture}`
                        : proposal.recipient_profile_picture
                    }
                    alt={proposal.username}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                  />
                </a>
              </div>
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        {isRecipient && isPending && !showResponseForm && (
          <button
            onClick={() => setShowResponseForm(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Respond
          </button>
        )}

        {proposal.status === "accepted" && (
          <button
            onClick={handleAddToCalendar}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add to Calendar
          </button>
        )}
      </div>

      {showResponseForm && (
        <div className="mt-4">
          <DateResponseForm
            proposalId={proposal.id}
            onSuccess={() => {
              setShowResponseForm(false);
              onResponse();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DateProposalItem;
