import React, { useState } from "react";
import { respondToDate } from "@/services/dateService";

const DateResponseForm = ({ proposalId, onSuccess }) => {
  const [response, setResponse] = useState({
    proposal_id: proposalId,
    response_status: "accepted",
    response_message: "",
  });

  const handleChange = (e) => {
    setResponse({ ...response, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await respondToDate(response);
      // showNotification("Response sent successfully!", "success");
      onSuccess();
    } catch (error) {
      // showNotification("Failed to send response", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Response
        </label>
        <select
          name="response_status"
          value={response.response_status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="accepted">Accept</option>
          <option value="declined">Decline</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Message (Optional)
        </label>
        <textarea
          name="response_message"
          value={response.response_message}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-1 px-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Submit Response
      </button>
    </form>
  );
};

export default DateResponseForm;
