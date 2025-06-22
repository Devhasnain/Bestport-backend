const admin = require("../config/firebase");
const { User } = require("../schemas");
const sendPushNotification = async (fcmToken, title, body, data = {}) => {
  const message = {
    notification: {
      title,
      body,
    },
    data,
    token: fcmToken,
  };

  try {
    await admin.messaging().send(message);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const sendAdminPushNotification = async (title, body, data = {}) => {
  const user = await User.findById("685578e00bd18789241c18ff");
  const message = {
    notification: {
      title,
      body,
    },
    data,
    token: user?.fcm_token,
  };

  try {
    await admin.messaging().send(message);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

module.exports = { sendPushNotification, sendAdminPushNotification };
