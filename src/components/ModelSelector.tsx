import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

type ModelInfo = { name: string; description: string; icon: string };

const models: ModelInfo[] = [
  { name: "OpenAI GPT-5.4", description: "Cutting-edge model", icon: "🌀" },
  { name: "OpenAI GPT-5.3", description: "Instant responses", icon: "🌀" },
  { name: "OpenAI GPT-5.1", description: "Advanced reasoning", icon: "🌀" },
  { name: "OpenAI GPT-5", description: "Smart chat model", icon: "🌀" },
  { name: "OpenAI GPT-4o", description: "Reliable, solid reasoning", icon: "🌀" },
  { name: "OpenAI GPT-4o Mini", description: "Fast and responsive", icon: "🌀" },
  { name: "Grok 4", description: "Fast, sharp and useful", icon: "⚡" },
  { name: "Claude Sonnet 4.6", description: "Claude's top coding model", icon: "✳️" },
  { name: "Claude Opus 4.5", description: "Claude's most powerful model", icon: "✳️" },
  { name: "Claude Opus 4.1", description: "Thoughtful and accurate responses", icon: "✳️" },
  { name: "DeepSeek", description: "Clearly explains its steps", icon: "🔵" },
  { name: "Gemini 3.1 Pro", description: "Google's flagship for reasoning", icon: "💫" },
  { name: "Gemini 3 Pro", description: "Reasoning, broad context", icon: "💫" },
  { name: "Gemini", description: "Excellent all-rounder", icon: "💫" },
  { name: "Qwen 3 Max", description: "Handles long, detailed tasks", icon: "🔮" },
  { name: "Llama 3.3", description: "Versatile for daily tasks", icon: "♾️" },
  { name: "DeepInfra Kimi K2", description: "Great for hard questions", icon: "⚫" },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  variant?: "header" | "inline";
}

const ModelSelector = ({ selectedModel, onModelChange, variant = "header" }: ModelSelectorProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayName = selectedModel.replace("OpenAI ", "").replace("Claude ", "");

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-normal text-foreground hover:bg-accent rounded-md px-2 py-1 transition-colors"
      >
        {displayName}
        <ChevronDown size={14} className="text-muted-foreground" />
      </button>
      {open && (
        <div
          className={`absolute ${variant === "header" ? "top-full left-0" : "top-full right-0"} mt-2 bg-background border border-border rounded-xl shadow-lg py-2 z-50 min-w-[280px] max-h-[400px] overflow-y-auto`}
        >
          {models.map((model) => (
            <button
              key={model.name}
              onClick={() => { onModelChange(model.name); setOpen(false); }}
              className={`w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-accent transition-colors ${
                selectedModel === model.name ? "bg-accent/50" : ""
              }`}
            >
              <span className="text-base mt-0.5 shrink-0">{model.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground">{model.name}</div>
                <div className="text-xs text-muted-foreground">{model.description}</div>
              </div>
              {selectedModel === model.name && (
                <Check size={16} className="text-foreground mt-0.5 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
