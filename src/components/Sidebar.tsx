import { useState } from "react";
import logo from "@/assets/logo.svg";
import { PenLine, Image, LayoutGrid, Moon, PanelLeft, ChevronDown, ChevronUp, ChevronRight, ArrowRight, X, Info, SquarePlus, HelpCircle, User, Star, LogOut, Users, MoreHorizontal, Pencil, FolderOpen, Plus, Trash2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const baseNavItems = [
  { icon: PenLine, label: "Start new", path: "/" },
  { icon: Image, label: "Images", path: "/" },
  { icon: LayoutGrid, label: "Apps", path: "/" },
];

const teamNavItem = { icon: Users, label: "Team", path: "/team-feature/teams" };

interface SidebarProps {
  showTeams?: boolean;
  showInvite?: boolean;
  showOrg?: boolean;
  showOrgName?: boolean;
  basePath?: string;
  hideTeamSections?: boolean;
  hideNewProject?: boolean;
  hideDelete?: boolean;
  hideTeamChatActions?: boolean;
  onTeamClick?: () => void;
  customProjects?: { name: string; id: string; chats: string[] }[];
}

const projects = [
  { name: "Project Ruby Labs", id: "1", chats: ["Q4 Strategy alignment", "Claude settings help", "Design system updates"] },
  { name: "Project Empty", id: "2", chats: [] },
];

const recentChats = [
  { name: "Claude settings help" },
  { name: "ChatGPT settings help" },
  { name: "Gemini settings help" },
];

const roles = ["User", "Admin"] as const;
const tiers = ["Standard", "Pro"] as const;

const Sidebar = ({ showTeams = true, showInvite = true, showOrg = true, showOrgName, basePath = "/team-feature", hideTeamSections = false, hideNewProject = false, hideDelete = false, hideTeamChatActions = false, onTeamClick, customProjects }: SidebarProps) => {
  const sidebarProjects = customProjects || projects;
  const teamNavPath = `${basePath}/teams`;
  const navItems = showTeams ? [...baseNavItems, { icon: Users, label: "Team", path: teamNavPath }] : baseNavItems;
  const navigate = useNavigate();
  const location = useLocation();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("User");
  const [tier, setTier] = useState<string>("Standard");
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({ "1": true, "2": true });
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [chatMenuOpen, setChatMenuOpen] = useState<string | null>(null);
  const [chatMoveSubmenu, setChatMoveSubmenu] = useState<string | null>(null);
  const [chatMenuPos, setChatMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <aside className="flex flex-col h-screen w-[260px] border-r border-sidebar-border bg-sidebar-surface shrink-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <img src={logo} alt="use.ai" className="h-6 cursor-pointer" onClick={() => navigate("/")} />
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground"><Moon size={18} /></button>
            <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground"><PanelLeft size={18} /></button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-3 mt-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === "Team" && onTeamClick) {
                  onTeamClick();
                } else {
                  navigate(item.path);
                }
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-text hover:bg-accent transition-colors"
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Scrollable middle section */}
        <div className="flex-1 overflow-y-auto min-h-0 px-3 mt-6">
          {/* Team projects */}
          {!hideTeamSections && (
            <>
              <p className="text-xs text-muted-foreground px-3 mb-2">Team projects</p>
              {!hideNewProject && (
                <button
                  onClick={() => navigate(basePath)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-text hover:bg-accent transition-colors w-full"
                >
                  <SquarePlus size={18} />
                  <span>New project</span>
                </button>
              )}
              {sidebarProjects.map((proj) => (
                <div key={proj.id}>
                  <button
                    onClick={() => navigate(`${basePath}/project/${proj.id}`)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full transition-colors ${
                      location.pathname === `${basePath}/project/${proj.id}` ? "bg-accent text-foreground" : "text-sidebar-text hover:bg-accent"
                    }`}
                  >
                    <span
                      className="flex-shrink-0"
                      onClick={(e) => { e.stopPropagation(); toggleProject(proj.id); }}
                    >
                      {expandedProjects[proj.id] ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 19a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4l2 3h9a2 2 0 0 1 2 2v1" />
                          <path d="M21.5 12H6.5a2 2 0 0 0-2 2.1L5 21h14.4a2 2 0 0 0 2-1.7l1.1-5.6a2 2 0 0 0-1-2.2z" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                      )}
                    </span>
                    <span>{proj.name}</span>
                  </button>
                  {expandedProjects[proj.id] && proj.chats.map((chat) => (
                    <div key={chat} className="relative group/chat flex items-center">
                      <button
                        className="pl-12 pr-8 py-1.5 text-sm text-sidebar-text hover:bg-accent rounded-lg w-full text-left transition-colors truncate"
                      >
                        {chat}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const key = `${proj.id}-${chat}`;
                          if (chatMenuOpen === key) {
                            setChatMenuOpen(null);
                          } else {
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            setChatMenuPos({ top: rect.top, left: rect.right + 4 });
                            setChatMenuOpen(key);
                          }
                        }}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-opacity ${chatMenuOpen === `${proj.id}-${chat}` ? 'opacity-100' : 'opacity-0 group-hover/chat:opacity-100'}`}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ))}

              {/* Team chats */}
              <p className="text-xs text-muted-foreground px-3 mb-2 mt-6">Team chats</p>
              {[
                { name: "Q4 Strategy alignment" },
                { name: "Claude settings help" },
                { name: "Design system updates" },
              ].map((chat) => (
                <div key={chat.name} className="relative group/teamchat flex items-center">
                  <button
                    className="flex items-center px-3 py-2 rounded-lg text-sm text-sidebar-text hover:bg-accent w-full text-left transition-colors truncate"
                  >
                    {chat.name}
                  </button>
                  {!hideTeamChatActions && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const key = `teamchat-${chat.name}`;
                        if (chatMenuOpen === key) {
                          setChatMenuOpen(null);
                        } else {
                          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          setChatMenuPos({ top: rect.top, left: rect.right + 4 });
                          setChatMenuOpen(key);
                        }
                      }}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-opacity ${chatMenuOpen === `teamchat-${chat.name}` ? 'opacity-100' : 'opacity-0 group-hover/teamchat:opacity-100'}`}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  )}
                </div>
              ))}
            </>
          )}

          {/* My projects */}
          <p className="text-xs text-muted-foreground px-3 mb-2 mt-6">My projects</p>
          <button
            onClick={() => navigate(basePath)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-text hover:bg-accent transition-colors w-full"
          >
            <SquarePlus size={18} />
            <span>New project</span>
          </button>
          <button
            onClick={() => navigate(`${basePath}/project/99`)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-text hover:bg-accent transition-colors w-full"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span>Personal Project</span>
          </button>

          {/* My chats */}
          <p className="text-xs text-muted-foreground px-3 mb-2 mt-6">My chats</p>
          {recentChats.map((chat) => (
            <button
              key={chat.name}
              className="flex items-center px-3 py-2 rounded-lg text-sm text-sidebar-text hover:bg-accent w-full text-left transition-colors"
            >
              {chat.name}
            </button>
          ))}
        </div>

        {/* Chat context menu - rendered outside scroll container */}
        {chatMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => { setChatMenuOpen(null); setChatMoveSubmenu(null); }} />
            <div
              className="fixed bg-background border border-border rounded-2xl shadow-lg py-3 z-50 min-w-[200px]"
              style={{ top: chatMenuPos.top, left: chatMenuPos.left }}
              onClick={(e) => e.stopPropagation()}
            >
              {!chatMenuOpen.startsWith('teamchat-') && (
                <>
                  <button
                    onClick={() => setChatMenuOpen(null)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                  >
                    <Pencil size={16} />
                    Rename
                  </button>
                  <div
                    className="relative"
                    onMouseEnter={() => setChatMoveSubmenu(chatMenuOpen)}
                    onMouseLeave={() => setChatMoveSubmenu(null)}
                  >
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors">
                      <FolderOpen size={16} />
                      <span className="flex-1 text-left">Move to project</span>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </button>
                    {chatMoveSubmenu === chatMenuOpen && (
                      <div className="absolute left-full top-0 ml-1 bg-background border border-border rounded-2xl shadow-lg py-3 z-50 min-w-[180px]">
                        <button
                          onClick={() => { setChatMenuOpen(null); setChatMoveSubmenu(null); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                        >
                          <Plus size={16} />
                          New project
                        </button>
                        <div className="border-t border-border my-1" />
                        {projects
                          .filter((p) => !chatMenuOpen.startsWith(p.id))
                          .map((p) => (
                            <button
                              key={p.id}
                              onClick={() => { setChatMenuOpen(null); setChatMoveSubmenu(null); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
                            >
                              <FolderOpen size={16} className="text-muted-foreground" />
                              {p.name}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </>
              )}
              {(!hideDelete || chatMenuOpen.startsWith('teamchat-')) && (
                <button
                  onClick={() => setChatMenuOpen(null)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-accent transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="px-3 pb-3">
        </div>

        <div className="border-t border-sidebar-border px-3 py-3 relative">
          {profileMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
              <div className="absolute bottom-full left-3 right-3 mb-1 bg-background border border-border rounded-xl shadow-lg z-50 py-2">
                <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-normal text-foreground hover:bg-accent w-full transition-colors">
                  <Moon size={18} className="text-muted-foreground" />
                  <span>Switch to Dark Mode</span>
                </button>
                <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-normal text-foreground hover:bg-accent w-full transition-colors">
                  <HelpCircle size={18} className="text-muted-foreground" />
                  <span>Get Help</span>
                </button>
                <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-normal text-foreground hover:bg-accent w-full transition-colors">
                  <User size={18} className="text-muted-foreground" />
                  <span>My profile</span>
                </button>
                {showOrg && (
                  <button
                    onClick={() => { setProfileMenuOpen(false); navigate(`${basePath}/my-organization`); }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-normal text-foreground hover:bg-accent w-full transition-colors"
                  >
                    <Users size={18} className="text-muted-foreground" />
                    <span>My organization</span>
                  </button>
                )}
                <button
                  onClick={() => { setProfileMenuOpen(false); navigate(showOrg ? "/onboarding" : "/onboarding?upgrade=true"); }}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-normal text-foreground hover:bg-accent w-full transition-colors"
                >
                  <Star size={18} className="text-muted-foreground" />
                  <span>Upgrade Plan</span>
                </button>
                <div className="border-t border-border my-1" />
                <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-normal text-foreground hover:bg-accent w-full transition-colors">
                  <LogOut size={18} className="text-muted-foreground" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          )}
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-full hover:bg-accent w-full transition-colors border border-border"
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-normal text-muted-foreground shrink-0">
              AT
            </div>
            <div className="flex-1 text-left min-w-0">
              <span className="text-sm font-normal text-foreground block truncate">Alessandro Tunzi</span>
              {(showOrg || showOrgName) && <span className="text-xs text-muted-foreground block truncate">RubyLabs</span>}
            </div>
            <ChevronDown size={16} className="text-muted-foreground shrink-0" />
          </button>
        </div>
      </aside>

    </>
  );
};

export default Sidebar;
