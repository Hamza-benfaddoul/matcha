import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getMutualMatches } from "../services/dateService";
import UserDatesList from "../components/dates/UserDatesList";
import DateProposalForm from "../components/dates/DateProposalForm";

const DatesPage = () => {
  const { auth } = useAuth();
  const currentUser = auth.user;
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const response = await getMutualMatches(currentUser.id);
        setMatches(response.data.profiles || []);
      } catch (error) {
        // showToast("Failed to fetch matches", "error");
        console.error("Failed to fetch matches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [currentUser]);

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setShowProposalForm(true);
  };

  const handleProposalSuccess = () => {
    // showToast("Date proposal sent successfully!", "success");
    setShowProposalForm(false);
    setSelectedMatch(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Date Proposals</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
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
                <ul className="space-y-2">
                  {matches.map((match) => (
                    <li key={match.id}>
                      <button
                        onClick={() => handleSelectMatch(match)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedMatch?.id === match.id
                            ? "bg-indigo-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              match.profile_picture || "/default-profile.png"
                            }
                            alt={match.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {match.username}
                            </p>
                            <p className="text-xs text-gray-500">
                              {match.firstName} {match.lastName}
                            </p>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {showProposalForm && selectedMatch ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Propose Date to {selectedMatch.username}
                </h2>
              </div>
              <div className="p-4">
                <DateProposalForm
                  recipientId={selectedMatch.id}
                  onSuccess={handleProposalSuccess}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Your Date Proposals
                </h2>
              </div>
              <div className="p-4">
                <UserDatesList />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatesPage;
