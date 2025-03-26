const Joi = require("joi");
const Admin = require("../Models/AdminModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { sendMail } = require("../Services/mailServices");

const adminValidationSchema = Joi.object({
    first_name: Joi.string().pattern(/^[A-Za-z]+$/).required().messages({
        'string.base': 'First Name should be a valid text with letters only.',
        'string.pattern.base': 'First Name should be a valid text with letters only.',
        'any.required': 'First Name is required.'
    }),
    last_name: Joi.string().pattern(/^[A-Za-z]+$/).required().messages({
        'string.base': 'Last Name should be a valid text with letters only.',
        'string.pattern.base': 'Last Name should be a valid text with letters only.',
        'any.required': 'Last Name is required.'
    }),
    password: Joi.string().min(5).max(15).required().messages({
        'string.base': 'Password should be a valid String.',
        'string.min': 'Password must be at least 5 digits long.',
        'string.max': 'Password must be no more than 12 digits long.',
        'any.required': 'Password is required.'
    }),
    email_id: Joi.string().email().required().messages({
        'string.base': 'Email should be a valid email address.',
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email Address is required.'
    })
});

const passwordChangeSchema = Joi.object({
    oldPwd: Joi.string().min(6).required().messages({
        'string.base': 'Old password should be a string.',
        'string.min': 'Old password should be at least 6 characters long.',
        'any.required': 'Old password is required.'
    }),
    newPwd: Joi.string().min(6).required().messages({
        'string.base': 'New password should be a string.',
        'string.min': 'New password should be at least 6 characters long.',
        'any.required': 'New password is required.'
    })
});

const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

exports.registerAdmin = async (req, res) => {
    try {
        const { error } = adminValidationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(err => err.message).join(', ')
            });
        }

        const existingAdmin = await Admin.findOne({ email_id: req.body.email_id, isDeleted: false });
        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: `Email Id is already Registered`,
            });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            const newAdmin = new Admin({
                ...req.body,
                password: hashedPassword
            });

            await newAdmin.save();
            res.status(201).json({
                success: true,
                message: "Registration successfully",
                data: newAdmin
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        const adminValidationSchema = Joi.object({
            password: Joi.string().min(5).max(12).required().messages({
                'string.base': 'Password should be a valid String.',
                'string.min': 'Password must be at least 5 digits long.',
                'string.max': 'Password must be no more than 12 digits long.',
                'any.required': 'Password is required.'
            }),
            email_id: Joi.string().email().required().messages({
                'string.base': 'Email should be a valid email address.',
                'string.email': 'Please provide a valid email address.',
                'any.required': 'Email Address is required.'
            })
        });

        const { error } = adminValidationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessages = error.details.map(err => err.message).join(', ');
            return res.status(400).json({
                success: false,
                message: errorMessages
            });
        }
        const admin = await Admin.findOne({ email_id: req.body.email_id, isDeleted: false });
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Email Id not registered with us."
            });
        }
        const isMatch = await bcrypt.compare(req.body.password, admin.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            message: "Login successfully",
            token: token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAdmins = async (req, res) => {
    try {
        const adminId = req.query.id || "";
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;

        const skip = (page - 1) * pageSize;
        const query = adminId ? { _id: adminId, isDeleted: false } : { isDeleted: false };

        const admins = await Admin.find(query)
            .skip(skip)
            .limit(pageSize)
            .exec();

        if (admins.length > 0) {
            const totalAdmins = await Admin.countDocuments(query);
            res.status(201).json({
                success: true,
                data: admins,
                totalRecords: totalAdmins,
                totalPages: Math.ceil(totalAdmins / pageSize),
                currentPage: page,
            });
        } else {
            res.status(201).json({
                success: false,
                message: "Admin Data Not Available"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateAdmin = async (req, res) => {
    try {
        const adminValidationSchema = Joi.object({
            first_name: Joi.string().pattern(/^[A-Za-z]+$/).required().messages({
                'string.base': 'First Name should be a valid text with letters only.',
                'string.pattern.base': 'First Name should be a valid text with letters only.',
                'any.required': 'First Name is required.'
            }),
            last_name: Joi.string().pattern(/^[A-Za-z]+$/).required().messages({
                'string.base': 'Last Name should be a valid text with letters only.',
                'string.pattern.base': 'Last Name should be a valid text with letters only.',
                'any.required': 'Last Name is required.'
            }),
            email_id: Joi.string().email().required().messages({
                'string.base': 'Email should be a valid email address.',
                'string.email': 'Please provide a valid email address.',
                'any.required': 'Email Address is required.'
            })
        });

        const adminId = req.params.id;
        const { error } = adminValidationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(err => err.message).join(', ')
            });
        }

        if (!adminId) {
            return res.status(400).json({
                success: false,
                message: "adminId is required."
            });
        }

        const currentAdmin = await Admin.findById({ _id: adminId });
        if (!currentAdmin) {
            return res.status(401).json({
                success: false,
                message: "Admin Not Found"
            });
        }

        if (req.body.email_id && req.body.email_id !== currentAdmin.email_id) {
            const existingAdmin = await Admin.findOne({ email_id: req.body.email_id });
            if (existingAdmin) {
                return res.status(401).json({
                    success: false,
                    message: "Email Id is already registered."
                });
            }
        }
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const admin = await Admin.findByIdAndUpdate(
            { _id: adminId },
            req.body,
            { new: true }
        );

        res.status(201).json({
            success: true,
            message: "Admin updated successfully!"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;

        if (!adminId) {
            return res.status(400).json({
                success: false,
                message: "adminId is required."
            });
        }

        const admin = await Admin.findByIdAndUpdate(
            adminId,
            { isDeleted: true },
            { new: true }
        );

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Admin Not Found"
            });
        }
        res.status(201).json({
            success: true,
            message: `Admin deleted successfully!`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { error } = passwordChangeSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(err => err.message).join(', ')
            });
        }

        const { oldPwd, newPwd } = req.body;
        const adminId = req.params.id;

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        const isOldPasswordCorrect = await bcrypt.compare(oldPwd, admin.password);
        if (!isOldPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: 'Old password is incorrect'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPwd, salt);

        admin.password = hashedNewPassword;
        await admin.save();
        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email_id } = req.body;

        const admin = await Admin.findOne({ email_id });

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        const otp = generateOtp();
        const otpExpiration = new Date();
        otpExpiration.setMinutes(otpExpiration.getMinutes() + 5);

        admin.otp = otp;
        admin.otpExpiration = otpExpiration;
        await admin.save();

        const to = admin.email_id;
        const subject = "Password Reset Request";
        const html = ` <h2>Hi Vishala,</h2>
            <p>Below is your one-time password (OTP) for logging into your account.</p>
            <p>Please note, the OTP is valid for 5 minutes:</p>
            <div class="otp">
            ${otp}
            </div>`;

        const mail = await sendMail(to, subject, html);

        return res.status(200).json({ success: true, message: "Password reset link sent to your email", notification: mail });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Something went wrong" });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email_id, otp } = req.body;

        if (!email_id || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        const admin = await Admin.findOne({ email_id });

        if (!admin) {
            return res.status(401).json({ success: false, message: "Admin not found" });
        }

        if (admin.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        const currentTime = new Date();
        if (currentTime > admin.otpExpiration) {
            return res.status(400).json({ success: false, message: "OTP has expired" });
        }
        return res.status(200).json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        console.log(req.body)
        const { email_id, password } = req.body;

        if (!email_id || !password ) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const admin = await Admin.findOne({ email_id });

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        admin.password = hashedPassword;
        admin.otp = null;  
        admin.otpExpiration = null;  
        await admin.save();

        return res.status(200).json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
    }
};
