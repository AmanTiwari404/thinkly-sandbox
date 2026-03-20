"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import ChatPanel from "./ChatPanel";
import PreviewPanel from "./PreviewPanel";

const MOCK_PROFILE_CARD = `import React from 'react';
import { Mail, MapPin, Link as LinkIcon, Github, Twitter, ExternalLink } from 'lucide-react';

export default function UserProfileCard() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative group">
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
          <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </div>
        
        <div className="relative px-6 pb-6">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-zinc-900 overflow-hidden bg-zinc-800 shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-zinc-900 rounded-full" />
            </div>
            <button className="mb-2 px-4 py-1.5 bg-zinc-100 text-zinc-900 text-sm font-medium rounded-full hover:bg-white transition-colors flex items-center gap-1.5">
              <span>Follow</span>
            </button>
          </div>

          <div className="space-y-1 mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Alex Developer
              <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </h2>
            <p className="text-zinc-400 font-mono text-sm">@alexdev</p>
          </div>

          <p className="text-zinc-300 text-sm mb-6 leading-relaxed">
            Frontend engineer crafting beautiful, micro-interactive user interfaces. Lover of Tailwind CSS and Framer Motion.
          </p>

          <div className="flex flex-col gap-3 mb-6 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-2">
              <LinkIcon size={16} />
              <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">alex.dev</a>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-white font-bold">1,234</span>
                <span className="text-zinc-500 text-xs uppercase tracking-wider">Following</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold">12.5k</span>
                <span className="text-zinc-500 text-xs uppercase tracking-wider">Followers</span>
              </div>
            </div>
            <div className="flex gap-3 text-zinc-400">
              <button className="hover:text-white transition-colors"><Github size={18} /></button>
              <button className="hover:text-white transition-colors"><Twitter size={18} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

export default function SandboxLayout() {
  const [code, setCode] = useState(MOCK_PROFILE_CARD);

  const containerRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState(400); // initial width in pixels
  const [isResizing, setIsResizing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Implement resizer logic
  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;
      
      // Enforce min and max widths
      if (newWidth > 320 && newWidth < containerRect.width - 320) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      // Prevent text selection while resizing
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-zinc-950 text-white overflow-hidden">
      <header className="h-14 border-b border-zinc-800 flex items-center px-4 shrink-0 bg-zinc-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <h1 className="ml-4 font-medium text-sm tracking-wide text-zinc-300 flex items-center gap-2">
          <span className="text-blue-400">⚡</span> Thinkly Developer Sandbox
        </h1>
      </header>
      
      <div className="flex-1 w-full h-[calc(100dvh-3.5rem)] flex flex-col md:flex-row relative" ref={containerRef}>
        {/* Left Side: Chat Panel */}
        <div 
          className="bg-zinc-950 flex flex-col h-[40vh] md:h-full border-b md:border-b-0 md:border-r border-zinc-800 shrink-0 relative z-10"
          style={{ width: isMounted && window.innerWidth > 768 ? `${sidebarWidth}px` : '100%' }}
        >
          <ChatPanel onCodeUpdate={setCode} />
        </div>
        
        {/* Resize Handle (visible only on desktop) */}
        <div 
          className={"hidden md:flex w-2 -ml-1 z-20 cursor-col-resize items-center justify-center group relative"} 
          onMouseDown={() => setIsResizing(true)}
        >
          <div className={`h-full w-[2px] transition-colors ${isResizing ? 'bg-blue-500' : 'bg-transparent group-hover:bg-blue-500/50'}`} />
          {isResizing && <div className="absolute inset-y-0 -left-4 -right-4 z-30" />}
        </div>
        
        {/* Right Side: Preview Panel */}
        <div className="bg-zinc-900 flex flex-col flex-1 h-[60vh] md:h-full min-w-0 z-0">
          <PreviewPanel code={code} />
        </div>
      </div>
    </div>
  );
}
