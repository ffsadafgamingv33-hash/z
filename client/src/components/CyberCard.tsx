import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "primary" | "secondary" | "accent" | "none";
}

export function CyberCard({ className, children, glow = "none", ...props }: CyberCardProps) {
  const glows = {
    primary: "border-primary/50 shadow-[0_0_15px_rgba(0,255,255,0.1)]",
    secondary: "border-secondary/50 shadow-[0_0_15px_rgba(255,0,255,0.1)]",
    accent: "border-accent/50 shadow-[0_0_15px_rgba(0,255,0,0.1)]",
    none: "border-white/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative bg-black/60 border backdrop-blur-md p-6 overflow-hidden group",
        "before:absolute before:inset-0 before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] before:bg-[length:250%_250%] group-hover:before:animate-[shine_3s_infinite]",
        glows[glow],
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
      
      {/* Grid lines background decoration */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} 
      />
    </motion.div>
  );
}
