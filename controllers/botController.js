const { NlpManager } = require("node-nlp");
const responses = require("../models/Responses.json");

const manager = new NlpManager({ languages: ["en"] });

responses.questions.forEach((qna) => {
  manager.addDocument("en", qna.question, "match", qna);
});

manager.train();

// Define the getRandomResponse function
function getRandomResponse(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function handleUserMessage(req, res) {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  manager
    .process("en", message)
    .then((result) => {
      const bestMatch = result.score > 0.7 ? result.intent : null;

      if (bestMatch) {
        const matchedQuestion = bestMatch.metadata;
        const response = getRandomResponse(matchedQuestion.response);
        console.log("Matched question:", matchedQuestion.question);
        console.log("Bot response:", response);
        return res.json({ response });
      }

      const defaultResponse = "I'm sorry, I don't understand that question.";
      console.log("No matching question found for:", message);
      res.json({ response: defaultResponse });
    })
    .catch((error) => {
      console.error(error);
      const defaultResponse =
        "I'm sorry, an error occurred while processing your request.";
      res.json({ response: defaultResponse });
    });
}

module.exports = { handleUserMessage };
