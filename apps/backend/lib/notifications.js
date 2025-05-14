// lib/notifications.js
const { sendPushNotification } = require("./pushNotifications");

// Create a simple socket manager if you don't have one
const activeSockets = {};

const getSocketForUser = (userId) => {
  return activeSockets[userId] || null;
};

const registerSocketForUser = (userId, socket) => {
  activeSockets[userId] = socket;
};

const unregisterSocketForUser = (userId) => {
  delete activeSockets[userId];
};

const sendDateNotification = async (userId, type, data) => {
  try {
    // Send via WebSocket if user is connected
    const userSocket = getSocketForUser(userId);
    if (userSocket) {
      userSocket.emit("date_notification", { type, data });
    }

    // Also send push notification
    await sendPushNotification(userId, {
      title: getNotificationTitle(type),
      body: getNotificationBody(type, data),
      data: { type, ...data },
    });
  } catch (error) {
    console.error("Notification error:", error);
  }
};

const getNotificationTitle = (type) => {
  switch (type) {
    case "new_proposal":
      return "New Date Proposal!";
    case "proposal_response":
      return "Date Proposal Response";
    case "reminder":
      return "Upcoming Date Reminder";
    default:
      return "New Date Activity";
  }
};

const getNotificationBody = (type, data) => {
  switch (type) {
    case "new_proposal":
      return "You have a new date proposal!";
    case "proposal_response":
      return data.response_status === "accepted"
        ? "Your date proposal was accepted!"
        : "Your date proposal was declined";
    case "reminder":
      return "You have a date coming up soon!";
    default:
      return "There is activity on your date proposal";
  }
};

module.exports = {
  sendDateNotification,
  getSocketForUser,
  registerSocketForUser,
  unregisterSocketForUser,
};
