import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertTicket } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useTickets() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tickets, isLoading } = useQuery({
    queryKey: [api.tickets.list.path],
    queryFn: async () => {
      const res = await fetch(api.tickets.list.path);
      if (!res.ok) throw new Error("Failed to fetch tickets");
      return await res.json();
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: async (data: InsertTicket) => {
      const res = await fetch(api.tickets.create.path, {
        method: api.tickets.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create ticket");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tickets.list.path] });
      toast({ title: "TICKET OPENED", className: "border-primary text-primary bg-black font-mono" });
    },
  });

  const replyTicketMutation = useMutation({
    mutationFn: async ({ id, reply }: { id: number; reply: string }) => {
      const url = buildUrl(api.tickets.reply.path, { id });
      const res = await fetch(url, {
        method: api.tickets.reply.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply }),
      });
      if (!res.ok) throw new Error("Failed to reply");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tickets.list.path] });
      toast({ title: "RESPONSE SENT", className: "border-primary text-primary bg-black font-mono" });
    },
  });

  return { tickets, isLoading, createTicket: createTicketMutation, replyTicket: replyTicketMutation };
}
