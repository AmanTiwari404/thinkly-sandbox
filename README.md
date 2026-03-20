# Thinkly Labs AI Sandbox

This project is a Technical Sandbox Chatbot built for the Thinkly Labs frontend engineering assignment. It serves as an AI pair programmer specifically tailored to generate and render **Tailwind UI components** in real-time.

## The Concept

Instead of a generic chat wrapper, this application provides an authentic developer experience using a **Split-Pane Architecture**. 
- The **Left Pane** is an intelligent AI chat interface powered by the Vercel AI SDK.
- The **Right Pane** is a Live Preview and Code Editor powered by `@codesandbox/sandpack-react`.

As the AI streams the React code, the Preview plane updates live, creating a seamless "handoff" animation effect.

## "Frontend Thinking" Features

1. **Stateful Split Layout**: A highly customized, vanilla CSS/JS resizable pane system built from scratch, demonstrating complex DOM manipulation without relying on heavy third-party layout libraries.
2. **Micro-interactions**: 
   - **Copy Code**: One-click clipboard copying with a temporary success state.
   - **Console Toggle**: In-browser dev tools toggle to view render errors.
   - **Code Export**: Instantly bundle the generated code and a pre-configured `package.json` into a `.zip` file for local use using JSZip.
3. **Custom Loading States**: Developer-centric loading states ("Compiling...") instead of generic spinners, mimicking real compilation times.
4. **Dark Mode Aesthetics**: A fully custom dark theme using Tailwind CSS and Lucide-React icons, matching modern IDE environments (Cursor, VS Code).

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **AI Integration**: Vercel AI SDK (\`@ai-sdk/react\`, \`@ai-sdk/openai\`)
- **Live Preview**: Sandpack by CodeSandbox (\`@codesandbox/sandpack-react\`)
- **Icons**: \`lucide-react\`

## Getting Started

1. Clone the repository.
2. Run \`npm install\` to install dependencies.
3. Rename \`.env.local.example\` to \`.env.local\` and add your \`OPENAI_API_KEY\`.
4. Run \`npm run dev\` to start the sandbox.

## Submission Details

- **Deployed URL**: https://thinkly-sandbox.vercel.app/
- **Loom Walkthrough**: [Insert Loom Video Link here]
