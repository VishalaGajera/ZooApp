const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

const userSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        mobile: {
            type: String,
            required: true
        },
        email_id: {
            type: String,
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        otp: {
            type: String
        },
        otpExpiration: { type: Date, required: false }
    },
    { timestamps: true }
);

userSchema.plugin(autopopulate);

module.exports = mongoose.model("users", userSchema);