const Joi = require('joi');
const Feedback = require('../Models/FeedbackModel');
const { sendMail } = require('../Services/mailServices');

const COMPANY_NAME = process.env.COMPANY_NAME;

const feedbackValidationSchema = Joi.object({
    rating: Joi.number().positive().min(1).max(5).required().messages({
        'number.base': 'Rating must be a valid number.',
        'number.min': 'Rating should be at least 1.',
        'number.max': 'Rating should be at most 5.',
        'any.required': 'Please provide a rating between 1 and 5.'
    }),
    comment: Joi.string().min(3).required().messages({
        'string.base': 'Comment must be a valid string.',
        'string.min': 'Comment cannot be empty.',
        'any.required': 'Please provide a comment for your feedback.'
    }),
    userId: Joi.string().required().messages({
        'string.base': 'User ID must be a valid string.',
        'any.required': 'User ID is required to submit feedback.'
    })
});

exports.createFeedback = async (req, res) => {
    try {
        const { error } = feedbackValidationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(err => err.message).join(', ')
            });
        }

        const newFeedback = new Feedback(req.body);

        await newFeedback.save();

        const to = process.env.EMAIL_ID;
        const subject = `${COMPANY_NAME} - New Feedback`;
        const feedbackUrl = `http://localhost:5000/api/feedback/update/id=${newFeedback._id}&approve=1`;
        const html = `
            <h2>Hi Admin,</h2>
            <p>You have received a new feedback from <b>${newFeedback.userId.first_name} ${newFeedback.userId.last_name}</b>.</p>
            <p><b>Feedback Details:</b></p>
            <table>
                <tr>
                    <th>Feedback</th>
                    <td>${newFeedback.comment}</td>
                </tr>
                <tr>
                    <th>Rating</th>
                    <td>${newFeedback.rating}</td>
                </tr>
            </table>
            <p>To approve the feedback, please <a href="${feedbackUrl}" class="button">Click Here</a></p>
        `;

        const mail = await sendMail(to, subject, html);
        const notification = {
            mail: mail,
        }

        res.status(201).json({
            success: true,
            message: "Feedback created successfully!",
            data: newFeedback,
            notification
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getFeedbacks = async (req, res) => {
    try {
        const approved = req.query.approved ? parseInt(req.query.approved) : undefined;
        const userId = req.query.id || ""; 
        const page = parseInt(req.query.page) || 1; 
        const pageSize = 10;

        const skip = (page - 1) * pageSize;

        let query = { isDeleted: false }; 
        if (approved !== undefined) { 
            query.approved = approved;
        }
        if (userId) { 
            query.userId = userId;
        }

        const feedbacks = await Feedback.find(query)
            .skip(skip)
            .limit(pageSize)
            .populate('userId')
            .exec();

        if (feedbacks.length > 0) {
            const totalFeedbacks = await Feedback.countDocuments(query);
            res.status(200).json({
                success: true,
                data: feedbacks,
                totalRecords: totalFeedbacks,
                totalPages: Math.ceil(totalFeedbacks / pageSize),
                currentPage: page,
            });
        } else {
            res.status(201).json({
                success: false,
                message: "Feedback Data Not Available"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateFeedback = async (req, res) => {
    try {
        const feedbackId = req.params.id;
        const approve = req.params.approve;

        if (!feedbackId || approve === undefined) {
            return res.status(400).json({
                success: false,
                message: "Both 'feedbackId' and 'approve' values are required."
            });
        }

        const updatedFeedback = await Feedback.findByIdAndUpdate(
            feedbackId,
            { approved: approve },
            { new: true }
        );

        if (!updatedFeedback) {
            return res.status(401).json({
                success: false,
                message: "Feedback Not Found"
            });
        }
        res.status(201).json({
            success: true,
            message: `Feedback ${approve == 1 ? "" : "un"}approved successfully!`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
        const feedbackId = req.params.id;

        if (!feedbackId) {
            return res.status(400).json({
                success: false,
                message: "feedbackId is required."
            });
        }

        const updatedFeedback = await Feedback.findByIdAndUpdate(
            feedbackId,
            { isDeleted: true },
            { new: true }
        );

        if (!updatedFeedback) {
            return res.status(401).json({
                success: false,
                message: "Feedback Not Found"
            });
        }
        res.status(201).json({
            success: true,
            message: `Feedback deleted successfully!`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}