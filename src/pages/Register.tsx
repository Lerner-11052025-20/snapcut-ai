import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Logo from "@/components/Logo";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Authentication requires Lovable Cloud. Enable it to proceed.");
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block transition-transform hover:scale-105 mb-8">
            <Logo size={48} />
          </Link>
          <h1 className="font-display text-4xl font-black text-white tracking-tight">Join SnapCut</h1>
          <p className="text-muted-foreground font-medium mt-2 uppercase tracking-widest text-[10px]">Start processing in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-[2rem] p-8 sm:p-10 space-y-6 border-white/5 shadow-2xl">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-xl border-white/10 bg-white/5 h-12 focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border-white/10 bg-white/5 h-12 focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl border-white/10 bg-white/5 h-12 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <Button variant="hero" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs" type="submit">
            Create Free Account
          </Button>

          <div className="text-center pt-4 border-t border-white/5">
            <p className="text-xs text-muted-foreground font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:text-white transition-colors underline underline-offset-4 decoration-primary/30">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
