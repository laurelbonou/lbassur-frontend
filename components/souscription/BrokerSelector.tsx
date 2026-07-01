"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Search, CheckCircle, ChevronLeft, ChevronRight, AlertCircle, X } from "lucide-react";
import { api } from "@/lib/api";

interface BrokerInfo {
  id: string;
  name: string;
  code: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface BrokerSelectorProps {
  onComplete: (brokerData: { brokerCode: string | null; brokerName: string | null }) => void;
  onBack: () => void;
  initialBrokerCode?: string | null;
}

export default function BrokerSelector({ onComplete, onBack, initialBrokerCode }: BrokerSelectorProps) {
  const [hasBroker, setHasBroker] = useState<boolean | null>(
    initialBrokerCode === null ? false : initialBrokerCode ? true : null
  );
  const [brokerCode, setBrokerCode] = useState(initialBrokerCode || "");
  const [isSearching, setIsSearching] = useState(false);
  const [foundBroker, setFoundBroker] = useState<BrokerInfo | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleLookup = async () => {
    if (!brokerCode.trim()) return;
    setIsSearching(true);
    setSearchError(null);
    setFoundBroker(null);

    try {
      const broker = await api.lookupBroker(brokerCode.trim());
      setFoundBroker(broker);
    } catch {
      setSearchError("Code courtier non trouvé. Vérifiez le code et réessayez.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleContinueWithBroker = () => {
    if (foundBroker) {
      onComplete({ brokerCode: foundBroker.code, brokerName: foundBroker.name });
    } else if (brokerCode.trim()) {
      // Allow continuing with unverified code (auto-created on backend)
      onComplete({ brokerCode: brokerCode.trim(), brokerName: null });
    }
  };

  const handleContinueWithoutBroker = () => {
    onComplete({ brokerCode: null, brokerName: null });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
        <Building2 className="text-gray-400" size={20} />
        <h2 className="text-lg font-black uppercase tracking-widest text-white">
          Courtier d&apos;Assurance
        </h2>
      </div>

      {/* Choice: Has broker or not */}
      {hasBroker === null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <p className="text-sm text-gray-400 mb-6">
            Avez-vous un courtier d&apos;assurance actuel ?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => { setHasBroker(false); handleContinueWithoutBroker(); }}
              className="bg-white/5 p-6 border border-white/10 hover:border-white/40 hover:bg-white/10 transition-all duration-500 text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[12px] font-black uppercase tracking-widest text-white block mb-1 group-hover:translate-x-1 transition-transform">
                    Non, utiliser LBASSUR
                  </span>
                  <span className="text-[10px] text-gray-500">
                    LBASSUR sera votre courtier — aucun frais supplémentaire
                  </span>
                </div>
                <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
              </div>
            </button>

            <button
              onClick={() => setHasBroker(true)}
              className="bg-white/5 p-6 border border-white/10 hover:border-white/40 hover:bg-white/10 transition-all duration-500 text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[12px] font-black uppercase tracking-widest text-white block mb-1 group-hover:translate-x-1 transition-transform">
                    Oui, j&apos;ai un courtier
                  </span>
                  <span className="text-[10px] text-gray-500">
                    Entrez le code de votre courtier pour continuer
                  </span>
                </div>
                <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
              </div>
            </button>
          </div>
        </motion.div>
      )}

      {/* Broker code input */}
      {hasBroker === true && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <p className="text-sm text-gray-400">
            Entrez le code de votre courtier d&apos;assurance. Ce code est généralement fourni par votre courtier.
          </p>

          {/* Search field */}
          <div className="relative">
            <input
              type="text"
              value={brokerCode}
              onChange={(e) => {
                setBrokerCode(e.target.value.toUpperCase());
                setFoundBroker(null);
                setSearchError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              placeholder="Ex: CIMA-BJ-0042"
              className="w-full bg-white/5 border border-white/10 px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors text-sm font-mono tracking-widest uppercase"
            />
            <button
              onClick={handleLookup}
              disabled={!brokerCode.trim() || isSearching}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-30"
            >
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Search size={18} />
              )}
            </button>
          </div>

          {/* Search result */}
          {foundBroker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/20 p-5"
            >
              <div className="flex items-start gap-3">
                <CheckCircle size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[11px] font-black uppercase tracking-widest text-green-400 mb-1">
                    Courtier vérifié
                  </p>
                  <p className="text-white font-bold text-sm">{foundBroker.name}</p>
                  <p className="text-[10px] text-gray-500 mt-1 font-mono tracking-wider">
                    Code: {foundBroker.code}
                  </p>
                  {foundBroker.contactPhone && (
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Tél: {foundBroker.contactPhone}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Error */}
          {searchError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/10 p-4"
            >
              <div className="flex items-start gap-3">
                <AlertCircle size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-yellow-500 leading-relaxed">{searchError}</p>
                  <p className="text-[10px] text-gray-500 mt-2">
                    Vous pouvez tout de même continuer avec ce code. Il sera enregistré pour vérification ultérieure.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Info notice */}
          <div className="flex items-start gap-3 bg-white/[0.02] border border-white/10 p-4">
            <AlertCircle size={14} className="text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-gray-500 leading-relaxed">
              En souscrivant via LBASSUR avec un courtier externe, des frais de service s&apos;appliquent.
              Votre courtier sera notifié de la souscription et recevra sa part de commission.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center border-t border-white/10 pt-6">
            <button
              onClick={() => {
                setHasBroker(null);
                setFoundBroker(null);
                setSearchError(null);
                setBrokerCode("");
              }}
              className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              <ChevronLeft size={14} /> Retour
            </button>

            <button
              onClick={handleContinueWithBroker}
              disabled={!brokerCode.trim()}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continuer <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
