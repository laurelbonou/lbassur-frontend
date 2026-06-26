"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Phone, User, Eye, EyeOff, ChevronRight, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLogin() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://lbassur-backend.onrender.com/api/v1";
      
      const payload: any = { phone, password };
      if (!isLogin) payload.fullName = fullName;

      const res = await fetch(`${apiUrl}${endpoint.replace("/api", "")}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      // Save token and user
      localStorage.setItem("client_token", data.access_token);
      localStorage.setItem("client_user", JSON.stringify(data.client));
      
      router.push("/compte");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-black min-h-screen text-white relative">
      <Navbar />
      
      <div className="pt-32 pb-24 container mx-auto px-6 flex justify-center items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#050505] border border-white/10 p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative accents */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="text-center mb-10 relative z-10">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
              <Lock className="text-white transform -rotate-3" size={24} />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-widest text-white mb-2">
              Espace Client
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              {isLogin ? "Connectez-vous à votre compte" : "Créez votre espace personnel"}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-6 text-xs text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Nom Complet</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-gray-600" size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white py-3 pl-10 pr-4 text-sm focus:border-white/40 focus:bg-white/10 transition-all outline-none"
                    placeholder="Jean Dupont"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Numéro de Téléphone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="text-gray-600" size={16} />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white py-3 pl-10 pr-4 text-sm focus:border-white/40 focus:bg-white/10 transition-all outline-none"
                  placeholder="ex: 01234567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Mot de Passe</label>
                {isLogin && (
                  <button type="button" className="text-[9px] text-gray-500 hover:text-white transition-colors">
                    Oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-600" size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white py-3 pl-10 pr-12 text-sm focus:border-white/40 focus:bg-white/10 transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50 mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn size={16} />
                  Se Connecter
                </>
              ) : (
                <>
                  Créer mon compte
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-[10px] text-gray-400 hover:text-white transition-colors uppercase tracking-widest"
            >
              {isLogin ? "Nouveau client ? Créer un compte" : "Déjà un compte ? Se connecter"}
            </button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
