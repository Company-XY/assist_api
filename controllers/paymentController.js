const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox", // Change to 'live' for production
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

    user.account_balance += amount;
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

    if (sender.account_balance < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    sender.account_balance -= amount;
    recipient.account_balance += amount;

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
            currency: "USD", // Change to the appropriate currency
          },
          receiver: user.email, // Use the user's PayPal email
          note: "Thank you.",
        },
      ],
    };

    // Create a PayPal payout
    paypal.payout.create(payout, (error, payout) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "PayPal payout failed" });
      } else {
        user.account_balance -= amount;
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
