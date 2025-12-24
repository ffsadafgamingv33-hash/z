import { useAuth } from "@/hooks/use-auth";
import { useTransactions } from "@/hooks/use-transactions";
import { useTickets } from "@/hooks/use-tickets";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { useState } from "react";
import { Loader2, Ticket, History, CreditCard } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { transactions, redeem } = useTransactions();
  const { tickets } = useTickets();
  const [code, setCode] = useState("");

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    redeem.mutate(code, { onSuccess: () => setCode("") });
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl mb-8">USER CONTROL PANEL</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <CyberCard glow="primary" className="col-span-1">
          <h2 className="text-xl mb-4 text-primary">STATUS</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-mono">IDENTITY</label>
              <div className="text-xl font-bold">{user.username}</div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-mono">AVAILABLE CREDITS</label>
              <div className="text-4xl font-display text-accent">{user.credits}</div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-mono">CLEARANCE</label>
              <div className="inline-block px-2 py-0.5 border border-white/20 text-xs mt-1 bg-white/5">{user.role.toUpperCase()}</div>
            </div>
          </div>
        </CyberCard>

        {/* Redeem Card */}
        <CyberCard className="col-span-1 md:col-span-2">
          <h2 className="text-xl mb-4 text-secondary">REDEEM VOUCHER</h2>
          <form onSubmit={handleRedeem} className="flex gap-4">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ENTER VOUCHER CODE"
              className="flex-1 bg-black/50 border border-white/20 p-3 text-white focus:border-secondary focus:outline-none font-mono"
            />
            <CyberButton variant="secondary" type="submit" isLoading={redeem.isPending}>
              ACTIVATE
            </CyberButton>
          </form>
          <p className="text-xs text-muted-foreground mt-4 font-mono">
            Enter generated voucher codes to instantly add credits to your account balance.
          </p>
        </CyberCard>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Transactions */}
        <div className="space-y-4">
          <h2 className="text-xl flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> TRANSACTION LOG
          </h2>
          <div className="space-y-2">
            {transactions?.length === 0 && <div className="text-muted-foreground text-sm font-mono">No transactions found.</div>}
            {transactions?.map((tx: any) => (
              <div key={tx.id} className="p-4 border border-white/10 bg-black/30 flex justify-between items-center">
                <div>
                  <div className="font-mono text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</div>
                  <div className="text-sm font-bold mt-1">ID: {tx.transactionId}</div>
                </div>
                <div className="text-right">
                  <div className="text-accent font-display">{tx.amount} CR</div>
                  <div className={`text-xs font-mono uppercase ${
                    tx.status === 'approved' ? 'text-accent' : 
                    tx.status === 'rejected' ? 'text-destructive' : 'text-yellow-500'
                  }`}>
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tickets */}
        <div className="space-y-4">
          <h2 className="text-xl flex items-center gap-2">
            <Ticket className="w-5 h-5 text-secondary" /> ACTIVE TICKETS
          </h2>
          <div className="space-y-2">
            {tickets?.length === 0 && <div className="text-muted-foreground text-sm font-mono">No support tickets found.</div>}
            {tickets?.map((t: any) => (
              <div key={t.id} className="p-4 border border-white/10 bg-black/30">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold">{t.subject}</div>
                  <div className={`text-xs px-2 py-0.5 border ${
                    t.status === 'open' ? 'border-primary text-primary' : 'border-white/20 text-muted-foreground'
                  }`}>
                    {t.status.toUpperCase()}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{t.message}</p>
                {t.reply && (
                  <div className="mt-2 pl-4 border-l-2 border-secondary text-sm text-secondary/80 text-xs font-mono">
                    ADMIN: {t.reply}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
