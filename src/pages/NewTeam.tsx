import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Building2, Minus, Plus, CreditCard, ArrowLeft } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Teams from "@/pages/Teams";
import ProjectDetail from "@/pages/ProjectDetail";
import MyOrganization from "@/pages/MyOrganization";
import ChatArea from "@/components/ChatArea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const BASE_PATH = "/new-team";

const PRICE_PER_MEMBER = 29.99;

const NewTeam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [orgName, setOrgName] = useState("RubyLabs");
  const [orgDescription, setOrgDescription] = useState(
    "Use AI will search your team's connected tools to find exactly what you need and give you the best answer."
  );
  const [memberCount, setMemberCount] = useState(1);

  const handleCreateTeam = () => {
    setShowWelcome(false);
    setShowSetup(true);
  };

  const handleFinishSetup = () => {
    setShowSetup(false);
    setShowPayment(true);
  };

  const handleGoBack = () => {
    setShowPayment(false);
    setShowSetup(true);
  };

  const handleConfirmPayment = () => {
    setShowPayment(false);
    setSetupComplete(true);
    navigate(`${BASE_PATH}/teams`);
  };

  const renderContent = () => {
    if (location.pathname.startsWith(`${BASE_PATH}/project/`)) return <ProjectDetail basePath={BASE_PATH} />;
    if (location.pathname === `${BASE_PATH}/my-organization`) return <MyOrganization basePath={BASE_PATH} />;
    if (location.pathname === `${BASE_PATH}/teams`) return <Teams basePath={BASE_PATH} hideProjects />;
    return <ChatArea />;
  };

  const total = memberCount * PRICE_PER_MEMBER;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar showInvite={false} basePath={BASE_PATH} hideTeamSections showOrg={setupComplete} onTeamClick={() => setShowWelcome(true)} />
      {renderContent()}

      {/* Welcome Modal */}
      <Dialog open={showWelcome && location.pathname === BASE_PATH} onOpenChange={(open) => {
        if (!open) setShowWelcome(false);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-normal text-center">
              Turn Use AI into your organization expert
            </DialogTitle>
            <DialogDescription className="text-center">
              Use AI will search your team's connected tools to find exactly what you need and give you the best answer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleCreateTeam}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-normal bg-foreground text-background hover:opacity-90 transition-colors"
            >
              Create your team
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Setup Modal */}
      <Dialog open={showSetup && location.pathname === BASE_PATH} onOpenChange={(open) => {
        if (!open) setShowSetup(false);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-normal text-center">
              Set up your team
            </DialogTitle>
            <DialogDescription className="text-center">
              You can always edit this later.
            </DialogDescription>
          </DialogHeader>

          <div className="text-left space-y-6 mt-4">
            <div>
              <label className="text-sm font-normal text-muted-foreground block mb-2">Name</label>
              <input
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm font-normal text-foreground outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div>
              <label className="text-sm font-normal text-muted-foreground block mb-2">Preview</label>
              <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                <Building2 size={16} />
                <span>Ask {orgName || "your team"}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-normal text-muted-foreground block mb-2">Description</label>
              <textarea
                value={orgDescription}
                onChange={(e) => setOrgDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm font-normal text-foreground outline-none focus:ring-2 focus:ring-ring/20 resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-normal text-muted-foreground">Members:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMemberCount(Math.max(1, memberCount - 1))}
                  className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-normal text-foreground w-5 text-center">{memberCount}</span>
                <button
                  onClick={() => setMemberCount(memberCount + 1)}
                  className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-normal text-muted-foreground">Total:</label>
              <span className="text-sm font-normal text-foreground">€{(memberCount * PRICE_PER_MEMBER).toFixed(2)}/mo</span>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleFinishSetup}
              disabled={!orgName.trim()}
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-normal transition-colors ${
                orgName.trim()
                  ? "bg-foreground text-background hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              Finish set up
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      <Dialog open={showPayment && location.pathname === BASE_PATH} onOpenChange={(open) => {
        if (!open) setShowPayment(false);
      }}>
        <DialogContent className="sm:max-w-md">
          <button
            onClick={handleGoBack}
            className="absolute left-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <DialogHeader>
            <DialogTitle className="text-2xl font-normal text-center">
              Complete your purchase
            </DialogTitle>
            <DialogDescription className="text-center">
              Review your order and choose a payment method.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Order Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-foreground">
                <span>Members</span>
                <span>{memberCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-foreground">
                <span>Price per member</span>
                <span>€{PRICE_PER_MEMBER}/mo</span>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between text-base font-medium text-foreground">
                <span>Total due today</span>
                <span>€{total}/mo</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              {/* PayPal */}
              <button
                onClick={handleConfirmPayment}
                className="w-full py-3.5 rounded-xl text-sm font-bold transition-colors hover:opacity-90 flex items-center justify-center"
                style={{ backgroundColor: "#FFC439", color: "#003087" }}
              >
                <span style={{ fontStyle: "italic", fontWeight: 800, fontSize: "16px" }}>
                  <span style={{ color: "#003087" }}>Pay</span><span style={{ color: "#0079C1" }}>Pal</span>
                </span>
              </button>
              {/* Apple Pay */}
              <button
                onClick={handleConfirmPayment}
                className="w-full py-3.5 rounded-xl bg-foreground text-background text-sm font-medium transition-colors hover:opacity-90 flex items-center justify-center gap-1"
              >
                <span className="text-base">Buy with</span>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="-mt-0.5">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="text-base font-semibold">Pay</span>
              </button>
              {/* Google Pay */}
              <button
                onClick={handleConfirmPayment}
                className="w-full py-3.5 rounded-xl bg-foreground text-background text-sm font-medium transition-colors hover:opacity-90 flex items-center justify-center gap-1"
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-base font-medium">Pay</span>
              </button>
              {/* Credit/Debit Card */}
              <button
                onClick={handleConfirmPayment}
                className="w-full py-3.5 rounded-xl text-sm font-medium transition-colors hover:opacity-90 flex items-center justify-center gap-2"
                style={{ backgroundColor: "#5469D4", color: "white" }}
              >
                <CreditCard size={18} />
                Credit or debit card
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewTeam;
