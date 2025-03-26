const { default: axios } = require('axios');

const sendSMS = async (text, to) => {
    try {
        const userName = process.env.SMS_USERNAME;
        const API_key = process.env.SMS_API_KEY;
        const API_Secret = process.env.SMS_API_SRCRET;

        if (!to || !text) {
            return res.status(400).json({
                success: false,
                message: 'Recipient phone number and message text are required.',
            });
        }

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://www.experttexting.com/ExptRestApi/sms/json/Message/Send?username=${userName}&api_key=${API_key}&api_secret=${API_Secret}&from=DEFAULT&to=${to}&text=${encodeURIComponent(text)}&type=text`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const response = await axios.request(config);
        if (response.data.Status === 0) {
            return {
                success: true,
                message: 'SMS sent successfully',
            };
        } else {
            return {
                success: false,
                message: response.data.ErrorMessage,
            };
        }
    } catch (error) {
        return {
            success: false,
            message: 'Error to send SMS',
        };
    }
};

module.exports = { sendSMS }