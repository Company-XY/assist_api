const express = require("express");
const updateUserRatings = require("../controllers/ratingController");

// Create a router
const router = express.Router();

router.get("/rating", async (req, res) => {
  try {
    // Call the function to update user ratings
    await updateUserRatings();
    res.status(200).json({ message: "User ratings updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user ratings" });
  }
});

module.exports = router;
