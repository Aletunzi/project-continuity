import { useParams } from "react-router-dom";
import { CheckCircle, Download } from "lucide-react";
import logo from "@/assets/logo.svg";

const invoicesData = [
  { id: "USEAI-2026-006", date: "Mar 13, 2026", paymentDate: "13 marzo 2026", members: 5, total: "$125.00", status: "Paid", card: "Visa •••• 8268" },
  { id: "USEAI-2026-005", date: "Feb 13, 2026", paymentDate: "13 febbraio 2026", members: 5, total: "$125.00", status: "Paid", card: "Visa •••• 8268" },
  { id: "USEAI-2026-004", date: "Jan 13, 2026", paymentDate: "13 gennaio 2026", members: 4, total: "$100.00", status: "Paid", card: "Visa •••• 8268" },
  { id: "USEAI-2025-003", date: "Dec 13, 2025", paymentDate: "13 dicembre 2025", members: 4, total: "$100.00", status: "Paid", card: "Visa •••• 8268" },
  { id: "USEAI-2025-002", date: "Nov 13, 2025", paymentDate: "13 novembre 2025", members: 3, total: "$75.00", status: "Paid", card: "Visa •••• 8268" },
  { id: "USEAI-2025-001", date: "Oct 13, 2025", paymentDate: "13 ottobre 2025", members: 3, total: "$75.00", status: "Paid", card: "Visa •••• 8268" },
];

const InvoiceDetail = () => {
  const { invoiceIndex } = useParams();
  const index = parseInt(invoiceIndex || "0", 10);
  const invoice = invoicesData[index];

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Invoice not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col items-center py-12 px-4">
      {/* Header with logo */}
      <div className="flex items-center gap-2 mb-10">
        <img src={logo} alt="use.ai" className="h-6" />
      </div>

      {/* Invoice card */}
      <div className="w-full max-w-md bg-background rounded-2xl border border-border shadow-sm p-8 flex flex-col items-center">
        {/* Document icon */}
        <div className="relative mb-4">
          <div className="w-16 h-20 bg-muted/50 border border-border rounded-lg flex flex-col items-center justify-center gap-1.5 p-3">
            <div className="w-6 h-0.5 bg-muted-foreground/40 rounded" />
            <div className="w-8 h-0.5 bg-muted-foreground/40 rounded" />
            <div className="w-7 h-0.5 bg-muted-foreground/40 rounded" />
            <div className="w-5 h-0.5 bg-muted-foreground/40 rounded" />
          </div>
          <CheckCircle size={20} className="absolute -bottom-1 -right-1 text-emerald-500 fill-emerald-500" />
        </div>

        <p className="text-sm text-muted-foreground mb-1">Invoice paid</p>
        <p className="text-3xl font-semibold text-foreground mb-6">{invoice.total}</p>

        <div className="w-full border-t border-border pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Invoice number</span>
            <span className="text-sm text-foreground font-medium">{invoice.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Payment date</span>
            <span className="text-sm text-foreground">{invoice.paymentDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Payment method</span>
            <span className="text-sm text-foreground">{invoice.card}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-8 w-full">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border text-sm text-foreground hover:bg-accent transition-colors">
            <Download size={14} />
            Download invoice
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-foreground text-background text-sm font-normal hover:opacity-90 transition-opacity">
            <Download size={14} />
            Download receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
