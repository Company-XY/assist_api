const axios = require('axios');

// Define your Daraja API credentials
const consumerKey = 'YOUR_CONSUMER_KEY';
const consumerSecret = 'YOUR_CONSUMER_SECRET';
const darajaBaseURL = 'https://api.safaricom.co.ke/daraja/';

// Controller function to initiate a payment
async function initiatePayment(req, res) {
  try {
    // Make a request to the Daraja API to initiate the payment
    const response = await axios.post(
      `${darajaBaseURL}mpesa/c2b/v1/simulate`,
      {
        ShortCode: 'YOUR_SHORTCODE',
        CommandID: 'CustomerPayBillOnline',
        Amount: req.body.amount,
        Msisdn: req.body.phone,
        BillRefNumber: req.body.reference,
      },
      {
        headers: {
          Authorization: `Bearer YOUR_ACCESS_TOKEN`,
        },
      }
    );

    // Handle the response from the Daraja API and send a response to the client
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = {
  initiatePayment,
};
