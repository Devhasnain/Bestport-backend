const { QueueJobTypes } = require("../config/constants");
const notificationQueue = require("../queues/notificationQueue");
const {
  sendPushNotification,
  sendAdminPushNotification,
  testPushNotification,
} = require("../utils/sendPushNotification");

require("dotenv").config();

notificationQueue.process(async (job) => {
  const { type, data } = job?.data;

  if(type === QueueJobTypes.TEST){

    await testPushNotification(
      data?.token,
      data?.title,
      data?.body
    );
  }
 
  if (type === QueueJobTypes.NEW_JOB) {
    await sendPushNotification(
      data?.user,
      `Job Submitted Successfully!`,
      `Hi ${data?.user?.name}, your job has been submitted to the admin. An employee will be assigned shortly and will reach out to you soon.`,
      {
        image: data?.user?.profile_img ?? "",
        redirect: `JobDetail_${data?.jobId}`,
      }
    );

    await sendAdminPushNotification(
      "New Job Submitted",
      `${data?.user?.name} just submitted a new job on BestPort.`,
      {
        image: data?.user?.profile_img ?? "",
        redirect: `job/${data?.jobId}`,
      }
    );
  }

  if (type === QueueJobTypes.JOB_STARTED) {
    await sendAdminPushNotification(
      "Job In Progress",
      `${data?.customer?.name}'s job is now in progress. ${data?.employee?.name} has accepted the job ticket.`,
      {
        image: data?.employee?.profile_img ?? "",
        redirect: `job/${data?.jobId}`,
      }
    );

    await sendPushNotification(
      data?.customer,
      `Your Job is Now in Progress`,
      `Hi ${data?.customer?.name}, your job is now in progress. ${data?.employee?.name} has been assigned and will contact you shortly.`,
      {
        image: data?.employee?.profile_img ?? "",
        redirect: `JobDetail_${data?.jobId}`,
      }
    );
  }

  if (type === QueueJobTypes.NEW_TICKET) {
    await sendPushNotification(
      data?.employee,
      `New Job Assigned`,
      `Hi ${data?.employee?.name}, the admin has assigned you a new job. Please review the job details and proceed accordingly.`,
      {
        image: data?.employee?.profile_img ?? "",
        redirect: `JobDetail_${data?.jobId}`,
      }
    );
  }

  return { success: true };
});


notificationQueue.on("completed",async (job, result) => {
  console.log(`Job completed`);
  await job.remove();
  console.log(`Job completed and removed`);
});

notificationQueue.on("failed", (job, err) => {
  console.error("Job failed:", err);
});

notificationQueue.on("error", (err) => {
  console.error("Queue error:", err);
});