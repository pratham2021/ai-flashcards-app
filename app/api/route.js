import { generateFlashcards } from './generation';

export default async function handler(req, res) {
  const { topic, number } = req.body;

  if (!topic || !number || isNaN(number)) {
      return res.status(400).json({ error: "Please provide a valid topic and number of flashcards." });
  }

  try {
      const flashcards = await generateFlashcards(topic, parseInt(number, 10));
      res.status(200).json({ flashcards });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate flashcards." });
  }
}
