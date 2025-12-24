import { Link } from "wouter";
import { CyberButton } from "@/components/CyberButton";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
      <AlertTriangle className="h-20 w-20 text-destructive mb-8 animate-pulse" />
      <h1 className="text-6xl font-display font-bold text-destructive mb-4">404 ERROR</h1>
      <p className="text-xl text-muted-foreground font-mono mb-8">SIGNAL LOST. SECTOR NOT FOUND.</p>
      
      <Link href="/">
        <CyberButton variant="primary">
          RETURN TO GRID
        </CyberButton>
      </Link>
    </div>
  );
}
