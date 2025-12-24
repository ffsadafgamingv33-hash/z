import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { CyberButton } from "@/components/CyberButton";
import { CyberCard } from "@/components/CyberCard";
import { useLocation } from "wouter";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate({ username, password }, {
      onSuccess: () => setLocation("/login"),
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <CyberCard className="w-full max-w-md p-8" glow="secondary">
        <h2 className="text-3xl mb-8 text-center border-b border-secondary/30 pb-4">NEW IDENTITY</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-secondary tracking-widest">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-secondary focus:outline-none focus:shadow-[0_0_10px_rgba(255,0,255,0.2)] transition-all font-mono"
              placeholder="CHOOSE ID..."
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-secondary tracking-widest">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-secondary focus:outline-none focus:shadow-[0_0_10px_rgba(255,0,255,0.2)] transition-all font-mono"
              placeholder="SECURE KEY..."
              required
            />
          </div>
          <CyberButton 
            variant="secondary"
            type="submit" 
            className="w-full mt-4" 
            isLoading={register.isPending}
          >
            INITIALIZE
          </CyberButton>
        </form>
      </CyberCard>
    </div>
  );
}
