// @ts-nocheck
"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { Send, Terminal, Loader2, User, Bot, Sparkles, Code2, Layers, Zap } from "lucide-react";

const INITIAL_MESSAGES = [
  {
    id: "mock-1",
    role: "user",
    content: "Create a modern, dark-mode user profile card."
  },
  {
    id: "mock-2",
    role: "assistant",
    content: "I've built a modern, responsive, dark-mode user profile card with micro-interactions, gradient backgrounds, and standard social links.\n\n```tsx\n// Code is running in the preview pane\n```"
  }
];

const LOADING_STATES = [
  "Analyzing request...",
  "Generating Tailwind classes...",
  "Compiling component...",
  "Applying micro-interactions..."
];

export default function ChatPanel({ onCodeUpdate }: { onCodeUpdate: (code: string) => void }) {
  const { messages, sendMessage, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: INITIAL_MESSAGES as any,
  });
  
  const [inputLocal, setInputLocal] = useState("");
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputLocal(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputLocal.trim() || isLoading) return;
    sendMessage({ role: 'user', content: inputLocal });
    setInputLocal("");
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingTextIndex(0);
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % LOADING_STATES.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant') {
      let code = lastMessage.content;
      const match = code.match(/```(?:tsx|jsx|js|ts)?\n([\s\S]*?)```/);
      if (match) {
        code = match[1];
      }
      onCodeUpdate(code);
    }
  }, [messages, onCodeUpdate]);

  return (
    <div className="flex flex-col h-full bg-zinc-950/80">
      <div className="border-b border-zinc-800 p-3 flex items-center justify-between px-4 shrink-0 bg-zinc-900/30">
        <div className="flex items-center">
          <Terminal size={16} className="text-blue-500 mr-2" />
          <span className="text-xs font-mono text-zinc-300 uppercase tracking-widest">AI Pair Programmer</span>
        </div>
        {isLoading && <Loader2 size={14} className="animate-spin text-blue-500" />}
      </div>
      
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto flex flex-col gap-5 scroll-smooth relative">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-sm mx-auto animate-in fade-in duration-700">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mb-6 shadow-xl shadow-blue-900/20">
              <Sparkles className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">What will we build?</h2>
            <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
              I'm your AI frontend engineer. I can generate Tailwind components, complex layouts, and detailed interactive micro-interactions.
            </p>
            <div className="flex flex-col gap-3 w-full">
              {[
                { label: "Build a pricing card", icon: <Layers size={14} /> },
                { label: "Create a responsive navbar", icon: <Code2 size={14} /> },
                { label: "Design a settings dashboard", icon: <Zap size={14} /> }
              ].map((prompt, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setInputLocal(prompt.label);
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 hover:border-zinc-700 transition-all text-sm text-zinc-300 text-left group"
                >
                  <div className="text-blue-500 group-hover:text-blue-400 transition-colors">
                    {prompt.icon}
                  </div>
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m: any) => (
              <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''} group animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                  m.role === 'user' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20' : 'bg-zinc-900 text-blue-500 border border-zinc-800'
                }`}>
                  {m.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                </div>
                <div className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-sm border border-indigo-500 shadow-indigo-900/20' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 rounded-tl-sm shadow-black/40'
                }`}>
                  {m.role === 'user' ? m.content : (
                    <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-lg max-w-none text-sm">
                      {m.content}
                      {m.content.includes("```") && (
                        <div className="mt-3 flex items-center gap-2 text-xs font-mono text-green-400 bg-green-500/10 border border-green-500/20 rounded-md px-2 py-1.5 w-max">
                           <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                           Code deployed to preview
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-4 animate-in slide-in-from-bottom-2 duration-300">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-blue-500 border border-zinc-800 flex items-center justify-center shrink-0 shadow-sm">
              <Bot size={15} />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] text-sm flex items-center gap-3 shadow-black/40 overflow-hidden relative">
              <div className="w-4 h-4 text-blue-500">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <span className="font-mono text-xs text-blue-400 animate-pulse tracking-wide">
                {LOADING_STATES[loadingTextIndex]}
              </span>
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-zinc-950 shrink-0 border-t border-zinc-800/50">
        <form onSubmit={handleSubmit} className="relative flex items-center rounded-xl bg-zinc-900 border border-zinc-800 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all shadow-md">
          <input 
            value={inputLocal}
            onChange={handleInputChange}
            placeholder="Build a pricing card with a dark theme..."
            className="w-full bg-transparent border-none rounded-xl px-4 py-3.5 pr-12 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !inputLocal.trim()}
            className="absolute right-2 p-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg text-white transition-colors"
          >
            <Send size={16} className="mt-[1px] ml-[1px]" />
          </button>
        </form>
        <div className="text-center mt-3">
          <span className="text-[10px] text-zinc-600 tracking-wide font-mono">POWERED BY NEXT.JS & VERCEL AI SDK</span>
        </div>
      </div>
    </div>
  );
}
