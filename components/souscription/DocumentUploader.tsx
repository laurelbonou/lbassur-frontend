"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, X, CheckCircle, AlertCircle, Image as ImageIcon } from "lucide-react";
import type { RequiredDocument } from "@/lib/insurance-forms";

interface UploadedFile {
  docId: string;
  file: File;
  preview?: string;
}

interface DocumentUploaderProps {
  requiredDocuments: RequiredDocument[];
  onComplete: (files: UploadedFile[]) => void;
  onBack: () => void;
  initialFiles?: UploadedFile[];
}

export default function DocumentUploader({ requiredDocuments, onComplete, onBack, initialFiles }: DocumentUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(initialFiles || []);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  const handleFileSelect = (docId: string, file: File) => {
    const doc = requiredDocuments.find((d) => d.id === docId);
    if (!doc) return;

    // Validate format
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!doc.acceptedFormats.includes(ext)) {
      setError(`Format non accepté pour "${doc.name}". Formats autorisés: ${doc.acceptedFormats.join(", ").toUpperCase()}`);
      return;
    }

    // Validate size
    if (file.size > doc.maxSizeMB * 1024 * 1024) {
      setError(`Fichier trop volumineux pour "${doc.name}". Taille maximale: ${doc.maxSizeMB} MB`);
      return;
    }

    setError(null);

    // Generate preview for images
    let preview: string | undefined;
    if (["jpg", "jpeg", "png"].includes(ext)) {
      preview = URL.createObjectURL(file);
    }

    setUploadedFiles((prev) => {
      const filtered = prev.filter((f) => f.docId !== docId);
      return [...filtered, { docId, file, preview }];
    });
  };

  const removeFile = (docId: string) => {
    setUploadedFiles((prev) => {
      const removed = prev.find((f) => f.docId === docId);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter((f) => f.docId !== docId);
    });
  };

  const handleDrop = (docId: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(docId, file);
  };

  const handleSubmit = () => {
    // Check required documents
    const missingRequired = requiredDocuments.filter(
      (doc) => doc.required && !uploadedFiles.find((f) => f.docId === doc.id)
    );

    if (missingRequired.length > 0) {
      setError(`Documents obligatoires manquants : ${missingRequired.map((d) => d.name).join(", ")}`);
      return;
    }

    onComplete(uploadedFiles);
  };

  const getFileForDoc = (docId: string) => uploadedFiles.find((f) => f.docId === docId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
        <UploadCloud className="text-gray-400" size={20} />
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest text-white">
            Pièces Justificatives
          </h2>
          <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider">
            Conformes à la législation béninoise
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-6">
        Veuillez fournir les documents suivants pour valider votre demande de cotation.
        Les documents marqués d&apos;un <span className="text-red-400 font-bold">*</span> sont obligatoires.
      </p>

      {/* Document Cards */}
      <div className="space-y-4">
        {requiredDocuments.map((doc) => {
          const uploadedFile = getFileForDoc(doc.id);
          const isDragging = dragOver === doc.id;

          return (
            <motion.div
              key={doc.id}
              layout
              className={`group border transition-all duration-300 ${
                uploadedFile
                  ? "border-white/30 bg-white/5"
                  : isDragging
                  ? "border-white/60 bg-white/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(doc.id);
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(doc.id, e)}
            >
              <div className="p-5 md:p-6 flex items-center justify-between gap-4">
                {/* Left — Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-sm flex-shrink-0 flex items-center justify-center transition-colors ${
                      uploadedFile
                        ? "bg-white text-black"
                        : "bg-white/5 text-gray-500 border border-white/10"
                    }`}
                  >
                    {uploadedFile ? (
                      <CheckCircle size={18} />
                    ) : (
                      <FileText size={18} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white truncate">
                        {doc.name}
                      </span>
                      {doc.required && (
                        <span className="text-red-400 text-[10px] font-black">*</span>
                      )}
                      {!doc.required && (
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider border border-white/10 px-1.5 py-0.5">
                          Optionnel
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                      {uploadedFile
                        ? uploadedFile.file.name
                        : doc.description}
                    </p>
                    <p className="text-[9px] text-gray-600 mt-0.5 uppercase tracking-wider">
                      {doc.acceptedFormats.map((f) => f.toUpperCase()).join(", ")} · Max {doc.maxSizeMB} MB
                    </p>
                  </div>
                </div>

                {/* Right — Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {uploadedFile ? (
                    <>
                      {uploadedFile.preview && (
                        <div className="w-10 h-10 border border-white/10 overflow-hidden rounded-sm">
                          <img src={uploadedFile.preview} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <button
                        onClick={() => removeFile(doc.id)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500 transition-colors rounded-sm border border-transparent hover:border-red-500"
                        title="Supprimer"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveDocId(doc.id);
                        fileInputRef.current?.click();
                      }}
                      className="px-6 py-3 bg-white !text-black text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-200 transition-transform active:scale-95 rounded-sm shadow-sm"
                    >
                      <UploadCloud size={16} />
                      Parcourir
                    </button>
                  )}
                </div>
              </div>

              {/* Drop zone indicator */}
              {isDragging && !uploadedFile && (
                <div className="px-5 pb-5">
                  <div className="border border-dashed border-white/40 bg-white/5 py-4 text-center">
                    <span className="text-[9px] font-bold text-white uppercase tracking-widest">
                      Déposez votre fichier ici
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.xlsx"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && activeDocId) {
            handleFileSelect(activeDocId, file);
            setActiveDocId(null);
          }
          e.target.value = "";
        }}
      />

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 bg-red-500/10 border border-red-500/30 p-5 rounded-sm"
          >
            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
            <span className="text-xs font-bold text-red-300 uppercase tracking-widest leading-relaxed">
              {error}
            </span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-white transition-colors p-1"
              title="Fermer"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Summary */}
      <div className="bg-white/5 border border-white/10 p-4 flex items-center justify-between">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Documents fournis
        </span>
        <span className="text-sm font-black text-white tabular-nums">
          {uploadedFiles.length} / {requiredDocuments.length}
        </span>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center border-t border-white/10 pt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
        >
          ← Retour à la Fiche
        </button>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-white !text-black px-10 py-5 text-[13px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors active:scale-95"
        >
          Continuer →
        </button>
      </div>
    </div>
  );
}
