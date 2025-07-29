const admin = require("../config/firebase");
const { User, Notification } = require("../schemas");
const sendPushNotification = async (user, title, body, data = {}) => {
  const message = {
    notification: {
      title,
      body,
    },
    data: data,
    token: user?.device?.fcm_token,
  };

  try {
    await Notification.create({
      recipient: user?._id,
      title,
      description: body,
      image: data?.image ?? "",
      redirect: data?.redirect ?? "",
    });
    await admin.messaging().send(message);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const sendAdminPushNotification = async (title, body, data = {}) => {
  const admins = await User.find({ role: "admin" });

  try {
    admins?.forEach(async (user) => {
      const message = {
        notification: {
          title,
          body,
        },
        data: data,

        token: user?.device?.fcm_token,
      };
      await Notification.create({
        recipient: user?._id,
        title,
        description: body,
        image: data?.image ?? "",
        redirect: data?.redirect,
      });
      await admin.messaging().send(message);
    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = { sendPushNotification, sendAdminPushNotification };
