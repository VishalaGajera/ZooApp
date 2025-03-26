const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

const adminSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        email_id: {
            type: String,
            required: true
        },
        password: {
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

adminSchema.plugin(autopopulate);

module.exports = mongoose.model("admins", adminSchema);