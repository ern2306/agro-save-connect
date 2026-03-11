import { useState } from "react";
import { ArrowUpCircle, Send, Wallet, Building2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import PageHeader from "@/components/PageHeader";
import { toast } from "sonner";
import { format } from "date-fns";

const presetAmounts = [10, 20, 50, 100, 200, 500];
const bankOptions = ["Maybank", "CIMB Bank", "Public Bank", "RHB Bank", "Hong Leong Bank", "AmBank", "Bank Islam"];

const WalletPage = () => {
  const { walletBalance, setWalletBalance, transactions, setTransactions } = useApp();
  const [showTopUp, setShowTopUp] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [withdrawBank, setWithdrawBank] = useState("");
  const [withdrawAccount, setWithdrawAccount] = useState("");
  const [topUpBank, setTopUpBank] = useState("");
  const [topUpAccount, setTopUpAccount] = useState("");

  const closeAll = () => { setShowTopUp(false); setShowTransfer(false); setShowWithdraw(false); setAmount(""); setSelectedPreset(null); setTopUpBank(""); setTopUpAccount(""); };

  const handlePresetSelect = (val: number) => {
    setSelectedPreset(val);
    setAmount(val.toString());
  };

  const handleTopUp = () => {
    const val = parseFloat(amount);
    if (!topUpBank) { toast.error("Please select a bank"); return; }
    if (!topUpAccount.trim()) { toast.error("Please enter account number"); return; }
    if (!val || val <= 0) { toast.error("Enter valid amount"); return; }
    setWalletBalance((b) => b + val);
    setTransactions([
      { id: `t${Date.now()}`, type: "topup", amount: val, description: "Top Up", timestamp: new Date() },
      ...transactions,
    ]);
    toast.success(`RM ${val.toFixed(2)} topped up!`);
    closeAll();
  };

  const handleTransfer = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) { toast.error("Enter valid amount"); return; }
    if (!transferTo.trim()) { toast.error("Enter recipient"); return; }
    if (walletBalance < val) { toast.error("Insufficient balance"); return; }
    setWalletBalance((b) => b - val);
    setTransactions([
      { id: `t${Date.now()}`, type: "transfer", amount: -val, description: `Transfer to ${transferTo}`, timestamp: new Date() },
      ...transactions,
    ]);
    toast.success(`RM ${val.toFixed(2)} transferred!`);
    setTransferTo("");
    closeAll();
  };

  const handleWithdraw = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) { toast.error("Enter valid amount"); return; }
    if (!withdrawBank) { toast.error("Select a bank"); return; }
    if (!withdrawAccount.trim()) { toast.error("Enter account number"); return; }
    if (walletBalance < val) { toast.error("Insufficient balance"); return; }
    setWalletBalance((b) => b - val);
    setTransactions([
      { id: `t${Date.now()}`, type: "transfer", amount: -val, description: `Withdraw to ${withdrawBank} (****${withdrawAccount.slice(-4)})`, timestamp: new Date() },
      ...transactions,
    ]);
    toast.success(`RM ${val.toFixed(2)} withdrawn to ${withdrawBank}!`);
    setWithdrawBank("");
    setWithdrawAccount("");
    closeAll();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Wallet" showBack />
      <div className="px-4 py-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 mb-6">
          <p className="text-primary-foreground/70 text-sm">Current Balance</p>
          <h2 className="text-primary-foreground text-3xl font-bold mt-1">RM {walletBalance.toFixed(2)}</h2>
          <div className="flex gap-2 mt-4">
            <button onClick={() => { closeAll(); setShowTopUp(true); }}
              className="flex-1 py-2 rounded-lg bg-primary-foreground/20 text-primary-foreground text-xs font-medium flex items-center justify-center gap-1">
              <ArrowUpCircle className="w-3.5 h-3.5" /> Top Up
            </button>
            <button onClick={() => { closeAll(); setShowTransfer(true); }}
              className="flex-1 py-2 rounded-lg bg-primary-foreground/20 text-primary-foreground text-xs font-medium flex items-center justify-center gap-1">
              <Send className="w-3.5 h-3.5" /> Transfer
            </button>
            <button onClick={() => { closeAll(); setShowWithdraw(true); }}
              className="flex-1 py-2 rounded-lg bg-primary-foreground/20 text-primary-foreground text-xs font-medium flex items-center justify-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Withdraw
            </button>
          </div>
        </div>

        {/* Top Up Panel */}
        {showTopUp && (
          <div className="bg-card rounded-xl p-4 border border-border mb-4 animate-slide-up">
            <h3 className="font-medium text-foreground text-sm mb-3">Top Up Wallet</h3>
            <select value={topUpBank} onChange={(e) => setTopUpBank(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none">
              <option value="">Select Bank / Payment Provider</option>
              {bankOptions.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {presetAmounts.map((p) => (
                <button key={p} onClick={() => handlePresetSelect(p)}
                  className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    selectedPreset === p ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-foreground hover:border-primary/50"
                  }`}>
                  RM {p}
                </button>
              ))}
            </div>
            <input value={amount} onChange={(e) => { setAmount(e.target.value); setSelectedPreset(null); }} type="number" placeholder="Or enter custom amount (RM)"
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button onClick={handleTopUp} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">Confirm Top Up</button>
          </div>
        )}

        {/* Transfer Panel */}
        {showTransfer && (
          <div className="bg-card rounded-xl p-4 border border-border mb-4 animate-slide-up">
            <h3 className="font-medium text-foreground text-sm mb-2">Transfer to User</h3>
            <input value={transferTo} onChange={(e) => setTransferTo(e.target.value)} placeholder="Recipient username"
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Amount (RM)"
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button onClick={handleTransfer} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">Confirm Transfer</button>
          </div>
        )}

        {/* Withdraw Panel */}
        {showWithdraw && (
          <div className="bg-card rounded-xl p-4 border border-border mb-4 animate-slide-up">
            <h3 className="font-medium text-foreground text-sm mb-2">Withdraw to Bank Account</h3>
            <select value={withdrawBank} onChange={(e) => setWithdrawBank(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none">
              <option value="">Select Bank</option>
              {bankOptions.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <input value={withdrawAccount} onChange={(e) => setWithdrawAccount(e.target.value)} placeholder="Account Number"
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Amount (RM)"
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button onClick={handleWithdraw} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">Confirm Withdrawal</button>
          </div>
        )}

        <h3 className="font-semibold text-foreground mb-3">Transaction History</h3>
        <div className="space-y-2">
          {transactions.map((t) => (
            <div key={t.id} className="bg-card rounded-xl p-3 flex items-center gap-3 border border-border">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.amount >= 0 ? "bg-accent" : "bg-destructive/10"}`}>
                <Wallet className={`w-4 h-4 ${t.amount >= 0 ? "text-primary" : "text-destructive"}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{t.description}</p>
                <p className="text-xs text-muted-foreground">{format(t.timestamp, "dd MMM yyyy, HH:mm")}</p>
              </div>
              <span className={`text-sm font-bold ${t.amount >= 0 ? "text-success" : "text-destructive"}`}>
                {t.amount >= 0 ? "+" : ""}RM {Math.abs(t.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
