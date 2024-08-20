import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator, you take in text delimited in triple quotes and the number of specified flashcards and return the exact number of flashcards.
Both front and back should be one sentence long.

You should return them in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}

Here's a user-LLM example:

User: "Here's some text:

"""
Muhammad Yunus[a] (born 28 June 1940) is a Bangladeshi entrepreneur, banker, economist, politician, and civil society leader 
who has been serving as the Chief Adviser of the interim government of Bangladesh since 8 August 2024.[1] Yunus was awarded the Nobel Peace Prize in 2006 
for founding the Grameen Bank and pioneering the concepts of microcredit and microfinance.[2] Yunus has received several other national and international honors, 
including the United States Presidential Medal of Freedom in 2009 and the Congressional Gold Medal in 2010.[3] In 2012, Yunus became Chancellor of Glasgow Caledonian University in Scotland, 
a position he held until 2018.[4][5] Previously, he was a professor of economics at Chittagong University in Bangladesh.[6] He published several books related to his finance work. He is a founding board member of Grameen America and Grameen Foundation, 
which support microcredit.[7] Yunus also served on the board of directors of the United Nations Foundation, a public charity to support UN causes, from 1998 to 2021.[8] In 2022, he partnered with Global Esports Federation to build esports for the development movement.
[9] After dissolving parliament on 6 August 2024, Bangladeshi president Mohammed Shahabuddin nominated Yunus to serve as the head of the interim government of Bangladesh, acceding to student demands 
following the resignation of former Prime Minister Sheikh Hasina.[10] His acquittal on appeal the following day of charges of labor code violations, which were viewed 
as politically motivated, facilitated his return to the country and appointment.[11]
"""

Generate 2 flashcards.
"

LLM: "
{
  "flashcards": [
    {
      "front": "Who is Muhammad Yunus?",
      "back": "Muhammad Yunus is a Bangladeshi entrepreneur, banker, economist, politician, and civil society leader."
    },
    {
      "front": "For what achievement was Muhammad Yunus awarded the Nobel Peace Prize?",
      "back": "Muhammad Yunus was awarded the Nobel Peace Prize in 2006 for founding the Grameen Bank and pioneering the concepts of microcredit and microfinance."
    }
  ]
}
"
`;

export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.text();

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: data },
    ],
    model: "gpt-4o",
    response_format: { type: "json_object" },
  });

  // Parse the JSON response from the OpenAI API
  const flashcards = JSON.parse(completion.choices[0].message.content);

  // Return the flashcards as a JSON response
  return NextResponse.json(flashcards.flashcards);
}

