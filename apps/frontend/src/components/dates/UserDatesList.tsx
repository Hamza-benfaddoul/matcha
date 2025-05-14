import { useEffect, useState } from "react";
import { getMyDates } from "@/services/dateService";
import DateProposalItem from "./DateProposalItem";
import { useAuth } from "@/hooks/useAuth";
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react";

const UserDatesList = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();
  const currentUser = auth.user;

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await getMyDates();
        setDates(response.data);
      } catch (error) {
        console.error("Failed to load dates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, [auth.user]);

  const handleResponse = async () => {
    try {
      const response = await getMyDates();
      setDates(response.data);
    } catch (error) {
      console.error("Failed to update dates:", error);
    }
  };

  const categorizedDates = {
    awaiting: dates.filter(
      (date) =>
        date.status === "pending" && date.recipient_id === currentUser.id,
    ),
    pending: dates.filter(
      (date) =>
        date.status === "pending" && date.proposer_id === currentUser.id,
    ),
    accepted: dates.filter((date) => date.status === "accepted"),
    declined: dates.filter((date) => date.status === "declined"),
  };

  const tabColors = {
    awaiting: "bg-purple-100 text-purple-800",
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
  };

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );

  return (
    <div>
      <TabGroup className="p-4">
        <TabList className="flex space-x-1 p-1 bg-gray-50 rounded-lg">
          {Object.entries(categorizedDates).map(([status, dates]) => (
            <Tab
              key={status}
              className={({ selected }) =>
                `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  selected
                    ? `${tabColors[status]} shadow-sm`
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <div className="flex items-center">
                <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                {dates.length > 0 && (
                  <span className="ml-1.5 py-0.5 px-1.5 rounded-full text-xs font-medium bg-white bg-opacity-60">
                    {dates.length}
                  </span>
                )}
              </div>
            </Tab>
          ))}
        </TabList>
        <TabPanels className="mt-4">
          {Object.entries(categorizedDates).map(([status, dates]) => (
            <TabPanel key={status}>
              <div className="space-y-4">
                {dates.length === 0 ? (
                  <div className="text-center  py-8 bg-gray-50 rounded-lg">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No {status} dates
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {status === "awaiting"
                        ? "You don't have any dates waiting for your response"
                        : status === "pending"
                          ? "Your proposed dates will appear here"
                          : `You don't have any ${status} dates`}
                    </p>
                  </div>
                ) : (
                  dates.map((date) => (
                    <DateProposalItem
                      key={date.id}
                      proposal={date}
                      onResponse={handleResponse}
                    />
                  ))
                )}
              </div>
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default UserDatesList;
