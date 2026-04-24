import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Minus, Plus, CreditCard, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const PRICE_PER_SEAT = 29.99;
const ASSIGNED_MEMBERS = 5;

const invoices = [
  { date: "Mar 13, 2026", members: 5, total: "€149.95", status: "Paid" },
  { date: "Feb 13, 2026", members: 5, total: "€149.95", status: "Paid" },
  { date: "Jan 28, 2026", members: 1, total: "€14.99", status: "Paid" },
  { date: "Jan 13, 2026", members: 4, total: "€119.96", status: "Paid" },
  { date: "Dec 13, 2025", members: 4, total: "€119.96", status: "Paid" },
  { date: "Nov 24, 2025", members: 1, total: "€10.99", status: "Paid" },
  { date: "Nov 13, 2025", members: 3, total: "€89.97", status: "Paid" },
  { date: "Oct 13, 2025", members: 3, total: "€89.97", status: "Paid" },
];

interface MyOrganizationProps {
  basePath?: string;
}

const MyOrganization = ({ basePath = "/team-feature" }: MyOrganizationProps) => {
  const navigate = useNavigate();
  const [orgName, setOrgName] = useState("RubyLabs");
  const [orgDescription, setOrgDescription] = useState(
    "Use AI will search your org's connected tools to find exactly what you need and give you the best answer."
  );
  const [activeSeats, setActiveSeats] = useState<number>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("activeSeats") : null;
    return stored ? parseInt(stored, 10) : 5;
  });
  useEffect(() => {
    localStorage.setItem("activeSeats", String(activeSeats));
    window.dispatchEvent(new Event("activeSeatsChanged"));
  }, [activeSeats]);
  const [showSeatsModal, setShowSeatsModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [draftSeats, setDraftSeats] = useState(5);

  const openSeatsModal = () => {
    setDraftSeats(activeSeats);
    setShowSeatsModal(true);
  };

  const minSeats = ASSIGNED_MEMBERS;
  const cannotReduce = draftSeats <= minSeats;
  const newMonthlyTotal = draftSeats * PRICE_PER_SEAT;
  const currentMonthlyTotal = activeSeats * PRICE_PER_SEAT;
  const diff = newMonthlyTotal - currentMonthlyTotal;

  const handleSaveSeats = () => {
    if (draftSeats === activeSeats) {
      setShowSeatsModal(false);
      return;
    }
    setShowSeatsModal(false);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    setActiveSeats(draftSeats);
    setShowPaymentModal(false);
  };

  const handleBackToSeats = () => {
    setShowPaymentModal(false);
    setShowSeatsModal(true);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[780px] mx-auto px-8 py-10">
        <h1 className="text-2xl font-normal text-foreground mb-8">My organization</h1>

        {/* Editable org info */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Organization name</label>
            <input
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm font-normal text-foreground outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Description</label>
            <textarea
              value={orgDescription}
              onChange={(e) => setOrgDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm font-normal text-foreground outline-none focus:ring-2 focus:ring-ring/20 resize-none"
            />
          </div>
        </div>

        <div className="border-t border-border my-8" />

        {/* Your plan */}
        <h2 className="text-lg font-normal text-foreground mb-4">Your plan</h2>
        <div className="p-6 mb-8">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Current plan</p>
              <p className="text-sm font-normal text-foreground">Team</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Active seats</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-normal text-foreground">{activeSeats}</p>
                <button
                  onClick={openSeatsModal}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Edit active seats"
                >
                  <Pencil size={12} />
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Next invoice</p>
              <p className="text-sm font-normal text-foreground">Apr 13, 2026</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Projected total</p>
              <p className="text-sm font-normal text-foreground">€{(activeSeats * PRICE_PER_SEAT).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border my-8" />

        {/* Invoices */}
        <h2 className="text-lg font-normal text-foreground mb-4">Invoices</h2>
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-xs font-normal text-muted-foreground">Date</th>
                <th className="text-left px-6 py-3 text-xs font-normal text-muted-foreground">Members</th>
                <th className="text-left px-6 py-3 text-xs font-normal text-muted-foreground">Total</th>
                <th className="text-left px-6 py-3 text-xs font-normal text-muted-foreground">Status</th>
                <th className="text-left px-6 py-3 text-xs font-normal text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={i} className="border-b border-border last:border-b-0">
                  <td className="px-6 py-4 text-sm font-normal text-foreground">{inv.date}</td>
                  <td className="px-6 py-4 text-sm font-normal text-foreground">{inv.members}</td>
                  <td className="px-6 py-4 text-sm font-normal text-foreground">{inv.total}</td>
                  <td className="px-6 py-4 text-sm font-normal text-foreground">{inv.status}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/invoice/${i}`)}
                      className="text-sm font-normal text-foreground underline hover:opacity-70 transition-opacity"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage seats modal */}
      <Dialog open={showSeatsModal} onOpenChange={setShowSeatsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-normal">Manage seats</DialogTitle>
            <DialogDescription>
              Adjust the number of seats for your organization.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-normal text-muted-foreground">Seats</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDraftSeats(Math.max(minSeats, draftSeats - 1))}
                  disabled={cannotReduce}
                  className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:hover:text-muted-foreground disabled:cursor-not-allowed"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-normal text-foreground w-5 text-center">{draftSeats}</span>
                <button
                  onClick={() => setDraftSeats(draftSeats + 1)}
                  className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {cannotReduce && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                All seats are assigned. Remove a member from{" "}
                <button
                  onClick={() => {
                    setShowSeatsModal(false);
                    navigate(`${basePath}/teams`);
                  }}
                  className="underline text-foreground hover:opacity-70 transition-opacity"
                >
                  Team &gt; Members
                </button>{" "}
                to free up a seat before reducing.
              </p>
            )}

            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm font-normal text-muted-foreground">New monthly total</span>
              <span className="text-sm font-normal text-foreground">
                €{newMonthlyTotal.toFixed(2)}
                {diff !== 0 && (
                  <span className="text-muted-foreground ml-1">
                    ({diff > 0 ? "+" : "−"}€{Math.abs(diff).toFixed(2)})
                  </span>
                )}
              </span>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <button
              onClick={() => setShowSeatsModal(false)}
              className="px-5 py-2.5 rounded-full text-sm font-normal text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSeats}
              disabled={draftSeats === activeSeats}
              className={`px-5 py-2.5 rounded-full text-sm font-normal transition-colors ${
                draftSeats !== activeSeats
                  ? "bg-foreground text-background hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              Save changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <button
            onClick={handleBackToSeats}
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
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-foreground">
                <span>Seats</span>
                <span>{draftSeats}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-foreground">
                <span>Price per seat</span>
                <span>€{PRICE_PER_SEAT}/mo</span>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between text-base font-medium text-foreground">
                <span>Total due today</span>
                <span>€{newMonthlyTotal.toFixed(2)}/mo</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleConfirmPayment}
                className="w-full py-3.5 rounded-xl text-sm font-bold transition-colors hover:opacity-90 flex items-center justify-center"
                style={{ backgroundColor: "#FFC439", color: "#003087" }}
              >
                <span style={{ fontStyle: "italic", fontWeight: 800, fontSize: "16px" }}>
                  <span style={{ color: "#003087" }}>Pay</span><span style={{ color: "#0079C1" }}>Pal</span>
                </span>
              </button>
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

export default MyOrganization;
