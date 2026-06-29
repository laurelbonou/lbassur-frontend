"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StepIndicator from "@/components/souscription/StepIndicator";
import DynamicForm from "@/components/souscription/DynamicForm";
import DocumentUploader from "@/components/souscription/DocumentUploader";

import SubscriptionSummary from "@/components/souscription/SubscriptionSummary";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle, CreditCard, ChevronLeft, ChevronRight, Download, ShieldCheck, AlertCircle, Printer } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { FeexPayProvider, FeexPayButton } from "@feexpay/react-sdk";
import "@feexpay/react-sdk/style.css";
import { getFormConfigByInsuranceType, getAvailableForms } from "@/lib/insurance-forms";
import type { InsuranceFormConfig } from "@/lib/insurance-forms";

// ── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: "select",    title: "Type d'Assurance",    shortTitle: "Type" },
  { id: "form",      title: "Fiche de Cotation",   shortTitle: "Fiche" },
  { id: "documents", title: "Pièces Justificatives", shortTitle: "Pièces" },
  { id: "summary",   title: "Récapitulatif",       shortTitle: "Résumé" },
  { id: "payment",   title: "Paiement",            shortTitle: "Paiement" },
  { id: "success",   title: "Confirmation",        shortTitle: "Confirmé" },
];

// ── Main Page ────────────────────────────────────────────────────────────────

export default function SouscriptionPage() {
  return (
    <Suspense fallback={
      <main className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </main>
    }>
      <SouscriptionContent />
    </Suspense>
  );
}

function SouscriptionContent() {
  const searchParams = useSearchParams();

  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedConfig, setSelectedConfig] = useState<InsuranceFormConfig | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [uploadedFiles, setUploadedFiles] = useState<{ docId: string; file: File; preview?: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<{
    id: string;
    insurer: string;
    price: number;
    guarantees: string;
    type: string;
  } | null>(null);

  // Initialize from URL params
  useEffect(() => {
    const offerId = searchParams.get("offerId");
    const type = searchParams.get("type");
    const insurer = searchParams.get("insurer");
    const price = searchParams.get("price");
    const guarantees = searchParams.get("guarantees");

    if (type) {
      const config = getFormConfigByInsuranceType(type);
      if (config && config.available) {
        setSelectedConfig(config);
        setCurrentStep(1); // Skip type selection
      }
    }

    if (offerId && insurer && price) {
      setSelectedOffer({
        id: offerId,
        insurer: decodeURIComponent(insurer),
        price: parseInt(price, 10) || 0,
        guarantees: guarantees ? decodeURIComponent(guarantees) : "",
        type: type ? decodeURIComponent(type) : "",
      });
    }
  }, [searchParams]);

  // Navigation
  const goToStep = (step: number) => setCurrentStep(step);

  const handleSelectType = (config: InsuranceFormConfig) => {
    setSelectedConfig(config);
    setCurrentStep(1);
  };

  const handleFormComplete = (data: Record<string, unknown>) => {
    setFormData(data);
    setCurrentStep(2);
  };

  const handleDocumentsComplete = (files: { docId: string; file: File; preview?: string }[]) => {
    setUploadedFiles(files);
    setCurrentStep(3); // Go to summary
  };

  const handleProceedToPayment = async (signature: string | null) => {
    setSignatureData(signature);
    setIsProcessing(true);
    try {
      const formDataUpload = new FormData();
      uploadedFiles.forEach((f) => formDataUpload.append("files", f.file));
      
      let documents: any[] = [];
      if (uploadedFiles.length > 0) {
        const uploadData = await api.uploadDocuments(formDataUpload);
        documents = uploadData.files.map((f: any) => {
          const originalDoc = uploadedFiles.find(u => u.file.name === f.originalname);
          return {
            type: originalDoc ? originalDoc.docId : "document",
            filename: f.filename,
            url: f.url,
            mimeType: f.mimeType,
            size: f.size,
          };
        });
      }

      const quotePayload = {
          fullName: formData["fullName"] || formData["nom"] || formData["prenom"] || "Client En Ligne",
          phone: formData["phone"] || formData["telephone"] || "00000000",
          email: formData["email"] || formData["courriel"] || undefined,
          insuranceType: selectedConfig?.id,
          budget: selectedOffer?.price || 0,
          payload: { ...formData, price: selectedOffer?.price },
          documents,
          signatureData: signature || undefined,
          selectedOfferId: selectedOffer?.id,
      };

      let quote;
      if (draftId) {
        quote = await api.updateQuoteRequest(draftId, quotePayload);
      } else {
        quote = await api.createQuoteRequest(quotePayload);
      }

      setQuoteId(quote.id);
      setCurrentStep(4); // Go to payment
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors du traitement.");
    } finally {
      setIsProcessing(false);
    }
  };

  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [quoteId, setQuoteId] = useState<string | null>(null);

  const handleSectionComplete = async (sectionIndex: number, data: Record<string, unknown>) => {
    if (sectionIndex === 0 && !draftId) {
      try {
        const draft = await api.createDraft({
          fullName: data["fullName"] || data["nom"] || data["prenom"] || "Client En Ligne",
          phone: data["phone"] || data["telephone"] || "00000000",
          email: data["email"] || data["courriel"] || undefined,
        });
        setDraftId(draft.id);
      } catch (err) {
        console.error("Failed to save draft", err);
      }
    } else if (draftId) {
      try {
        await api.updateQuoteRequest(draftId, { payload: data });
      } catch (err) {
        console.error("Failed to update draft", err);
      }
    }
  };

  const onPaymentSuccess = (response: any) => {
    console.log("FeexPay Response:", response);
    setReference(response?.reference || `LB-${Date.now().toString(36).toUpperCase().slice(-8)}`);
    setCurrentStep(5); // Go to success
  };

  const currentStepId = STEPS[currentStep]?.id;

  return (
    <FeexPayProvider>
    <main className="bg-black min-h-screen text-white relative">
      <Navbar />

      <div className="pt-32 pb-24 container mx-auto px-6 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8 block"
          >
            Souscription 100% Digitale
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-24 uppercase tracking-tighter"
          >
            {selectedConfig ? selectedConfig.title : "Souscription"}{" "}
            <span className="text-gray-600">en Ligne</span>
          </motion.h1>

          {/* Step Indicator */}
          {currentStep < STEPS.length - 1 && (
            <StepIndicator
              steps={STEPS.slice(0, -1)}
              currentStep={currentStep}
            />
          )}
        </div>

        {/* Form Container */}
        <div className="bg-[#050505] border border-white/10 p-6 md:p-10 shadow-2xl relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* ── STEP 0: TYPE SELECTION ── */}
            {currentStepId === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                  <Shield className="text-gray-400" size={20} />
                  <h2 className="text-lg font-black uppercase tracking-widest text-white">
                    Choisissez votre type d&apos;assurance
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getAvailableForms().map((config) => (
                    <button
                      key={config.id}
                      onClick={() => handleSelectType(config)}
                      className="bg-white/5 p-6 border border-white/10 hover:border-white/40 hover:bg-white/10 transition-all duration-500 text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-white block mb-1 group-hover:translate-x-1 transition-transform">
                            {config.title}
                          </span>
                          <span className="text-[8px] text-gray-500">{config.subtitle}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Phase 2 preview */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                    Bientôt Disponible
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["RC", "Transport", "Caution", "TRC", "Flotte", "Incendie", "Cyber", "Agricole"].map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1.5 border border-white/5 text-[7px] font-bold uppercase tracking-widest text-gray-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 1: DYNAMIC FORM ── */}
            {currentStepId === "form" && selectedConfig && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <DynamicForm
                  config={selectedConfig}
                  onComplete={handleFormComplete}
                  onBack={() => goToStep(0)}
                  onSectionComplete={handleSectionComplete}
                  initialData={formData}
                />
              </motion.div>
            )}

            {/* ── STEP 2: DOCUMENTS ── */}
            {currentStepId === "documents" && selectedConfig && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <DocumentUploader
                  requiredDocuments={selectedConfig.requiredDocuments}
                  onComplete={handleDocumentsComplete}
                  onBack={() => goToStep(1)}
                  initialFiles={uploadedFiles}
                />
              </motion.div>
            )}

            {/* ── STEP 3: SUMMARY ── */}
            {currentStepId === "summary" && selectedConfig && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <SubscriptionSummary
                  config={selectedConfig}
                  formData={formData}
                  uploadedFilesCount={uploadedFiles.length}
                  selectedOffer={selectedOffer}
                  onProceedToPayment={handleProceedToPayment}
                  onBack={() => goToStep(2)}
                  onEditStep={(step) => goToStep(step)}
                />
              </motion.div>
            )}

            {/* ── STEP 4: PAYMENT ── */}
            {currentStepId === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 relative"
              >
                {isProcessing && (
                  <div className="absolute inset-0 bg-[#050505]/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white animate-pulse">
                      Traitement Sécurisé en cours...
                    </p>
                    <p className="text-[8px] text-gray-500 mt-2 uppercase tracking-wider">
                      Ne fermez pas cette page
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                  <CreditCard className="text-gray-400" size={20} />
                  <h2 className="text-lg font-black uppercase tracking-widest">Règlement</h2>
                </div>

                {/* Amount */}
                <div className="bg-white/5 border border-white/10 p-6 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Montant à Payer
                  </span>
                  <span className="text-2xl font-black text-white tabular-nums">
                    {selectedOffer ? selectedOffer.price.toLocaleString("fr-FR") : "—"}{" "}
                    <small className="text-xs text-gray-500">F.CFA</small>
                  </span>
                </div>

                {/* Payment Methods */}
                <div className="flex justify-center py-4">
                  {quoteId ? (
                    <FeexPayButton 
                      amount={selectedOffer?.price || 0} 
                      description={`Souscription ${selectedConfig?.title}`} 
                      id={process.env.NEXT_PUBLIC_FEEXPAY_SHOP_ID!} 
                      token={process.env.NEXT_PUBLIC_FEEXPAY_TOKEN!} 
                      callback={onPaymentSuccess}
                      callback_url={`${process.env.NEXT_PUBLIC_API_URL || "https://lbassur.bj/api"}/payments/webhook`}
                      mode="LIVE"
                      currency="XOF"
                      customId={quoteId}
                    />
                  ) : (
                    <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  )}
                </div>

                {/* Notice */}
                <div className="flex items-start gap-3 bg-white/[0.02] border border-white/10 p-4">
                  <AlertCircle size={14} className="text-gray-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[8px] text-gray-500 leading-relaxed">
                    Le paiement est sécurisé et chiffré par FeexPay. Vous recevrez une attestation provisoire par email
                    immédiatement après confirmation du paiement.
                  </p>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center border-t border-white/10 pt-6">
                  <button
                    onClick={() => goToStep(3)}
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                  >
                    <ChevronLeft size={14} /> Retour
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 5: SUCCESS ── */}
            {currentStepId === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, delay: 0.2 }}
                  className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                >
                  <ShieldCheck size={48} className="text-black" />
                </motion.div>

                <h2 className="text-3xl font-bold uppercase tracking-tight text-white mb-4">
                  Souscription Confirmée
                </h2>
                <p className="text-gray-400 text-sm mb-4 max-w-md mx-auto">
                  Votre demande de souscription{" "}
                  <span className="text-white font-bold">{selectedConfig?.title}</span>{" "}
                  {selectedOffer && (
                    <>
                      auprès de{" "}
                      <span className="text-white font-bold">{selectedOffer.insurer}</span>
                    </>
                  )}{" "}
                  a bien été enregistrée.
                </p>
                <p className="text-gray-500 text-xs mb-8 max-w-md mx-auto">
                  Vous recevrez un retour sous 30 minutes. Un email et un message WhatsApp contenant votre quittance vous ont été envoyés.
                </p>

                {/* Reference Number */}
                <div className="bg-white/5 border border-white/10 p-4 max-w-sm mx-auto mb-8">
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                    Numéro de référence
                  </span>
                  <span className="text-lg font-black text-white tabular-nums tracking-widest">
                    {reference || `LB-${Date.now().toString(36).toUpperCase().slice(-8)}`}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {receiptUrl ? (
                    <a
                      href={receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
                    >
                      <Download size={14} />
                      Télécharger la Quittance
                    </a>
                  ) : (
                    <button className="inline-flex items-center justify-center gap-3 bg-white/5 text-gray-500 px-8 py-4 text-[10px] font-black uppercase tracking-widest cursor-not-allowed">
                      <Download size={14} />
                      Quittance non disponible
                    </button>
                  )}
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center justify-center gap-3 border border-white/20 text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                  >
                    <Printer size={14} />
                    Imprimer la Page
                  </button>
                </div>

                <div className="mt-10">
                  <Link
                    href="/"
                    className="text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1"
                  >
                    Retour à l&apos;accueil
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </main>
    </FeexPayProvider>
  );
}
