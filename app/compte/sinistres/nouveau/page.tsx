"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Send,
  ChevronLeft,
  Calendar,
  Clock,
  FileText,
  MapPin,
  Camera,
  Mic,
  Square,
  Trash2,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { api } from "@/lib/api";

const CLAIM_TYPES = [
  { value: "COLLISION", label: "Collision / accident" },
  { value: "VOL", label: "Vol" },
  { value: "INCENDIE", label: "Incendie" },
  { value: "BRIS_DE_GLACE", label: "Bris de glace" },
  { value: "DEGAT_DES_EAUX", label: "Dégât des eaux" },
  { value: "CATASTROPHE_NATURELLE", label: "Catastrophe naturelle" },
  { value: "AUTRE", label: "Autre" },
];

const COMMUNES = [
  "Cotonou", "Abomey-Calavi", "Porto-Novo", "Sèmè-Podji", "Ouidah",
  "Parakou", "Bohicon", "Abomey", "Djougou", "Natitingou",
  "Lokossa", "Kandi", "Malanville", "Savalou", "Pobè",
];

const MAX_PHOTOS = 6;
const MAX_RECORDING_SECONDS = 180;

/** Ordre de préférence : le premier format supporté par le navigateur gagne. */
const AUDIO_MIME_CANDIDATES = [
  "audio/webm;codecs=opus", // Chrome, Firefox, Android
  "audio/webm",
  "audio/mp4", // Safari, iOS
  "audio/ogg;codecs=opus",
];

const AUDIO_EXTENSIONS: Record<string, string> = {
  "audio/webm": ".webm",
  "audio/mp4": ".m4a",
  "audio/ogg": ".ogg",
  "audio/mpeg": ".mp3",
};

function audioExtension(mimeType: string) {
  const base = mimeType.split(";")[0].trim().toLowerCase();
  return AUDIO_EXTENSIONS[base] ?? ".webm";
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

const inputClass =
  "w-full bg-white/5 border border-white/10 text-white py-3 px-4 text-sm focus:border-white/40 focus:bg-white/10 transition-all outline-none";
const labelClass =
  "text-[9px] font-black uppercase tracking-widest text-gray-500";

export default function NouveauSinistre() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Champs du sinistre ──
  const [selectedQuote, setSelectedQuote] = useState("");
  const [claimType, setClaimType] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [description, setDescription] = useState("");
  const [hasInjuries, setHasInjuries] = useState(false);
  const [hasAmicableReport, setHasAmicableReport] = useState(false);
  const [hasPoliceReport, setHasPoliceReport] = useState(false);
  const [policeReportRef, setPoliceReportRef] = useState("");
  const [hasThirdParty, setHasThirdParty] = useState(false);
  const [thirdPartyName, setThirdPartyName] = useState("");
  const [thirdPartyPlate, setThirdPartyPlate] = useState("");
  const [thirdPartyInsurer, setThirdPartyInsurer] = useState("");
  const [thirdPartyPolicy, setThirdPartyPolicy] = useState("");

  // ── Pièces jointes ──
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const [audio, setAudio] = useState<{ blob: Blob; url: string } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioError, setAudioError] = useState("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("client_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchQuotes = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://lbassur-backend.onrender.com/api/v1";
        const res = await fetch(`${apiUrl}/clients/me/quotes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setQuotes(data.filter((q: any) => q.status !== "DRAFT"));
        }
      } catch (err) {
        console.error("Failed to fetch quotes", err);
      }
    };

    fetchQuotes();
  }, [router]);

  // ── Enregistrement vocal ────────────────────────────────────────────────

  const releaseMicrophone = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const startRecording = async () => {
    setAudioError("");

    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setAudioError("Votre navigateur ne permet pas l'enregistrement. Décrivez le sinistre par écrit.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = AUDIO_MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setAudio((previous) => {
          if (previous) URL.revokeObjectURL(previous.url);
          return { blob, url: URL.createObjectURL(blob) };
        });
        releaseMicrophone();
      };

      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((value) => value + 1), 1000);
    } catch (err) {
      releaseMicrophone();
      setAudioError("Micro inaccessible. Autorisez l'accès au microphone puis réessayez.");
    }
  };

  // Coupe l'enregistrement à la durée maximale sans que l'utilisateur ait à y penser.
  useEffect(() => {
    if (isRecording && elapsed >= MAX_RECORDING_SECONDS) stopRecording();
  }, [isRecording, elapsed, stopRecording]);

  const discardAudio = () => {
    if (audio) URL.revokeObjectURL(audio.url);
    setAudio(null);
    setElapsed(0);
  };

  // Libère micro, minuteur et URLs d'objets si l'utilisateur quitte la page.
  useEffect(() => {
    return () => {
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      releaseMicrophone();
    };
  }, [releaseMicrophone]);

  // ── Photos ──────────────────────────────────────────────────────────────

  const addPhotos = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const room = MAX_PHOTOS - photos.length;
    const accepted = Array.from(fileList).slice(0, room);
    setPhotos((current) => [
      ...current,
      ...accepted.map((file) => ({ file, url: URL.createObjectURL(file) })),
    ]);
  };

  const removePhoto = (index: number) => {
    setPhotos((current) => {
      URL.revokeObjectURL(current[index].url);
      return current.filter((_, i) => i !== index);
    });
  };

  // ── Envoi ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("client_token");
    if (!token) {
      setLoading(false);
      router.push("/login");
      return;
    }

    try {
      // 1. Les fichiers partent d'abord vers /uploads, qui renvoie leurs URLs.
      let attachments: any[] = [];
      const filesToUpload: File[] = photos.map((photo) => photo.file);

      if (audio) {
        const extension = audioExtension(audio.blob.type);
        filesToUpload.push(
          new File([audio.blob], `note-vocale-${Date.now()}${extension}`, { type: audio.blob.type }),
        );
      }

      if (filesToUpload.length) {
        const formData = new FormData();
        filesToUpload.forEach((file) => formData.append("files", file));

        const uploaded = await api.uploadClaimFiles(formData);
        attachments = (uploaded.files || []).map((file: any) => ({
          // La nature vient du type MIME renvoyé par le serveur, pas de l'ordre
          // d'envoi : plus robuste si l'ordre change un jour.
          kind: file.mimeType?.startsWith("audio/")
            ? "AUDIO"
            : file.mimeType?.startsWith("image/")
              ? "PHOTO"
              : "DOCUMENT",
          filename: file.originalname,
          // On renvoie la référence du fichier, pas son URL : celle-ci est
          // signée et expirante, elle est refabriquée côté serveur à chaque
          // consultation.
          publicId: file.publicId,
          resourceType: file.resourceType,
          format: file.format,
          mimeType: file.mimeType,
          size: file.size,
        }));
      }

      // 2. Puis la déclaration elle-même, avec les références des pièces.
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://lbassur-backend.onrender.com/api/v1";
      const res = await fetch(`${apiUrl}/clients/me/claims`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          quoteRequestId: selectedQuote || undefined,
          claimType,
          incidentDate,
          incidentTime: incidentTime || undefined,
          locationCity,
          locationDetails: locationDetails || undefined,
          description,
          hasInjuries,
          hasAmicableReport,
          hasPoliceReport,
          policeReportRef: hasPoliceReport ? policeReportRef || undefined : undefined,
          thirdPartyName: hasThirdParty ? thirdPartyName || undefined : undefined,
          thirdPartyPlate: hasThirdParty ? thirdPartyPlate || undefined : undefined,
          thirdPartyInsurer: hasThirdParty ? thirdPartyInsurer || undefined : undefined,
          thirdPartyPolicy: hasThirdParty ? thirdPartyPolicy || undefined : undefined,
          attachments,
        })
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la déclaration du sinistre");
      }

      router.push("/compte?tab=claims");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="bg-black min-h-screen text-white relative">
      <Navbar />

      <div className="pt-32 pb-24 container mx-auto px-6 max-w-2xl relative z-10">
        <Link
          href="/compte?tab=claims"
          className="inline-flex items-center gap-2 text-[10px] text-gray-500 hover:text-white uppercase tracking-widest transition-colors mb-8"
        >
          <ChevronLeft size={14} /> Retour à mon espace
        </Link>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="text-red-500" size={24} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white mb-2">
            Déclarer un Sinistre
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
            Plus votre déclaration est complète, plus vite nous la transmettons.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-6 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* ── Contrat ────────────────────────────────────────────────── */}
          <section className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/10 pb-3">
              Contrat concerné
            </h2>

            <div className="space-y-2">
              <label className={labelClass}>Contrat (optionnel)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="text-gray-600" size={16} />
                </div>
                <select
                  value={selectedQuote}
                  onChange={(e) => setSelectedQuote(e.target.value)}
                  className={`${inputClass} pl-10 appearance-none cursor-pointer`}
                >
                  <option value="" className="bg-black">Je ne sais pas / Autre</option>
                  {quotes.map((quote) => (
                    <option key={quote.id} value={quote.id} className="bg-black">
                      {quote.insuranceType?.replace("-", " ").toUpperCase()}
                      {quote.policyNumber ? ` - Police: ${quote.policyNumber}` : ` - Réf: ${quote.id.substring(0, 8)}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* ── Le sinistre ────────────────────────────────────────────── */}
          <section className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/10 pb-3">
              Le sinistre
            </h2>

            <div className="space-y-2">
              <label className={labelClass}>
                Nature du sinistre <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={claimType}
                onChange={(e) => setClaimType(e.target.value)}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option value="" className="bg-black">Sélectionnez…</option>
                {CLAIM_TYPES.map((type) => (
                  <option key={type.value} value={type.value} className="bg-black">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>
                  Date <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="text-gray-600" size={16} />
                  </div>
                  <input
                    type="date"
                    required
                    max={today}
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Heure approximative</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="text-gray-600" size={16} />
                  </div>
                  <input
                    type="time"
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>
                Commune <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="text-gray-600" size={16} />
                </div>
                <input
                  type="text"
                  required
                  list="communes"
                  value={locationCity}
                  onChange={(e) => setLocationCity(e.target.value)}
                  placeholder="Cotonou, Abomey-Calavi…"
                  className={`${inputClass} pl-10`}
                />
                <datalist id="communes">
                  {COMMUNES.map((commune) => (
                    <option key={commune} value={commune} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Quartier, rue ou point de repère</label>
              <input
                type="text"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                placeholder="Ex. carrefour Saint-Michel, en face de la station"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>
                Que s'est-il passé ? <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputClass} resize-none`}
                placeholder="Décrivez les circonstances : ce que vous faisiez, comment l'accident s'est produit, les dégâts constatés…"
              />
            </div>
          </section>

          {/* ── Note vocale ────────────────────────────────────────────── */}
          <section className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/10 pb-3">
              Note vocale (optionnel)
            </h2>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Plus simple que d'écrire ? Racontez le sinistre à voix haute, un gestionnaire
              LBASSUR écoutera votre message. 3 minutes maximum.
            </p>

            {audioError && (
              <p className="text-[10px] text-red-400 uppercase tracking-widest">{audioError}</p>
            )}

            {!audio ? (
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-full flex items-center justify-center gap-3 py-4 text-[10px] font-black uppercase tracking-widest transition-colors border ${
                  isRecording
                    ? "bg-red-600 border-red-600 text-white hover:bg-red-700"
                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {isRecording ? (
                  <>
                    <Square size={14} /> Arrêter — {formatDuration(elapsed)}
                  </>
                ) : (
                  <>
                    <Mic size={16} /> Enregistrer une note vocale
                  </>
                )}
              </button>
            ) : (
              <div className="bg-[#050505] border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <audio controls src={audio.url} className="w-full sm:flex-1" />
                <button
                  type="button"
                  onClick={discardAudio}
                  className="flex items-center justify-center gap-2 text-[9px] text-gray-500 hover:text-red-400 uppercase tracking-widest transition-colors"
                >
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            )}
          </section>

          {/* ── Photos ─────────────────────────────────────────────────── */}
          <section className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/10 pb-3">
              Photos ({photos.length}/{MAX_PHOTOS})
            </h2>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Vue d'ensemble, dégâts de près, plaque du véhicule tiers, constat amiable.
              Ce sont les photos qui accélèrent le plus le traitement.
            </p>

            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {photos.map((photo, index) => (
                  <div key={photo.url} className="relative aspect-square border border-white/10 overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      aria-label="Retirer la photo"
                      className="absolute top-1 right-1 bg-black/80 border border-white/20 p-1 text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photos.length < MAX_PHOTOS && (
              <label className="flex items-center justify-center gap-3 py-4 text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
                <Camera size={16} /> Ajouter des photos
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={(e) => {
                    addPhotos(e.target.files);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
              </label>
            )}
          </section>

          {/* ── Autres éléments ────────────────────────────────────────── */}
          <section className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/10 pb-3">
              Autres éléments
            </h2>

            <Toggle
              checked={hasInjuries}
              onChange={setHasInjuries}
              label="Il y a eu des blessés"
            />
            <Toggle
              checked={hasAmicableReport}
              onChange={setHasAmicableReport}
              label="Un constat amiable a été établi"
            />
            <Toggle
              checked={hasPoliceReport}
              onChange={setHasPoliceReport}
              label="Un PV de police ou une plainte a été déposé"
            />

            {hasPoliceReport && (
              <div className="space-y-2 pl-4 border-l border-white/10">
                <label className={labelClass}>Référence du PV ou de la plainte</label>
                <input
                  type="text"
                  value={policeReportRef}
                  onChange={(e) => setPoliceReportRef(e.target.value)}
                  className={inputClass}
                />
              </div>
            )}

            <Toggle
              checked={hasThirdParty}
              onChange={setHasThirdParty}
              label="Un tiers est impliqué"
            />

            {hasThirdParty && (
              <div className="space-y-4 pl-4 border-l border-white/10">
                <div className="space-y-2">
                  <label className={labelClass}>Nom du tiers</label>
                  <input
                    type="text"
                    value={thirdPartyName}
                    onChange={(e) => setThirdPartyName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelClass}>Immatriculation</label>
                  <input
                    type="text"
                    value={thirdPartyPlate}
                    onChange={(e) => setThirdPartyPlate(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Sa compagnie d'assurance</label>
                    <input
                      type="text"
                      value={thirdPartyInsurer}
                      onChange={(e) => setThirdPartyInsurer(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Son n° de police</label>
                    <input
                      type="text"
                      value={thirdPartyPolicy}
                      onChange={(e) => setThirdPartyPolicy(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          <button
            type="submit"
            disabled={loading || isRecording}
            className="w-full flex items-center justify-center gap-3 bg-red-600 text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send size={16} />
                Soumettre la déclaration
              </>
            )}
          </button>

          {isRecording && (
            <p className="text-[9px] text-center text-gray-500 uppercase tracking-widest">
              Arrêtez l'enregistrement avant de soumettre.
            </p>
          )}
        </form>
      </div>

      <Footer />
    </main>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-red-600 cursor-pointer"
      />
      <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
        {label}
      </span>
    </label>
  );
}
