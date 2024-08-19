import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function generateFlashcards(topic, n = 5) {
  const flashcards = [];

  for (let i = 0; i < n; i++) {
    const prompt = `Generate ${n} question and answer pairs about ${topic}. 
    The question should be on the front of the flashcard and the answer on the back. 
    Both should be at least one sentence long.`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 100,
    });

    const flashcardText = response.data.choices[0].text.trim();
    const [question, answer] = flashcardText.split("\n").map(str => str.trim());

    flashcards.push({ question, answer });
  }

  return flashcards;  // Return the array of flashcards
}
