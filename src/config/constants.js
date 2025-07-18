const JobStatus = {
  pending: "pending",
  assigned: "assigned",
  inProgress: "in-progress",
  completed: "completed",
  cancelled: "cancelled",
};

const JobTicketStatus = {
  assigned: "assigned",
  accepted: "accepted",
  expired: "expired",
  rejected: "rejected",
};

module.exports = {
  JobStatus,
  JobTicketStatus,
};
