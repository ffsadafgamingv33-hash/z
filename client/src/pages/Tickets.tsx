import { useState } from "react";
import { useTickets } from "@/hooks/use-tickets";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Ticket as TicketIcon } from "lucide-react";

export default function Tickets() {
  const { tickets, createTicket } = useTickets();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket.mutate({ subject, message }, {
      onSuccess: () => {
        setSubject("");
        setMessage("");
      }
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-4xl mb-8">SUPPORT CHANNEL</h1>
        <CyberCard glow="secondary">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-secondary tracking-widest">SUBJECT</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-secondary focus:outline-none font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-secondary tracking-widest">MESSAGE</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-secondary focus:outline-none font-mono min-h-[150px]"
                required
              />
            </div>
            <CyberButton 
              variant="secondary"
              type="submit" 
              className="w-full" 
              isLoading={createTicket.isPending}
            >
              TRANSMIT TICKET
            </CyberButton>
          </form>
        </CyberCard>
      </div>

      <div>
        <h2 className="text-2xl mb-6">TICKET HISTORY</h2>
        <div className="space-y-4">
          {tickets?.map((ticket: any) => (
            <CyberCard key={ticket.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold flex items-center gap-2">
                  <TicketIcon className="w-4 h-4 text-primary" />
                  {ticket.subject}
                </div>
                <div className={`text-xs px-2 py-0.5 border ${
                  ticket.status === 'open' ? 'border-primary text-primary' : 'border-white/20 text-muted-foreground'
                }`}>
                  {ticket.status.toUpperCase()}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{ticket.message}</p>
              {ticket.reply && (
                 <div className="mt-2 pl-4 border-l-2 border-secondary bg-secondary/5 p-2 text-sm text-secondary/90">
                   <span className="font-bold text-xs block mb-1">ADMIN RESPONSE:</span>
                   {ticket.reply}
                 </div>
              )}
            </CyberCard>
          ))}
        </div>
      </div>
    </div>
  );
}
