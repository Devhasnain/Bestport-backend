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

const QueueJobTypes = {
  NEW_JOB:"NEW_JOB",
  JOB_STARTED:"JOB_STARTED",
  NEW_TICKET:"NEW_TICKET",
  TEST:"TEST",
  JOB_COMPLETED:"JOB_COMPLETED"
}

module.exports = {
  JobStatus,
  JobTicketStatus,
  QueueJobTypes
};
