import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertTransaction } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useTransactions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery({
    queryKey: [api.transactions.list.path],
    queryFn: async () => {
      const res = await fetch(api.transactions.list.path);
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return await res.json();
    },
  });

  const createTransactionMutation = useMutation({
    mutationFn: async (data: InsertTransaction) => {
      const res = await fetch(api.transactions.create.path, {
        method: api.transactions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create transaction");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      toast({ title: "DEPOSIT LOGGED", description: "Pending admin approval.", className: "border-primary text-primary bg-black font-mono" });
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.transactions.approve.path, { id });
      const res = await fetch(url, { method: api.transactions.approve.method });
      if (!res.ok) throw new Error("Failed to approve");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      toast({ title: "TRANSACTION VERIFIED", className: "border-accent text-accent bg-black font-mono" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.transactions.reject.path, { id });
      const res = await fetch(url, { method: api.transactions.reject.method });
      if (!res.ok) throw new Error("Failed to reject");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
      toast({ title: "TRANSACTION NULLIFIED", variant: "destructive", className: "border-destructive text-destructive bg-black font-mono" });
    },
  });

  const redeemCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch(api.codes.redeem.path, {
        method: api.codes.redeem.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({ title: "CREDITS LOADED", description: `Added ${data.value} credits.`, className: "border-accent text-accent bg-black font-mono" });
    },
    onError: (error) => {
      toast({ title: "INVALID CODE", description: error.message, variant: "destructive", className: "border-destructive text-destructive bg-black font-mono" });
    },
  });

  return { transactions, isLoading, createTransaction: createTransactionMutation, approve: approveMutation, reject: rejectMutation, redeem: redeemCodeMutation };
}
