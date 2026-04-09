import { useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUp, MoreHorizontal, MoreVertical, Plus, ChevronDown, ChevronRight, Copy, ThumbsUp, ThumbsDown, RotateCcw, Share2, Pencil, FolderMinus, Archive, Flag, Trash2, X, Settings, SmilePlus, FileText, AudioLines, Mic, FolderOpen } from "lucide-react";

const SharedFolderIcon = ({ size = 28, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    <circle cx="10" cy="13" r="2" />
    <circle cx="15" cy="12" r="2" />
    <path d="M7 20c0-2 1.5-3 3-3s1.5.5 2.5.5 1.5-.5 2.5-.5 3 1 3 3" />
  </svg>
);
import ShareModal from "@/components/ShareModal";
import ModelSelector from "@/components/ModelSelector";

type ChatParticipant = { initials: string; bg: string; text: string; name: string; email: string };

const allMembers: ChatParticipant[] = [
  { initials: "EA", bg: "bg-primary", text: "text-primary-foreground", name: "Evgenii Akinshin", email: "akinshinevgenii@gmail.com" },
  { initials: "PR", bg: "bg-[hsl(142,60%,35%)]", text: "text-white", name: "Paolo Rossi", email: "paolo@rubylabs.com" },
  { initials: "AT", bg: "bg-[hsl(25,80%,40%)]", text: "text-white", name: "Alessandro Tunzi", email: "alessandro@rubylabs.com" },
  { initials: "MR", bg: "bg-[hsl(220,70%,50%)]", text: "text-white", name: "Marco Rizzi", email: "marco@rubylabs.com" },
  { initials: "LB", bg: "bg-[hsl(340,65%,47%)]", text: "text-white", name: "Laura Bianchi", email: "laura@rubylabs.com" },
  { initials: "FS", bg: "bg-[hsl(270,55%,50%)]", text: "text-white", name: "Federico Sala", email: "federico@rubylabs.com" },
];

type ChatDef = { name: string; participants: ChatParticipant[] };

const projectsData: Record<string, { name: string; description: string; chats: ChatDef[] }> = {
  "1": {
    name: "Project Ruby Labs",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    chats: [
      { name: "Q4 Strategy alignment", participants: [allMembers[0], allMembers[1], allMembers[2]] },
      { name: "Claude settings help", participants: [allMembers[0]] },
      { name: "Design system updates", participants: [allMembers[0], allMembers[2], allMembers[3], allMembers[4]] },
    ],
  },
  "2": { name: "Project Empty", description: "Dolor sit amet consectetur adipiscing elit.", chats: [] },
};

type Message = { role: "user" | "assistant"; content: string };
type Chat = { name: string; messages: Message[]; participants: ChatParticipant[] };

const ProjectDetail = ({ basePath = "/team-feature" }: { basePath?: string }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projectsData[id || ""] || { name: "Project", description: "", chats: [] };

  const [inputValue, setInputValue] = useState("");
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [replyInput, setReplyInput] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);
  const [instructionsDraft, setInstructionsDraft] = useState("");
  const [chatMenu, setChatMenu] = useState<string | null>(null);
  const [moveSubmenuOpen, setMoveSubmenuOpen] = useState<string | null>(null);
  const [renamingChat, setRenamingChat] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [selectedModel, setSelectedModel] = useState("OpenAI GPT-5");
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [dotsMenuOpen, setDotsMenuOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsName, setSettingsName] = useState(project.name);
  const [settingsInstructions, setSettingsInstructions] = useState("");
  const [settingsMemory, setSettingsMemory] = useState("Default");
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number; date: string }[]>([]);
  const MAX_CAPACITY_MB = 100;
  const usedMB = uploadedFiles.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024);
  const usedPercent = Math.min(Math.round((usedMB / MAX_CAPACITY_MB) * 100), 100);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map((f) => ({
      name: f.name,
      size: f.size,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }),
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const handleStartChat = () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue.trim();
    const newChat: Chat = {
      name: userMsg,
      participants: [allMembers[0]],
      messages: [
        { role: "user", content: userMsg },
        { role: "assistant", content: "Hi! Everything is working correctly. How can I help you?" },
      ],
    };
    setActiveChat(newChat);
    setChatHistory((prev) => [newChat, ...prev]);
    setInputValue("");
  };

  const handleSendReply = () => {
    if (!replyInput.trim() || !activeChat) return;
    const updatedChat = {
      ...activeChat,
      messages: [
        ...activeChat.messages,
        { role: "user" as const, content: replyInput.trim() },
        { role: "assistant" as const, content: "Thanks for your message! How else can I help?" },
      ],
    };
    setActiveChat(updatedChat);
    setChatHistory((prev) => prev.map((c) => (c.name === activeChat.name ? updatedChat : c)));
    setReplyInput("");
  };

  const members = [
    { initials: "EA", name: "Evgenii Akinshin", email: "akinshinevgenii@gmail.com", bg: "bg-primary", text: "text-primary-foreground" },
    { initials: "PR", name: "Paolo Rossi", email: "paolo@rubylabs.com", bg: "bg-[hsl(142,60%,35%)]", text: "text-white" },
    { initials: "AT", name: "Alessandro Tunzi", email: "alessandro@rubylabs.com", bg: "bg-[hsl(25,80%,40%)]", text: "text-white" },
  ];

  // Chat view
  if (activeChat) {
    return (
      <div className="flex-1 min-w-0 h-screen flex flex-col bg-background">
        {/* Model selector row */}
        <div className="flex items-center justify-between px-6 py-3">
          <button className="flex items-center gap-1 text-sm font-normal text-foreground px-2 py-1 rounded-md hover:bg-accent transition-colors">
            GPT-5
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Copy size={15} />
              Copy chat
            </button>
            <div className="flex -space-x-2">
              {members.map((m) => (
                <div key={m.initials} className="relative group z-10 hover:z-20">
                  <div className={`w-7 h-7 rounded-full ${m.bg} flex items-center justify-center text-[10px] ${m.text} ring-2 ring-background cursor-pointer`}>{m.initials}</div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 rounded-lg bg-foreground text-background text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50 text-center shadow-lg">
                    <div className="font-normal">{m.name}</div>
                    <div className="text-background/70">{m.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Breadcrumb */}
        <div className="px-6 pb-3 ml-2">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <button onClick={() => { setActiveChat(null); navigate(`${basePath}/teams`); }} className="text-muted-foreground hover:text-foreground hover:underline transition-colors">
              Team
            </button>
            <span className="text-muted-foreground">/</span>
            <button onClick={() => setActiveChat(null)} className="text-muted-foreground hover:text-foreground hover:underline transition-colors">
              {project.name}
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="truncate max-w-[200px]">{activeChat.name}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-8 max-w-[900px] mx-auto w-full">
          {activeChat.messages.map((msg, i) => (
            <div key={i} className={`mb-6 ${msg.role === "user" ? "flex flex-col items-end" : ""}`}>
              {msg.role === "user" ? (
                <>
                  <div className="bg-muted rounded-2xl px-5 py-3 max-w-[70%]">
                    <p className="text-sm text-foreground">{msg.content}</p>
                  </div>
                  <div className="mt-1.5 mr-1">
                    <Copy size={15} className="text-muted-foreground cursor-pointer hover:text-foreground" />
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-sm text-foreground mb-2">{msg.content}</p>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Copy size={15} className="cursor-pointer hover:text-foreground" />
                    <ThumbsUp size={15} className="cursor-pointer hover:text-foreground" />
                    <ThumbsDown size={15} className="cursor-pointer hover:text-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reply input */}
        <div className="px-6 pb-6 max-w-[900px] mx-auto w-full">
          <div className="flex items-center gap-2 border border-border rounded-full px-4 py-3 bg-card shadow-sm focus-within:ring-2 focus-within:ring-ring/20 transition-shadow">
            <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <Plus size={20} />
            </button>
            <input
              type="text"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
            <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <AudioLines size={20} />
            </button>
            <button
              onClick={handleSendReply}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${replyInput.trim() ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
        {shareOpen && <ShareModal projectName={project.name} onClose={() => setShareOpen(false)} />}
      </div>
    );
  }

  const allChats: Chat[] = [
    ...chatHistory,
    ...(chatHistory.length === 0
      ? project.chats.map((chatDef) => ({
          name: chatDef.name,
          participants: chatDef.participants,
          messages: [
            { role: "user" as const, content: chatDef.name },
            { role: "assistant" as const, content: "Hi! How can I help you with this?" },
          ],
        }))
      : []),
  ];

  // Project overview
  return (
    <div className="flex-1 min-w-0 h-screen flex flex-col bg-background">
      {/* Model selector row */}
      <div className="flex items-center justify-between gap-3 px-6 py-3">
        <button className="flex items-center gap-1 text-sm font-normal text-foreground px-2 py-1 rounded-md hover:bg-accent transition-colors">
          GPT-5
          <ChevronDown size={14} className="text-muted-foreground" />
        </button>
        <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {members.map((m) => (
            <div key={m.initials} className="relative group z-10 hover:z-20">
              <div className={`w-7 h-7 rounded-full ${m.bg} flex items-center justify-center text-[10px] ${m.text} ring-2 ring-background cursor-pointer`}>{m.initials}</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 rounded-lg bg-foreground text-background text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50 text-center shadow-lg">
                <div className="font-normal">{m.name}</div>
                <div className="text-background/70">{m.email}</div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
      {/* Breadcrumb */}
      <div className="px-6 pb-3 ml-2">
        <div className="flex items-center gap-2 text-sm text-foreground">
          <button onClick={() => navigate(`${basePath}/teams`)} className="text-muted-foreground hover:text-foreground hover:underline transition-colors">
            Team
          </button>
          <span className="text-muted-foreground">/</span>
          <span>{project.name}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[780px] mx-auto px-8 pt-6 pb-10">
          {/* Title row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <SharedFolderIcon size={28} className="text-foreground" />
              <h1 className="text-2xl font-normal text-foreground">{project.name}</h1>
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-accent transition-colors"
            >
              Project Settings
            </button>
          </div>

          {/* Chat input */}
          <div className="flex items-center gap-2 border border-border rounded-full px-4 py-2.5 mb-8 bg-card focus-within:ring-2 focus-within:ring-ring/20 transition-shadow relative">
            <Plus size={18} className="text-muted-foreground shrink-0 cursor-pointer hover:text-foreground" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStartChat()}
              placeholder={`New chat in ${project.name}`}
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm text-foreground hover:bg-accent transition-colors shrink-0">
              <AudioLines size={14} />
              Voice
            </button>
          </div>

          {/* Chat list */}
          <div className="space-y-1">
                {allChats.map((chat, i) => (
                  <div
                    key={chat.name + i}
                    className="relative w-full flex items-center gap-3 py-3 px-3 hover:bg-accent/50 rounded-xl transition-colors group/row cursor-pointer"
                    onClick={() => setActiveChat(chat)}
                  >
                    <div className="flex-1 text-left min-w-0">
                      <h3 className="text-sm font-normal text-foreground truncate">{chat.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {chat.messages[chat.messages.length - 1]?.content || ""}
                      </p>
                    </div>
                    <div className="relative shrink-0 flex items-center" style={{ width: `${members.length * 14 + 14}px` }}>
                      {members.map((m, mi) => (
                        <div
                          key={mi}
                          className={`w-7 h-7 rounded-full ${m.bg} flex items-center justify-center text-[9px] ${m.text} ring-2 ring-background absolute group/avatar`}
                          style={{ left: `${mi * 14}px`, zIndex: members.length - mi }}
                        >
                          {m.initials}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-foreground text-background text-xs whitespace-nowrap opacity-0 invisible group-hover/avatar:opacity-100 group-hover/avatar:visible transition-all pointer-events-none z-50 text-center shadow-lg">
                            <div className="font-normal">{m.name}</div>
                            <div className="text-background/70">{m.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setChatMenu(chatMenu === chat.name ? null : chat.name);
                      }}
                      className="shrink-0 p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    <span className="text-xs text-muted-foreground shrink-0">{["Apr 5", "Apr 3", "Mar 28", "Mar 25", "Mar 19", "Mar 14", "Mar 10", "Mar 5", "Feb 27", "Feb 20"][i] || "Mar 19"}</span>
                    {chatMenu === chat.name && (
                      <>
                      <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setChatMenu(null); setMoveSubmenuOpen(null); }} />
                      <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-2xl shadow-lg py-3 z-50 min-w-[200px]" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setRenamingChat(chat.name);
                            setRenameValue(chat.name);
                            setChatMenu(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                        >
                          <Pencil size={16} />
                          Rename
                        </button>
                        <div
                          className="relative"
                          onMouseEnter={() => setMoveSubmenuOpen(chat.name)}
                          onMouseLeave={() => setMoveSubmenuOpen(null)}
                        >
                          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors">
                            <FolderOpen size={16} />
                            <span className="flex-1 text-left">Move to project</span>
                            <ChevronRight size={14} className="text-muted-foreground" />
                          </button>
                          {moveSubmenuOpen === chat.name && (
                            <div className="absolute left-full top-0 ml-1 bg-background border border-border rounded-2xl shadow-lg py-3 z-50 min-w-[180px]">
                              <button
                                onClick={() => { setChatMenu(null); setMoveSubmenuOpen(null); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                              >
                                <Plus size={16} />
                                New project
                              </button>
                              <div className="border-t border-border my-1" />
                              {Object.entries(projectsData)
                                .filter(([pid]) => pid !== id)
                                .map(([pid, proj]) => (
                                  <button
                                    key={pid}
                                    onClick={() => {
                                      setChatHistory((prev) => prev.filter((c) => c.name !== chat.name));
                                      setChatMenu(null);
                                      setMoveSubmenuOpen(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                                  >
                                    <FolderOpen size={16} className="text-muted-foreground" />
                                    {proj.name}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setChatHistory((prev) => prev.filter((c) => c.name !== chat.name));
                            setChatMenu(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-accent transition-colors"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                      </>
                    )}
                  </div>
                ))}
                {allChats.length === 0 && (
                  <div className="text-center py-24">
                    <p className="text-sm font-normal text-foreground">No chats yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Chats in {project.name} will live here</p>
                  </div>
                )}
              </div>
          </div>
      </div>
      {shareOpen && <ShareModal projectName={project.name} onClose={() => setShareOpen(false)} />}

      {/* Project Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSettingsOpen(false)} />
          <div className="relative bg-background rounded-2xl border border-border shadow-xl w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto">
            <div className="p-6 pb-0">
              <h2 className="text-lg font-semibold text-foreground mb-6">Project Settings</h2>

              {/* Project Name */}
              <div className="mb-5">
                <label className="text-sm font-medium text-foreground mb-2 block">Project Name</label>
                <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2.5">
                  <SharedFolderIcon size={18} className="text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    value={settingsName}
                    onChange={(e) => setSettingsName(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-foreground"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-5">
                <label className="text-sm font-medium text-foreground mb-2 block">Instructions</label>
                <textarea
                  value={settingsInstructions}
                  onChange={(e) => setSettingsInstructions(e.target.value)}
                  placeholder='e.g. "Respond in Spanish. Keep answers short and focused."'
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/20 resize-y"
                />
              </div>

              {/* Files */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Files</label>
                  <label className="px-3 py-1 rounded-full border border-border text-sm text-foreground hover:bg-accent transition-colors cursor-pointer">
                    <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                    Add
                  </label>
                </div>
                {uploadedFiles.length === 0 ? (
                  <label className="flex flex-col items-center justify-center py-10 text-center cursor-pointer rounded-xl border border-dashed border-border hover:bg-accent/30 transition-colors">
                    <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                    <FileText size={24} className="text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground leading-relaxed px-8">
                      Add documents, code files, images, and more. <span className="font-semibold text-foreground">{settingsName}</span> can access their contents when you chat inside the project.
                    </p>
                  </label>
                ) : (
                  <div className="rounded-xl border border-border overflow-hidden max-h-[200px] overflow-y-auto">
                    {uploadedFiles.map((file, i) => {
                      const ext = file.name.split('.').pop()?.toUpperCase() || '';
                      const isPdf = ext === 'PDF';
                      const isImage = ['PNG', 'JPG', 'JPEG', 'GIF', 'WEBP', 'SVG'].includes(ext);
                      const isDoc = ['DOC', 'DOCX'].includes(ext);
                      const isXls = ['XLS', 'XLSX', 'CSV'].includes(ext);
                      const bgColor = isPdf ? 'bg-red-500' : isImage ? 'bg-blue-500' : isDoc ? 'bg-blue-600' : isXls ? 'bg-green-500' : 'bg-muted-foreground';
                      const typeLabel = isPdf ? 'PDF' : isImage ? ext : isDoc ? 'DOC' : isXls ? 'XLS' : ext;

                      return (
                        <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-border' : ''}`}>
                          <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              {isImage ? (
                                <>
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                  <circle cx="8.5" cy="8.5" r="1.5" />
                                  <polyline points="21 15 16 10 5 21" />
                                </>
                              ) : (
                                <>
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </>
                              )}
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{typeLabel}</p>
                          </div>
                          <button
                            onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                            className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4">
              <button onClick={() => setDeleteConfirmOpen(true)} className="text-sm text-destructive hover:text-destructive/80 transition-colors">
                Delete project
              </button>
              <button
                onClick={() => setSettingsOpen(false)}
                className="px-5 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirmOpen(false)} />
          <div className="relative bg-background rounded-2xl border border-border shadow-xl w-full max-w-md p-6 z-10">
            <h2 className="text-lg font-semibold text-foreground mb-3">Delete project?</h2>
            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-semibold">This will permanently delete all project files and chats.</span>
              To save chats, move them to your chat list or another project before deleting.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setSettingsOpen(false);
                  navigate(`${basePath}/teams`);
                }}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions Modal */}
      {instructionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setInstructionsModalOpen(false)} />
          <div className="relative bg-background rounded-xl border border-border shadow-xl w-full max-w-2xl p-6 z-10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-medium text-foreground mb-1">Set project instructions</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Provide Use.ai with relevant instructions and information for chats within {project.name}. This will work alongside{" "}
              <a href="https://use.ai/it/help" target="_blank" rel="noopener noreferrer" className="underline">user preferences</a>{" "}
              and the selected style in a chat.
            </p>
            <textarea
              value={instructionsDraft}
              onChange={(e) => setInstructionsDraft(e.target.value)}
              placeholder="Enter instructions for Use.ai..."
              rows={12}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/20 resize-y mb-4"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setInstructionsModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setSettingsInstructions(instructionsDraft); setInstructionsModalOpen(false); }}
                className="px-4 py-2 rounded-lg bg-foreground text-background text-sm hover:bg-foreground/90 transition-colors"
              >
                Save instructions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
