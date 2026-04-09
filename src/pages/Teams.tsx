import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, Plus, Building2, Lock, X, Info, Download, MoreHorizontal, Copy, CreditCard, ArrowUp, ThumbsUp, ThumbsDown, AudioLines } from "lucide-react";

const teamsData = [
  {
    id: 1,
    name: "Project Ruby Labs",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
    updatedAt: "Updated 37 minutes ago",
  },
  {
    id: 2,
    name: "Project Empty",
    description: "# Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vehicula nulla vitae magna fermentum e…",
    updatedAt: "Updated 22 hours ago",
  },
];

type MemberRole = "Owner" | "Member" | "Primary Owner";
type MemberTier = "Standard" | "Pro";

const initialMembersData: { name: string; email: string; role: MemberRole; tier: MemberTier; status: string; isOwner: boolean }[] = [
  { name: "Evgenii Akinshin", email: "akinshinevgenii@gmail.com", role: "Owner", tier: "Pro", status: "Active", isOwner: true },
  { name: "Alessandro Tunzi", email: "alessandro@rubylabs.com", role: "Member", tier: "Pro", status: "Active", isOwner: false },
  { name: "Paolo Rossi", email: "paolo@rubylabs.com", role: "Member", tier: "Standard", status: "Active", isOwner: false },
  { name: "Marco Bianchi", email: "marco@rubylabs.com", role: "Member", tier: "Standard", status: "Active", isOwner: false },
  { name: "Sofia Conti", email: "sofia@rubylabs.com", role: "Member", tier: "Pro", status: "Active", isOwner: false },
];

const sortOptions = ["Recent activity", "Last modified", "Date created"] as const;
type SortOption = typeof sortOptions[number];

const Teams = ({ basePath = "/team-feature", hideProjects = false, hideAddProject = false, hideAddMember = false, hideMemberActions = false, hideTeamChatActions = false, showProjectSubTabs = false }: { basePath?: string; hideProjects?: boolean; hideAddProject?: boolean; hideAddMember?: boolean; hideMemberActions?: boolean; hideTeamChatActions?: boolean; showProjectSubTabs?: boolean }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [projectSubTab, setProjectSubTab] = useState<"your" | "team" | "shared">("your");
  const [sortBy, setSortBy] = useState<SortOption>("Recent activity");
  const [sortOpen, setSortOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"projects" | "chats" | "files" | "members">("projects");
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectGoal, setProjectGoal] = useState("");
  const [visibility, setVisibility] = useState<"org" | "private">("org");
  const [teamName, setTeamName] = useState("RubyLabs");
  const originalTeamName = "RubyLabs";
  const originalTeamLogo = "/favicon.ico";
  const [memberSearch, setMemberSearch] = useState("");
  const [membersData, setMembersData] = useState(hideProjects ? initialMembersData.filter(m => m.isOwner) : initialMembersData);
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);
  const [openTierDropdown, setOpenTierDropdown] = useState<string | null>(null);
  const [openMemberMenu, setOpenMemberMenu] = useState<string | null>(null);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");
  const [inviteTier, setInviteTier] = useState("Standard");
  const [memberBreakdownOpen, setMemberBreakdownOpen] = useState(false);
  const [seatBreakdownOpen, setSeatBreakdownOpen] = useState(false);
  const [changeSeatsOpen, setChangeSeatsOpen] = useState(false);
  const [adjustedStandard, setAdjustedStandard] = useState(5);
  const [adjustedPremium, setAdjustedPremium] = useState(0);
  const [domainsOpen, setDomainsOpen] = useState(false);
  const [discoverable, setDiscoverable] = useState(false);
  const [approvalSetting, setApprovalSetting] = useState("require");
  const [inviteLink, setInviteLink] = useState(false);
  const [memberInvites, setMemberInvites] = useState(true);
  const [teamLogo, setTeamLogo] = useState<string>("/favicon.ico");
  const [logoUploadOpen, setLogoUploadOpen] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const hasTeamChanges = teamName !== originalTeamName || teamLogo !== originalTeamLogo;
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string }[]>([]);
  const [chatTabMenu, setChatTabMenu] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTeamChat, setActiveTeamChat] = useState<{ title: string; messages: { role: "user" | "assistant"; content: string }[]; avatars: { initials: string; bg: string; name: string; email: string }[] } | null>(null);
  const [teamChatReply, setTeamChatReply] = useState("");

  const handleSendTeamChatReply = () => {
    if (!teamChatReply.trim() || !activeTeamChat) return;
    setActiveTeamChat({
      ...activeTeamChat,
      messages: [
        ...activeTeamChat.messages,
        { role: "user", content: teamChatReply.trim() },
        { role: "assistant", content: "Thanks for your message! How else can I help?" },
      ],
    });
    setTeamChatReply("");
  };

  const getFileCategory = (fileName: string): { label: string; color: string } => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (['pdf'].includes(ext)) return { label: 'PDF', color: 'bg-red-500' };
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return { label: ext.toUpperCase(), color: 'bg-blue-500' };
    if (['doc', 'docx'].includes(ext)) return { label: 'DOC', color: 'bg-blue-600' };
    if (['xls', 'xlsx'].includes(ext)) return { label: 'XLS', color: 'bg-green-600' };
    if (['ppt', 'pptx'].includes(ext)) return { label: 'PPT', color: 'bg-orange-500' };
    if (['txt', 'md'].includes(ext)) return { label: 'TXT', color: 'bg-gray-500' };
    return { label: ext.toUpperCase() || 'FILE', color: 'bg-muted-foreground' };
  };

  const getFileIcon = (fileName: string) => {
    const { label } = getFileCategory(fileName);
    const isPdf = label === 'PDF';
    const isImage = ['PNG', 'JPG', 'JPEG', 'GIF', 'WEBP', 'SVG'].includes(label);
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
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
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map(f => ({ name: f.name, type: f.type }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    e.target.value = '';
  };
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple_pay" | "google_pay" | "paypal">("card");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 8268");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTeamLogo(url);
      setLogoUploadOpen(false);
    }
  };

  const currentStandard = 5;
  const currentPremium = 0;
  const costPerSeat = 25;
  const minSeats = 5;
  const standardDiff = adjustedStandard - currentStandard;
  const premiumDiff = adjustedPremium - currentPremium;
  const totalDiff = standardDiff + premiumDiff;
  const totalAdjusted = adjustedStandard + adjustedPremium;
  const standardCost = standardDiff > 0 ? standardDiff * costPerSeat : 0;
  const premiumCost = premiumDiff > 0 ? premiumDiff * costPerSeat : 0;
  const totalCost = standardCost + premiumCost;
  const belowMinimum = totalAdjusted < minSeats;

  const projectSearchFiltered = teamsData.filter(
    (team) =>
      team.name.toLowerCase().includes((showProjectSubTabs ? projectSearchQuery : searchQuery).toLowerCase()) ||
      team.description.toLowerCase().includes((showProjectSubTabs ? projectSearchQuery : searchQuery).toLowerCase())
  );

  const filteredTeams = teamsData.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMembers = membersData.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const handleCreateProject = () => {
    setNewProjectOpen(false);
    setProjectName("");
    setProjectGoal("");
    setVisibility("org");
  };

  // Team tab content
  const renderTeamView = () => (
    <div className="space-y-8">
      {/* Team overview */}
      <div>
        <h2 className="text-lg font-normal text-foreground mb-4">Team overview</h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-normal text-foreground">rubylabs.com & 2 more</p>
            <p className="text-xs text-muted-foreground mt-0.5">Allowed email domains</p>
            <button className="text-xs text-primary hover:underline mt-1" onClick={() => setDomainsOpen(true)}>Update</button>
          </div>
          <div>
            <p className="text-sm font-normal text-foreground">5 (3 available)</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total seats</p>
            <button className="text-xs text-primary hover:underline mt-1" onClick={() => setSeatBreakdownOpen(true)}>Manage</button>
          </div>
          <div>
            <p className="text-sm font-normal text-foreground">2 (0 unassigned)</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total members</p>
            <button className="text-xs text-primary hover:underline mt-1" onClick={() => setMemberBreakdownOpen(true)}>View details</button>
          </div>
        </div>
      </div>

      {/* Member breakdown overlay */}
      {memberBreakdownOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setMemberBreakdownOpen(false)}>
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" onClick={() => setMemberBreakdownOpen(false)}>
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold text-foreground mb-1">Member breakdown</h3>
            <p className="text-sm text-muted-foreground mb-6">Active members by seat tier. Unassigned members do not count towards your seat usage.</p>
            <div className="space-y-0 divide-y divide-border">
              <div className="flex justify-between py-3">
                <span className="text-sm text-foreground">Standard members</span>
                <span className="text-sm text-foreground font-medium">2</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm text-foreground">Premium members</span>
                <span className="text-sm text-foreground font-medium">0</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm text-foreground">Unassigned members</span>
                <span className="text-sm text-foreground font-medium">0</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm font-semibold text-foreground">Total members</span>
                <span className="text-sm font-semibold text-foreground">2</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button className="bg-foreground text-background px-6 py-2 rounded-md text-sm font-medium hover:opacity-90" onClick={() => setMemberBreakdownOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Seat usage breakdown modal */}
      {seatBreakdownOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSeatBreakdownOpen(false)}>
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" onClick={() => setSeatBreakdownOpen(false)}>
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold text-foreground mb-1">Seat usage breakdown</h3>
            <p className="text-sm text-muted-foreground mb-6">Current seats are the seats purchased in your subscription. Unassigned members do not count towards your seat usage.</p>
            
            <div className="grid grid-cols-3 gap-4 mb-2">
              <span className="text-xs text-muted-foreground">Current seats</span>
              <span className="text-xs text-muted-foreground text-right">Claimed</span>
              <span className="text-xs text-muted-foreground text-right">Available</span>
            </div>
            <div className="divide-y divide-border">
              <div className="grid grid-cols-3 gap-4 py-3">
                <span className="text-sm text-foreground">5 standard seats</span>
                <span className="text-sm text-foreground text-right">2</span>
                <span className="text-sm text-foreground text-right">3</span>
              </div>
              <div className="grid grid-cols-3 gap-4 py-3">
                <span className="text-sm text-foreground">0 premium seats</span>
                <span className="text-sm text-foreground text-right">0</span>
                <span className="text-sm text-foreground text-right">0</span>
              </div>
              <div className="grid grid-cols-3 gap-4 py-3">
                <span className="text-sm font-semibold text-foreground">Total</span>
                <span className="text-sm font-semibold text-foreground text-right">2</span>
                <span className="text-sm font-semibold text-foreground text-right">3</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button 
                className="bg-foreground text-background px-6 py-2 rounded-md text-sm font-medium hover:opacity-90"
                onClick={() => { setSeatBreakdownOpen(false); setAdjustedStandard(currentStandard); setAdjustedPremium(currentPremium); setChangeSeatsOpen(true); }}
              >
                Add or change seats
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add or change seats modal */}
      {changeSeatsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setChangeSeatsOpen(false)}>
          <div className="bg-background rounded-lg shadow-lg w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" onClick={() => setChangeSeatsOpen(false)}>
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold text-foreground mb-6">Add or change seats</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-2">
              <span className="text-xs text-muted-foreground">Current seats</span>
              <span className="text-xs text-muted-foreground text-center">Adjusted seats</span>
              <span className="text-xs text-muted-foreground text-right">Cost change</span>
            </div>
            <div className="divide-y divide-border">
              <div className="grid grid-cols-3 gap-4 py-4 items-center">
                <div>
                  <p className="text-sm font-medium text-foreground">5 Standard</p>
                  <p className="text-xs text-muted-foreground">3 unclaimed</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="flex items-center border border-border rounded-md">
                    <button className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" onClick={() => setAdjustedStandard(Math.max(0, adjustedStandard - 1))}>−</button>
                    <span className="px-4 py-1.5 text-sm text-foreground min-w-[40px] text-center">{adjustedStandard}</span>
                    <button className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" onClick={() => setAdjustedStandard(adjustedStandard + 1)}>+</button>
                  </div>
                </div>
                <p className="text-sm text-foreground text-right">{standardCost > 0 ? `+$${standardCost.toFixed(2)}` : '$0.00'}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 py-4 items-center">
                <div>
                  <p className="text-sm font-medium text-foreground">0 Premium</p>
                  <p className="text-xs text-muted-foreground">0 unclaimed</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="flex items-center border border-border rounded-md">
                    <button className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" onClick={() => setAdjustedPremium(Math.max(0, adjustedPremium - 1))}>−</button>
                    <span className="px-4 py-1.5 text-sm text-foreground min-w-[40px] text-center">{adjustedPremium}</span>
                    <button className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" onClick={() => setAdjustedPremium(adjustedPremium + 1)}>+</button>
                  </div>
                </div>
                <p className="text-sm text-foreground text-right">{premiumCost > 0 ? `+$${premiumCost.toFixed(2)}` : '$0.00'}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 py-4 items-center">
                <p className="text-sm font-semibold text-foreground">{currentStandard + currentPremium} Total</p>
                <p className="text-sm font-medium text-foreground text-center">{totalDiff > 0 ? `+${totalDiff}` : totalDiff}</p>
                <p className="text-sm font-semibold text-foreground text-right">{totalCost > 0 ? `+$${totalCost.toFixed(2)}` : '$0.00'}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-4">Any proration credits for unused time will be applied in the next step.</p>

            {belowMinimum && (
              <div className="mt-3 p-3 bg-accent/50 rounded-md">
                <p className="text-sm text-muted-foreground">Team plans require a minimum of {minSeats} seats</p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button className="px-6 py-2 rounded-md border border-border text-sm font-medium text-foreground hover:bg-accent transition-colors" onClick={() => setChangeSeatsOpen(false)}>Cancel</button>
              <button 
                className={`px-6 py-2 rounded-md text-sm font-medium transition-opacity ${belowMinimum || totalDiff === 0 ? 'bg-foreground/50 text-background cursor-not-allowed' : 'bg-foreground text-background hover:opacity-90'}`}
                disabled={belowMinimum || totalDiff === 0}
                onClick={() => setChangeSeatsOpen(false)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Domains & Organization access modal */}
      {domainsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDomainsOpen(false)}>
          <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" onClick={() => setDomainsOpen(false)}>
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-semibold text-foreground mb-1">Domains</h3>
            <p className="text-sm text-muted-foreground mb-4">Verified email domains associated with your organization.</p>

            <div className="border border-border rounded-lg mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs text-muted-foreground font-normal px-4 py-2.5">
                      <span className="flex items-center gap-1">Domain <Info size={12} /></span>
                    </th>
                    <th className="text-left text-xs text-muted-foreground font-normal px-4 py-2.5">
                      <span className="flex items-center gap-1">Discoverable <Info size={12} /></span>
                    </th>
                    <th className="text-left text-xs text-muted-foreground font-normal px-4 py-2.5">
                      <span className="flex items-center gap-1">Verification <Info size={12} /></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-3 text-sm text-foreground">rubylabs.com</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDiscoverable(!discoverable)}
                        className={`w-9 h-5 rounded-full relative transition-colors ${discoverable ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-background shadow transition-transform ${discoverable ? 'left-[18px]' : 'left-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-sm text-foreground underline font-medium hover:opacity-80">Verify</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3" colSpan={3}>
                      <button className="text-sm text-primary hover:underline">Add or edit domains</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-4">Organization access</h3>

            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium text-foreground">New member approval</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Controls whether new members joining through discovery or member invites are added automatically or require owner approval.</p>
                </div>
                <select
                  value={approvalSetting}
                  onChange={(e) => setApprovalSetting(e.target.value)}
                  className="px-3 py-2 rounded-md border border-border bg-background text-sm text-foreground outline-none min-w-[200px]"
                >
                  <option value="require">Require owner approval</option>
                  <option value="auto">Add automatically</option>
                </select>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium text-foreground">Invite link</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Share a link for people with an allowed email domain to join.</p>
                </div>
                <button
                  onClick={() => setInviteLink(!inviteLink)}
                  className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${inviteLink ? 'bg-primary' : 'bg-muted'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-background shadow transition-transform ${inviteLink ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium text-foreground">Member invites</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Allow members to invite others via email. New members follow your approval settings.</p>
                </div>
                <button
                  onClick={() => setMemberInvites(!memberInvites)}
                  className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${memberInvites ? 'bg-primary' : 'bg-muted'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-background shadow transition-transform ${memberInvites ? 'left-[18px]' : 'left-0.5'}`} />
                </button>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium text-foreground">Single sign-on</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Requires at least one verified domain.</p>
                </div>
                <button className="px-4 py-2 rounded-md border border-border text-sm text-foreground hover:bg-accent transition-colors flex items-center gap-1.5">
                  Verify a domain <span className="text-xs">↗</span>
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="bg-foreground text-background px-6 py-2 rounded-md text-sm font-medium hover:opacity-90" onClick={() => setDomainsOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-border" />

      {/* Team name */}
      <div>
        <h2 className="text-lg font-normal text-foreground mb-4">Team name</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex flex-col gap-1 relative">
              <span className="text-xs text-muted-foreground">Logo</span>
              <div
                className="w-10 h-10 rounded-lg bg-accent border border-border flex items-center justify-center cursor-pointer group relative overflow-hidden"
                onClick={() => setLogoUploadOpen(true)}
              >
                {teamLogo ? (
                  <img src={teamLogo} alt="Team logo" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Building2 size={18} className="text-muted-foreground" />
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <Plus size={16} className="text-background" />
                </div>
              </div>

              {/* Logo upload popover */}
              {logoUploadOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-56">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">Upload logo</span>
                    <button className="text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); setLogoUploadOpen(false); }}>
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">Choose an image file to use as your team logo.</p>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <button
                    className="w-full px-3 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); logoInputRef.current?.click(); }}
                  >
                    Choose file
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 flex-1 max-w-[300px]">
              <span className="text-xs text-muted-foreground">Team name</span>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all mt-auto ${
              hasTeamChanges
                ? 'bg-foreground text-background hover:opacity-90'
                : 'border border-border text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            Save changes
          </button>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Members */}
      <div>
        <h2 className="text-lg font-normal text-foreground mb-4">Members</h2>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-accent transition-colors">
              All members
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border">
              <Search size={14} className="text-muted-foreground" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-[120px]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-accent transition-colors">
              <Download size={14} />
              Export CSV
            </button>
            <button
              onClick={() => setAddMemberOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-normal hover:opacity-90 transition-opacity"
            >
              Add member
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-normal text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 text-xs font-normal text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 text-xs font-normal text-muted-foreground">Seat Tier</th>
                <th className="text-left px-4 py-3 text-xs font-normal text-muted-foreground">Status</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.email} className="border-b border-border last:border-b-0 hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {member.isOwner ? (
                      <span className="text-sm text-foreground">{member.role}</span>
                    ) : (
                      <div className="relative">
                        <button
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-border text-sm text-foreground hover:bg-accent transition-colors"
                          onClick={() => setOpenRoleDropdown(openRoleDropdown === member.email ? null : member.email)}
                        >
                          {member.role}
                          <ChevronDown size={12} className="text-muted-foreground" />
                        </button>
                        {openRoleDropdown === member.email && (
                          <div className="absolute top-full left-0 mt-1 z-50 bg-background border border-border rounded-md shadow-lg py-1 min-w-[100px]">
                            {(["Owner", "Member"] as const).map((r) => (
                              <button
                                key={r}
                                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-accent transition-colors ${member.role === r ? 'text-primary font-medium' : 'text-foreground'}`}
                                onClick={() => {
                                  setMembersData(prev => prev.map(m => m.email === member.email ? { ...m, role: r } : m));
                                  setOpenRoleDropdown(null);
                                }}
                              >
                                {r}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-border text-sm text-foreground hover:bg-accent transition-colors"
                        onClick={() => setOpenTierDropdown(openTierDropdown === member.email ? null : member.email)}
                      >
                        {member.tier}
                        <ChevronDown size={12} className="text-muted-foreground" />
                      </button>
                      {openTierDropdown === member.email && (
                        <div className="absolute top-full left-0 mt-1 z-50 bg-background border border-border rounded-md shadow-lg py-1 min-w-[100px]">
                          {(["Standard", "Pro"] as const).map((t) => (
                            <button
                              key={t}
                              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-accent transition-colors ${member.tier === t ? 'text-primary font-medium' : 'text-foreground'}`}
                              onClick={() => {
                                setMembersData(prev => prev.map(m => m.email === member.email ? { ...m, tier: t } : m));
                                setOpenTierDropdown(null);
                              }}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{member.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {!member.isOwner && (
                      <div className="relative">
                        <button
                          className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setOpenMemberMenu(openMemberMenu === member.email ? null : member.email)}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        {openMemberMenu === member.email && (
                          <div className="absolute top-full right-0 mt-1 z-50 bg-background border border-border rounded-md shadow-lg py-1 min-w-[140px]">
                            <button
                              className="w-full text-left px-3 py-1.5 text-sm text-destructive hover:bg-accent transition-colors"
                              onClick={() => {
                                setMembersData(prev => prev.filter(m => m.email !== member.email));
                                setOpenMemberMenu(null);
                              }}
                            >
                              Remove member
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add member modal */}
      {addMemberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAddMemberOpen(false)} />
          <div className="relative bg-background rounded-xl border border-border shadow-xl w-full max-w-md p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-normal text-foreground">Add new member</h2>
              <button onClick={() => setAddMemberOpen(false)} className="p-1 rounded-lg hover:bg-accent text-muted-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-foreground mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div>
                <label className="text-sm text-foreground mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="your-teammate@your-domain.com"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div>
                <label className="text-sm text-foreground mb-1.5 block">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/20 appearance-none"
                >
                  {(["Member", "Owner"] as const).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-foreground mb-1.5 block">Tier</label>
                <select
                  value={inviteTier}
                  onChange={(e) => setInviteTier(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/20 appearance-none"
                >
                  {(["Standard", "Pro"] as const).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-accent/50 border border-border">
                <Info size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Billing charges for new team members will be prorated based on the date they are added.{" "}
                  <a href="https://use.ai/it/help" target="_blank" rel="noopener noreferrer" className="underline cursor-pointer">Learn more</a>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end mt-6">
              <button
                onClick={() => { setAddMemberOpen(false); setInviteName(""); setInviteEmail(""); setInviteRole("Member"); setInviteTier("Standard"); }}
                className="px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-normal hover:opacity-90 transition-opacity"
              >
                Add member
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-border" />

      {/* Organization ID */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-normal text-foreground">Organization ID</span>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-accent/30">
          <span className="text-xs text-muted-foreground font-mono">1e6378b1-a3dc-417e-8442-a39731f057b4</span>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Copy size={14} />
          </button>
        </div>
      </div>

      {/* Delete organization */}
      <div className="flex items-start gap-4">
        <span className="text-sm font-normal text-foreground shrink-0">Delete organization</span>
        <p className="text-sm text-muted-foreground">
          <a href="https://use.ai/it/help" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline cursor-pointer">Visit our help center</a> to request the deletion of your organization and its associated data. Please note that once deleted, the organization cannot be restored, and its data cannot be exported.
        </p>
      </div>
    </div>
  );

  const renderProjectCards = (teams: typeof teamsData, from?: string) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => navigate(`${basePath}/project/${team.id}${from ? `?from=${from}` : ''}`)}
            className="flex flex-col items-start text-left border border-border rounded-xl p-5 hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <h3 className="text-sm font-normal text-foreground mb-1">{team.name}</h3>
            <span className="text-xs text-muted-foreground">Project team</span>
            <span className="text-xs text-muted-foreground mt-auto pt-2">{team.updatedAt}</span>
          </button>
        ))}
      </div>
      {teams.length === 0 && (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No projects found.
        </div>
      )}
    </>
  );

  // Projects tab content
  const renderProjectsView = () => (
    <>
      {hideProjects ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No projects yet. Create your first project to get started.
        </div>
      ) : showProjectSubTabs ? (
        <>
          {/* Project search bar */}
          <div className="flex items-center gap-2 border border-border rounded-lg px-4 py-3 bg-background mb-6">
            <Search size={16} className="text-muted-foreground" />
            <input
              type="text"
              value={projectSearchQuery}
              onChange={(e) => setProjectSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
            {projectSearchQuery && (
              <button onClick={() => setProjectSearchQuery("")} className="text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-2 mb-5">
            {([["your", "Your project"], ["team", "Team"], ["shared", "Shared with you"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setProjectSubTab(key as any)}
                className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                  projectSubTab === key
                    ? "bg-accent text-foreground font-normal"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {projectSubTab === "your" && renderProjectCards([{
            id: 99,
            name: "Personal Project",
            description: "Your personal project workspace.",
            updatedAt: "Updated 37 minutes ago",
          }].filter(p => p.name.toLowerCase().includes(projectSearchQuery.toLowerCase())))}
          {projectSubTab === "team" && renderProjectCards(projectSearchFiltered)}
          {projectSubTab === "shared" && renderProjectCards([{
            id: 98,
            name: "Project shared with me",
            description: "A project shared with you by a team member.",
            updatedAt: "Updated 22 hours ago",
          }].filter(p => p.name.toLowerCase().includes(projectSearchQuery.toLowerCase())))}
        </>
      ) : (
        <>
          {renderProjectCards(filteredTeams)}
        </>
      )}
    </>
  );

  // Team chat view
  if (activeTeamChat) {
    return (
      <div className="flex-1 min-w-0 h-screen flex flex-col bg-background">
        {/* Top bar */}
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
              {activeTeamChat.avatars.map((av, i) => (
                <div key={i} className="relative group z-10 hover:z-20">
                  <div className={`w-7 h-7 rounded-full ${av.bg} flex items-center justify-center text-[10px] text-white ring-2 ring-background cursor-pointer`}>{av.initials}</div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 rounded-lg bg-foreground text-background text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50 text-center shadow-lg">
                    <div className="font-normal">{av.name}</div>
                    <div className="text-background/70">{av.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Breadcrumb */}
        <div className="px-6 pb-3 ml-2">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <button onClick={() => setActiveTeamChat(null)} className="text-muted-foreground hover:text-foreground hover:underline transition-colors">
              Team
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="truncate max-w-[200px]">{activeTeamChat.title}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-8 max-w-[900px] mx-auto w-full">
          {activeTeamChat.messages.map((msg, i) => (
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
              value={teamChatReply}
              onChange={(e) => setTeamChatReply(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendTeamChatReply()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
            <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <AudioLines size={20} />
            </button>
            <button
              onClick={handleSendTeamChatReply}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${teamChatReply.trim() ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="flex-1 min-w-0 h-screen flex flex-col bg-background">
      <div className="max-w-[900px] w-full mx-auto px-8 pt-10 shrink-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6" style={{ minHeight: '44px' }}>
          <h1 className="text-2xl font-normal text-foreground">Team</h1>
          {!hideAddProject && (
            <button
              onClick={() => { setActiveFilter("projects"); setNewProjectOpen(true); }}
              className={`px-5 py-2 rounded-full border border-border bg-background text-foreground text-sm font-normal hover:bg-accent transition-colors ${activeFilter !== "projects" ? "invisible" : ""}`}
            >
              Add project
            </button>
          )}
        </div>

      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-[900px] mx-auto px-8 pb-10">


        {/* Sort + Filter tabs row */}
        <div className="flex items-center justify-between mb-5 relative">
          <div className="flex items-center gap-2">
            {([["projects", "Projects"], ["chats", "Chats"], ["files", "Files"], ["members", "Members"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key as any)}
                className={`px-5 py-1.5 rounded-lg text-sm transition-colors ${
                  activeFilter === key
                    ? "bg-accent text-foreground font-normal"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeFilter === "projects" && renderProjectsView()}
        {activeFilter === "chats" && (
          <div className="max-w-3xl">
            {/* New chat input */}
            <div className="flex items-center gap-2 border border-border rounded-full px-5 py-3 bg-background mb-8">
              <Plus size={18} className="text-muted-foreground" />
              <span className="flex-1 text-sm text-muted-foreground">Type a message...</span>
               <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted text-sm text-foreground hover:bg-accent transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>
                Voice
              </button>
            </div>

            {hideProjects ? (
              <div className="text-center py-16 text-muted-foreground text-sm">
                No chats yet. Start a conversation to get going.
              </div>
            ) : (
              <div>
                {[
                  { title: "Q4 Strategy alignment", subtitle: "Hi! How can I help you with this?", date: "Apr 5", avatars: [
                    { initials: "AT", bg: "bg-amber-700", name: "Alessandro Tunzi", email: "alessandro@rubylabs.com" },
                    { initials: "R", bg: "bg-green-600", name: "Paolo Rossi", email: "paolo@rubylabs.com" },
                  ] },
                  { title: "Claude settings help", subtitle: "Hi! How can I help you with this?", date: "Apr 3", avatars: [
                    { initials: "AT", bg: "bg-amber-700", name: "Alessandro Tunzi", email: "alessandro@rubylabs.com" },
                  ] },
                  { title: "Design system updates", subtitle: "Hi! How can I help you with this?", date: "Mar 28", avatars: [
                    { initials: "AT", bg: "bg-amber-700", name: "Alessandro Tunzi", email: "alessandro@rubylabs.com" },
                    { initials: "T", bg: "bg-green-600", name: "Alessandro Tunzi", email: "alessandro@rubylabs.com" },
                    { initials: "R", bg: "bg-blue-500", name: "Paolo Rossi", email: "paolo@rubylabs.com" },
                  ] },
                ].map((chat) => (
                  <div key={chat.title} className="relative flex items-center justify-between py-5 cursor-pointer hover:bg-accent/30 transition-colors -mx-2 px-2 rounded-md" onClick={() => setActiveTeamChat({ title: chat.title, messages: [{ role: "user", content: chat.title }, { role: "assistant", content: "Hi! How can I help you with this?" }], avatars: chat.avatars })}>
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{chat.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{chat.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex" style={{ gap: "-14px" }}>
                        {chat.avatars.map((av, i) => (
                          <div key={i} className={`w-8 h-8 rounded-full ${av.bg} flex items-center justify-center text-[11px] font-medium text-white ring-2 ring-background group/avatar relative`} style={{ marginLeft: i > 0 ? '-13px' : '0', zIndex: chat.avatars.length - i }}>
                            {av.initials}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-foreground text-background text-xs whitespace-nowrap opacity-0 invisible group-hover/avatar:opacity-100 group-hover/avatar:visible transition-all pointer-events-none z-50 text-center shadow-lg">
                              <div className="font-normal">{av.name}</div>
                              <div className="text-background/70">{av.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">{chat.date}</span>
                      {!hideTeamChatActions && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setChatTabMenu(chatTabMenu === chat.title ? null : chat.title); }}
                          className="p-1 rounded-md hover:bg-accent transition-colors text-muted-foreground"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      )}
                    </div>
                    {chatTabMenu === chat.title && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setChatTabMenu(null); }} />
                        <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-2xl shadow-lg py-2 z-50 min-w-[160px]" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setChatTabMenu(null)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-accent transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeFilter === "files" && (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileUpload}
            />
            <div className="flex items-center justify-end mb-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2 rounded-full border border-border bg-background text-foreground text-sm font-normal hover:bg-accent transition-colors"
              >
                Add
              </button>
            </div>
            {uploadedFiles.length === 0 ? (
              <div className="border border-border rounded-xl w-full flex items-center justify-center" style={{ minHeight: 320 }}>
                <div className="text-center p-8 max-w-md">
                  <div className="flex justify-center mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/60">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Add documents, code files, images, and more. <span className="font-semibold text-foreground">use.ai</span> can access their contents when you chat inside the project.
                  </p>
                </div>
              </div>
            ) : (
              <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                {uploadedFiles.map((file, idx) => {
                  const { label, color } = getFileCategory(file.name);
                  return (
                    <div key={idx} className="flex items-center gap-3 px-4 py-3 hover:bg-accent/20 transition-colors">
                      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                        {getFileIcon(file.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </div>
                      <button
                        onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                        className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
                        title="Rimuovi file"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {activeFilter === "members" && (
          <div>
            {!hideAddMember && (
              <div className="flex items-center justify-end mb-4">
                <button
                  onClick={() => setAddMemberOpen(true)}
                  className="px-5 py-2 rounded-full border border-border bg-background text-foreground text-sm font-normal hover:bg-accent transition-colors"
                >
                  Add
                </button>
              </div>
            )}

            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-accent/30">
                    <th className="text-left text-xs text-muted-foreground font-normal px-4 py-3">Name</th>
                    <th className="text-left text-xs text-muted-foreground font-normal px-4 py-3">Role</th>
                    <th className="text-right text-xs text-muted-foreground font-normal px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.email} className="border-b border-border last:border-b-0 hover:bg-accent/20 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-foreground">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-foreground">{member.role}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!member.isOwner && !hideMemberActions && (
                          <div className="relative inline-block">
                            <button
                              className="p-1 rounded-md hover:bg-accent text-muted-foreground transition-colors"
                              onClick={() => setOpenMemberMenu(openMemberMenu === member.email ? null : member.email)}
                            >
                              <MoreHorizontal size={16} />
                            </button>
                            {openMemberMenu === member.email && (
                              <div className="absolute top-full right-0 mt-1 z-50 bg-background border border-border rounded-md shadow-lg py-1 min-w-[140px]">
                                <button
                                  className="w-full text-left px-3 py-1.5 text-sm text-destructive hover:bg-accent transition-colors"
                                  onClick={() => {
                                    setMembersData(prev => prev.filter(m => m.email !== member.email));
                                    setOpenMemberMenu(null);
                                  }}
                                >
                                  Remove member
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredMembers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">No members found.</div>
            )}

            {/* Add member modal for Members tab */}
            {addMemberOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50" onClick={() => setAddMemberOpen(false)} />
                <div className="relative bg-background rounded-xl border border-border shadow-xl w-full max-w-md p-6 z-10">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-normal text-foreground">Add new member</h2>
                    <button onClick={() => setAddMemberOpen(false)} className="p-1 rounded-lg hover:bg-accent text-muted-foreground">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-foreground mb-1.5 block">Name</label>
                      <input
                        type="text"
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        placeholder="Full name"
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/20"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-foreground mb-1.5 block">Email</label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="your-teammate@your-domain.com"
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/20"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-foreground mb-1.5 block">Role</label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/20 appearance-none"
                      >
                        {(["Member", "Owner"] as const).map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end mt-6">
                    <button
                      onClick={() => { setAddMemberOpen(false); setInviteName(""); setInviteEmail(""); setInviteRole("Member"); }}
                      className="px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-normal hover:opacity-90 transition-opacity"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      {/* New Project Modal */}
      {newProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setNewProjectOpen(false)} />
          <div className="relative bg-background rounded-xl border border-border shadow-xl w-full max-w-md p-6 z-10">
            <div className="space-y-5">
              <div>
                <label className="text-sm text-foreground mb-1.5 block">What are you working on?</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Use.ai"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>

              <div>
                <label className="text-sm text-foreground mb-1.5 block">What are you trying to achieve?</label>
                <textarea
                  value={projectGoal}
                  onChange={(e) => setProjectGoal(e.target.value)}
                  placeholder="e.g. Team project"
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/20 resize-none"
                />
              </div>

              <div>
                <label className="text-sm text-foreground mb-3 block">Visibility</label>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="flex items-start gap-2">
                      <Building2 size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <span className="text-sm text-foreground font-normal block">RubyLabs</span>
                        <span className="text-xs text-muted-foreground">Everyone in your organization can view and use this project</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setNewProjectOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-normal hover:opacity-90 transition-opacity"
              >
                Create project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

      {/* Payment Method Modal */}
    {paymentModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-background border border-border rounded-xl shadow-lg w-full max-w-md p-6 relative">
          <button onClick={() => setPaymentModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-semibold text-foreground mb-1">Update payment method</h2>
          <p className="text-sm text-muted-foreground mb-5">Choose your preferred payment method.</p>

          {/* Payment method selection */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {([
              { key: "card" as const, label: "Credit card", icon: <CreditCard className="w-4 h-4" /> },
              { key: "apple_pay" as const, label: "Apple Pay", icon: <span className="text-sm font-bold"></span> },
              { key: "google_pay" as const, label: "Google Pay", icon: <span className="text-sm font-bold">G</span> },
              { key: "paypal" as const, label: "PayPal", icon: <span className="text-sm font-bold">P</span> },
            ]).map((m) => (
              <button
                key={m.key}
                onClick={() => setPaymentMethod(m.key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                  paymentMethod === m.key
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border text-muted-foreground hover:border-foreground/30"
                }`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>

          {/* Card form */}
          {paymentMethod === "card" && (
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Card number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground mb-1 block">Expiry</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground mb-1 block">CVC</label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Alternative methods info */}
          {paymentMethod !== "card" && (
            <div className="mb-5 p-4 rounded-lg border border-border bg-accent/30 text-sm text-muted-foreground">
              You will be redirected to {paymentMethod === "apple_pay" ? "Apple Pay" : paymentMethod === "google_pay" ? "Google Pay" : "PayPal"} to complete the setup.
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <button onClick={() => setPaymentModalOpen(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-accent transition-colors">
              Cancel
            </button>
            <button onClick={() => setPaymentModalOpen(false)} className="px-4 py-2 rounded-lg bg-foreground text-background text-sm hover:bg-foreground/90 transition-colors">
              Save
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Teams;