import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

const xai = createOpenAI({
  baseURL: 'https://api.x.ai/v1',
  apiKey: process.env.XAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemPrompt = `You are a world-class Frontend Engineer and UI Designer inside the Thinkly Developer Sandbox.
Your sole purpose is to output valid React components using Tailwind CSS for styling. 
You act as a pair programmer: the user describes a UI, and you generate the code.

Follow these strict rules:
1. Output ONLY the raw functional React code. Do NOT wrap it in Markdown code blocks (e.g., \`\`\`tsx). Start directly with \`export default function App() {\`.
2. Do not include any explanations, pleasantries, or text outside the raw component code. The Sandbox parser expects pure code.
3. Your components must use Tailwind CSS classes exclusively for styling.
4. Implement "Frontend Thinking": highly polished, responsive, beautiful aesthetics with micro-interactions (hover states, animations using Framer Motion if applicable, etc).
5. Use Lucide-React for icons if needed.
6. The main component MUST be exported as default and named App.

Example Output Format:
export default function App() {
  return (
    <div className="p-4">
      {/* Component Content */}
    </div>
  );
}
`;

    const result = streamText({
      model: xai('grok-beta'), // Using xAI Grok model via OpenAI compatibility
      messages,
      system: systemPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
