const { Notification } = require("../schemas")
const { sendError, sendSuccess } = require("../utils")

exports.getNotifications = async (req,res)=>{
    try {
        const notifications = await Notification.find({recipient:req?.user?._id}).sort({ is_read: 1, createdAt: -1 }).exec();
        sendSuccess(res,'',{notifications})
    } catch (err) {
        return sendError(res,err.message)
    }
}

exports.deleteNotification = async (req,res)=>{
    try {
        if(!req.query?.id){
            throw new Error("Notification id is required.");
        }
        await Notification.findByIdAndDelete(req.query.id);
        sendSuccess(res,'Notification deleted successfully.',{})
    } catch (err) {
        return sendError(res,err.message)
    }
}

exports.setNotificationSeen = async (req,res)=>{
    try {
        if(!req.query?.id){
            throw new Error("Notification id is required.");
        }
        await Notification.findByIdAndUpdate(req.query?.id,{is_read:true})
        sendSuccess(res,'',{})
    } catch (err) {
        return sendError(res,err.message)
    }
}