import { useRoute } from "wouter";
import { useItem, useItems } from "@/hooks/use-items";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Loader2, ShoppingCart, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function ItemDetails() {
  const [, params] = useRoute("/shop/:id");
  const id = parseInt(params?.id || "0");
  const { data: item, isLoading } = useItem(id);
  const { purchase } = useItems();
  const [purchasedContent, setPurchasedContent] = useState<string | null>(null);

  const handlePurchase = () => {
    if (!confirm(`Confirm purchase for ${item.price} Credits?`)) return;
    purchase.mutate(id, {
      onSuccess: (data) => {
        setPurchasedContent(data.content);
      },
    });
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!item) return <div className="text-center p-20 text-destructive">ITEM NOT FOUND</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/shop" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 font-mono text-sm">
        <ArrowLeft className="w-4 h-4 mr-2" /> BACK TO MARKET
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <CyberCard className="h-fit" glow="primary">
          <div className="aspect-square bg-gradient-to-br from-black to-primary/20 flex items-center justify-center border border-primary/20 mb-6">
            <ShoppingCart className="w-24 h-24 text-primary/50" />
          </div>
          <div className="flex justify-between items-center border-t border-white/10 pt-4">
             <div className="text-sm font-mono text-muted-foreground">PRICE</div>
             <div className="text-3xl font-display text-accent font-bold">{item.price} CR</div>
          </div>
        </CyberCard>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl mb-4 text-glow">{item.title}</h1>
            <div className="flex gap-2 mb-6">
              <span className="px-3 py-1 bg-white/5 border border-white/10 text-xs font-mono">{item.type.toUpperCase()}</span>
              <span className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary text-xs font-mono">INSTANT DELIVERY</span>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">{item.description}</p>
          </div>

          {!purchasedContent ? (
            <CyberButton 
              size="lg" 
              className="w-full" 
              onClick={handlePurchase} 
              isLoading={purchase.isPending}
            >
              ACQUIRE ASSET
            </CyberButton>
          ) : (
            <CyberCard glow="accent" className="bg-accent/5">
              <div className="flex items-center gap-2 text-accent mb-4 font-bold">
                <CheckCircle className="w-5 h-5" /> PURCHASE SUCCESSFUL
              </div>
              <div className="p-4 bg-black border border-accent/30 font-mono text-sm break-all">
                {purchasedContent}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Copy this content immediately. It is also saved in your dashboard.
              </p>
            </CyberCard>
          )}
        </div>
      </div>
    </div>
  );
}
