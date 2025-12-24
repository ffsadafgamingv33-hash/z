import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { CyberButton } from "./CyberButton";
import { Loader2, Terminal, ShoppingBag, CreditCard, Shield, LogOut, Ticket } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-primary">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  const navItems = [
    { href: "/shop", label: "MARKET", icon: ShoppingBag },
    { href: "/dashboard", label: "DASHBOARD", icon: Terminal },
    { href: "/deposit", label: "DEPOSIT", icon: CreditCard },
    { href: "/tickets", label: "SUPPORT", icon: Ticket },
  ];

  if (user?.role === "admin") {
    navItems.push({ href: "/admin", label: "ADMIN", icon: Shield });
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 border-b border-primary/30 bg-black/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 border-2 border-primary rotate-45 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                <div className="w-6 h-6 bg-primary/20 -rotate-45 group-hover:-rotate-90 transition-transform duration-500" />
              </div>
              <span className="text-2xl font-display font-bold text-primary tracking-widest ml-2 group-hover:text-glow transition-all">
                NEON<span className="text-white">MARKET</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {user ? (
                <>
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className={`
                      flex items-center gap-2 text-sm font-mono tracking-wider hover:text-primary transition-colors
                      ${location === item.href ? "text-primary text-glow" : "text-muted-foreground"}
                    `}>
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  ))}
                  <div className="h-8 w-px bg-white/20 mx-2" />
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground font-mono">CREDITS</div>
                      <div className="text-lg font-bold text-accent font-display">{user.credits}</div>
                    </div>
                    <CyberButton 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => logout.mutate()}
                      className="h-10 w-10 p-0 flex items-center justify-center"
                    >
                      <LogOut className="w-4 h-4" />
                    </CyberButton>
                  </div>
                </>
              ) : (
                <div className="flex gap-4">
                  <Link href="/login">
                    <CyberButton variant="secondary" size="sm">LOGIN</CyberButton>
                  </Link>
                  <Link href="/register">
                    <CyberButton variant="primary" size="sm">REGISTER</CyberButton>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-white/10 py-8 bg-black">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground font-mono text-sm">
          <p>© 2024 NEON MARKET SYSTEM. ALL RIGHTS RESERVED.</p>
          <p className="mt-2 text-xs opacity-50">SECURE CONNECTION ESTABLISHED</p>
        </div>
      </footer>
    </div>
  );
}
