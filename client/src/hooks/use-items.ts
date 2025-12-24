import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useItems() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: [api.items.list.path],
    queryFn: async () => {
      const res = await fetch(api.items.list.path);
      if (!res.ok) throw new Error("Failed to fetch items");
      return await res.json();
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: InsertItem & { contents?: string[] }) => {
      const res = await fetch(api.items.create.path, {
        method: api.items.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create item");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.items.list.path] });
      toast({ title: "ITEM UPLOADED", className: "border-primary text-primary bg-black font-mono" });
    },
    onError: () => {
      toast({ title: "UPLOAD FAILED", variant: "destructive", className: "border-destructive text-destructive bg-black font-mono" });
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.items.purchase.path, { id });
      const res = await fetch(url, { method: api.items.purchase.method });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Purchase failed");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] }); // Refresh credits
      queryClient.invalidateQueries({ queryKey: [api.items.list.path] });
      toast({ 
        title: "ACQUISITION SUCCESSFUL", 
        description: "Item added to your inventory.",
        className: "border-accent text-accent bg-black font-mono" 
      });
    },
    onError: (error) => {
      toast({ 
        title: "TRANSACTION REJECTED", 
        description: error.message,
        variant: "destructive", 
        className: "border-destructive text-destructive bg-black font-mono" 
      });
    },
  });

  return { items, isLoading, createItem: createItemMutation, purchase: purchaseMutation };
}

export function useItem(id: number) {
  return useQuery({
    queryKey: [api.items.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.items.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch item");
      return await res.json();
    },
    enabled: !!id,
  });
}
