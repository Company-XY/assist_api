const responses = require("../models/Responses.json");

function getRandomResponse(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function handleUserMessage(req, res) {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  const matchedQuestion = responses.questions.find((qna) =>
    message.toLowerCase().includes(qna.question.toLowerCase())
  );

  if (matchedQuestion) {
    const response = getRandomResponse(matchedQuestion.response);
    console.log("Matched question:", matchedQuestion.question);
    console.log("Bot response:", response);
    return res.json({ response });
  }

  const defaultResponse = "I'm sorry, I don't understand that question.";
  console.log("No matching question found for:", message);
  res.json({ response: defaultResponse });
}

module.exports = { handleUserMessage };
