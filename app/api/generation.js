import { apiKey, Completion, require } from 'openai';

const openai = require('openai');

openai.apiKey = process.env.OPENAI_API_KEY;

async function generateFlashcard(topic) {
    const prompt = `Generate flashcards with a front and back. Provide the following information on each:
    - Front: A question or concept about "${topic}" that is at least one sentence long.
    - Back: The detailed answer or explanation about "${topic}" that is at least one sentence long.
      
    Format the response like this:
    Front: [Your question or concept here]
    Back: [Your answer or explanation here]`;

    const response = await Completion.create({
        engine: "text-davinci-003",
        prompt: prompt,
        max_tokens: 200
    });

    const text = response.choices[0].text.trim();
    const [front, back] = text.split("\nBack: ");

    return {
      front: front.replace("Front: ", "").trim(),
      back: back ? back.trim() : "",
    }
}

async function generateFlashcards(topic, n) {
    const flashcards = [];

    for (let i = 0; i < n; i++) {
        const flashcard = await generateFlashcard(topic);
        flashcards.push({ id: i + 1, ...flashcard });
    }

    return flashcards;
}

export { generateFlashcard, generateFlashcards };