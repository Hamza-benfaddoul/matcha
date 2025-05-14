import React, { useEffect, useState } from "react";
import { getMyDates } from "../../services/dateService";
import DateProposalItem from "./DateProposalItem";
import { useAuth } from "@/hooks/useAuth";

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
        // showNotification("Failed to load dates", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDates();
  }, [currentUser]);

  const handleResponse = async () => {
    try {
      const response = await getMyDates();
      setDates(response.data);
    } catch (error) {
      // showNotification("Failed to update dates", "error");
    }
  };

  if (loading) return <div>Loading dates...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Date Proposals</h2>
      {dates.length === 0 ? (
        <p>No date proposals yet.</p>
      ) : (
        <div className="space-y-4">
          {dates.map((date) => (
            <DateProposalItem
              key={date.id}
              proposal={date}
              onResponse={handleResponse}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDatesList;
