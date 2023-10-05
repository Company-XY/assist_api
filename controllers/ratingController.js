const User = require("../models/userModel");
const Job = require("../models/jobModel");

const updateUserRatings = async () => {
  try {
    const freelancers = await User.find({
      role: "Freelancer",
      "bid.status": "Ongoing",
    });

    // Iterate through freelancers and update their ratings
    for (const freelancer of freelancers) {
      const jobs = await Job.find({
        user_email: freelancer.email,
        stage: "Complete",
      });

      if (jobs.length > 0) {
        const ratings = jobs.map((job) => {
          return {
            review: job.review,
            rating: job.rating,
          };
        });

        // Calculate the average rating for the freelancer
        const averageRating = calculateAverageRating(ratings);

        // Update the freelancer's rating
        freelancer.rating = averageRating;

        // Save the updated user (freelancer)
        await freelancer.save();
      }
    }
  } catch (error) {
    console.error("Error updating user ratings:", error);
  }
};

module.exports = updateUserRatings;
