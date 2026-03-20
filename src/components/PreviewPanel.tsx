"use client";

import { useState, useEffect } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { Download, Code2, TerminalSquare, Copy, Check, RefreshCw, MonitorPlay, Braces } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";

export default function PreviewPanel({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [refreshKey, setRefreshKey] = useState(0);

  // Trigger handoff animation by treating code prop changes as a new render flow
  const [visibleCode, setVisibleCode] = useState(code);

  useEffect(() => {
    setVisibleCode(code);
    setActiveTab("preview"); // auto-switch to preview on new code
  }, [code]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(visibleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    zip.file("App.tsx", code);
    zip.file("package.json", JSON.stringify({
      name: "thinkly-sandbox-export",
      version: "1.0.0",
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "lucide-react": "latest",
        "framer-motion": "latest",
        "clsx": "latest",
        "tailwind-merge": "latest"
      }
    }, null, 2));
    
    zip.file("index.html", `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thinkly Sandbox Export</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {}
        }
      }
    </script>
    <style>
      body { margin: 0; background: #09090b; color: white; }
    </style>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "thinkly-sandbox-export.zip");
  };

  return (
    <div className="h-full w-full flex flex-col bg-zinc-900 overflow-hidden relative">
      <div className="h-14 border-b border-zinc-800 flex items-center px-2 sm:px-4 bg-zinc-950/50 justify-between shrink-0 backdrop-blur-md relative z-20">
        
        {/* Tabs */}
        <div className="flex bg-zinc-900/80 p-1 rounded-lg border border-zinc-800/80 shadow-inner">
          <button 
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === "preview" 
                ? "bg-zinc-800/80 text-white shadow-sm border border-zinc-700/50" 
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent"
            }`}
          >
            <MonitorPlay size={14} className={activeTab === "preview" ? "text-blue-400" : ""} />
            Live Preview
          </button>
          <button 
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === "code" 
                ? "bg-zinc-800/80 text-white shadow-sm border border-zinc-700/50" 
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 border border-transparent"
            }`}
          >
            <Braces size={14} className={activeTab === "code" ? "text-blue-400" : ""} />
            Code View
          </button>
        </div>

        <div className="flex gap-2">
            <div className="relative">
              <button 
                onClick={handleCopy}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                  copied 
                    ? 'bg-green-600/20 border-green-500/50 text-green-400' 
                    : 'bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700/50 text-zinc-300'
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span className="hidden sm:inline">Copy</span>
              </button>
              <AnimatePresence>
                {copied && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded shadow-xl whitespace-nowrap pointer-events-none"
                  >
                    Copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {activeTab === "preview" && (
              <button 
                onClick={handleRefresh}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 text-zinc-300 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 group"
                title="Force Re-render"
              >
                <RefreshCw size={14} className="group-active:rotate-180 transition-transform duration-300" />
              </button>
            )}
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                copied 
                  ? 'bg-green-600/20 border-green-500/50 text-green-400' 
                  : 'bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700/50 text-zinc-300'
              }`}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button 
              onClick={() => setShowConsole(!showConsole)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                showConsole
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                  : 'bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700/50 text-zinc-300'
              }`}
            >
              <TerminalSquare size={13} />
              Console
            </button>
            <button 
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-md border border-blue-500/50 text-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </button>
        </div>
      </div>
      
      <div className="flex-1 min-h-0 relative bg-zinc-950 overflow-hidden">
        {/* Subtle Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={visibleCode + activeTab + refreshKey}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="w-full h-full relative z-10 p-4 sm:p-6 lg:p-8"
          >
            <div className="w-full h-full bg-zinc-900 rounded-xl border border-zinc-800/80 shadow-2xl overflow-hidden flex flex-col">
              {activeTab === "preview" ? (
                <>
                  <Sandpack
                    key={refreshKey}
                    template="react-ts"
                    theme="dark"
                    customSetup={{
                      dependencies: {
                        "lucide-react": "latest",
                        "framer-motion": "latest",
                        "clsx": "latest",
                        "tailwind-merge": "latest"
                      }
                    }}
                    files={{
                      "/App.tsx": {
                        code: visibleCode,
                        active: true
                      },
                      "/public/index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thinkly Sandbox</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {}
        }
      }
    </script>
    <style>
      body { margin: 0; background: #09090b; color: white; }
    </style>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
                    }}
                    options={{
                      showLineNumbers: true,
                      showInlineErrors: true,
                      editorHeight: "100%",
                      showConsoleButton: false,
                      showConsole: showConsole,
                      classes: {
                        "sp-wrapper": "custom-sp-wrapper",
                        "sp-layout": "custom-sp-layout",
                        "sp-preview-container": "custom-sp-preview",
                      }
                    }}
                  />
                  <style dangerouslySetInnerHTML={{__html: `
                    .custom-sp-wrapper, .custom-sp-layout {
                      height: 100% !important;
                      border-radius: 0 !important;
                      border: none !important;
                    }
                    .custom-sp-layout {
                      background: transparent !important;
                    }
                    .custom-sp-preview {
                      background: #18181B !important; /* zinc-900 */
                    }
                  `}} />
                </>
              ) : (
                <div className="w-full h-full overflow-auto bg-[#0d0d0d] p-6 text-sm">
                  <pre className="font-mono text-zinc-300 leading-relaxed tabular-nums">
                    <code>{visibleCode}</code>
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
