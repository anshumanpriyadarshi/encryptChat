const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username : String,
    password : String,

    message : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }]
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);