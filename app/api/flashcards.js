import { generateFlashcards } from "./generateFlashcards";

export default async function handler(req, res) {
  const { topic, count } = req.query;

  if (!topic || !count) {
    return res.status(400).send("Topic and count are required.");
  }

  try {
    const flashcards = await generateFlashcards(topic, parseInt(count, 10));
    res.status(200).json(flashcards);  // Return the flashcards as an array
  } catch (error) {
    res.status(500).send("Failed to generate flashcards.");
  }
}
