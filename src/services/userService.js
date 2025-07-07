const { User } = require("../schemas")

const editUserService = async (id, data)=>{
    return await User.findByIdAndUpdate(id, data, {new:true}).select(['-password'])
};

module.exports = {
    editUserService
}