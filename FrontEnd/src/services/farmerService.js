import { practiceLogs } from "../data/practiceLogs";

// Swap these bodies for axiosInstance calls once Spring Boot is ready —
// the pages that use them will not need to change.

export const getPracticeLogs = async () => {
  return Promise.resolve(practiceLogs);
};

export const submitPractice = async (practiceData) => {
  const newLog = {
    id: Date.now(),
    ...practiceData,
    status: "pending",
    submittedLabel: "Submitted just now",
  };
  practiceLogs.unshift(newLog);
  return Promise.resolve(newLog);
};

// Mock canned replies — swapped for a real Gemini-backed endpoint later.
// conversationHistory is accepted now so the backend contract is already
// correct: a multi-turn chatbot needs prior messages for context, and
// AIAssistant.jsx already sends the full array on every call.
const MOCK_REPLIES = {
  default:
    "That's a great question! Once I'm connected to the backend, I'll be able to give you a personalized answer based on your farm's data.",
};

export const sendChatMessage = async (message, conversationHistory) => {
  // Simulated network delay so the "typing" indicator feels real
  await new Promise((resolve) => setTimeout(resolve, 900));

  // Later:
  // const { data } = await axiosInstance.post("/api/chatbot/ask", {
  //   message,
  //   history: conversationHistory,
  // });
  // return data.reply;

  return MOCK_REPLIES.default;
};