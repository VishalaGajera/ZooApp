const Joi = require("joi");
const User = require("../Models/UserModel");
const { sendMail } = require("../Services/mailServices");
const { sendSMS } = require("../Services/SMSServices");

const COMPANY_NAME = process.env.COMPANY_NAME;

const userValidationSchema = Joi.object({
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
    mobile: Joi.string().min(10).max(12).pattern(/^[0-9]+$/).required().messages({
        'string.base': 'Mobile Number should be a valid number.',
        'string.min': 'Mobile Number must be at least 10 digits long.',
        'string.max': 'Mobile Number must be no more than 12 digits long.',
        'string.pattern.base': 'Mobile Number can only contain digits (0-9).',
        'any.required': 'Mobile Number is required.'
    }),
    email_id: Joi.string().email().required().messages({
        'string.base': 'Email should be a valid email address.',
        'string.email': 'Please provide a valid email address.',
        'any.required': 'Email Address is required.'
    })
});

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

exports.registerUser = async (req, res) => {
    try {
        const { error } = userValidationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(err => err.message).join(', ')
            });
        }

        const existingUser = await User.findOne({ mobile: req.body.mobile, isDeleted: false });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: `Mobile number is already Registered`,
            });
        } else {
            const otp = generateOtp();
            const otpExpiration = new Date();
            otpExpiration.setMinutes(otpExpiration.getMinutes() + 5);

            const newUser = await User(req.body);
            newUser.otpExpiration = otpExpiration;
            newUser.otp = otp;
            await newUser.save();

            const html = `
                <h2>Hi ${newUser.first_name} ${newUser.last_name}, Welcome to ${COMPANY_NAME}!</h2>
                <p>Thank you for registering with us. Your registration was successful. Below is your one-time password (OTP) for logging into your account.</p>
                <p>Please note, the OTP is valid for 5 minutes:</p>
                <div class="otp">
                    ${otp}
                </div>
                <p>Thank you for choosing ${COMPANY_NAME}.</p>
            `;

            const text = `Your OTP for ${COMPANY_NAME} login is ${otp}. Valid for 5 minutes.`
            const to = req.body.mobile;
            const email_to = newUser.email_id;
            const subject = `${COMPANY_NAME} - One Time Password for Login`;
            const mail = await sendMail(email_to, subject, html);
            const sms = await sendSMS(text, to);
            const notification = {
                sms: sms,
                mail: mail,
            }
            res.status(201).json({
                success: true,
                message: "Registration successfully",
                data: newUser,
                notification
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const userValidationSchema = Joi.string()
            .min(10)
            .max(12)
            .pattern(/^[0-9]+$/)
            .required()
            .messages({
                'string.base': 'Mobile Number must be a valid number with digits only.',
                'string.min': 'Mobile Number must be at least 10 digits long.',
                'string.max': 'Mobile Number must be no more than 12 digits long.',
                'string.pattern.base': 'Mobile Number can only contain digits (0-9).',
                'any.required': 'Mobile Number is Required'
            });

        const { error } = userValidationSchema.validate(req.body.mobile, { abortEarly: false });

        if (error) {
            const errorMessages = error.details.map(err => err.message).join(', ');
            return res.status(400).json({
                success: false,
                message: errorMessages
            });
        }
        const user = await User.findOne({ mobile: req.body.mobile, isDeleted: false });
        if (!user) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Mobile number not registered with us."
                });
        }

        const otp = generateOtp();
        const otpExpiration = new Date();
        otpExpiration.setMinutes(otpExpiration.getMinutes() + 5);

        user.otp = otp;
        user.otpExpiration = otpExpiration;
        await user.save();

        const text = `Your OTP for ${COMPANY_NAME} login is ${otp}. Valid for 5 minutes.`
        const to = req.body.mobile;
        const html = `
            <h2>Hi Vishala,</h2>
            <p>Below is your one-time password (OTP) for logging into your account.</p>
            <p>Please note, the OTP is valid for 5 minutes:</p>
            <div class="otp">
            ${otp}
            </div>
        `;
        const email_to = user.email_id;
        const subject = `${COMPANY_NAME} - One Time Password for Login`;
        const mail = await sendMail(email_to, subject, html);
        const sms = await sendSMS(text, to);
        const notification = {
            sms: sms,
            mail: mail,
        }
        if (notification.sms.success || notification.mail.success) {
            res.status(201).json({
                success: true,
                message: "OTP successfully sent",
                notification
            });
        } else {
            res.status(201).json({
                success: false,
                message: "Error to send OTP",
                notification
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const userValidationSchema = Joi.object({
            mobile: Joi.string().min(10).max(12).pattern(/^[0-9]+$/).required().messages({
                'string.base': 'Mobile Number should be a valid number.',
                'string.min': 'Mobile Number must be at least 10 digits long.',
                'string.max': 'Mobile Number must be no more than 12 digits long.',
                'string.pattern.base': 'Mobile Number can only contain digits (0-9).',
                'any.required': 'Please provide your Mobile Number.'
            }),
            otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
                'string.base': 'OTP should be a valid number.',
                'string.length': 'OTP must be 6 digits long.',
                'string.pattern.base': 'OTP can only contain digits (0-9).',
                'any.required': 'Please provide an OTP.'
            })
        });

        const { error } = userValidationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(err => err.message).join(', ')
            });
        }

        const { mobile, otp } = req.body;

        const user = await User.findOne({ mobile: mobile, isDeleted: false });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Not Found"
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        const currentTime = new Date();
        if (currentTime > user.otpExpiration) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }

        user.otp = "";
        user.otpExpiration = null;
        await user.save();

        res.status(201).json({
            success: true,
            message: "OTP verified successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { error } = userValidationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(err => err.message).join(', ')
            });
        }

        const existingUser = await User.findOne({ mobile: req.body.mobile, isDeleted: false });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: `Mobile number is already Registered`,
            });
        } else {
            const newUser = await User(req.body);
            await newUser.save();

            res.status(201).json({
                success: true,
                message: "Add new user successfully",
                data: newUser
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const userId = req.query.id || "";
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;

        const skip = (page - 1) * pageSize;
        const query = userId ? { userId: userId, isDeleted: false } : { isDeleted: false };

        const users = await User.find(query)
            .skip(skip)
            .limit(pageSize)
            .exec();

        if (users.length > 0) {
            const totalUsers = await User.countDocuments(query);
            res.status(201).json({
                success: true,
                data: users,
                totalRecords: totalUsers,
                totalPages: Math.ceil(totalUsers / pageSize),
                currentPage: page,
            });
        } else {
            res.status(201).json({
                success: false,
                message: "User Data Not Available"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { error } = userValidationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(err => err.message).join(', ')
            });
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required."
            });
        }

        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(401).json({
                success: false,
                message: "User Not Found"
            });
        }

        if (req.body.mobile && req.body.mobile !== currentUser.mobile) {
            const existingUser = await User.findOne({ mobile: req.body.mobile });
            if (existingUser) {
                return res.status(401).json({
                    success: false,
                    message: "Mobile number is already registered."
                });
            }
        }

        const user = await User.findByIdAndUpdate(
            userId,
            req.body,
            { new: true }
        );

        res.status(201).json({
            success: true,
            message: "User updated successfully!"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required."
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { isDeleted: true },
            { new: true }
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Not Found"
            });
        }
        res.status(201).json({
            success: true,
            message: `User deleted successfully!`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}