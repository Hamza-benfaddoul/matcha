import { useState } from "react";
import { respondToDate } from "@/services/dateService";

const DateResponseForm = ({ proposalId, onSuccess }) => {
  const [response, setResponse] = useState({
    proposal_id: proposalId,
    response_status: "accepted",
    response_message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setResponse({ ...response, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await respondToDate(response);
      onSuccess();
    } catch (error) {
      console.error("Failed to send response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Your Response
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() =>
                setResponse({ ...response, response_status: "accepted" })
              }
              className={`flex-1 py-2 px-4 rounded-l-md border ${response.response_status === "accepted" ? "bg-green-500 text-white border-green-600" : "bg-white text-gray-700 border-gray-300"}`}
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() =>
                setResponse({ ...response, response_status: "declined" })
              }
              className={`flex-1 py-2 px-4 rounded-r-md border ${response.response_status === "declined" ? "bg-red-500 text-white border-red-600" : "bg-white text-gray-700 border-gray-300"}`}
            >
              Decline
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Message (Optional)
          </label>
          <textarea
            name="response_message"
            value={response.response_message}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Add a personal message..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
            response.response_status === "accepted"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            response.response_status === "accepted"
              ? "focus:ring-green-500"
              : "focus:ring-red-500"
          } ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </span>
          ) : (
            `Confirm ${response.response_status === "accepted" ? "Acceptance" : "Decline"}`
          )}
        </button>
      </div>
    </form>
  );
};

export default DateResponseForm;
