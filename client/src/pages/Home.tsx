import { Link } from "wouter";
import { CyberButton } from "@/components/CyberButton";
import { motion } from "framer-motion";
import { ShoppingBag, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="absolute -inset-10 bg-primary/20 blur-3xl rounded-full" />
        <h1 className="relative text-7xl md:text-9xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary mb-6 tracking-tighter drop-shadow-2xl">
          FUTURE<br />COMMERCE
        </h1>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-xl md:text-2xl text-muted-foreground font-mono max-w-2xl mb-12"
      >
        The premier digital marketplace for the wired generation. 
        Secure assets. Instant delivery. Anonymous transactions.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex flex-col sm:flex-row gap-6"
      >
        <Link href="/shop">
          <CyberButton size="lg" className="w-full sm:w-auto">
            <ShoppingBag className="mr-2 w-5 h-5" /> ENTER MARKET
          </CyberButton>
        </Link>
        <Link href="/register">
          <CyberButton variant="secondary" size="lg" className="w-full sm:w-auto">
            <Zap className="mr-2 w-5 h-5" /> JOIN NETWORK
          </CyberButton>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
        {[
          { icon: Shield, title: "SECURE", text: "Encrypted end-to-end delivery system" },
          { icon: Zap, title: "INSTANT", text: "Automated fulfillment 24/7/365" },
          { icon: ShoppingBag, title: "VERIFIED", text: "Curated premium digital assets" },
        ].map((feat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + (i * 0.2) }}
            className="p-6 border border-white/10 bg-black/50 backdrop-blur-sm"
          >
            <feat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
            <p className="text-muted-foreground font-mono text-sm">{feat.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
