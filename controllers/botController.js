const responses = require("../models/Responses.json");

function findResponse(question) {
  const foundQuestion = responses.questions.find(
    (qna) => qna.question.toLowerCase() === question.toLowerCase()
  );

  if (foundQuestion) {
    const randomResponse =
      foundQuestion.response[
        Math.floor(Math.random() * foundQuestion.response.length)
      ];
    return randomResponse;
  } else {
    return "I'm sorry, I don't have a response to that question. Would you like to talk to one of our agents";
  }
}

function handleUserMessage(req, res) {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  const response = findResponse(message);

  if (response) {
    return res.json({ response });
  } else {
    const defaultResponse =
      "I'm sorry, I don't understand that question. Would you like to talk to one of our agents";
    return res.json({ response: defaultResponse });
  }
}

module.exports = { handleUserMessage };
