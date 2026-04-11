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



// module.exports = async function expireOfflineEmployees() {
//   try {
//     const cutoff = new Date(Date.now() - 90_000);

//     // 👇 Pehle check karo kitne online hain aur unka last_heartbeat kya hai
//     const onlineUsers = await User.find({ is_online: true }).select('name last_heartbeat');
//     console.log(`[cron] Online users: ${onlineUsers.length}`);
//     onlineUsers.forEach(u => {
//       const secondsAgo = u.last_heartbeat 
//         ? Math.floor((Date.now() - new Date(u.last_heartbeat)) / 1000)
//         : 'NULL';
//       console.log(`  → ${u.name} | last_heartbeat: ${secondsAgo}s ago`);
//     });
//     console.log(`[cron] Cutoff: anything older than 90s`);

//     const result = await User.updateMany(
//       { is_online: true, last_heartbeat: { $lt: cutoff } },
//       { $set: { is_online: false } }
//     );

//     console.log(`[cron] Modified: ${result.modifiedCount}`);

//   } catch (err) {
//     console.error('[cron] expireOfflineEmployees failed:', err.message);
//   }
// };