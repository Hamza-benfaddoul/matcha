import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getMutualMatches } from "../services/dateService";
import UserDatesList from "../components/dates/UserDatesList";
import DateProposalForm from "../components/dates/DateProposalForm";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Tab } from "@headlessui/react";

const DatesPage = () => {
  const { auth } = useAuth();
  const currentUser = auth.user;
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const response = await getMutualMatches(currentUser.id);
        setMatches(response.data.profiles || []);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [currentUser]);

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handleProposalSuccess = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Date Proposals
        </h1>

        {/* Enhanced Matches Scroll */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Your Matches
            </h2>
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : matches.length === 0 ? (
              <p className="text-sm text-gray-500">No matches yet.</p>
            ) : (
              <div className="relative">
                <div className="flex space-x-4 pb-4 overflow-x-auto scrollbar-hide">
                  {matches.map((match) => (
                    <button
                      key={match.id}
                      onClick={() => handleSelectMatch(match)}
                      className="flex flex-col items-center flex-shrink-0 w-24 transition-transform hover:scale-105"
                    >
                      <div className="relative mb-2">
                        <img
                          src={match.profile_picture || "/default-profile.png"}
                          alt={match.username}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <p className="text-xs font-medium text-gray-900 truncate w-full text-center">
                        {match.firstName}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Date Proposals Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <UserDatesList />
      </div>

      {/* Proposal Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsModalOpen(false)}
          static // Add this to prevent closing on outside click
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Propose Date to {selectedMatch?.username}
                  </Dialog.Title>
                  <div className="mt-4">
                    <DateProposalForm
                      recipientId={selectedMatch?.id}
                      onSuccess={handleProposalSuccess}
                      onCancel={() => setIsModalOpen(false)}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default DatesPage;
