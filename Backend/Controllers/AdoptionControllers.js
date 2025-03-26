const Joi = require('joi');
const Adoption = require('../Models/AdoptionModel');
const { sendMail } = require('../Services/mailServices');

const COMPANY_NAME = process.env.COMPANY_NAME;

const adoptionValidationSchema = Joi.object({
    animal_name: Joi.string().pattern(/^[A-Za-z\s]+$/).required().messages({
        'string.base': 'Animal name should be a valid name containing letters and spaces.',
        'string.pattern.base': 'Animal name should be a valid name containing letters and spaces.',
        'any.required': 'Please provide the animal\'s name.'
    }),
    period: Joi.number().positive().required().messages({
        'number.base': 'Period must be a valid number.',
        'number.positive': 'Period must be a positive number greater than zero.',
        'any.required': 'Please provide the adoption period.'
    }),
    frequency: Joi.string().valid('daily', 'monthly', 'yearly').required().messages({
        'string.base': 'Frequency should be a valid string.',
        'any.required': 'Please select the frequency of adoption (daily, monthly, or yearly).',
        'string.valid': 'Frequency must be one of the following: daily, monthly, or yearly.'
    }),
    cost: Joi.number().positive().required().messages({
        'number.base': 'Cost must be a valid number.',
        'number.positive': 'Cost must be a positive number greater than zero.',
        'any.required': 'Please provide the cost of adoption.'
    }),
    userId: Joi.string().required().messages({
        'string.base': 'User ID must be a valid string.',
        'any.required': 'User ID is required for adoption.'
    })
});

exports.createAdoption = async (req, res) => {
    try {
        const { error } = adoptionValidationSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(err => err.message).join(', ')
            });
        }

        const newAdoption = new Adoption(req.body);
        await newAdoption.save();

        const date = new Date(newAdoption.createdAt);
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        const to = newAdoption.userId.email_id;
        const getEmailHtml = (recipientName, message) => `
            <h2>Hi ${recipientName},</h2>
            <p>${message}</p>
            <p><b>Adoption Details:</b></p>
            <table>
                <tr>
                    <th>Animal Name</th>
                    <td>${newAdoption.animal_name}</td>
                </tr>
                <tr>
                    <th>Period</th>
                    <td>${newAdoption.period}</td>
                </tr>
                <tr>
                    <th>Frequency</th>
                    <td>${newAdoption.frequency}</td>
                </tr>
                <tr>
                    <th>Cost</th>
                    <td>${newAdoption.cost}</td>
                </tr>
                <tr>
                    <th>Adoption Date</th>
                    <td>${formattedDate}</td>
                </tr>
            </table>
        `;

        const adminMessage = `You have received a new adoption from <b>${newAdoption.userId.first_name} ${newAdoption.userId.last_name}</b>.`;
        const adminSubject = `${COMPANY_NAME} - New Adoption`;
        const adminHtml = getEmailHtml('Admin', adminMessage);

        const userMessage = `Thank you for the adoption.`;
        const userSubject = `${COMPANY_NAME} - Thank you for adoption`;
        const userHtml = getEmailHtml(`${newAdoption.userId.first_name} ${newAdoption.userId.last_name}`, userMessage);

        const adminMail = await sendMail(process.env.EMAIL_ID, adminSubject, adminHtml);
        const userMail = await sendMail(to, userSubject, userHtml);

        const notification = {
            adminMail: adminMail,
            userMail: userMail,
        };

        res.status(201).json({
            success: true,
            message: "Adoption created successfully!",
            data: newAdoption,
            notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAdoptions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const userId = req.query.id || "";
        const pageSize = 10;

        const skip = (page - 1) * pageSize;
        const query = userId ? { userId: userId, isDeleted: false } : { isDeleted: false };

        const adoptions = await Adoption.find(query)
            .skip(skip)
            .limit(pageSize)
            .populate('userId')
            .exec();

        if (adoptions.length > 0) {
            const totalAdoptions = await Adoption.countDocuments(query);
            res.status(201).json({
                success: true,
                data: adoptions,
                totalRecords: totalAdoptions,
                totalPages: Math.ceil(totalAdoptions / pageSize),
                currentPage: page,
            });
        } else {
            res.status(201).json({
                success: false,
                message: "Adoption Data Not Available"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteAdoption = async (req, res) => {
    try {
        const adoptionId = req.params.id;

        if (!adoptionId) {
            return res.status(400).json({
                success: false,
                message: "adoptionId is required."
            });
        }

        const updatedAdoption = await Adoption.findByIdAndUpdate(
            adoptionId,
            { isDeleted: true },
            { new: true }
        );

        if (!updatedAdoption) {
            return res.status(401).json({
                success: false,
                message: "Adoption Not Found"
            });
        }
        res.status(201).json({
            success: true,
            message: 'Adoption deleted successfully!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

