const { Ticket } = require("../schemas")

exports.getJobTicketService=async(query={})=>{
    return await Ticket.findOne(query);
}