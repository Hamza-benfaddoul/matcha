// services/socketService.js
io.on("connection", (socket) => {
  // ... existing connection logic

  // Date proposal events
  socket.on("accept_date", async (data) => {
    try {
      const proposal = await respondToDateProposal({
        date_proposal_id: data.proposal_id,
        responder_id: socket.user.id,
        response_status: "accepted",
      });

      io.to(`user_${proposal.proposer_id}`).emit("date_accepted", proposal);
    } catch (error) {
      console.error("Error accepting date:", error);
    }
  });

  // ... other date-related socket events
});
