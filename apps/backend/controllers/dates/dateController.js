// controllers/dates/dateController.js
const {
  createDateProposal,
  respondToDateProposal,
  getDateProposalsForUser,
  createDateReminder,
} = require("../../models/dates");
const { checkIfMatched, getDateProposalById } = require("../../models/matches");
const { sendDateNotification } = require("../../lib/notifications");

const proposeDate = async (req, res) => {
  try {
    const { recipient_id, title, description, proposed_date, location } =
      req.body;
    const proposer_id = req.userId;

    // Verify users are matched
    // const areMatched = await checkIfMatched(proposer_id, recipient_id);
    // if (!areMatched) {
    //   return res.status(403).json({ error: 'You can only propose dates to matched users' });
    // }

    const proposal = await createDateProposal({
      proposer_id,
      recipient_id,
      title,
      description,
      proposed_date,
      location,
    });

    // Send notification to recipient
    await sendDateNotification(recipient_id, "new_proposal", {
      proposer_id,
      proposal_id: proposal.id,
    });

    res.status(201).json(proposal);
  } catch (error) {
    console.error("Date proposal error:", error);
    res.status(500).json({ error: "Failed to create date proposal" });
  }
};

const respondToDate = async (req, res) => {
  try {
    const { proposal_id, response_status, response_message } = req.body;
    const responder_id = req.userId;

    const response = await respondToDateProposal({
      date_proposal_id: proposal_id,
      responder_id,
      response_status,
      response_message,
    });

    // Send notification to proposer
    const proposal = await getDateProposalById(proposal_id);
    await sendDateNotification(proposal.proposer_id, "proposal_response", {
      response_status,
      responder_id,
      proposal_id,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Date response error:", error);
    res.status(500).json({ error: "Failed to process date response" });
  }
};

const getUserDateProposals = async (req, res) => {
  try {
    const proposals = await getDateProposalsForUser(req.userId);
    res.status(200).json(proposals);
  } catch (error) {
    console.error("Get date proposals error:", error);
    res.status(500).json({ error: "Failed to get date proposals" });
  }
};

const setDateReminder = async (req, res) => {
  try {
    const { proposal_id, reminder_time } = req.body;

    // Verify user is part of this date
    const proposal = await getDateProposalById(proposal_id);
    if (
      proposal.proposer_id !== req.userId &&
      proposal.recipient_id !== req.userId
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to set reminder for this date" });
    }

    const reminder = await createDateReminder({
      date_proposal_id: proposal_id,
      user_id: req.userId,
      reminder_time,
    });

    res.status(201).json(reminder);
  } catch (error) {
    console.error("Set reminder error:", error);
    res.status(500).json({ error: "Failed to set date reminder" });
  }
};

module.exports = {
  proposeDate,
  respondToDate,
  getUserDateProposals,
  setDateReminder,
};
