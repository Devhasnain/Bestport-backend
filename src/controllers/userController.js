const { User } = require("../schemas");
const { sendError, sendSuccess } = require("../utils")

exports.getUserProfile = async(req,res)=>{
    try {
        const id = req.query.id;
        if(!id){
            throw new Error("Parameter id is required");
        }

        const user = await User.findById(id).select(['-password','-device','-is_available','-is_active','-is_locked','-address','-email']).populate({
            path:"reviews",
            select:['rating','comment']
        });

    sendSuccess(res, "New product created successfully.", user, 200);

    } catch (error) {
        sendError(res,error.message)
    }
}