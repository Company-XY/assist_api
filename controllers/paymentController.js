const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox", // Development
  //mode: "live", //Production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

const depositFunds = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { amount } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.accountBalance += amount;
    await user.save();

    return res.status(201).json({ message: "Funds deposited successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to deposit funds" });
  }
});

const transferFunds = asyncHandler(async (req, res) => {
  const senderId = req.params.senderId;
  const recipientId = req.params.recipientId;
  const { amount } = req.body;

  try {
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(404).json({ error: "User not found" });
    }

    if (sender.accountBalance < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    sender.accountBalance -= amount;
    recipient.accountBalance += amount;

    await sender.save();
    await recipient.save();

    return res.status(200).json({ message: "Funds transferred successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to transfer funds" });
  }
});

const withdrawToPayPal = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const { amount } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.account_balance < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    const payout = {
      sender_batch_header: {
        sender_batch_id: "batch_" + Math.random().toString(36).substring(9),
        email_subject: "You have a payment",
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: amount,
            currency: "USD",
          },
          receiver: user.email,
          note: "Thank you.",
        },
      ],
    };

    paypal.payout.create(payout, (error, payout) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "PayPal payout failed" });
      } else {
        user.accountBalance -= amount;
        user.save();
        return res.status(200).json({ message: "Withdrawal successful" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Withdrawal process failed" });
  }
});

module.exports = {
  depositFunds,
  transferFunds,
  withdrawToPayPal,
};
