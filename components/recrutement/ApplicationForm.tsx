"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Loader2,
  Check,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Copy,
} from "lucide-react";
import { api, type UploadedFile } from "@/lib/api";
import type { OffreDetail, ChampOffre } from "@/app/carrieres/[slug]/page";

type Experience = {
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

type Formation = {
  degree: string;
  field: string;
  school: string;
  level: string;
  startYear: string;
  endYear: string;
  ongoing: boolean;
};

type Certification = { name: string; issuer: string; obtainedYear: string };

const NIVEAUX = ["Bac", "Bac+2", "Bac+3", "Bac+4", "Bac+5", "Doctorat"];
const NIVEAUX_LANGUE = ["Notions", "Intermédiaire", "Courant", "Langue maternelle"];
const DISPONIBILITES = [
  { val: "IMMEDIATE", label: "Immédiate" },
  { val: "ONE_MONTH", label: "Sous 1 mois" },
  { val: "TWO_MONTHS", label: "Sous 2 mois" },
  { val: "THREE_MONTHS_PLUS", label: "3 mois et plus" },
];

const ETAPES = ["CV", "Identité", "Parcours", "Formation", "Compléments", "Envoi"];

const vide = (s: string) => !s || s.trim() === "";

export default function ApplicationForm({ offre }: { offre: OffreDetail }) {
  const [etape, setEtape] = useState(0);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [resultat, setResultat] = useState<{ reference: string } | null>(null);

  // Pièces
  const [cv, setCv] = useState<UploadedFile | null>(null);
  const [photo, setPhoto] = useState<UploadedFile | null>(null);
  const [pieceIdentite, setPieceIdentite] = useState<UploadedFile | null>(null);
  const [diplomes, setDiplomes] = useState<UploadedFile[]>([]);
  const [televersement, setTeleversement] = useState<string | null>(null);
  const [lectureCv, setLectureCv] = useState(false);
  const [cvLu, setCvLu] = useState(false);

  /**
   * `null` tant que la reponse n'est pas revenue : on n'affiche alors aucune
   * promesse, plutot que d'annoncer un pre-remplissage puis de se dedire.
   */
  const [preselection, setPreselection] = useState<boolean | null>(null);

  useEffect(() => {
    api.getRecruitmentCapabilities().then((c) => setPreselection(c.screening));
  }, []);

  // Identité
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  // Profil
  const [headline, setHeadline] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [yearsOfExperience, setYears] = useState("");
  const [availability, setAvailability] = useState("");
  const [salaryExpectation, setSalary] = useState("");
  const [linkedinUrl, setLinkedin] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [competence, setCompetence] = useState("");
  const [languages, setLanguages] = useState<{ name: string; level: string }[]>([]);

  // Parcours
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Formation[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  // Questions de l'offre
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [motivation, setMotivation] = useState("");

  const champs: ChampOffre[] = offre.formSchema?.fields ?? [];

  // ── Téléversement ────────────────────────────────────────────────────────

  async function televerser(fichiers: FileList | null, cible: string) {
    if (!fichiers?.length) return;
    setTeleversement(cible);
    setErreur(null);
    try {
      const { files } = await api.uploadApplicationFiles(Array.from(fichiers));
      if (cible === "cv") {
        setCv(files[0]);
        // Inutile d'interroger le serveur quand la lecture n'est pas en service.
        if (preselection) void lireCv(files[0]);
      } else if (cible === "photo") setPhoto(files[0]);
      else if (cible === "identite") setPieceIdentite(files[0]);
      else setDiplomes((d) => [...d, ...files]);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Téléversement impossible.");
    } finally {
      setTeleversement(null);
    }
  }

  /**
   * Lecture du CV pour pré-remplir le formulaire.
   *
   * Silencieuse en cas d'échec : le candidat remplit à la main, ce qui reste
   * parfaitement praticable. Un message d'erreur ici ne lui apprendrait rien
   * d'actionnable.
   */
  async function lireCv(fichier: UploadedFile) {
    setLectureCv(true);
    try {
      const { profile } = await api.prefillFromCv({
        publicId: fichier.publicId,
        resourceType: fichier.resourceType,
        format: fichier.format,
        mimeType: fichier.mimeType,
      });
      if (!profile) return;

      const p = (v: unknown) => (typeof v === "string" && v.trim() ? v : "");
      setFirstName((x) => x || p(profile.firstName));
      setLastName((x) => x || p(profile.lastName));
      setEmail((x) => x || p(profile.email));
      setPhone((x) => x || p(profile.phone));
      setCity((x) => x || p(profile.city));
      setHeadline((x) => x || p(profile.headline));
      setCurrentPosition((x) => x || p(profile.currentPosition));
      setCurrentCompany((x) => x || p(profile.currentCompany));
      setLinkedin((x) => x || p(profile.linkedinUrl));
      if (profile.yearsOfExperience != null) setYears(String(profile.yearsOfExperience));
      if (profile.skills?.length) setSkills(profile.skills);
      if (profile.languages?.length) setLanguages(profile.languages);

      if (profile.experiences?.length) {
        setExperiences(
          profile.experiences.map((e: any) => ({
            position: p(e.position),
            company: p(e.company),
            location: p(e.location),
            startDate: p(e.startDate),
            endDate: p(e.endDate),
            current: !!e.current,
            description: p(e.description),
          })),
        );
      }
      if (profile.educations?.length) {
        setEducations(
          profile.educations.map((e: any) => ({
            degree: p(e.degree),
            field: p(e.field),
            school: p(e.school),
            level: p(e.level),
            startYear: e.startYear ? String(e.startYear) : "",
            endYear: e.endYear ? String(e.endYear) : "",
            ongoing: !!e.ongoing,
          })),
        );
      }
      if (profile.certifications?.length) {
        setCertifications(
          profile.certifications.map((c: any) => ({
            name: p(c.name),
            issuer: p(c.issuer),
            obtainedYear: c.obtainedYear ? String(c.obtainedYear) : "",
          })),
        );
      }
      setCvLu(true);
    } catch {
      /* pré-remplissage indisponible : saisie manuelle */
    } finally {
      setLectureCv(false);
    }
  }

  // ── Validation par étape ─────────────────────────────────────────────────

  function valider(n: number): string | null {
    if (n === 0 && !cv) return "Le CV est obligatoire.";
    if (n === 1) {
      if (vide(firstName) || vide(lastName)) return "Nom et prénom sont obligatoires.";
      if (!/^\S+@\S+\.\S+$/.test(email)) return "Adresse e-mail invalide.";
      if (vide(phone)) return "Le téléphone est obligatoire.";
    }
    if (n === 2 && experiences.length === 0) {
      return "Renseignez au moins une expérience professionnelle.";
    }
    if (n === 2) {
      const i = experiences.findIndex(
        (e) => vide(e.position) || vide(e.company) || vide(e.startDate),
      );
      if (i >= 0) return `Expérience ${i + 1} : poste, entreprise et date de début sont obligatoires.`;
    }
    if (n === 3) {
      if (educations.length === 0) return "Renseignez au moins une formation.";
      const i = educations.findIndex((e) => vide(e.degree) || vide(e.school));
      if (i >= 0) return `Formation ${i + 1} : diplôme et établissement sont obligatoires.`;
    }
    if (n === 4) {
      const manquant = champs.find((c) => {
        if (!c.required) return false;
        const v = answers[c.id];
        if (v === undefined || v === null) return true;
        if (typeof v === "string") return v.trim() === "";
        if (Array.isArray(v)) return v.length === 0;
        return false;
      });
      if (manquant) return `« ${manquant.label} » est obligatoire.`;
    }
    return null;
  }

  function suivant() {
    const e = valider(etape);
    if (e) return setErreur(e);
    setErreur(null);
    setEtape((n) => Math.min(n + 1, ETAPES.length - 1));
  }

  // ── Envoi ────────────────────────────────────────────────────────────────

  async function envoyer() {
    for (let n = 0; n <= 4; n++) {
      const e = valider(n);
      if (e) {
        setEtape(n);
        return setErreur(e);
      }
    }

    setEnvoi(true);
    setErreur(null);
    try {
      const piece = (f: UploadedFile, kind: string) => ({
        kind,
        filename: f.originalname,
        mimeType: f.mimeType,
        size: f.size,
        publicId: f.publicId,
        resourceType: f.resourceType,
        format: f.format,
      });

      const payload = {
        firstName,
        lastName,
        email,
        phone,
        ...(birthDate ? { birthDate: new Date(birthDate).toISOString() } : {}),
        ...(gender ? { gender } : {}),
        ...(nationality ? { nationality } : {}),
        ...(city ? { city } : {}),
        ...(address ? { address } : {}),
        ...(photo
          ? {
              photoPublicId: photo.publicId,
              photoResourceType: photo.resourceType,
              photoFormat: photo.format,
            }
          : {}),
        ...(headline ? { headline } : {}),
        ...(currentPosition ? { currentPosition } : {}),
        ...(currentCompany ? { currentCompany } : {}),
        ...(yearsOfExperience ? { yearsOfExperience: Number(yearsOfExperience) } : {}),
        ...(availability ? { availability } : {}),
        ...(salaryExpectation ? { salaryExpectation: Number(salaryExpectation) } : {}),
        ...(linkedinUrl ? { linkedinUrl } : {}),
        ...(skills.length ? { skills } : {}),
        ...(languages.length ? { languages } : {}),
        experiences: experiences.map((e) => ({
          position: e.position,
          company: e.company,
          ...(e.location ? { location: e.location } : {}),
          // Le formulaire capture AAAA-MM ; l'API attend une date complète.
          startDate: new Date(`${e.startDate}-01`).toISOString(),
          ...(e.current || !e.endDate
            ? {}
            : { endDate: new Date(`${e.endDate}-01`).toISOString() }),
          current: e.current,
          ...(e.description ? { description: e.description } : {}),
        })),
        educations: educations.map((e) => ({
          degree: e.degree,
          ...(e.field ? { field: e.field } : {}),
          school: e.school,
          ...(e.level ? { level: e.level } : {}),
          ...(e.startYear ? { startYear: Number(e.startYear) } : {}),
          ...(e.endYear && !e.ongoing ? { endYear: Number(e.endYear) } : {}),
          ongoing: e.ongoing,
        })),
        ...(certifications.length
          ? {
              certifications: certifications.map((c) => ({
                name: c.name,
                ...(c.issuer ? { issuer: c.issuer } : {}),
                ...(c.obtainedYear ? { obtainedYear: Number(c.obtainedYear) } : {}),
              })),
            }
          : {}),
        ...(motivation ? { motivation } : {}),
        ...(Object.keys(answers).length ? { answers } : {}),
        attachments: [
          ...(cv ? [piece(cv, "CV")] : []),
          ...(photo ? [piece(photo, "PHOTO")] : []),
          ...(pieceIdentite ? [piece(pieceIdentite, "ID_DOCUMENT")] : []),
          ...diplomes.map((d) => piece(d, "DIPLOMA")),
        ],
      };

      const res = await api.applyToJob(offre.slug, payload);
      setResultat({ reference: res.reference });
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "Envoi impossible.");
    } finally {
      setEnvoi(false);
    }
  }

  // ── Confirmation ─────────────────────────────────────────────────────────

  if (resultat) {
    return (
      <div className="border border-white/15 p-10 md:p-14 text-center">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
          <Check size={22} />
        </div>
        <h2 className="text-2xl font-bold mb-4">Candidature enregistrée</h2>
        <p className="text-gray-400 font-light mb-8 max-w-md mx-auto leading-relaxed">
          Un e-mail de confirmation vient de vous être envoyé à {email}, avec le
          récapitulatif de votre dossier.
        </p>

        <div className="inline-block border border-white/20 px-8 py-5 mb-8">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
            Votre code de suivi
          </p>
          <p className="text-2xl font-bold tracking-wider mb-3">{resultat.reference}</p>
          <button
            onClick={() => navigator.clipboard?.writeText(resultat.reference)}
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            <Copy size={11} />
            Copier
          </button>
        </div>

        <p className="text-sm text-gray-500 font-light">
          Conservez ce code : il vous permet de suivre l&apos;avancement de votre
          dossier sur{" "}
          <a href="/carrieres/suivi" className="text-white underline">
            la page de suivi
          </a>
          .
        </p>
      </div>
    );
  }

  // ── Formulaire ───────────────────────────────────────────────────────────

  return (
    <div className="border border-white/15">
      <div className="border-b border-white/10 p-6 md:p-8">
        <h2 className="text-xl font-bold uppercase tracking-wider mb-6">
          Postuler à cette offre
        </h2>
        <ol className="flex flex-wrap gap-x-2 gap-y-2 text-[10px] uppercase tracking-widest font-bold">
          {ETAPES.map((nom, i) => (
            <li
              key={nom}
              className={`px-2.5 py-1 border ${
                i === etape
                  ? "border-white text-white"
                  : i < etape
                    ? "border-white/20 text-gray-500"
                    : "border-white/10 text-gray-600"
              }`}
            >
              {i < etape ? "✓ " : ""}
              {nom}
            </li>
          ))}
        </ol>
      </div>

      <div className="p-6 md:p-8">
        {erreur && (
          <div className="flex gap-3 border border-red-500/30 bg-red-500/5 p-4 mb-8 text-sm text-red-300">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{erreur}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={etape}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── 0. CV ── */}
            {etape === 0 && (
              <Section
                titre="Votre CV"
                aide={
                  preselection
                    ? "Déposez votre CV : nous en pré-remplissons le formulaire pour vous éviter de tout ressaisir. Vous pourrez corriger chaque champ ensuite."
                    : "Déposez votre CV, puis renseignez votre parcours dans les étapes suivantes. Comptez une dizaine de minutes : ces informations nous permettent d’étudier votre candidature sans rien laisser de côté."
                }
              >
                <ZoneFichier
                  label="CV (PDF ou image, 10 Mo maximum)"
                  accept=".pdf,.jpg,.jpeg,.png"
                  fichier={cv}
                  occupe={televersement === "cv"}
                  onChange={(f) => televerser(f, "cv")}
                  onRetirer={() => {
                    setCv(null);
                    setCvLu(false);
                  }}
                />

                {lectureCv && (
                  <p className="flex items-center gap-2 text-sm text-gray-400 mt-5">
                    <Loader2 size={14} className="animate-spin" />
                    Lecture de votre CV en cours…
                  </p>
                )}
                {cvLu && !lectureCv && (
                  <p className="flex items-center gap-2 text-sm text-gray-300 mt-5">
                    <Sparkles size={14} />
                    Formulaire pré-rempli depuis votre CV. Vérifiez et corrigez les
                    champs aux étapes suivantes.
                  </p>
                )}
              </Section>
            )}

            {/* ── 1. Identité ── */}
            {etape === 1 && (
              <Section titre="Votre identité">
                <div className="grid md:grid-cols-2 gap-5">
                  <Champ label="Prénom *" valeur={firstName} onChange={setFirstName} />
                  <Champ label="Nom *" valeur={lastName} onChange={setLastName} />
                  <Champ label="E-mail *" type="email" valeur={email} onChange={setEmail} />
                  <Champ label="Téléphone *" valeur={phone} onChange={setPhone} placeholder="+229 ..." />
                  <Champ label="Date de naissance" type="date" valeur={birthDate} onChange={setBirthDate} />
                  <Liste
                    label="Sexe"
                    valeur={gender}
                    onChange={setGender}
                    options={["Femme", "Homme", "Ne souhaite pas répondre"]}
                  />
                  <Champ label="Nationalité" valeur={nationality} onChange={setNationality} />
                  <Champ label="Ville" valeur={city} onChange={setCity} />
                  <div className="md:col-span-2">
                    <Champ label="Adresse" valeur={address} onChange={setAddress} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5 mt-8">
                  <ZoneFichier
                    label="Photo d'identité (facultative)"
                    accept=".jpg,.jpeg,.png"
                    fichier={photo}
                    occupe={televersement === "photo"}
                    onChange={(f) => televerser(f, "photo")}
                    onRetirer={() => setPhoto(null)}
                  />
                  <ZoneFichier
                    label="Pièce d'identité (facultative)"
                    aide="Elle ne nous est utile qu'à l'embauche. Vous pouvez la fournir plus tard."
                    accept=".pdf,.jpg,.jpeg,.png"
                    fichier={pieceIdentite}
                    occupe={televersement === "identite"}
                    onChange={(f) => televerser(f, "identite")}
                    onRetirer={() => setPieceIdentite(null)}
                  />
                </div>
              </Section>
            )}

            {/* ── 2. Parcours ── */}
            {etape === 2 && (
              <Section
                titre="Parcours professionnel"
                aide="De l'expérience la plus récente à la plus ancienne."
              >
                {experiences.map((exp, i) => (
                  <Bloc key={i} titre={`Expérience ${i + 1}`} onSupprimer={() => setExperiences((l) => l.filter((_, j) => j !== i))}>
                    <div className="grid md:grid-cols-2 gap-5">
                      <Champ label="Poste *" valeur={exp.position} onChange={(v) => majExp(i, { position: v })} />
                      <Champ label="Entreprise *" valeur={exp.company} onChange={(v) => majExp(i, { company: v })} />
                      <Champ label="Lieu" valeur={exp.location} onChange={(v) => majExp(i, { location: v })} />
                      <div className="grid grid-cols-2 gap-3">
                        <Champ label="Début * (AAAA-MM)" type="month" valeur={exp.startDate} onChange={(v) => majExp(i, { startDate: v })} />
                        {!exp.current && (
                          <Champ label="Fin" type="month" valeur={exp.endDate} onChange={(v) => majExp(i, { endDate: v })} />
                        )}
                      </div>
                      <label className="md:col-span-2 flex items-center gap-2.5 text-sm text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => majExp(i, { current: e.target.checked })}
                          className="accent-white"
                        />
                        Poste occupé actuellement
                      </label>
                      <div className="md:col-span-2">
                        <ZoneTexte label="Missions et réalisations" valeur={exp.description} onChange={(v) => majExp(i, { description: v })} />
                      </div>
                    </div>
                  </Bloc>
                ))}
                <BoutonAjout
                  label="Ajouter une expérience"
                  onClick={() =>
                    setExperiences((l) => [
                      ...l,
                      { position: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" },
                    ])
                  }
                />
              </Section>
            )}

            {/* ── 3. Formation ── */}
            {etape === 3 && (
              <Section titre="Formation et certifications">
                {educations.map((f, i) => (
                  <Bloc key={i} titre={`Formation ${i + 1}`} onSupprimer={() => setEducations((l) => l.filter((_, j) => j !== i))}>
                    <div className="grid md:grid-cols-2 gap-5">
                      <Champ label="Diplôme *" valeur={f.degree} onChange={(v) => majForm(i, { degree: v })} />
                      <Champ label="Spécialité" valeur={f.field} onChange={(v) => majForm(i, { field: v })} />
                      <Champ label="Établissement *" valeur={f.school} onChange={(v) => majForm(i, { school: v })} />
                      <Liste label="Niveau" valeur={f.level} onChange={(v) => majForm(i, { level: v })} options={NIVEAUX} />
                      <div className="grid grid-cols-2 gap-3">
                        <Champ label="Année de début" valeur={f.startYear} onChange={(v) => majForm(i, { startYear: v })} placeholder="2018" />
                        {!f.ongoing && (
                          <Champ label="Année de fin" valeur={f.endYear} onChange={(v) => majForm(i, { endYear: v })} placeholder="2021" />
                        )}
                      </div>
                      <label className="flex items-center gap-2.5 text-sm text-gray-300 cursor-pointer self-end pb-2">
                        <input type="checkbox" checked={f.ongoing} onChange={(e) => majForm(i, { ongoing: e.target.checked })} className="accent-white" />
                        Formation en cours
                      </label>
                    </div>
                  </Bloc>
                ))}
                <BoutonAjout
                  label="Ajouter une formation"
                  onClick={() => setEducations((l) => [...l, { degree: "", field: "", school: "", level: "", startYear: "", endYear: "", ongoing: false }])}
                />

                <div className="mt-10 pt-8 border-t border-white/10">
                  {certifications.map((c, i) => (
                    <Bloc key={i} titre={`Certification ${i + 1}`} onSupprimer={() => setCertifications((l) => l.filter((_, j) => j !== i))}>
                      <div className="grid md:grid-cols-3 gap-5">
                        <Champ label="Intitulé *" valeur={c.name} onChange={(v) => majCert(i, { name: v })} />
                        <Champ label="Organisme" valeur={c.issuer} onChange={(v) => majCert(i, { issuer: v })} />
                        <Champ label="Année" valeur={c.obtainedYear} onChange={(v) => majCert(i, { obtainedYear: v })} placeholder="2023" />
                      </div>
                    </Bloc>
                  ))}
                  <BoutonAjout
                    label="Ajouter une certification"
                    onClick={() => setCertifications((l) => [...l, { name: "", issuer: "", obtainedYear: "" }])}
                  />
                </div>

                <div className="mt-10 pt-8 border-t border-white/10">
                  <ZoneFichier
                    label="Diplômes et attestations (facultatif, plusieurs fichiers possibles)"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    occupe={televersement === "diplomes"}
                    onChange={(f) => televerser(f, "diplomes")}
                  />
                  {diplomes.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {diplomes.map((d, i) => (
                        <li key={d.publicId} className="flex items-center justify-between text-sm text-gray-300 border border-white/10 px-4 py-2.5">
                          <span className="truncate">{d.originalname}</span>
                          <button onClick={() => setDiplomes((l) => l.filter((_, j) => j !== i))} className="text-gray-500 hover:text-white">
                            <Trash2 size={13} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Section>
            )}

            {/* ── 4. Compléments ── */}
            {etape === 4 && (
              <Section titre="Compléments">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <Champ label="Présentation en une ligne" valeur={headline} onChange={setHeadline} placeholder="Courtier IARD, 8 ans en cabinet" />
                  </div>
                  <Champ label="Poste actuel" valeur={currentPosition} onChange={setCurrentPosition} />
                  <Champ label="Entreprise actuelle" valeur={currentCompany} onChange={setCurrentCompany} />
                  <Champ label="Années d'expérience" valeur={yearsOfExperience} onChange={setYears} placeholder="5" />
                  <Liste
                    label="Disponibilité"
                    valeur={availability}
                    onChange={setAvailability}
                    options={DISPONIBILITES.map((d) => d.label)}
                    valeurs={DISPONIBILITES.map((d) => d.val)}
                  />
                  <Champ label="Prétention salariale (FCFA / mois)" valeur={salaryExpectation} onChange={setSalary} placeholder="350000" />
                  <Champ label="Profil LinkedIn" valeur={linkedinUrl} onChange={setLinkedin} placeholder="https://..." />
                </div>

                {/* Compétences */}
                <div className="mt-8">
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">
                    Compétences
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      value={competence}
                      onChange={(e) => setCompetence(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (competence.trim()) {
                            setSkills((s) => [...s, competence.trim()]);
                            setCompetence("");
                          }
                        }
                      }}
                      placeholder="Saisissez puis appuyez sur Entrée"
                      className="flex-1 bg-transparent border border-white/15 px-4 py-2.5 text-sm focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 text-xs">
                        {s}
                        <button onClick={() => setSkills((l) => l.filter((_, j) => j !== i))} className="text-gray-500 hover:text-white">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Langues */}
                <div className="mt-8">
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">
                    Langues
                  </label>
                  {languages.map((l, i) => (
                    <div key={i} className="flex gap-3 mb-3">
                      <input
                        value={l.name}
                        onChange={(e) => setLanguages((x) => x.map((v, j) => (j === i ? { ...v, name: e.target.value } : v)))}
                        placeholder="Français, Fon, Yoruba…"
                        className="flex-1 bg-transparent border border-white/15 px-4 py-2.5 text-sm focus:outline-none focus:border-white/40"
                      />
                      <select
                        value={l.level}
                        onChange={(e) => setLanguages((x) => x.map((v, j) => (j === i ? { ...v, level: e.target.value } : v)))}
                        className="bg-black border border-white/15 px-4 py-2.5 text-sm focus:outline-none focus:border-white/40"
                      >
                        {NIVEAUX_LANGUE.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => setLanguages((x) => x.filter((_, j) => j !== i))} className="text-gray-500 hover:text-white px-2">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <BoutonAjout label="Ajouter une langue" onClick={() => setLanguages((l) => [...l, { name: "", level: "Courant" }])} />
                </div>

                {/* Questions propres à l'offre */}
                {champs.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-white/10">
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-6">
                      Questions pour ce poste
                    </h4>
                    <div className="space-y-5">
                      {champs.map((c) => (
                        <ChampDynamique
                          key={c.id}
                          champ={c}
                          valeur={answers[c.id]}
                          onChange={(v) => setAnswers((a) => ({ ...a, [c.id]: v }))}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-10 pt-8 border-t border-white/10">
                  <ZoneTexte
                    label="Votre motivation"
                    valeur={motivation}
                    onChange={setMotivation}
                    placeholder="Pourquoi ce poste, chez LBASSUR ?"
                    lignes={6}
                  />
                </div>
              </Section>
            )}

            {/* ── 5. Envoi ── */}
            {etape === 5 && (
              <Section titre="Vérification">
                <dl className="divide-y divide-white/10 text-sm">
                  <Recap label="Candidat">{firstName} {lastName}</Recap>
                  <Recap label="Contact">{email} · {phone}</Recap>
                  <Recap label="Poste visé">{offre.title}</Recap>
                  <Recap label="Expériences">{experiences.length} renseignée{experiences.length > 1 ? "s" : ""}</Recap>
                  <Recap label="Formations">{educations.length} renseignée{educations.length > 1 ? "s" : ""}</Recap>
                  {certifications.length > 0 && <Recap label="Certifications">{certifications.length}</Recap>}
                  <Recap label="Pièces jointes">
                    {[cv && "CV", photo && "photo", pieceIdentite && "pièce d'identité", diplomes.length && `${diplomes.length} diplôme(s)`]
                      .filter(Boolean)
                      .join(", ")}
                  </Recap>
                </dl>

                <p className="text-xs text-gray-500 font-light leading-relaxed mt-8">
                  En envoyant ce formulaire, vous acceptez que LBASSUR conserve ces
                  informations pour étudier votre candidature. Vous recevrez un code de
                  suivi par e-mail pour consulter l&apos;avancement de votre dossier.
                </p>
              </Section>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-10 pt-8 border-t border-white/10">
          <button
            onClick={() => {
              setErreur(null);
              setEtape((n) => Math.max(n - 1, 0));
            }}
            disabled={etape === 0}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} />
            Retour
          </button>

          {etape < ETAPES.length - 1 ? (
            <button
              onClick={suivant}
              className="inline-flex items-center gap-2 bg-white text-black px-7 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors"
            >
              Continuer
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={envoyer}
              disabled={envoi}
              className="inline-flex items-center gap-2 bg-white text-black px-7 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              {envoi ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {envoi ? "Envoi…" : "Envoyer ma candidature"}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  function majExp(i: number, p: Partial<Experience>) {
    setExperiences((l) => l.map((e, j) => (j === i ? { ...e, ...p } : e)));
  }
  function majForm(i: number, p: Partial<Formation>) {
    setEducations((l) => l.map((e, j) => (j === i ? { ...e, ...p } : e)));
  }
  function majCert(i: number, p: Partial<Certification>) {
    setCertifications((l) => l.map((e, j) => (j === i ? { ...e, ...p } : e)));
  }
}

// ── Petits composants ──────────────────────────────────────────────────────

function Section({ titre, aide, children }: { titre: string; aide?: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-base font-bold uppercase tracking-wider mb-2">{titre}</h3>
      {aide && <p className="text-sm text-gray-500 font-light mb-8 max-w-2xl">{aide}</p>}
      {!aide && <div className="mb-8" />}
      {children}
    </div>
  );
}

function Champ({
  label,
  valeur,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  valeur: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
        {label}
      </label>
      <input
        type={type}
        value={valeur}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border border-white/15 px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/40 transition-colors [color-scheme:dark]"
      />
    </div>
  );
}

function ZoneTexte({
  label,
  valeur,
  onChange,
  placeholder,
  lignes = 3,
}: {
  label: string;
  valeur: string;
  onChange: (v: string) => void;
  placeholder?: string;
  lignes?: number;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
        {label}
      </label>
      <textarea
        rows={lignes}
        value={valeur}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border border-white/15 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/40 transition-colors resize-y"
      />
    </div>
  );
}

function Liste({
  label,
  valeur,
  onChange,
  options,
  valeurs,
}: {
  label: string;
  valeur: string;
  onChange: (v: string) => void;
  options: string[];
  valeurs?: string[];
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
        {label}
      </label>
      <select
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/40 transition-colors"
      >
        <option value="">—</option>
        {options.map((o, i) => (
          <option key={o} value={valeurs?.[i] ?? o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function Bloc({ titre, onSupprimer, children }: { titre: string; onSupprimer: () => void; children: React.ReactNode }) {
  return (
    <div className="border border-white/10 p-5 md:p-6 mb-4">
      <div className="flex justify-between items-center mb-5">
        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{titre}</span>
        <button onClick={onSupprimer} className="text-gray-600 hover:text-white transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
      {children}
    </div>
  );
}

function BoutonAjout({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 border border-dashed border-white/20 px-5 py-3 text-xs uppercase tracking-widest font-bold text-gray-400 hover:border-white/40 hover:text-white transition-colors"
    >
      <Plus size={14} />
      {label}
    </button>
  );
}

function ZoneFichier({
  label,
  aide,
  accept,
  fichier,
  occupe,
  multiple,
  onChange,
  onRetirer,
}: {
  label: string;
  aide?: string;
  accept: string;
  fichier?: UploadedFile | null;
  occupe: boolean;
  multiple?: boolean;
  onChange: (f: FileList | null) => void;
  onRetirer?: () => void;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
        {label}
      </label>
      {aide && <p className="text-xs text-gray-600 font-light mb-3">{aide}</p>}

      {fichier ? (
        <div className="flex items-center justify-between border border-white/20 px-4 py-3 text-sm">
          <span className="truncate flex items-center gap-2">
            <Check size={14} />
            {fichier.originalname}
          </span>
          {onRetirer && (
            <button onClick={onRetirer} className="text-gray-500 hover:text-white shrink-0">
              <Trash2 size={13} />
            </button>
          )}
        </div>
      ) : (
        <label className="flex items-center justify-center gap-2.5 border border-dashed border-white/20 px-5 py-7 cursor-pointer hover:border-white/40 transition-colors text-sm text-gray-400">
          {occupe ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {occupe ? "Téléversement…" : "Choisir un fichier"}
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            disabled={occupe}
            onChange={(e) => onChange(e.target.files)}
          />
        </label>
      )}
    </div>
  );
}

/** Rend un champ défini par l'offre (`formSchema`). */
function ChampDynamique({
  champ,
  valeur,
  onChange,
}: {
  champ: ChampOffre;
  valeur: unknown;
  onChange: (v: unknown) => void;
}) {
  const label = `${champ.label}${champ.required ? " *" : ""}`;
  const v = (valeur ?? "") as string;

  if (champ.type === "textarea") {
    return (
      <div>
        <ZoneTexte label={label} valeur={v} onChange={onChange} placeholder={champ.placeholder} />
        {champ.help && <p className="text-xs text-gray-600 mt-2">{champ.help}</p>}
      </div>
    );
  }

  if (champ.type === "select" || champ.type === "radio") {
    return (
      <div>
        <Liste label={label} valeur={v} onChange={onChange} options={champ.options ?? []} />
        {champ.help && <p className="text-xs text-gray-600 mt-2">{champ.help}</p>}
      </div>
    );
  }

  if (champ.type === "multiselect") {
    const choisis = Array.isArray(valeur) ? (valeur as string[]) : [];
    return (
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">
          {label}
        </label>
        <div className="flex flex-wrap gap-2">
          {(champ.options ?? []).map((o) => {
            const actif = choisis.includes(o);
            return (
              <button
                key={o}
                type="button"
                onClick={() => onChange(actif ? choisis.filter((c) => c !== o) : [...choisis, o])}
                className={`px-3.5 py-2 text-xs border transition-colors ${
                  actif ? "border-white bg-white text-black font-bold" : "border-white/15 text-gray-300 hover:border-white/40"
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
        {champ.help && <p className="text-xs text-gray-600 mt-2">{champ.help}</p>}
      </div>
    );
  }

  if (champ.type === "checkbox") {
    return (
      <label className="flex items-center gap-2.5 text-sm text-gray-300 cursor-pointer">
        <input type="checkbox" checked={!!valeur} onChange={(e) => onChange(e.target.checked)} className="accent-white" />
        {label}
      </label>
    );
  }

  const types: Record<string, string> = { number: "number", date: "date", email: "email", phone: "tel" };
  return (
    <div>
      <Champ label={label} valeur={v} onChange={onChange} type={types[champ.type] ?? "text"} placeholder={champ.placeholder} />
      {champ.help && <p className="text-xs text-gray-600 mt-2">{champ.help}</p>}
    </div>
  );
}

function Recap({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-6 py-3.5">
      <dt className="text-gray-500 shrink-0">{label}</dt>
      <dd className="text-white text-right font-medium">{children}</dd>
    </div>
  );
}
