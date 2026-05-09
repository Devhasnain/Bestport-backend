const { HelpRequest } = require("../schemas");

exports.generateUniqueTicketId = async () => {
  let ticketId;
  let exists = true;
  while (exists) {
    const random = Math.floor(1000 + Math.random() * 9000);
    ticketId = `#TK-${random}`;
    const duplicate = await HelpRequest.findOne({ ticketId });
    if (!duplicate) exists = false;
  }
  return ticketId;
};