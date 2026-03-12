import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabase';
import {
  CheckCircle2,
  ChevronRight,
  ChevronUp,
  X,
  PhoneCall,
  Handshake,
  Laptop,
  ArrowRight,
  TrendingUp,
  Mail,
  Users,
  BrainCircuit,
  Globe,
  Zap,
  Clock,
  Target,
  MessageSquare,
  BarChart3,
  Rocket,
  Shield,
  Star
} from 'lucide-react';

// --- Custom Hooks ---
function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);
  return ref;
}

// --- Components ---
const RevealSection = ({ children, className = '', delay = 0 }) => {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`reveal-hidden ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    isAdult: '',
    roles: [],
    attraction: '',
    motivation: 5,
    closingExp: '',
    closingExpDesc: '',
    salesExp: '',
    aiLevel: '',
    status: '',
    microEntreprise: '',
    hoursPerWeek: '',
    availability: '',
    preferredTime: [],
    hasComputer: '',
    hasPhone: '',
    hasInternet: '',
    source: '',
    additionalInfo: ''
  });

  // --- Handlers ---
  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleToggle = (role) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const handleTimeToggle = (timeFrame) => {
    setFormData(prev => ({
      ...prev,
      preferredTime: prev.preferredTime.includes(timeFrame)
        ? prev.preferredTime.filter(t => t !== timeFrame)
        : [...prev.preferredTime, timeFrame]
    }));
  };

  const validateStep = (step) => {
    switch(step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone && formData.city && formData.isAdult);
      case 2:
        return !!(
          formData.roles.length > 0 &&
          formData.attraction &&
          formData.closingExp &&
          (formData.closingExp !== 'Oui, expérience confirmée' || formData.closingExpDesc) &&
          formData.salesExp &&
          formData.aiLevel
        );
      case 3:
        return !!(formData.status && formData.microEntreprise && formData.hoursPerWeek);
      case 4:
        return !!(formData.availability && formData.preferredTime.length > 0 && formData.hasComputer && formData.hasPhone && formData.hasInternet);
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const { error } = await supabase
        .from('recrutement_agence')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          is_adult: formData.isAdult,
          roles: formData.roles,
          attraction: formData.attraction,
          motivation: formData.motivation,
          closing_exp: formData.closingExp,
          closing_exp_desc: formData.closingExpDesc,
          sales_exp: formData.salesExp,
          ai_level: formData.aiLevel,
          status: formData.status,
          micro_entreprise: formData.microEntreprise,
          hours_per_week: formData.hoursPerWeek,
          availability: formData.availability,
          preferred_time: formData.preferredTime,
          has_computer: formData.hasComputer,
          has_phone: formData.hasPhone,
          has_internet: formData.hasInternet,
          source: formData.source,
          additional_info: formData.additionalInfo,
        });

      if (error) throw error;

      setIsSubmitting(false);
      setSubmitStatus('success');
    } catch (error) {
      console.error('Erreur submission:', error);
      setIsSubmitting(false);
      setSubmitStatus('error');
    }
  };

  const RadioChip = ({ label, field, value }) => {
    const isSelected = formData[field] === value;
    return (
      <button
        type="button"
        onClick={() => handleChange(field, value)}
        className={`px-4 py-2 rounded-full border transition-all text-sm md:text-base ${
          isSelected
            ? 'bg-accent border-accent text-white shadow-md'
            : 'bg-white border-gray-200 text-primary hover:border-accent hover:text-accent'
        }`}
      >
        {label}
      </button>
    );
  };

  const CheckboxChip = ({ label, isSelected, onClick }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2 rounded-full border transition-all text-sm md:text-base ${
          isSelected
            ? 'bg-accent border-accent text-white shadow-md'
            : 'bg-white border-gray-200 text-primary hover:border-accent hover:text-accent'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="relative min-h-screen font-sans text-primary selection:bg-accent selection:text-white">
      {/* GLOBAL STYLES & ANIMATIONS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #F5F7FA; overflow-x: hidden; }

        .antigravity-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          z-index: -1;
          opacity: 0.1;
        }

        .antigravity-shape {
          position: fixed;
          z-index: -1;
          opacity: 0.05;
          border-radius: 30px;
          border: 2px solid #1B2A4A;
        }

        @keyframes float-slow {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-40px) rotate(10deg) scale(1.05); }
          100% { transform: translateY(0) rotate(0deg) scale(1); }
        }

        @keyframes float-medium {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(50px) rotate(-15deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        @keyframes float-fast {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -50px) rotate(20deg); }
          66% { transform: translate(-20px, 20px) rotate(-10deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        .animate-float-slow { animation: float-slow 15s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 10s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 8s ease-in-out infinite; }

        .reveal-hidden {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid #E5E7EB;
          background-color: white;
          outline: none;
          transition: all 0.2s;
        }
        .form-input:focus {
          border-color: #4A90D9;
          box-shadow: 0 0 0 4px rgba(74, 144, 217, 0.1);
        }

        .drawer-content::-webkit-scrollbar { width: 6px; }
        .drawer-content::-webkit-scrollbar-track { background: transparent; }
        .drawer-content::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
      `}</style>

      {/* BACKGROUND ANTIGRAVITY */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="antigravity-blob bg-blue-500 w-[500px] h-[500px] -top-[100px] -left-[100px] animate-float-slow" />
        <div className="antigravity-blob bg-indigo-500 w-[600px] h-[600px] top-[40%] -right-[200px] animate-float-medium" />
        <div className="antigravity-blob bg-cyan-400 w-[400px] h-[400px] -bottom-[100px] left-[20%] animate-float-fast" />

        <div className="antigravity-shape w-64 h-64 top-[20%] right-[10%] animate-float-medium" />
        <div className="antigravity-shape w-40 h-40 rounded-full bottom-[30%] left-[10%] animate-float-slow" />
      </div>

      <div className="relative z-10 lg:w-[1000px] max-w-full mx-auto px-6 pb-32">

        {/* ==================== HERO SECTION ==================== */}
        <section className="min-h-[90vh] flex flex-col justify-center pt-20">
          <RevealSection>
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-accent font-semibold text-sm mb-6 shadow-sm border border-blue-200">
              Lancement dans ~1 mois
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-primary">
              Rejoins la <span className="text-accent">première agence</span> de closers & setters propulsée à l'IA
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl leading-relaxed">
              On lance une aventure collective : une agence de closing et de setting, propulsée à l'IA. Personne ici n'est né expert — <strong className="text-primary">on apprend tous ensemble, chacun à son rythme</strong>. L'IA fait le gros du travail, toi tu progresses et tu deviens performant. L'objectif ? Que tout le monde monte en compétences et qu'on soit tous hyper efficaces.
            </p>
            <p className="text-base text-gray-500 mb-10 max-w-3xl leading-relaxed">
              Ce formulaire c'est une <strong>pré-candidature</strong> pour voir qui est chaud. Ça prend 3 minutes et ça ne t'engage à rien.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleOpenDrawer}
                className="px-8 py-4 bg-accent hover:bg-blue-600 text-white font-bold rounded-2xl text-lg shadow-xl shadow-blue-500/30 transition-all transform hover:-translate-y-1"
              >
                Je candidate
              </button>
              <a
                href="#qui-je-suis"
                className="px-8 py-4 bg-white/80 backdrop-blur border border-gray-200 hover:border-gray-300 text-primary font-bold rounded-2xl text-lg shadow-sm transition-all text-center flex items-center justify-center gap-2 group"
              >
                En savoir plus
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </RevealSection>
        </section>

        {/* ==================== QUI EST DERRIÈRE TOUT ÇA ==================== */}
        <section id="qui-je-suis" className="py-24 border-t border-gray-200/60">
          <RevealSection>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Qui est derrière tout ça ?</h2>
            <div className="text-lg text-gray-600 mb-12 max-w-3xl leading-relaxed space-y-4">
              <p>
                Celui qui écrit ce message, c'est <strong className="text-primary">Elliot</strong> (<a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-accent hover:underline">son LinkedIn</a>) et celui qui relit les fautes c'est <strong className="text-primary">Matthieu</strong> (<a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-accent hover:underline">son LinkedIn</a>).
              </p>
              <p>
                On est deux fondateurs et on lance une agence de closing et de setting, propulsée à l'IA. C'est un premier test : on a déjà un logiciel IA d'aide à la création d'entreprise (<strong className="text-primary">Aurentia</strong>, qui sort bientôt), et on va configurer tout ça pour monter une vraie agence IA.
              </p>
              <p>
                Moi je ne vais pas en faire mon métier numéro 1. Je vois une <strong className="text-primary">opportunité de dingue</strong> et ça me fait plaisir de partager ça avec d'autres gars de chez nous (je suis de Cavaillon).
              </p>
              <p>
                Pour faire simple : on lance une agence de <strong className="text-primary">création de sites vitrines pour des conciergeries</strong>, qu'on fait en 48h avec l'IA, et on vise à s'étendre ensuite sur d'autres cibles.
              </p>
              <p>
                J'ai fait toute la partie "aide au closing" — le logiciel, la formation, la config IA — et maintenant c'est les plus déterminés qui feront le plus d'argent. <strong className="text-primary">Je ne garantis pas que ça marchera</strong>, mais j'ai essayé de donner le maximum de cartes pour que ça marche.
              </p>
              <p className="text-primary font-semibold">
                On est tous dans le même bateau — personne ne prétend tout savoir. C'est une aventure où chacun avance à son rythme, et ceux qui s'investissent vraiment seront les plus récompensés.
              </p>
            </div>
          </RevealSection>

          <RevealSection delay={200}>
            <h3 className="text-2xl font-bold mb-2">Preuves concrètes</h3>
            <p className="text-gray-600 mb-8">J'ai déjà fait des sites web, du graphisme, des logiciels IA, de l'automation IA, et de la formation pour des grands groupes. Quelques exemples :</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "friendiz.fr", label: "Projet historique", url: "https://friendiz.fr" },
                { name: "comparateur-ia-facile.com", label: "Développé avec l'IA", url: "https://comparateur-ia-facile.com" },
                { name: "allorestau.fr", label: "Développé avec l'IA", url: "https://allorestau.fr" },
                { name: "landing-savistas.vercel.app", label: "Développé avec l'IA", url: "https://landing-savistas.vercel.app" },
              ].map((site, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">{site.label}</div>
                  <div className="text-lg font-bold text-primary mb-4 break-all">{site.name}</div>
                  <a href={site.url} target="_blank" rel="noreferrer" className="text-accent flex items-center gap-1 text-sm font-medium hover:underline">
                    Visiter le site <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>

            {/* Showcase principal */}
            <div className="mt-6 bg-gradient-to-br from-primary to-[#2a3c63] text-white rounded-2xl p-8 md:p-10 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Globe className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="inline-block px-3 py-1 rounded-full bg-accent/20 text-blue-200 font-semibold text-xs mb-4 border border-blue-400/30">
                  Développé avec l'IA
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-4">maison-enileh.vercel.app</div>
                <p className="text-blue-100/80 mb-6 text-base md:text-lg max-w-2xl leading-relaxed">
                  La cliente m'a envoyé un mail avec ce qu'elle voulait et ses inspirations, j'ai balancé ça à ma config IA (Claude Code), et <strong className="text-white">en une demi-journée le site était livré</strong>. C'est ça la puissance de la configuration qu'on a — et c'est cette même config que tu utiliseras.
                </p>
                <a href="https://maison-enileh.vercel.app" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-3 rounded-xl text-sm font-medium transition-colors">
                  Voir le site <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </RevealSection>
        </section>

        {/* ==================== L'AGENCE IA CONCRÈTEMENT ==================== */}
        <section className="py-24">
          <RevealSection>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">L'agence IA, concrètement</h2>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl">
              C'est pas une agence classique. L'IA est <strong className="text-primary font-bold">partout</strong> dans le process — pas juste un gadget, c'est le coeur du système.
            </p>
            <p className="text-base text-gray-500 mb-16 max-w-3xl">
              On commence par la vente de sites web et de services pour des <strong>conciergeries</strong>, et on élargira ensuite à d'autres secteurs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <Users size={24} />, title: "Liste de prospects prête", desc: "La liste des prospects est déjà prête, avec leur site web, numéro de téléphone, email, etc. Tu n'as plus qu'à appeler." },
                { icon: <PhoneCall size={24} />, title: "Enregistrement des appels", desc: "Le setter peut enregistrer l'appel directement depuis l'application. Tout est centralisé dans un seul outil." },
                { icon: <BrainCircuit size={24} />, title: "Analyse IA de tes appels", desc: "L'IA analyse l'appel et te recommande des axes d'amélioration. Tu progresses à chaque appel." },
                { icon: <Mail size={24} />, title: "Email auto post-appel", desc: "Un email de récap de l'appel + les infos de l'entreprise est généré automatiquement par l'IA et envoyé au prospect." },
                { icon: <TrendingUp size={24} />, title: "Scripts rédigés par l'IA", desc: "Les scripts d'appels sont rédigés avec l'IA. Tu as un argumentaire prêt à l'emploi, testé et optimisé." },
                { icon: <Laptop size={24} />, title: "Livraison en une journée", desc: "La création de sites web se fait avec une config IA qui permet de livrer en une journée, voire une demi-journée." },
              ].map((feat, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-50 text-accent rounded-2xl flex items-center justify-center mb-6">
                    {feat.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>

            {/* Upsells */}
            <div className="mt-10 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 border border-amber-100/50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-primary mb-2">Offres d'upsell en structuration</h4>
                  <p className="text-gray-600 leading-relaxed">
                    On est en train de structurer des offres d'upsell pour augmenter le panier moyen : un <strong>abonnement mensuel</strong> où le client peut avoir des articles de blog qui se rédigent et se publient automatiquement sur son site, des recommandations SEO tous les mois dans sa boîte mail, etc. L'idée c'est que ça génère du <strong>récurrent pour tout le monde</strong>.
                  </p>
                </div>
              </div>
            </div>
          </RevealSection>
        </section>

        {/* ==================== LA VISION ==================== */}
        <section className="py-24">
          <RevealSection>
            <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

              <div className="relative z-10">
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/90 font-semibold text-sm mb-6 border border-white/20">
                  Notre vision long terme
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                  Aujourd'hui les conciergeries.<br/>
                  <span className="text-cyan-200">Demain, tous les marchés.</span>
                </h2>

                <div className="space-y-6 text-lg md:text-xl text-blue-50/90 font-light leading-relaxed max-w-3xl">
                  <p>
                    On a développé en interne une <strong className="text-white font-bold">solution IA de malade</strong> — une config qui nous permet d'aller <strong className="text-white font-bold">10x plus vite que n'importe quelle agence classique</strong>. Les sites vitrines pour conciergeries, c'est juste le point de départ.
                  </p>
                  <p>
                    La vision, c'est de <strong className="text-white font-bold">couvrir tous les marchés à terme</strong> : restaurants, artisans, coachs, e-commerce, immobilier... Chaque secteur qu'on ouvre, c'est une nouvelle source de revenus pour toute l'équipe.
                  </p>
                  <p>
                    Et le plus beau : pour chaque client, on ne vend pas juste un site. On leur offre aussi <strong className="text-white font-bold">des solutions IA qu'on utilise nous-mêmes</strong> — gestion des réseaux sociaux automatisée, génération de contenu, SEO automatique, emails marketing... Tout ça <strong className="text-white font-bold">inclus dans les packs</strong>. Ça rend notre offre imbattable et ça fidélise les clients.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                  {[
                    { icon: <Rocket size={22} />, title: "Config IA propriétaire", desc: "Notre avantage compétitif : une vitesse de livraison que personne ne peut matcher" },
                    { icon: <Globe size={22} />, title: "Multi-marchés", desc: "Conciergeries aujourd'hui, tous les secteurs demain — on scale ensemble" },
                    { icon: <Star size={22} />, title: "Solutions IA offertes", desc: "Réseaux sociaux auto, SEO, contenu — inclus dans chaque pack client" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4 text-cyan-200">
                        {item.icon}
                      </div>
                      <h4 className="font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-blue-100/80 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-10 text-lg text-cyan-100 font-semibold">
                  On est tous au même niveau, on part tous de zéro ensemble. La différence, c'est qu'on a les outils pour aller plus loin, plus vite que les autres. Et ceux qui montent dans le train maintenant seront les mieux placés quand on ouvrira les prochains marchés.
                </p>
              </div>
            </div>
          </RevealSection>
        </section>

        {/* ==================== LES RÔLES & RÉMUNÉRATION ==================== */}
        <section className="py-24">
          <RevealSection>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Les rôles & la rémunération</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-3xl">Car c'est ce qui vous intéresse le plus, je sais. Un site se vend en général entre <strong className="text-primary">900 et 1 200 €</strong> selon ce que le client choisit.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

              {/* Le Setter */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-50 text-accent rounded-2xl flex items-center justify-center mb-5">
                  <PhoneCall size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Le Setter</h3>
                <p className="text-gray-600 mb-3 leading-relaxed">
                  C'est celui qui prospecte et prend le premier contact. Ton job : <strong>identifier les prospects, engager la conversation et décrocher un rendez-vous qualifié</strong>.
                </p>
                <p className="text-gray-500 mb-8 text-sm">Tu es la porte d'entrée de l'agence.</p>
                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                  <div className="text-sm text-gray-500 font-medium mb-1">Rémunération</div>
                  <div className="text-2xl font-bold text-accent">10% sur chaque vente</div>
                  <div className="text-sm text-gray-500 mt-1">signée grâce à ton rendez-vous</div>
                </div>
              </div>

              {/* Le Closer */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-50 text-accent rounded-2xl flex items-center justify-center mb-5">
                  <Handshake size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Le Closer</h3>
                <p className="text-gray-600 mb-3 leading-relaxed">
                  C'est celui qui prend le relais en rendez-vous. Ton job : <strong>comprendre le besoin, présenter l'offre et signer le deal</strong>.
                </p>
                <p className="text-gray-500 mb-8 text-sm">Tu transformes l'intérêt en contrat.</p>
                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                  <div className="text-sm text-gray-500 font-medium mb-1">Rémunération</div>
                  <div className="text-2xl font-bold text-accent">10% de la vente</div>
                  <div className="text-sm text-gray-500 mt-1">sur chaque deal signé</div>
                </div>
              </div>

              {/* Le Créateur */}
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-50 text-accent rounded-2xl flex items-center justify-center mb-5">
                  <Laptop size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Le Créateur de site</h3>
                <p className="text-gray-600 mb-3 leading-relaxed">
                  Tu utilises la config IA pour <strong>livrer des sites web pros en une journée</strong>. Pas besoin d'être développeur — la config fait le taff.
                </p>
                <p className="text-gray-500 mb-8 text-sm">Tu crées de la valeur directement.</p>
                <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                  <div className="text-sm text-gray-500 font-medium mb-1">Rémunération</div>
                  <div className="text-2xl font-bold text-accent">30% de la vente</div>
                  <div className="text-sm text-gray-500 mt-1">sur chaque site livré</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-100/50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 text-accent rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-lg font-bold text-primary mb-2">Tu peux cumuler les rôles</p>
                  <p className="text-gray-600">Tu peux être setter/closer ET créateur de site. Plus tu t'investis, plus tu gagnes. Exemple : si tu fais le setting + le closing + le site, tu touches <strong className="text-primary">50% de la vente</strong> (10% + 10% + 30%).</p>
                </div>
              </div>
            </div>
          </RevealSection>
        </section>

        {/* ==================== CE QU'ON TE FOURNIT ==================== */}
        <section className="py-24 grid grid-cols-1 md:grid-cols-2 gap-12">
          <RevealSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Ce qu'on te fournit</h2>
            <ul className="space-y-5 mb-8">
              {[
                { text: "Le logiciel d'appels et tout l'écosystème IA", detail: "Tout est centralisé dans un seul outil" },
                { text: "Les scripts d'appels rédigés par l'IA", detail: "Argumentaires testés et optimisés" },
                { text: "La formation complète pour te mettre à niveau", detail: "Même si t'y connais rien en closing" },
                { text: "Des vidéos pour configurer ton Claude", detail: "Step by step, tu seras opérationnel" },
                { text: "Un Discord dédié pour s'entraider", detail: "Parler closing, progresser ensemble" }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="text-accent w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-lg text-gray-700 font-medium">{item.text}</span>
                    <span className="block text-sm text-gray-400">{item.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 border-l-4 border-l-orange-400">
              <p className="text-gray-700 font-medium leading-relaxed">
                <strong className="text-primary">Pas besoin d'être expert.</strong> On ne cherche pas des profils parfaits — on cherche des gens motivés. L'idée c'est que chacun évolue à son rythme, qu'on se forme ensemble, et qu'on devienne tous hyper performants. C'est une aventure, pas un examen d'entrée. Si ça marche bien, il y aura des possibilités d'évolution.
              </p>
            </div>
          </RevealSection>

          <RevealSection delay={200}>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Le minimum vital</h2>
            <ul className="space-y-4 mb-8 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500 w-5 h-5" /> <span className="text-lg font-medium">Un ordinateur</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500 w-5 h-5" /> <span className="text-lg font-medium">Un téléphone</span></li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500 w-5 h-5" /> <span className="text-lg font-medium">Une bonne connexion internet</span></li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-green-500 w-5 h-5" />
                <span className="text-lg font-medium">
                  Une <a href="https://www.legalplace.fr" target="_blank" rel="noreferrer" className="text-accent hover:underline">micro-entreprise</a> (rapide à créer)
                </span>
              </li>
              <li className="flex items-start gap-3 mt-6 pt-6 border-t border-gray-100">
                <Shield className="text-blue-400 w-5 h-5 mt-1 flex-shrink-0" />
                <span className="text-gray-600 text-sm leading-relaxed">
                  <strong>Pour les créateurs de sites :</strong> Optionnellement Claude (20€/mois) + Claude Code (90€/mois). Non pris en charge, mais tu peux attendre ton premier client signé avant de t'abonner !
                </span>
              </li>
            </ul>
          </RevealSection>
        </section>

        {/* ==================== L'ÉTAT D'ESPRIT ==================== */}
        <section className="py-24 pb-40">
          <RevealSection>
            <div className="bg-primary text-white rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

              <h2 className="text-3xl md:text-5xl font-bold mb-8 relative z-10">C'est une aventure,<br/><span className="text-blue-300">pas un job classique.</span></h2>

              <div className="space-y-6 text-lg md:text-xl text-blue-50/90 relative z-10 font-light leading-relaxed max-w-3xl">
                <p>On est deux fondateurs avec nos business à côté. On ne sera pas sur ton dos H24, donc on cherche des gens <strong className="text-white font-bold">autonomes et déterminés</strong>.</p>
                <p>Je ne te garantis pas que tout sera parfait au jour 1. Personne n'est expert, et c'est justement ça qui est excitant — <strong className="text-white font-bold">on construit ça ensemble, en apprenant au fur et à mesure</strong>.</p>
                <p>Chacun avance à son rythme, mais l'objectif est le même : <strong className="text-white font-bold">devenir hyper performant</strong>. Ceux qui s'investissent et qui croient en cette aventure seront les plus récompensés.</p>
                <div className="flex items-center gap-3 mt-10 bg-white/10 p-5 rounded-2xl border border-white/10">
                  <Clock className="w-8 h-8 text-blue-300 flex-shrink-0" />
                  <p className="font-semibold text-blue-200 text-xl">Lancement prévu d'ici environ 1 mois.</p>
                </div>
              </div>
            </div>
          </RevealSection>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-200/50 pt-12 pb-32 text-center text-gray-500">
        <p className="mb-2 font-medium">© 2025 — Agence IA Closers & Setters</p>
        <p className="text-sm">Propulsé par <strong>Aurentia</strong> & <strong>ESST Solutions</strong></p>
      </footer>

      {/* STICKY BOTTOM BAR */}
      <div
        onClick={handleOpenDrawer}
        className="fixed bottom-0 left-0 w-full z-50 flex justify-center cursor-pointer group pb-4"
      >
        <div className="glass-panel w-[95%] md:w-[600px] rounded-t-3xl rounded-b-[2rem] md:rounded-b-3xl p-5 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_-5px_50px_rgba(74,144,217,0.2)] transition-all transform group-hover:-translate-y-1">
          <span className="text-xl font-bold text-primary pl-4">Rejoins l'aventure</span>
          <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform animate-bounce">
            <ChevronUp size={24} />
          </div>
        </div>
      </div>

      {/* ==================== THE DRAWER (FORMULAIRE) ==================== */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-primary/40 backdrop-blur-sm z-[60] transition-opacity duration-400 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleCloseDrawer}
      ></div>

      {/* Drawer Panel */}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full md:w-[700px] h-[90vh] glass-panel !bg-white/95 rounded-t-3xl shadow-2xl z-[70] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Header Drawer */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex flex-col gap-2 w-full pr-8">
            <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              <span>Pré-candidature</span>
              {submitStatus !== 'success' && <span>Étape {currentStep} sur 5</span>}
            </div>
            {submitStatus !== 'success' && (
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                ></div>
              </div>
            )}
          </div>
          <button
            onClick={handleCloseDrawer}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors absolute right-4 top-5 text-gray-400 hover:text-primary"
          >
            <X size={24} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 drawer-content relative">

          {submitStatus === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-bold mb-4">C'est dans la boîte !</h2>
              <p className="text-gray-600 text-lg mb-10 max-w-md">
                Merci pour ta pré-candidature. On étudie ça très vite et on te recontacte. En attendant, tu peux retourner sur la page.
              </p>
              <button
                onClick={handleCloseDrawer}
                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-primary font-bold rounded-xl transition-colors"
              >
                Fermer
              </button>
            </div>
          ) : (
            <div className="max-w-xl mx-auto pb-20">

              {/* STEP 1 */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold mb-8">Commençons par les bases</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Prénom <span className="text-red-500">*</span></label>
                      <input type="text" className="form-input" placeholder="Elon" value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Nom <span className="text-red-500">*</span></label>
                      <input type="text" className="form-input" placeholder="Musk" value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Email <span className="text-red-500">*</span></label>
                    <input type="email" className="form-input" placeholder="elon@x.com" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Téléphone (WhatsApp de préf.) <span className="text-red-500">*</span></label>
                    <input type="tel" className="form-input" placeholder="+33 6..." value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Ville de résidence <span className="text-red-500">*</span></label>
                    <input type="text" className="form-input" placeholder="Paris, Lyon, Remote..." value={formData.city} onChange={e => handleChange('city', e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">Es-tu majeur(e) ? <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-3">
                      <RadioChip label="Oui" field="isAdult" value="Oui" />
                      <RadioChip label="Non" field="isAdult" value="Non" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold mb-8">Ton profil</h2>

                  <div>
                    <label className="block text-sm font-semibold mb-3">Quel(s) rôle(s) t'intéresse(nt) ? <span className="text-gray-400 font-normal">(Plusieurs choix possibles)</span> <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-3">
                      <CheckboxChip label="Setter prospecteur" isSelected={formData.roles.includes('Setter')} onClick={() => handleRoleToggle('Setter')} />
                      <CheckboxChip label="Closer en appel" isSelected={formData.roles.includes('Closer')} onClick={() => handleRoleToggle('Closer')} />
                      <CheckboxChip label="Créateur de site IA" isSelected={formData.roles.includes('Créateur')} onClick={() => handleRoleToggle('Créateur')} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Pourquoi cette aventure t'attire ? <span className="text-red-500">*</span></label>
                    <textarea className="form-input min-h-[100px] resize-y" placeholder="Sois franc, pas besoin de faire corporate..." value={formData.attraction} onChange={e => handleChange('attraction', e.target.value)}></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">Motivation de 1 à 10 <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-2">
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <button
                          key={num}
                          onClick={() => handleChange('motivation', num)}
                          className={`w-10 h-10 rounded-full font-bold transition-all ${formData.motivation === num ? 'bg-accent text-white shadow-md scale-110' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">Expérience en Closing/Setting ? <span className="text-red-500">*</span></label>
                    <div className="flex flex-col gap-3">
                      <RadioChip label="Jamais fait, je débute" field="closingExp" value="Jamais" />
                      <RadioChip label="Un peu en autodidacte" field="closingExp" value="Autodidacte" />
                      <RadioChip label="Oui, j'ai de l'expérience confirmée" field="closingExp" value="Oui, expérience confirmée" />
                    </div>
                  </div>

                  {formData.closingExp === 'Oui, expérience confirmée' && (
                    <div>
                      <label className="block text-sm font-semibold mb-2">Où et quels résultats ? <span className="text-red-500">*</span></label>
                      <textarea className="form-input" rows="2" value={formData.closingExpDesc} onChange={e => handleChange('closingExpDesc', e.target.value)}></textarea>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold mb-3">Autre expérience globale en vente/commerce ? <span className="text-red-500">*</span></label>
                    <div className="flex gap-3">
                      <RadioChip label="Oui" field="salesExp" value="Oui" />
                      <RadioChip label="Non" field="salesExp" value="Non" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">Ton niveau en outils IA (ChatGPT, Claude, etc) <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-3">
                      <RadioChip label="Aucun" field="aiLevel" value="Aucun" />
                      <RadioChip label="Basique (je pose des questions)" field="aiLevel" value="Basique" />
                      <RadioChip label="Intermédiaire (bons prompts)" field="aiLevel" value="Intermédiaire" />
                      <RadioChip label="Avancé (api, automatisation...)" field="aiLevel" value="Avancé" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold mb-8">Ta situation</h2>

                  <div>
                    <label className="block text-sm font-semibold mb-3">Ton statut actuel <span className="text-red-500">*</span></label>
                    <div className="flex flex-col gap-3">
                      <RadioChip label="Salarié(e) / En emploi" field="status" value="En emploi" />
                      <RadioChip label="Indépendant(e) / Freelance" field="status" value="Freelance" />
                      <RadioChip label="Étudiant(e)" field="status" value="Étudiant(e)" />
                      <RadioChip label="Sans activité" field="status" value="Sans activité" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">As-tu une micro-entreprise ? <span className="text-red-500">*</span></label>
                    <div className="flex gap-3">
                      <RadioChip label="Oui" field="microEntreprise" value="Oui" />
                      <RadioChip label="Non" field="microEntreprise" value="Non" />
                      <RadioChip label="En cours de création" field="microEntreprise" value="En cours" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">Combien d'heures par semaine peux-tu investir ? <span className="text-red-500">*</span></label>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                      <RadioChip label="Moins de 10h" field="hoursPerWeek" value="Moins de 10h" />
                      <RadioChip label="10h à 20h" field="hoursPerWeek" value="10-20h" />
                      <RadioChip label="20h à 35h" field="hoursPerWeek" value="20-35h" />
                      <RadioChip label="Temps plein (35h+)" field="hoursPerWeek" value="35h+" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold mb-8">Matériel & Disponibilité</h2>

                  <div>
                    <label className="block text-sm font-semibold mb-3">Quand pourrais-tu démarrer ? <span className="text-red-500">*</span></label>
                    <div className="flex flex-col gap-3">
                      <RadioChip label="Maintenant, tout de suite" field="availability" value="Immédiatement" />
                      <RadioChip label="D'ici 1 à 2 semaines" field="availability" value="1-2 semaines" />
                      <RadioChip label="D'ici le mois prochain" field="availability" value="1 mois" />
                      <RadioChip label="Plus tard" field="availability" value="Plus tard" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">Tes créneaux préférés (plusieurs choix) <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-3">
                      <CheckboxChip label="Matin" isSelected={formData.preferredTime.includes('Matin')} onClick={() => handleTimeToggle('Matin')} />
                      <CheckboxChip label="Après-midi" isSelected={formData.preferredTime.includes('Après-midi')} onClick={() => handleTimeToggle('Après-midi')} />
                      <CheckboxChip label="Soirée" isSelected={formData.preferredTime.includes('Soirée')} onClick={() => handleTimeToggle('Soirée')} />
                      <CheckboxChip label="Je suis flexible" isSelected={formData.preferredTime.includes('Flexible')} onClick={() => handleTimeToggle('Flexible')} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-3">T'as un ordinateur ? <span className="text-red-500">*</span></label>
                      <div className="flex gap-3">
                        <RadioChip label="Oui" field="hasComputer" value="Oui" />
                        <RadioChip label="Non" field="hasComputer" value="Non" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-3">Un smartphone ? <span className="text-red-500">*</span></label>
                      <div className="flex gap-3">
                        <RadioChip label="Oui" field="hasPhone" value="Oui" />
                        <RadioChip label="Non" field="hasPhone" value="Non" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <label className="block text-sm font-semibold mb-3">Connexion internet stable ? <span className="text-red-500">*</span></label>
                    <div className="flex gap-3">
                      <RadioChip label="Oui absolue" field="hasInternet" value="Oui" />
                      <RadioChip label="Galère par moment" field="hasInternet" value="Non" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5 */}
              {currentStep === 5 && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold mb-8">C'est presque fini !</h2>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Comment as-tu entendu parler de nous ?</label>
                    <input type="text" className="form-input" placeholder="TikTok, IG, un pote..." value={formData.source} onChange={e => handleChange('source', e.target.value)} />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Autre chose à ajouter ?</label>
                    <textarea className="form-input min-h-[120px] resize-y" placeholder="Une blague, un projet perso, une question..." value={formData.additionalInfo} onChange={e => handleChange('additionalInfo', e.target.value)}></textarea>
                  </div>

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm font-medium">
                      Oups, une erreur est survenue lors de l'envoi. Vérifie ta connexion ou réessaie.
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {submitStatus !== 'success' && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl flex justify-between items-center mt-auto">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-6 py-3 font-medium text-gray-500 hover:text-primary transition-colors flex items-center gap-2"
              >
                Retour
              </button>
            ) : <div></div>}

            {currentStep < 5 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!validateStep(currentStep)}
                className="px-8 py-3 bg-primary hover:bg-[#2a3c63] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 group"
              >
                Suivant
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-4 bg-accent hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(74,144,217,0.4)] flex items-center gap-2 w-full md:w-auto justify-center"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Envoi en cours...
                  </span>
                ) : (
                  <>Envoyer ma pré-candidature</>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
