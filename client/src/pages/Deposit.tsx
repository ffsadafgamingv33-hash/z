import { useState } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { CreditCard } from "lucide-react";

export default function Deposit() {
  const { createTransaction } = useTransactions();
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTransaction.mutate({ 
      amount: parseInt(amount), 
      transactionId 
    }, {
      onSuccess: () => {
        setAmount("");
        setTransactionId("");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl mb-8">ADD FUNDS</h1>
      
      <CyberCard glow="accent">
        <div className="mb-8 p-4 bg-accent/5 border border-accent/20 rounded text-sm text-accent font-mono">
          <CreditCard className="w-5 h-5 mb-2" />
          Transfer funds to the wallet address below, then enter the transaction ID to claim your credits.
          <br /><br />
          WALLET: <span className="text-white select-all">0x1234...5678</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-accent tracking-widest">AMOUNT (CREDITS)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-accent focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,0,0.2)] transition-all font-mono"
              placeholder="0"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-accent tracking-widest">TRANSACTION HASH / ID</label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-accent focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,0,0.2)] transition-all font-mono"
              placeholder="TxID..."
              required
            />
          </div>
          <CyberButton 
            variant="accent"
            type="submit" 
            className="w-full mt-4" 
            isLoading={createTransaction.isPending}
          >
            SUBMIT CLAIM
          </CyberButton>
        </form>
      </CyberCard>
    </div>
  );
}
