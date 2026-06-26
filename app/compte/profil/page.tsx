"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfileChangeRequestPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [proofDocumentUrl, setProofDocumentUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("client_user");
    if (!userData) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      fullName: parsedUser.fullName || "",
      email: parsedUser.email || "",
      phone: parsedUser.phone || "",
    });
  }, [router]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async (selectedFile: File) => {
    const token = localStorage.getItem("client_token");
    const uploadData = new FormData();
    uploadData.append("file", selectedFile);
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://lbassur-backend.onrender.com/api/v1";
    const res = await fetch(`${apiUrl}/uploads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: uploadData,
    });
    
    if (!res.ok) {
      throw new Error("Erreur lors de l'upload du fichier justificatif");
    }
    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("client_token");
      
      // Determine what changed
      const requestedData: any = {};
      if (formData.fullName !== user.fullName) requestedData.fullName = formData.fullName;
      if (formData.email !== user.email) requestedData.email = formData.email;
      if (formData.phone !== user.phone) requestedData.phone = formData.phone;

      if (Object.keys(requestedData).length === 0) {
        setError("Aucune modification détectée.");
        setLoading(false);
        return;
      }

      if (!file) {
        setError("Un document justificatif est requis (ex: CNI, Passeport) pour valider ces changements.");
        setLoading(false);
        return;
      }

      // 1. Upload the file
      const uploadedUrl = await uploadFile(file);

      // 2. Submit change request
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://lbassur-backend.onrender.com/api/v1";
      const res = await fetch(`${apiUrl}/clients/me/change-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          requestedData,
          proofDocumentUrl: uploadedUrl,
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la soumission de la demande");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/compte");
      }, 3000);

    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <main className="bg-black min-h-screen text-white relative">
      <Navbar />

      <div className="pt-32 pb-24 container mx-auto px-6 max-w-3xl relative z-10">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] text-gray-500 hover:text-white uppercase tracking-widest mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Retour au tableau de bord
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#050505] border border-white/10 p-8 md:p-12"
        >
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-2">Modifier mon profil</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-8">
            Vos modifications doivent être accompagnées d'un justificatif d'identité et seront validées par notre équipe.
          </p>

          {success ? (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 flex flex-col items-center justify-center text-center">
              <CheckCircle size={48} className="mb-4" />
              <h3 className="font-bold uppercase tracking-widest mb-2">Demande envoyée</h3>
              <p className="text-xs">
                Votre demande de modification a bien été reçue. Elle sera traitée dans les plus brefs délais par notre administration.
              </p>
              <p className="text-[10px] mt-4 opacity-50">Redirection en cours...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 text-xs flex items-start gap-3">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Nom Complet</label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white p-4 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white p-4 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Téléphone</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 text-white p-4 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                  Justificatif d'identité (Obligatoire)
                </label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className={`w-full border-2 border-dashed ${file ? 'border-white/40 bg-white/5' : 'border-white/10 bg-[#050505]'} p-8 text-center flex flex-col items-center justify-center transition-colors`}>
                    <Upload size={24} className={file ? 'text-white mb-2' : 'text-gray-600 mb-2'} />
                    {file ? (
                      <span className="text-xs font-bold text-white">{file.name}</span>
                    ) : (
                      <span className="text-xs text-gray-500 uppercase tracking-widest">
                        Glissez ou cliquez pour uploader une CNI / Passeport
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-white text-black font-black uppercase tracking-widest py-4 hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />}
                Soumettre la demande
              </button>
            </form>
          )}
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
