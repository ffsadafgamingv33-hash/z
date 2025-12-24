import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { CyberButton } from "@/components/CyberButton";
import { CyberCard } from "@/components/CyberCard";
import { useLocation } from "wouter";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ username, password }, {
      onSuccess: () => setLocation("/dashboard"),
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <CyberCard className="w-full max-w-md p-8" glow="primary">
        <h2 className="text-3xl mb-8 text-center border-b border-primary/30 pb-4">SYSTEM LOGIN</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary tracking-widest">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-primary focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.2)] transition-all font-mono"
              placeholder="ENTER ID..."
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-primary tracking-widest">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/20 p-3 text-white focus:border-primary focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.2)] transition-all font-mono"
              placeholder="ENTER KEY..."
              required
            />
          </div>
          <CyberButton 
            type="submit" 
            className="w-full mt-4" 
            isLoading={login.isPending}
          >
            AUTHENTICATE
          </CyberButton>
        </form>
      </CyberCard>
    </div>
  );
}
