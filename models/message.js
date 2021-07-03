const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    text : String,
    sender : {
        id: {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username : String
    },
    reciever : {
        id: {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username : String
    }
})

module.exports = mongoose.model("Message",messageSchema);