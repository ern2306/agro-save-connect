import { useState } from "react";
import {
  ArrowUpCircle,
  Send,
  Building2,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  X,
  ChevronRight,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";

const bankOptions = [
  "Maybank",
  "CIMB Bank",
  "Public Bank",
  "RHB Bank",
  "Hong Leong Bank",
  "AmBank",
  "Bank Islam",
];

const WalletPage = () => {
  const navigate = useNavigate();
  const { walletBalance, setWalletBalance, transactions, setTransactions } =
    useApp();
  const [showTopUp, setShowTopUp] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [withdrawBank, setWithdrawBank] = useState("");
  const [withdrawAccount, setWithdrawAccount] = useState("");
  const [topUpBank, setTopUpBank] = useState("");
  const [topUpAccount, setTopUpAccount] = useState("");

  const closeAll = () => {
    setShowTopUp(false);
    setShowTransfer(false);
    setShowWithdraw(false);
    setAmount("");
    setTopUpBank("");
    setTopUpAccount("");
    setTransferTo("");
    setWithdrawBank("");
    setWithdrawAccount("");
  };

  const handleTopUp = () => {
    const val = parseFloat(amount);
    if (!topUpBank) {
      toast.error("Please select a bank");
      return;
    }
    if (!topUpAccount.trim()) {
      toast.error("Please enter your account number");
      return;
    }
    if (!val || val <= 0) {
      toast.error("Enter valid amount");
      return;
    }
    setWalletBalance((b) => b + val);
    setTransactions([
      {
        id: `t${Date.now()}`,
        type: "topup",
        amount: val,
        description: `Top Up via ${topUpBank} (****${topUpAccount.slice(-4)})`,
        timestamp: new Date(),
      },
      ...transactions,
    ]);
    toast.success(`RM ${val.toFixed(2)} topped up!`);
    closeAll();
  };

  const handleTransfer = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      toast.error("Enter valid amount");
      return;
    }
    if (!transferTo.trim()) {
      toast.error("Please enter recipient's account number");
      return;
    }
    if (walletBalance < val) {
      toast.error("Insufficient balance");
      return;
    }
    setWalletBalance((b) => b - val);
    setTransactions([
      {
        id: `t${Date.now()}`,
        type: "transfer",
        amount: -val,
        description: `Transfer to account ****${transferTo.slice(-4)}`,
        timestamp: new Date(),
      },
      ...transactions,
    ]);
    toast.success(`RM ${val.toFixed(2)} transferred!`);
    closeAll();
  };

  const handleWithdraw = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      toast.error("Enter valid amount");
      return;
    }
    if (!withdrawBank) {
      toast.error("Select a bank");
      return;
    }
    if (!withdrawAccount.trim()) {
      toast.error("Enter account number");
      return;
    }
    if (walletBalance < val) {
      toast.error("Insufficient balance");
      return;
    }
    setWalletBalance((b) => b - val);
    setTransactions([
      {
        id: `t${Date.now()}`,
        type: "transfer",
        amount: -val,
        description: `Withdraw to ${withdrawBank} (****${withdrawAccount.slice(
          -4
        )})`,
        timestamp: new Date(),
      },
      ...transactions,
    ]);
    toast.success(`RM ${val.toFixed(2)} withdrawn to ${withdrawBank}!`);
    closeAll();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary pt-12 pb-24 px-6 relative overflow-hidden rounded-b-[3.5rem] shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black text-white tracking-widest uppercase">
            My Wallet
          </h1>
          <div className="w-10" />
        </div>

        <div className="relative z-10 text-center">
          <p className="text-white/70 text-xs font-black uppercase tracking-[0.2em] mb-2">
            Available Balance
          </p>
          <h2 className="text-5xl font-black text-white tracking-tight">
            <span className="text-2xl mr-1">RM</span>
            {walletBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 -mt-12 relative z-20 mb-8">
        <div className="bg-card rounded-[2.5rem] p-4 shadow-2xl border border-border/50 grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              closeAll();
              setShowTopUp(true);
            }}
            className="flex flex-col items-center gap-2 py-4 rounded-3xl hover:bg-primary/5 transition-colors group"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-active:scale-90 transition-transform">
              <ArrowUpCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
              Top Up
            </span>
          </button>
          <button
            onClick={() => {
              closeAll();
              setShowTransfer(true);
            }}
            className="flex flex-col items-center gap-2 py-4 rounded-3xl hover:bg-blue-500/5 transition-colors group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-active:scale-90 transition-transform">
              <Send className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
              Transfer
            </span>
          </button>
          <button
            onClick={() => {
              closeAll();
              setShowWithdraw(true);
            }}
            className="flex flex-col items-center gap-2 py-4 rounded-3xl hover:bg-emerald-500/5 transition-colors group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-active:scale-90 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
              Withdraw
            </span>
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Transaction Panels */}
        {(showTopUp || showTransfer || showWithdraw) && (
          <div className="bg-card rounded-[2.5rem] p-6 border-2 border-primary/20 shadow-xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-foreground uppercase tracking-tight">
                {showTopUp
                  ? "Top Up Wallet"
                  : showTransfer
                  ? "Transfer Money"
                  : "Withdraw Funds"}
              </h3>
              <button
                onClick={closeAll}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {showTopUp && (
              <div className="space-y-4">
                <select
                  value={topUpBank}
                  onChange={(e) => setTopUpBank(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none font-bold"
                >
                  <option value="">Select Bank</option>
                  {bankOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <input
                  value={topUpAccount}
                  onChange={(e) => setTopUpAccount(e.target.value)}
                  placeholder="Your Bank Account Number"
                  className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-sm focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                />
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  placeholder="Enter Amount (RM)"
                  className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-sm focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                />
                <button
                  onClick={handleTopUp}
                  className="w-full py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                >
                  Confirm Top Up
                </button>
              </div>
            )}

            {showTransfer && (
              <div className="space-y-4">
                <input
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  placeholder="Recipient Account Number"
                  className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-sm focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                />
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  placeholder="Amount (RM)"
                  className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-sm focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                />
                <button
                  onClick={handleTransfer}
                  className="w-full py-4 rounded-2xl bg-blue-500 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
                >
                  Send Money
                </button>
              </div>
            )}

            {showWithdraw && (
              <div className="space-y-4">
                <select
                  value={withdrawBank}
                  onChange={(e) => setWithdrawBank(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none font-bold"
                >
                  <option value="">Select Bank</option>
                  {bankOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <input
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  placeholder="Your Bank Account Number"
                  className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-sm focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                />
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  placeholder="Amount (RM)"
                  className="w-full px-5 py-4 rounded-2xl bg-background border border-border text-sm focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                />
                <button
                  onClick={handleWithdraw}
                  className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
                >
                  Confirm Withdrawal
                </button>
              </div>
            )}
          </div>
        )}

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Recent Activity
            </h3>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-card rounded-3xl p-4 border border-border/50 flex items-center gap-4 hover:border-primary/30 transition-colors group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    tx.type === "topup" ||
                    tx.type === "sale" ||
                    tx.type === "refund"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {tx.type === "topup" ||
                  tx.type === "sale" ||
                  tx.type === "refund" ? (
                    <ArrowDownLeft className="w-6 h-6" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                    {tx.description}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {format(new Date(tx.timestamp), "dd MMM yyyy · hh:mm a")}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-black ${
                      tx.type === "topup" ||
                      tx.type === "sale" ||
                      tx.type === "refund"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  >
                    {tx.type === "topup" ||
                    tx.type === "sale" ||
                    tx.type === "refund"
                      ? "+"
                      : "-"}
                    RM {Math.abs(tx.amount).toFixed(2)}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
