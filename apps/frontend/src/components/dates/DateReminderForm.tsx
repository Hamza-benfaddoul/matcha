import React, { useState } from "react";
import { setDateReminder } from "../../services/dateService";
// import { useNotification } from "../../context/NotificationContext";

const DateReminderForm = ({ proposalId, proposedDate, onSuccess }) => {
  const [reminderTime, setReminderTime] = useState("");
  // const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDateReminder({
        proposal_id: proposalId,
        reminder_time: reminderTime,
      });
      // showNotification("Reminder set successfully!", "success");
      onSuccess();
    } catch (error) {
      // showNotification("Failed to set reminder", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Remind me at
        </label>
        <input
          type="datetime-local"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          min={new Date().toISOString().slice(0, 16)}
          max={proposedDate}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-1 px-3 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Set Reminder
      </button>
    </form>
  );
};

export default DateReminderForm;
