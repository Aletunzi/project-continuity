import { useState } from "react";
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
  const [activeSeats, setActiveSeats] = useState(5);
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
            <DialogTitle className="text-xl font-normal">Manage active seats</DialogTitle>
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

      {/* Confirm modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-normal">Confirm seat change</DialogTitle>
            <DialogDescription>
              You are about to change your seats from {activeSeats} to {draftSeats}.
              The new monthly total of €{newMonthlyTotal.toFixed(2)} will apply from the next billing cycle on Apr 13, 2026.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-5 py-2.5 rounded-full text-sm font-normal text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSeats}
              className="px-5 py-2.5 rounded-full text-sm font-normal bg-foreground text-background hover:opacity-90 transition-colors"
            >
              Confirm
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyOrganization;
