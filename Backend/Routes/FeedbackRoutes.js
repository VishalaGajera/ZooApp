const express = require("express");
const feedbackController = require("../Controllers/FeedbackControllers");

const FeedbackRouter = express.Router();

FeedbackRouter.post("/add", feedbackController.createFeedback);
FeedbackRouter.get("/get", feedbackController.getFeedbacks);
FeedbackRouter.put("/update/:id/:approve", feedbackController.updateFeedback);
FeedbackRouter.delete("/delete/:id", feedbackController.deleteFeedback);

module.exports = FeedbackRouter;