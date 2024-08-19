import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator, you take in text and the number of flashcards that need to be generated and create multiple flashcards from it. 
Make sure to create the number of flashcards specified by the user.
Both front and back should be one sentence long.

You should return in the following JSON format:
{
  "flashcards": [
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

export async function POST(req) {
    const openai = new OpenAI();
    const data = await req.text();

    const completion = await openai.chat.completions.create({
        messages: [
            {role: 'system', content: systemPrompt},
            {role: 'user', content: data}
        ],
        model: 'gpt-4-turbo',
        response_format: {type: 'json_object'},
    });

    // Parse the JSON response from the OpenAI API
    const flashcards = JSON.parse(completion.choices[0].messages.content);

    // Return the flashcards as a JSON response
    return NextResponse.json(flashcards.flashcards);
}