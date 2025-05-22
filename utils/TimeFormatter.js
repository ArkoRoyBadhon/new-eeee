export const FormatMessageTime = (timestamp) => {
  if (!timestamp) return "";

  const messageDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if same day
  if (messageDate.toDateString() === today.toDateString()) {
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  // Check if yesterday
  else if (messageDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  // Otherwise show date
  else {
    return messageDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  }
};
