import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "accent";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    
    const variants = {
      primary: "border-primary text-primary hover:bg-primary/10 shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]",
      secondary: "border-secondary text-secondary hover:bg-secondary/10 shadow-[0_0_10px_rgba(255,0,255,0.3)] hover:shadow-[0_0_20px_rgba(255,0,255,0.5)]",
      accent: "border-accent text-accent hover:bg-accent/10 shadow-[0_0_10px_rgba(0,255,0,0.3)] hover:shadow-[0_0_20px_rgba(0,255,0,0.5)]",
      destructive: "border-destructive text-destructive hover:bg-destructive/10 shadow-[0_0_10px_rgba(255,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]",
    };

    const sizes = {
      sm: "h-8 px-4 text-xs",
      md: "h-12 px-8 text-sm",
      lg: "h-14 px-10 text-base",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading || props.disabled}
        className={cn(
          "relative border-2 uppercase font-mono tracking-widest transition-all duration-300",
          "clip-path-diagonal bg-black/80 backdrop-blur-sm",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <span className="animate-spin">⟳</span> PROCESSING
          </div>
        ) : (
          children
        )}
        
        {/* Decorative corner accents */}
        <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-50" />
        <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-50" />
      </motion.button>
    );
  }
);
CyberButton.displayName = "CyberButton";
