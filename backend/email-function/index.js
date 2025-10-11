const axios = require('axios');

module.exports = async ({ req, res }) => {
  const { email, subject, message } = req.body;

  const payload = {
    Messages: [
      {
        From: {
          Email: process.env.MAILJET_SENDER_EMAIL,
          Name: "Jagruk Alerts"
        },
        To: [{ Email: email }],
        Subject: subject,
        TextPart: message
      }
    ]
  };

  try {
    const response = await axios.post(
      'https://api.mailjet.com/v3.1/send',
      payload,
      {
        auth: {
          username: process.env.MAILJET_API_KEY,
          password: process.env.MAILJET_SECRET_KEY
        },
        headers: { 'Content-Type': 'application/json' }
      }
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
