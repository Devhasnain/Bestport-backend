const connectDB = require("../config/db");
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
    await connectDB();
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
  try {
    await connectDB();
    const admins = await User.find({ role: "admin" });
    admins?.forEach(async (user) => {
      await Notification.create({
        recipient: user?._id,
        title,
        description: body,
        image: data?.image ?? "",
        redirect: data?.redirect,
      });

      if(user?.device?.fcm_token){

      const message = {
        notification: {
          title,
          body,
        },
        data: data,
        token: user?.device?.fcm_token,
      };

      await admin.messaging().send(message);
      }

    });
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const testPushNotification = async (token, title, body) => {
  const message = {
    notification: {
      title,
      body,
    },
    data: {},
    token: token,
  };

  try {
    await admin.messaging().send(message);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = {
  sendPushNotification,
  sendAdminPushNotification,
  testPushNotification,
};
