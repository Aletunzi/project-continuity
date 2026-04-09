import { useState } from "react";
import { Plus, Mic, ArrowUp, ChevronDown, Sparkles, Pencil, BookOpen, Search, FileText, Building2 } from "lucide-react";
import ModelSelector from "@/components/ModelSelector";

const suggestions = [
  { icon: Pencil, label: "Help me write" },
  { icon: BookOpen, label: "Learn about" },
  { icon: Search, label: "Analyze image" },
  { icon: FileText, label: "Summarize text" },
];

const ChatArea = () => {
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("OpenAI GPT-5");

  return (
    <div className="flex flex-col h-screen flex-1 min-w-0">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 shrink-0">
        <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} variant="header" />
        <div className="flex items-center gap-3">
        </div>
      </header>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent border border-border text-sm text-foreground font-normal mb-4">
          <Building2 size={16} className="text-muted-foreground" />
          RubyLabs
        </div>
        <h1 className="text-2xl font-normal text-foreground mb-8">How can I help you?</h1>

        {/* Input */}
        <div className="w-full max-w-[680px]">
          <div className="flex items-center gap-2 border border-border rounded-full px-4 py-3 bg-input-area shadow-sm focus-within:ring-2 focus-within:ring-ring/20 transition-shadow">
            <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <Plus size={20} />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
            <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <Mic size={20} />
            </button>
            <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${message.trim() ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
              <ArrowUp size={16} />
            </button>
          </div>

          {/* Suggestion chips */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-nowrap">
            {suggestions.map((s) => (
              <button
                key={s.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-chip-border bg-chip text-sm text-foreground hover:bg-accent transition-colors whitespace-nowrap shrink-0"
              >
                <s.icon size={14} className="text-muted-foreground" />
                <span>{s.label}</span>
              </button>
            ))}
            <button className="flex items-center gap-1 px-4 py-2 rounded-full border border-chip-border bg-chip text-sm text-muted-foreground hover:bg-accent transition-colors whitespace-nowrap shrink-0">
              + See More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
