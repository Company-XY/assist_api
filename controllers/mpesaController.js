const axios = require("axios");
const User = require("../models/userModel");

const createToken = async (req, res, next) => {
  const secret = process.env.MPESA_SECRET;
  const consumer = process.env.MPESA_CONSUMER;
  const auth = new Buffer.from(`${consumer}:${secret}`).toString("base64");
  try {
    const { data } = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          authorization: `Basic ${auth}`,
        },
      }
    );
    req.token = data.access_token;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
};

const stkPush = async (req, res) => {
  const userId = req.header("x-user-id");

  if (!userId) {
    return res.status(401).json({ message: "User ID not provided" });
  }

  const shortCode = 174379;
  const phone = req.body.phone.substring(1);
  const amount = req.body.amount;
  const passkey = process.env.MPESA_PASSKEY;
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

  const date = new Date();
  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);
  const password = new Buffer.from(shortCode + passkey + timestamp).toString(
    "base64"
  );
  const data = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: `254${phone}`,
    PartyB: 174379,
    PhoneNumber: `254${phone}`,
    CallBackURL: "https://mydomain.com/path",
    AccountReference: "Mpesa Test",
    TransactionDesc: "Testing stk push",
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        authorization: `Bearer ${req.token}`,
      },
    });

    try {
      const user = await User.findById(userId);

      console.log(user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newBalance = user.accountBalance + parseFloat(amount);
      user.accountBalance = newBalance;
      await user.save();

      console.log("User account balance updated:", newBalance);

      res
        .status(200)
        .json({ message: "STK push successful and user balance updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating user balance" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
};

module.exports = { createToken, stkPush };
