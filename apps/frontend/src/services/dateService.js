import { axiosPrivate as api } from "@/api/axios";

export const proposeDate = async (dateData) => {
  return api.post("/dates/propose", dateData);
};

export const respondToDate = async (responseData) => {
  return api.post("/dates/respond", responseData);
};

export const getMyDates = async () => {
  return api.get("/dates/my-dates");
};

export const setDateReminder = async (reminderData) => {
  return api.post("/dates/reminders", reminderData);
};

export const getMutualMatches = async (userId) => {
  const page = 0;

  const limit = 5;
  const offset = page * limit;
  const response = await api.get(
    `/matching-profiles/${userId}?limit=${limit}&offset=${offset}`,
  );
  return response;
  // return api.get("/api/matching-profiles");
  // `/matching-profiles/${userId}?limit=${limit}&offset=${offset}`,
};
