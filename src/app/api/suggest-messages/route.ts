import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';


export const runtime = 'edge';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export async function POST() {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||Whats a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

    const result = streamText({
      model: google('gemini-1.5-flash'), // Just a string
        temperature: 0.7,
        maxOutputTokens: 1024,
      system: 'You are a helpful assistant that suggests concise and relevant replies to messages. Only respond with the text of the message.',
      prompt: prompt,
    });

     return result.toTextStreamResponse()
  } catch (error) {
    console.error('Error in message suggestion route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(`An internal server error occurred: ${errorMessage}`, { status: 500 });
  }
}
