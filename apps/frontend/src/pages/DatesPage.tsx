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

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await getMutualMatches(auth.user.id);
        console.log("Fetched matches:", response.data);
        setMatches(response.data.profiles);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      }
    };

    fetchMatches();
  }, [currentUser]);

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setShowProposalForm(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Date Proposals</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Your Matches</h2>
            {matches.length === 0 ? (
              <p>No matches yet.</p>
            ) : (
              <ul className="space-y-2">
                {matches.map((match) => (
                  <li key={match.id}>
                    <button
                      onClick={() => handleSelectMatch(match)}
                      className={`w-full text-left p-2 rounded ${selectedMatch?.id === match.id ? "bg-indigo-100" : "hover:bg-gray-100"}`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={match.profile_picture || "/default-profile.png"}
                          alt={match.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <span>{match.username}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {showProposalForm && selectedMatch ? (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4">
                Propose Date to {selectedMatch.username}
              </h2>
              <DateProposalForm
                recipientId={selectedMatch.id}
                onSuccess={() => {
                  setShowProposalForm(false);
                  setSelectedMatch(null);
                }}
              />
            </div>
          ) : (
            <UserDatesList />
          )}
        </div>
      </div>
    </div>
  );
};

export default DatesPage;
