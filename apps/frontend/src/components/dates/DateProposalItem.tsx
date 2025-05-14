import React, { useState } from "react";
import { format } from "date-fns";
import DateResponseForm from "./DateResponseForm";
import DateReminderForm from "./DateReminderForm";
import { useAuth } from "@/hooks/useAuth";

const DateProposalItem = ({ proposal, onResponse }) => {
  const { auth } = useAuth();
  const currentUser = auth.user;
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);

  const isRecipient = currentUser.id === proposal.recipient_id;
  const isPending = proposal.status === "pending";

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">{proposal.title}</h3>
          <p className="text-sm text-gray-600">
            With: {proposal.proposer_first_name} {proposal.proposer_last_name}
          </p>
          <p className="text-sm text-gray-600">
            When: {format(new Date(proposal.proposed_date), "PPPp")}
          </p>
          <p className="text-sm text-gray-600">Where: {proposal.location}</p>
          <p className="mt-2">{proposal.description}</p>
          <p className="text-sm mt-2">
            Status: <span className="font-medium">{proposal.status}</span>
          </p>
        </div>
      </div>

      {isRecipient && isPending && !showResponseForm && (
        <button
          onClick={() => setShowResponseForm(true)}
          className="mt-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Respond
        </button>
      )}

      {showResponseForm && (
        <DateResponseForm
          proposalId={proposal.id}
          onSuccess={() => {
            setShowResponseForm(false);
            onResponse();
          }}
        />
      )}

      {proposal.status === "accepted" && (
        <button
          onClick={() => setShowReminderForm(!showReminderForm)}
          className="mt-2 inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {showReminderForm ? "Cancel" : "Set Reminder"}
        </button>
      )}

      {showReminderForm && (
        <DateReminderForm
          proposalId={proposal.id}
          proposedDate={proposal.proposed_date}
          onSuccess={() => setShowReminderForm(false)}
        />
      )}
    </div>
  );
};

export default DateProposalItem;
