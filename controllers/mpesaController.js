const axios = require('axios');

const consumerKey = 'AfcrjyYGuCZ3HOA6UJUZ0foFIwKWbn8d';
const consumerSecret = 'Wiym5053EiTCyMdl';
const darajaBaseURL = 'https://api.safaricom.co.ke/daraja/';

async function initiatePayment(req, res) {
  try {
    const response = await axios.post(
      `${darajaBaseURL}mpesa/c2b/v1/simulate`,
      {
        ShortCode: '5097785',
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

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = {
  initiatePayment,
};
