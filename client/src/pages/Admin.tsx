import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useItems } from "@/hooks/use-items";
import { useTransactions } from "@/hooks/use-transactions";
import { useTickets } from "@/hooks/use-tickets";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Shield, Package, CreditCard, Ticket, Code } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const { items, createItem } = useItems();
  const { transactions, approve, reject } = useTransactions();
  const { tickets, replyTicket } = useTickets();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Item Form State
  const [newItem, setNewItem] = useState({ title: "", description: "", price: 0, type: "full", content: "" });
  
  // Code Gen State
  const [codeVal, setCodeVal] = useState(10);
  const [codeCount, setCodeCount] = useState(1);
  const [generatedCodes, setGeneratedCodes] = useState<any[]>([]);

  // Ticket Reply State
  const [replyText, setReplyText] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  const generateCodes = useMutation({
    mutationFn: async () => {
      const res = await fetch(api.codes.generate.path, {
        method: api.codes.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: codeVal, count: codeCount }),
      });
      return await res.json();
    },
    onSuccess: (data) => {
      setGeneratedCodes(data);
      toast({ title: "CODES GENERATED", className: "bg-black border-primary text-primary" });
    }
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    createItem.mutate({
      ...newItem,
      contents: newItem.type === 'sequential' ? newItem.content.split('\n') : undefined,
      content: newItem.type === 'full' ? newItem.content : undefined
    } as any, {
      onSuccess: () => setNewItem({ title: "", description: "", price: 0, type: "full", content: "" })
    });
  };

  const deleteItem = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      toast({ title: "ITEM DELETED", className: "bg-black border-destructive text-destructive" });
    }
  });

  const updateTransactionAmount = useMutation({
    mutationFn: async ({ id, amount }: { id: number; amount: number }) => {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      toast({ title: "TRANSACTION UPDATED", className: "bg-black border-primary text-primary" });
    }
  });

  if (user?.role !== "admin") return <div className="text-center p-20 text-destructive text-3xl font-display">ACCESS DENIED</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-4xl flex items-center gap-4 text-destructive">
        <Shield className="w-10 h-10" /> ADMIN CONSOLE
      </h1>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="bg-black border border-white/20 p-1 mb-8">
          <TabsTrigger value="transactions" className="data-[state=active]:bg-primary data-[state=active]:text-black font-mono">TRANSACTIONS</TabsTrigger>
          <TabsTrigger value="items" className="data-[state=active]:bg-primary data-[state=active]:text-black font-mono">ITEMS</TabsTrigger>
          <TabsTrigger value="tickets" className="data-[state=active]:bg-primary data-[state=active]:text-black font-mono">TICKETS</TabsTrigger>
          <TabsTrigger value="codes" className="data-[state=active]:bg-primary data-[state=active]:text-black font-mono">CODES</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <div className="space-y-4">
            {transactions?.filter((t: any) => t.status === 'pending').map((tx: any) => (
              <CyberCard key={tx.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-accent text-lg">{tx.amount} CR</div>
                    <div className="font-mono text-sm text-muted-foreground">User ID: {tx.userId} | Tx: {tx.transactionId}</div>
                  </div>
                  <div className="flex gap-2">
                    <CyberButton size="sm" variant="accent" onClick={() => approve.mutate(tx.id)}>APPROVE</CyberButton>
                    <CyberButton size="sm" variant="destructive" onClick={() => reject.mutate(tx.id)}>REJECT</CyberButton>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <input type="number" className="w-24 bg-black border border-white/20 p-1 text-white text-sm" defaultValue={tx.amount} placeholder="Amount" id={`tx-${tx.id}`} />
                  <CyberButton size="sm" variant="secondary" onClick={() => {
                    const input = document.getElementById(`tx-${tx.id}`) as HTMLInputElement;
                    if (input) updateTransactionAmount.mutate({ id: tx.id, amount: parseInt(input.value) });
                  }}>UPDATE</CyberButton>
                </div>
              </CyberCard>
            ))}
            {transactions?.filter((t: any) => t.status === 'pending').length === 0 && (
              <div className="text-muted-foreground text-center py-10 font-mono">NO PENDING TRANSACTIONS</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="items">
          <div className="grid md:grid-cols-2 gap-8">
            <CyberCard>
              <h3 className="text-xl mb-4 text-primary">ADD NEW ASSET</h3>
              <form onSubmit={handleCreateItem} className="space-y-4">
                <input placeholder="Title" className="w-full bg-black border border-white/20 p-2 text-white" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} />
                <textarea placeholder="Description" className="w-full bg-black border border-white/20 p-2 text-white" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
                <div className="flex gap-4">
                  <input type="number" placeholder="Price" className="w-full bg-black border border-white/20 p-2 text-white" value={newItem.price} onChange={e => setNewItem({...newItem, price: parseInt(e.target.value)})} />
                  <select className="bg-black border border-white/20 p-2 text-white" value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value})}>
                    <option value="full">Full Content</option>
                    <option value="sequential">Sequential</option>
                  </select>
                </div>
                <textarea placeholder="Content (For sequential, separate lines)" className="w-full h-32 bg-black border border-white/20 p-2 text-white font-mono" value={newItem.content} onChange={e => setNewItem({...newItem, content: e.target.value})} />
                <CyberButton type="submit" className="w-full">UPLOAD TO MARKET</CyberButton>
              </form>
            </CyberCard>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {items?.map((item: any) => (
                <div key={item.id} className="p-2 border border-white/10 text-sm flex justify-between items-center">
                  <span>{item.title}</span>
                  <div className="flex gap-2 items-center">
                    <span className="text-accent">{item.price} CR</span>
                    <CyberButton size="sm" variant="destructive" onClick={() => deleteItem.mutate(item.id)}>DEL</CyberButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tickets">
          <div className="space-y-4">
            {tickets?.filter((t: any) => t.status === 'open').map((t: any) => (
              <CyberCard key={t.id} className="p-4">
                <div className="mb-2 font-bold">{t.subject} <span className="text-muted-foreground font-normal text-xs">(User: {t.userId})</span></div>
                <p className="text-sm text-muted-foreground mb-4">{t.message}</p>
                {selectedTicket === t.id ? (
                  <div className="flex gap-2">
                    <input className="flex-1 bg-black border border-white/20 p-2 text-white" value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type reply..." />
                    <CyberButton size="sm" onClick={() => replyTicket.mutate({ id: t.id, reply: replyText }, { onSuccess: () => { setSelectedTicket(null); setReplyText(""); } })}>SEND</CyberButton>
                    <CyberButton size="sm" variant="secondary" onClick={() => setSelectedTicket(null)}>CANCEL</CyberButton>
                  </div>
                ) : (
                  <CyberButton size="sm" variant="secondary" onClick={() => setSelectedTicket(t.id)}>REPLY</CyberButton>
                )}
              </CyberCard>
            ))}
             {tickets?.filter((t: any) => t.status === 'open').length === 0 && (
              <div className="text-muted-foreground text-center py-10 font-mono">NO OPEN TICKETS</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="codes">
          <CyberCard>
            <h3 className="text-xl mb-4 text-accent">GENERATE VOUCHERS</h3>
            <div className="flex gap-4 mb-4">
              <input type="number" className="bg-black border border-white/20 p-2 text-white" value={codeVal} onChange={e => setCodeVal(parseInt(e.target.value))} placeholder="Value" />
              <input type="number" className="bg-black border border-white/20 p-2 text-white" value={codeCount} onChange={e => setCodeCount(parseInt(e.target.value))} placeholder="Count" />
              <CyberButton onClick={() => generateCodes.mutate()}>GENERATE</CyberButton>
            </div>
            {generatedCodes.length > 0 && (
              <div className="bg-black border border-accent/20 p-4 font-mono text-xs max-h-60 overflow-y-auto">
                {generatedCodes.map((c: any) => (
                  <div key={c.id} className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-accent">{c.code}</span>
                    <span>{c.value} CR</span>
                  </div>
                ))}
              </div>
            )}
          </CyberCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
