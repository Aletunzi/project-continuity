import { useState } from "react";
import { X, Lock, ChevronDown, Pencil, MessageCircle, UserMinus, Info, Link2 } from "lucide-react";

type Permission = "Can edit" | "Can chat";

type Member = {
  initials: string;
  name: string;
  email?: string;
  role: "Owner" | Permission;
  color: string;
  isYou?: boolean;
  inviteSent?: boolean;
};

interface ShareModalProps {
  projectName: string;
  onClose: () => void;
}

const ShareModal = ({ projectName, onClose }: ShareModalProps) => {
  const [emailInput, setEmailInput] = useState("");
  const [members, setMembers] = useState<Member[]>([
    { initials: "AT", name: "Alessandro Tunzi (you)", role: "Owner", color: "bg-primary", isYou: true },
    { initials: "P", name: "user2@gmail.com", role: "Can edit", color: "bg-amber-700", inviteSent: true },
    { initials: "P", name: "user3@gmail.com", role: "Can edit", color: "bg-amber-700", inviteSent: true },
  ]);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [removeConfirm, setRemoveConfirm] = useState<number | null>(null);

  const handlePermissionChange = (index: number, perm: Permission) => {
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, role: perm } : m)));
    setDropdownOpen(null);
  };

  const handleRemoveClick = (index: number) => {
    setDropdownOpen(null);
    setRemoveConfirm(index);
  };

  const confirmRemove = () => {
    if (removeConfirm !== null) {
      setMembers((prev) => prev.filter((_, i) => i !== removeConfirm));
      setRemoveConfirm(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-xl border border-border shadow-xl w-full max-w-lg p-6 z-10">
        {/* Remove confirmation overlay */}
        {removeConfirm !== null && (
          <div className="absolute inset-0 z-20 bg-background/80 rounded-xl flex items-center justify-center">
            <div className="bg-background border border-border rounded-xl p-6 max-w-sm mx-4 shadow-lg">
              <p className="text-sm text-foreground mb-2">
                Remove {members[removeConfirm]?.name} from {projectName}?
              </p>
              <p className="text-xs text-muted-foreground mb-5">
                <span className="font-normal">{members[removeConfirm]?.name}</span> will lose access to all contents in this project.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setRemoveConfirm(null)}
                  className="px-4 py-2 text-sm border border-border rounded-lg text-foreground hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemove}
                  className="px-4 py-2 text-sm rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-normal text-foreground">Share {projectName}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-accent text-muted-foreground">
            <X size={18} />
          </button>
        </div>

        {/* Email input */}
        <input
          type="text"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder="Email, separated by commas"
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/20 mb-5"
        />

        {/* Who has access */}
        <p className="text-sm font-normal text-foreground mb-3">Who has access</p>

        <div className="flex items-center gap-2 mb-4">
          <Lock size={14} className="text-muted-foreground" />
          <span className="text-sm text-foreground">Only those invited</span>
          <ChevronDown size={14} className="text-muted-foreground" />
        </div>

        {/* Members list */}
        <div className="space-y-3 mb-5">
          {members.map((member, i) => (
            <div key={i} className="flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full ${member.color} flex items-center justify-center text-[10px] text-primary-foreground`}>
                  {member.initials}
                </div>
                <div>
                  <span className="text-sm text-foreground">{member.name}</span>
                  {member.inviteSent && (
                    <span className="text-xs text-muted-foreground ml-1">(invite sent)</span>
                  )}
                </div>
              </div>

              {member.isYou ? (
                <span className="text-sm text-muted-foreground">Owner</span>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(dropdownOpen === i ? null : i)}
                    className="flex items-center gap-1 text-sm text-foreground hover:bg-accent px-2 py-1 rounded-lg transition-colors"
                  >
                    {member.role} <ChevronDown size={14} className="text-muted-foreground" />
                  </button>

                  {dropdownOpen === i && (
                    <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded-lg shadow-lg py-1 z-30 min-w-[220px]">
                      <button
                        onClick={() => handlePermissionChange(i, "Can chat")}
                        className="w-full text-left px-4 py-2.5 hover:bg-accent transition-colors flex items-center gap-3"
                      >
                        <MessageCircle size={14} className="text-muted-foreground" />
                        <div>
                          <p className={`text-sm ${member.role === "Can chat" ? "text-primary" : "text-foreground"}`}>Can chat</p>
                          <p className="text-xs text-muted-foreground">Chat and view project content</p>
                        </div>
                        {member.role === "Can chat" && <span className="ml-auto text-primary">✓</span>}
                      </button>
                      <button
                        onClick={() => handlePermissionChange(i, "Can edit")}
                        className="w-full text-left px-4 py-2.5 hover:bg-accent transition-colors flex items-center gap-3"
                      >
                        <Pencil size={14} className="text-muted-foreground" />
                        <div>
                          <p className={`text-sm ${member.role === "Can edit" ? "text-primary" : "text-foreground"}`}>Can edit</p>
                          <p className="text-xs text-muted-foreground">Chat and edit project content</p>
                        </div>
                        {member.role === "Can edit" && <span className="ml-auto text-primary">✓</span>}
                      </button>
                      <div className="border-t border-border my-1" />
                      <button
                        onClick={() => handleRemoveClick(i)}
                        className="w-full text-left px-4 py-2.5 hover:bg-accent transition-colors flex items-center gap-3"
                      >
                        <UserMinus size={14} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">Remove from project</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info box */}
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/50 border border-border mb-5">
          <Info size={16} className="text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-foreground font-normal">This project may include personal information</p>
            <p className="text-xs text-muted-foreground">
              All project contents are visible to collaborators. Personal memories are disabled for shared projects.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-4">
          <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors text-xs font-normal">in</button>
          <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors text-xs font-normal">r/</button>
          <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors text-xs font-normal">X</button>
          <button className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-full text-sm text-foreground hover:bg-accent transition-colors">
            <Link2 size={14} />
            Copy link
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
