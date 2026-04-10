const { User } = require("../schemas");

module.exports = async function expireOfflineEmployees() {
  try {
    const cutoff = new Date(Date.now() - 90_000);

    const result = await User.updateMany(
      {
        is_online: true,
        last_heartbeat: { $lt: cutoff },
      },
      {
        $set: { is_online: false },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`[cron] Expired ${result.modifiedCount} stale employee(s)`);
    }
  } catch (err) {
    console.error('[cron] expireOfflineEmployees failed:', err.message);
  }
};