import { useItems } from "@/hooks/use-items";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Link } from "wouter";
import { Item } from "@shared/schema";
import { ShoppingBag, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Shop() {
  const { items, isLoading } = useItems();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl mb-2">DIGITAL ASSETS</h1>
          <p className="text-muted-foreground font-mono">Premium items available for immediate acquisition.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((item: Item, i: number) => (
          <Link key={item.id} href={`/shop/${item.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <CyberCard className="h-full hover:border-primary/50 transition-colors cursor-pointer group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-primary/10 text-primary px-2 py-1 text-xs font-mono border border-primary/20">
                      {item.type.toUpperCase()}
                    </span>
                    <span className="text-accent font-display font-bold text-xl">
                      {item.price} CR
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-6">{item.description}</p>
                </div>
                <CyberButton className="w-full mt-auto">
                  <ShoppingBag className="w-4 h-4 mr-2" /> VIEW DETAILS
                </CyberButton>
              </CyberCard>
            </motion.div>
          </Link>
        ))}
        {items?.length === 0 && (
          <div className="col-span-full text-center py-20 text-muted-foreground font-mono">
            NO ASSETS DETECTED IN INVENTORY.
          </div>
        )}
      </div>
    </div>
  );
}
