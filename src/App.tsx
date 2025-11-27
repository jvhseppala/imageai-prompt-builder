import React, { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { 
  Info, Copy, Check, ChevronDown, ChevronUp, 
  Palette, Camera, Zap, Mountain, Eye, Sparkles, Wand2, 
  PenTool, Users, Layers, Frame, CloudRain, Box, Aperture, Droplet,
  Play
} from 'lucide-react';

// --- TYPES ---
interface PillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

interface AccordionProps {
  title: string;
  icon?: ReactNode;
  info: string;
  children: ReactNode;
  disabled?: boolean;
  preview?: string;
}

interface SectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  generatedText: string;
}

interface Subject {
  id: number;
  name: string;
  age: string; customAge: string;   
  expression: string; customExpression: string;
  action: string; customAction: string;
  clothing: string[]; customClothing: string;
}

interface StyleSettings {
  artStyles: string[]; customArtStyle: string;
  effects: string[]; customEffect: string;
  quality: string; customQuality: string;
  composition: string; customComposition: string;
  shotType: string; customShotType: string;
  cameraAngle: string; customCameraAngle: string;
  environment: string; customEnvironment: string;
  lighting: string; customLighting: string;
  weather: string; customWeather: string;
  material: string; customMaterial: string;
  colorPalette: string; customColorPalette: string;
  filmType: string; customFilmType: string;
  mainEnvironmentDescription: string;
}

interface Settings {
  tool: 'midjourney' | 'chatgpt';
  model: 'v7' | 'v6' | 'niji';
  aspectRatio: string;
  customAR: string;
  chaos: number;
  stylize: number;
  repeat: number;
  tile: boolean;
  weird: number;
}

// --- DATA LISTS ---
const EXPRESSIONS = ['Angry', 'Ashamed', 'Bored', 'Confused', 'Curious', 'Determined', 'Disgusted', 'Excited', 'Fearful', 'Joyful', 'Melancholic', 'Proud', 'Relaxed', 'Stoic', 'Surprised'];
const INDIVIDUAL_ACTIONS = ['Crossed arms', 'Fighting stance', 'Floating', 'Hands in pockets', 'Jumping', 'Leaning', 'Looking away', 'Lying down', 'Sitting', 'Standing relaxed', 'Walking'];
const GROUP_INTERACTIONS = ['Back to back', 'Chasing each other', 'Dancing together', 'Embracing', 'Facing each other', 'Fighting', 'Ignoring each other', 'Laughing together', 'Talking to each other', 'Walking together', 'Working together'];
const CLOTHING = ['Bomber jacket', 'Business formal', 'Casual T-shirt', 'Cyberpunk armor', 'Denim jacket', 'Gothic fashion', 'Haute couture', 'Hoodie', 'Jeans', 'Joggers', 'Leather jacket', 'Medieval tunic', 'Robes', 'Smart casual', 'Space suit', 'Streetwear', 'Suit', 'Summer dress', 'Swimwear', 'Trench coat', 'Uniform', 'Vintage 80s'];
const AGES = ['20s', '30s', '40s', '50s', '60s'];
const ART_STYLES = ['3D render', 'Anime', 'Baroque painting', 'Cinematic', 'Claymation', 'Cyberpunk', 'Disney', 'Impressionist', 'Low-poly', 'Manga', 'Oil painting', 'Photorealistic', 'Pixel art', 'Pop art', 'Steampunk', 'Vector art', 'Watercolor'];
const QUALITY = ['CG cinematic', 'Film grain texture', 'Hyper-realistic', 'Magazine cover quality', 'Professional grade', 'Ultra-detailed'];
const EFFECTS = ['Chromatic aberration', 'Direct flash photography', 'Dispersion effect', 'Double exposure', 'Film grain', 'Glitch RGB shift', 'Halation', 'Light leaks', 'Motion blur', 'Soft focus filter', 'VHS noise', 'Vignetting'];
const ENVIRONMENTS = ['Arctic tundra', 'Brutalist concrete wall', 'City street', 'Cozy living room', 'Cyberpunk alley', 'Desert dunes', 'Forest clearing', 'Futuristic laboratory', 'Industrial warehouse', 'Japanese tatami room', 'Medieval village', 'Messy home garage', 'Modern bedroom', 'Mountain ridge', 'Neon alleyway', 'Pastel colonnade backdrop', 'Retro 80s arcade', 'Rooftop garden', 'Seamless white paper backdrop', 'Space station', 'Studio backdrop', 'Tropical beach', 'Underwater reef', 'Victorian library'];
const LIGHTING = ['Blue hour', 'Candlelit', 'Dramatic backlight', 'Film-noir lighting', 'Golden hour', 'Harsh midday sun', 'High-key', 'Low-key', 'Natural daylight', 'Neon rim light', 'Rembrandt lighting', 'Rim light', 'Single spotlight', 'Soft ambient glow', 'Softbox studio', 'Volumetric light'];
const COMPOSITIONS = ['Asymmetry', 'Centered composition', 'Diagonal composition', 'Dynamic composition', 'Framing within a frame', 'Leading lines', 'Minimal framing', 'Negative space', 'Rule of thirds', 'Symmetry'];
const SHOT_TYPES = ['Close-up', 'Establishing shot', 'Extreme close-up', 'Full-body shot', 'Long shot', 'Medium shot', 'Over-the-shoulder', 'Point-of-view (POV)', 'Ultra-wide shot', 'Wide shot'];
const CAMERA_ANGLES = ["Bird's-eye view", 'Drone shot', 'Dutch angle', 'Eye-level', 'Flat lay', 'High angle', 'Isometric view', 'Low angle', 'Profile shot', 'Top-down view', "Worm's-eye view"];
const WEATHER = ['Aurora borealis', 'Clear sky', 'Dramatic clouds', 'Foggy', 'Heavy rain', 'Humid haze', 'Lightning strike', 'Milky way', 'Morning dew', 'Overcast', 'Puddles and reflections', 'Snowy pine forest', 'Starry night sky', 'Stormy sky'];
const MATERIALS = ['Aged brass', 'Brushed aluminum', 'Concrete', 'Cracked paint', 'Frosted glass', 'Leather', 'Linen weave', 'Marble veining', 'Polished chrome', 'Stainless steel', 'Velvet', 'Weathered wood'];
const COLORS = ['Acid green', 'Black and white', 'Cinematic color grade', 'Duotone', 'Earth tones', 'High contrast', 'Jewel tones', 'Millenial pink', 'Monochromatic', 'Muted tones', 'Neon palette', 'Pastel palette', 'Sepia tone', 'Teal and orange', 'Vibrant saturation', 'Warm tones', 'Wes Anderson style'];
const FILM_TYPES = ['35mm photograph', 'ARRI Alexa', 'Analog camera look', 'Canon AE-1 Program', 'CineStill 800T', 'Disposable camera', 'Fujifilm Pro 400H', 'Fujifilm Velvia 50', 'GoPro footage', 'Hasselblad 500 C/M', 'Ilford HP5 Plus', 'Kodak Ektar 100', 'Kodak Gold 200', 'Kodak Portra 400', 'Kodak Tri-X 400', 'Leica M6', 'Lomography 800', 'Polaroid SX-70', 'Polaroid vintage'];

// --- SUB-COMPONENTS ---

const Pill: React.FC<PillProps> = ({ label, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
      selected 
        ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]' 
        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
    }`}
  >
    {label}
  </button>
);

const Accordion: React.FC<AccordionProps> = ({ title, icon, info, children, disabled = false, preview = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // No internal useEffect for disabled state to avoid complexity, parent controls logic usually
  
  return (
    <div className={`border border-slate-700 rounded-xl mb-4 bg-slate-800/40 w-full relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/60 transition-colors ${isOpen ? 'rounded-t-xl' : 'rounded-xl'}`}
      >
        <div className="flex items-center gap-3 min-w-0"> 
          {icon && <span className="text-slate-400">{icon}</span>}
          <span className="font-semibold text-lg text-slate-100 truncate">{title}</span>
          <div className="group relative flex items-center flex-shrink-0">
            <Info size={18} className="text-slate-500 hover:text-blue-400 transition-colors cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 w-72 bg-slate-950 text-xs text-slate-300 p-3 rounded-lg border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50">
              {info}
            </div>
          </div>
        </div>

        {!isOpen && preview && (
            <div className="flex-1 text-right mr-4 ml-4">
                <span className="text-sm font-medium text-blue-400 truncate inline-block max-w-[150px] md:max-w-[300px]">
                    {preview}
                </span>
            </div>
        )}

        {isOpen ? <ChevronUp size={20} className="text-slate-400 flex-shrink-0"/> : <ChevronDown size={20} className="text-slate-400 flex-shrink-0"/>}
      </button>
      
      {isOpen && (
        <div className="p-5 border-t border-slate-700/50 bg-slate-900/30 rounded-b-xl">
          {children}
        </div>
      )}
    </div>
  );
};

const Section: React.FC<SectionProps> = ({ title, isOpen, onToggle, children, generatedText }) => {
  return (
    <section className={`bg-slate-900/20 rounded-2xl border border-slate-800 transition-all duration-300 overflow-hidden ${isOpen ? 'ring-1 ring-slate-700' : 'hover:border-slate-600'}`}>
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <div className="flex items-center gap-3">
           <h2 className={`text-xl font-bold transition-colors ${isOpen ? 'text-white' : 'text-slate-400'}`}>
             {title}
           </h2>
           {!isOpen && generatedText && (
             <span className="hidden md:block text-sm text-slate-500 truncate max-w-md">
                — {generatedText}
             </span>
           )}
        </div>
        {isOpen ? <ChevronUp className="text-slate-400"/> : <ChevronDown className="text-slate-400"/>}
      </button>

      {isOpen && (
        <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2">
          {children}
          {generatedText && (
            <div className="mt-6 pt-4 border-t border-slate-800/50">
                <div className="flex gap-3 items-start">
                    <div className="mt-1 p-1 bg-slate-800 rounded">
                        <Play size={12} className="text-blue-400" fill="currentColor" />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Section Output</span>
                        <p className="text-sm text-slate-300 font-mono leading-relaxed">{generatedText}</p>
                    </div>
                </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

// --- MAIN COMPONENT ---

const MidjourneyBuilder = () => {
  const [mainPrompt, setMainPrompt] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [subjectCount, setSubjectCount] = useState<1 | 2 | 3>(1);
  const [openSectionId, setOpenSectionId] = useState<number | null>(1);

  // Interaction State
  const [groupInteraction, setGroupInteraction] = useState<string>("");
  const [customGroupInteraction, setCustomGroupInteraction] = useState<string>("");

  const [subjects, setSubjects] = useState<Subject[]>([
    { 
      id: 1, name: '', 
      age: '', customAge: '',
      expression: '', customExpression: '',
      action: '', customAction: '',
      clothing: [], customClothing: ''
    }
  ]);

  const [styleSettings, setStyleSettings] = useState<StyleSettings>({
    artStyles: [], customArtStyle: '',
    effects: [], customEffect: '',
    quality: '', customQuality: '',
    shotType: '', customShotType: '',
    environment: '', customEnvironment: '',
    mainEnvironmentDescription: '',
    lighting: '', customLighting: '',
    cameraAngle: '', customCameraAngle: '',
    composition: '', customComposition: '',
    weather: '', customWeather: '',
    material: '', customMaterial: '',
    colorPalette: '', customColorPalette: '',
    filmType: '', customFilmType: ''
  });

  const [settings, setSettings] = useState<Settings>({
    tool: 'midjourney', model: 'v7', aspectRatio: '1:1', customAR: '', chaos: 0, stylize: 0, repeat: 1, tile: false, weird: 0
  });

  // --- LOGIC ---
  const updateSubjectCount = (count: 1 | 2 | 3) => {
    setSubjectCount(count);
    setSubjects(prev => {
      if (count > prev.length) {
        const newSubjects = [...prev];
        for (let i = prev.length; i < count; i++) {
          newSubjects.push({ 
            id: i + 1, name: '', 
            age: '', customAge: '',
            expression: '', customExpression: '',
            action: '', customAction: '',
            clothing: [], customClothing: '' 
          });
        }
        return newSubjects;
      } else {
        if (count === 1) {
            setGroupInteraction("");
            setCustomGroupInteraction("");
        }
        return prev.slice(0, count);
      }
    });
  };

  const updateSubject = (id: number, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(sub => sub.id === id ? { ...sub, ...updates } : sub));
  };

  const toggleSubjectList = (id: number, listKey: 'clothing', item: string) => {
    setSubjects(prev => prev.map(sub => {
      if (sub.id === id) {
        const list = sub[listKey];
        return { ...sub, [listKey]: list.includes(item) ? list.filter(c => c !== item) : [...list, item] };
      }
      return sub;
    }));
  };

  const updateStyle = (updates: Partial<StyleSettings>) => setStyleSettings(prev => ({ ...prev, ...updates }));

  const toggleStyleList = (listKey: 'artStyles' | 'effects', item: string) => {
    setStyleSettings(prev => {
      const list = prev[listKey];
      return { ...prev, [listKey]: list.includes(item) ? list.filter(i => i !== item) : [...list, item] };
    });
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => setSettings(prev => ({ ...prev, [key]: value }));

  // --- STRING CALCULATORS (useMemo) ---

  const subjectString = useMemo(() => {
    const buildSubjectString = (sub: Subject) => {
        const hasContent = sub.name || sub.age || sub.customAge || sub.action || sub.customAction || sub.expression || sub.customExpression || sub.clothing.length > 0 || sub.customClothing;
        if (!hasContent) return null;

        let s = sub.name ? sub.name : 'Subject'; 
        const ageParts = [sub.age, sub.customAge].filter(Boolean);
        if (ageParts.length > 0) s += ` in their ${ageParts.join(" ")}`;
        const expressionParts = [sub.expression, sub.customExpression].filter(Boolean);
        if (expressionParts.length > 0) s += ` with a ${expressionParts.join(" ")} expression`;
        const allClothing = [...sub.clothing];
        if (sub.customClothing.trim()) allClothing.push(sub.customClothing.trim());
        if (allClothing.length > 0) s += ` wearing ${allClothing.join(" and ")}`;
        const actionParts = [sub.action, sub.customAction].filter(Boolean);
        if (actionParts.length > 0) s += `, ${actionParts.join(", ")}`;
        return s;
    };

    const subjectStrings = subjects.map(buildSubjectString).filter(Boolean) as string[];
    const interaction = [groupInteraction, customGroupInteraction].filter(Boolean).join(", ");

    if (subjectStrings.length === 0) return "";
    if (subjectStrings.length > 1 && interaction) {
        return subjectStrings.join(" AND ") + " ARE " + interaction;
    }
    return subjectStrings.join(". ");
  }, [subjects, groupInteraction, customGroupInteraction]);

    const environmentString = useMemo(() => {
    let parts: string[] = [];
    
    // NEW: Add the free-form description first
    if (styleSettings.mainEnvironmentDescription.trim()) {
        parts.push(styleSettings.mainEnvironmentDescription.trim());
    }

    const getCombined = (pill: string, custom: string, prefix = '') => {
        const p = [pill, custom].filter(Boolean);
        if (p.length === 0) return null;
        return prefix + p.join(", ");
    };

    const env = getCombined(styleSettings.environment, styleSettings.customEnvironment, 'set in ');
    if (env) parts.push(env);
    
    const weather = getCombined(styleSettings.weather, styleSettings.customWeather);
    if (weather) parts.push(`${weather}`);

    const mat = getCombined(styleSettings.material, styleSettings.customMaterial, 'made of ');
    if (mat) parts.push(mat);

    return parts.join(", ");
  }, [styleSettings]);

    const toolString = useMemo(() => {
    if (settings.tool === 'midjourney') return "Midjourney";
    if (settings.tool === 'chatgpt') return "ChatGPT / Gemini";
    return "Select a tool";
  }, [settings.tool]);

  const visualString = useMemo(() => {
    let parts: string[] = [];
    const getCombined = (pill: string, custom: string, prefix = '') => {
        const p = [pill, custom].filter(Boolean);
        if (p.length === 0) return null;
        return prefix + p.join(", ");
    };



    const film = getCombined(styleSettings.filmType, styleSettings.customFilmType, 'shot on ');
    if (film) parts.push(film);

    const art = [...styleSettings.artStyles, styleSettings.customArtStyle].filter(Boolean);
    if (art.length > 0) parts.push(`${art.join(", ")} style`);

    const colorVals = [styleSettings.colorPalette, styleSettings.customColorPalette].filter(Boolean);
    if (colorVals.length > 0) parts.push(`in ${colorVals.join(", ")} color palette`);

    const comp = getCombined(styleSettings.composition, styleSettings.customComposition, 'with '); 
    if (comp) parts.push(comp);

    const light = getCombined(styleSettings.lighting, styleSettings.customLighting, '');
    if (light) parts.push(`${light} lighting`);
    
    const shot = getCombined(styleSettings.shotType, styleSettings.customShotType);
    if (shot) parts.push(shot);
    
    const cam = getCombined(styleSettings.cameraAngle, styleSettings.customCameraAngle);
    if (cam) parts.push(cam);
    
    const qual = getCombined(styleSettings.quality, styleSettings.customQuality);
    if (qual) parts.push(qual);
    
    const eff = [...styleSettings.effects, styleSettings.customEffect].filter(Boolean);
    if (eff.length > 0) parts.push(eff.join(", "));

    return parts.join(", ");
  }, [styleSettings]);

  const mjString = useMemo(() => {
    if (settings.tool !== 'midjourney') return "";
    let params: string[] = [];
    if (settings.model === 'niji') params.push('--niji');
    else if (settings.model === 'v7') params.push('--v 7');
    else if (settings.model === 'v6') params.push('--v 6');

    if (settings.aspectRatio === 'custom' && settings.customAR) params.push(`--ar ${settings.customAR}`);
    else if (settings.aspectRatio !== 'custom') params.push(`--ar ${settings.aspectRatio}`);

    if (settings.chaos > 0) params.push(`--c ${settings.chaos}`);
    if (settings.stylize > 0) params.push(`--s ${settings.stylize}`);
    if (settings.weird > 0) params.push(`--weird ${settings.weird}`);
    if (settings.repeat > 1) params.push(`--r ${settings.repeat}`);
    if (settings.tile) params.push('--tile');

    return params.join(" ");
  }, [settings]);

  // COMBINED FINAL PROMPT
  const generatedString = useMemo(() => {
    let p = [];
    if (subjectString) p.push(subjectString + ".");
    if (environmentString) p.push(environmentString + ".");
    if (visualString) p.push(visualString + ".");
    if (mainPrompt.trim()) p.push(mainPrompt.trim());
    if (mjString) p.push(mjString);
    return p.join(" ");
  }, [subjectString, environmentString, visualString, mainPrompt, mjString]);

  const toggleSection = (id: number) => {
    setOpenSectionId(openSectionId === id ? null : id);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    setSettings({ tool: 'midjourney', model: 'v7', aspectRatio: '1:1', customAR: '', chaos: 0, stylize: 0, repeat: 1, tile: false, weird: 0 });
    setSubjects([{ id: 1, name: '', age: '', customAge: '', expression: '', customExpression: '', action: '', customAction: '', clothing: [], customClothing: '' }]);
    setStyleSettings({ 
        artStyles: [], customArtStyle: '', effects: [], customEffect: '',
        quality: '', customQuality: '', shotType: '', customShotType: '',
        environment: '', customEnvironment: '', lighting: '', customLighting: '',
        cameraAngle: '', customCameraAngle: '', composition: '', customComposition: '',
        weather: '', customWeather: '', material: '', customMaterial: '',
        colorPalette: '', customColorPalette: '', filmType: '', customFilmType: '',
        mainEnvironmentDescription: '',
    });
    setGroupInteraction("");
    setCustomGroupInteraction("");
    setSubjectCount(1);
    setMainPrompt("");
    setOpenSectionId(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col items-center">
      
      <div className="w-full max-w-5xl px-6 py-12 space-y-10 pb-40 flex flex-col items-center">
        
        {/* Header */}
        <header className="text-center space-y-4 max-w-2xl mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent pb-2">
            ImageAI Prompt Builder
          </h1>
        </header>

         {/* INSTRUCTION CARD */}
        <div className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl p-6 mb-8 backdrop-blur-sm shadow-xl">
          <h3 className="text-lg font-semibold text-slate-200 mb-5 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Layers size={20} className="text-blue-400" />
            Build your prompt layer by layer
          </h3>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase tracking-wide">
                <span className="w-6 h-6 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-xs">1</span>
                Define
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Set specific character details, individual poses, and complex group interactions. Describe the scene in detail.
              </p>
            </div>
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-blue-400 font-bold text-sm uppercase tracking-wide">
                <span className="w-6 h-6 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center text-xs">2</span>
                Style
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Layer on the visual atmosphere, artistic style, lighting, and camera settings.
              </p>
            </div>
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-green-400 font-bold text-sm uppercase tracking-wide">
                <span className="w-6 h-6 rounded-full bg-green-900/50 border border-green-500/30 flex items-center justify-center text-xs">3</span>
                Execute
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Copy the raw text from the footer. Paste into the Gemini <strong>ImageAI Prompt Optimizer </strong>Gem for polish, or straight to your image AI tool of choice.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full space-y-4">
          


          {/* 2. SUBJECT DETAILS */}
          <Section 
            title="1. Describe your subject(s)" 
            isOpen={openSectionId === 1} 
            onToggle={() => toggleSection(1)}
            generatedText={subjectString}
          >
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-200">Subject Definition</h2>
                </div>
                <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
                   {[1, 2, 3].map(num => (
                     <button
                       key={num}
                       onClick={() => updateSubjectCount(num as 1 | 2 | 3)}
                       className={`px-3 py-1 text-xs font-bold rounded transition-colors ${subjectCount === num ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                     >
                       {num} Subject{num > 1 ? 's' : ''}
                     </button>
                   ))}
                </div>
             </div>
             
             {subjects.map((subject) => (
               <div key={subject.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8 last:mb-0">
                 <div className="flex items-center gap-3 mb-3 pl-1">
                    <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center border border-purple-500/30 text-purple-300 font-bold text-sm">
                        {subject.id}
                    </div>
                    <span className="text-purple-300 font-semibold tracking-wide uppercase text-sm">Subject {subject.id}</span>
                 </div>

                 <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 mb-4 focus-within:border-purple-500/50 transition-colors">
                    <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Who is this? (Required)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. A futuristic samurai / An orange tabby cat"
                      value={subject.name}
                      onChange={(e) => updateSubject(subject.id, { name: e.target.value })}
                      className="w-full bg-transparent text-white focus:outline-none placeholder-slate-600 text-lg"
                    />
                 </div>

                 <div className="space-y-3">
                    <Accordion title="Age" info="Approximate age." preview={[subject.age, subject.customAge].filter(Boolean).join(', ')}>
                      <div className="flex flex-wrap gap-2 mb-3">
                         {AGES.map(age => <Pill key={age} label={age} selected={subject.age === age} onClick={() => updateSubject(subject.id, { age: age })} />)}
                      </div>
                      <input type="text" value={subject.customAge} onChange={(e) => updateSubject(subject.id, { customAge: e.target.value })} placeholder="Add specific age details e.g. toddler / ancient" className="w-full bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white focus:border-purple-500 outline-none text-sm" />
                    </Accordion>

                    <Accordion title="Expression" info="Facial expression or mood." preview={[subject.expression, subject.customExpression].filter(Boolean).join(', ')}>
                      <div className="flex flex-wrap gap-2 mb-3">
                         {EXPRESSIONS.map(ex => <Pill key={ex} label={ex} selected={subject.expression === ex} onClick={() => updateSubject(subject.id, { expression: ex })} />)}
                      </div>
                      <input type="text" value={subject.customExpression} onChange={(e) => updateSubject(subject.id, { customExpression: e.target.value })} placeholder="Add specific expression e.g. tears of joy / stoic gaze" className="w-full bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white focus:border-purple-500 outline-none text-sm" />
                    </Accordion>

                    <Accordion title="Clothing / Attire" info="What is the subject wearing?" preview={[...subject.clothing, subject.customClothing].filter(Boolean).join(', ')}>
                      <div className="flex flex-wrap gap-2 mb-3">
                         {CLOTHING.map(item => <Pill key={item} label={item} selected={subject.clothing.includes(item)} onClick={() => toggleSubjectList(subject.id, 'clothing', item)} />)}
                      </div>
                      <input type="text" value={subject.customClothing} onChange={(e) => updateSubject(subject.id, { customClothing: e.target.value })} placeholder="Add specific clothing e.g. Red Scarf" className="w-full bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white focus:border-purple-500 outline-none text-sm" />
                    </Accordion>

                    <Accordion title="Individual Pose / Mannerism" info="Specific body language for this character." preview={[subject.action, subject.customAction].filter(Boolean).join(', ')}>
                      <div className="flex flex-wrap gap-2 mb-3">
                         {INDIVIDUAL_ACTIONS.map(action => <Pill key={action} label={action} selected={subject.action === action} onClick={() => updateSubject(subject.id, { action: action })} />)}
                      </div>
                      <input type="text" value={subject.customAction} onChange={(e) => updateSubject(subject.id, { customAction: e.target.value })} placeholder="Add specific pose e.g. hands on hips" className="w-full bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white focus:border-purple-500 outline-none text-sm" />
                    </Accordion>
                 </div>
               </div>
             ))}

             {subjectCount > 1 && (
                <div className="mt-8 pt-6 border-t border-slate-800 animate-in fade-in">
                    <div className="flex items-center gap-2 mb-4">
                        <Users size={20} className="text-purple-400" />
                        <h3 className="text-lg font-bold text-slate-200">Group Dynamic</h3>
                    </div>
                    <Accordion title="Interaction" info="How are the subjects interacting?" preview={[groupInteraction, customGroupInteraction].filter(Boolean).join(', ')}>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {GROUP_INTERACTIONS.map(g => <Pill key={g} label={g} selected={groupInteraction === g} onClick={() => setGroupInteraction(g)} />)}
                        </div>
                        <input type="text" value={customGroupInteraction} onChange={(e) => setCustomGroupInteraction(e.target.value)} placeholder="Add specific interaction e.g. Planning a heist" className="w-full bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white focus:border-purple-500 outline-none text-sm" />
                    </Accordion>
                </div>
             )}
          </Section>

          {/* 3. ENVIRONMENT & SETTING */}
          <Section 
            title="2. Describe the scene" 
            isOpen={openSectionId === 2} 
            onToggle={() => toggleSection(2)}
            generatedText={environmentString}
          >
            {/* NEW: Free-form Input Block */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 mb-4 focus-within:border-blue-500/50 transition-colors">
                <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Describe the scene (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. A bustling cyber-market during a festival"
                  value={styleSettings.mainEnvironmentDescription}
                  onChange={(e) => updateStyle({ mainEnvironmentDescription: e.target.value })}
                  className="w-full bg-transparent text-white focus:outline-none placeholder-slate-600 text-lg"
                />
             </div>
            <div className="space-y-3">
              <Accordion title="Environment" icon={<Mountain size={18} />} info="The physical location." preview={[styleSettings.environment, styleSettings.customEnvironment].filter(Boolean).join(', ')}>
                <div className="flex flex-wrap gap-2 mb-3">
                  {ENVIRONMENTS.map(e => <Pill key={e} label={e} selected={styleSettings.environment === e} onClick={() => updateStyle({ environment: e })} />)}
                </div>
                <input type="text" value={styleSettings.customEnvironment} onChange={(e) => updateStyle({ customEnvironment: e.target.value })} placeholder="Add specific location e.g. Inside a volcano" className="w-full bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white focus:border-purple-500 outline-none text-sm" />
              </Accordion>

              <Accordion title="Weather & Time" icon={<CloudRain size={18} />} info="Atmospheric conditions and time of day." preview={[styleSettings.weather, styleSettings.customWeather].filter(Boolean).join(', ')}>
                <div className="flex flex-wrap gap-2 mb-3">
                  {WEATHER.map(w => <Pill key={w} label={w} selected={styleSettings.weather === w} onClick={() => updateStyle({ weather: w })} />)}
                </div>
                <input type="text" value={styleSettings.customWeather} onChange={(e) => updateStyle({ customWeather: e.target.value })} placeholder="Add specific weather e.g. Solar eclipse" className="w-full bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white focus:border-purple-500 outline-none text-sm" />
              </Accordion>

              <Accordion title="Material & Texture" icon={<Box size={18} />} info="Dominant textures or materials in the scene." preview={[styleSettings.material, styleSettings.customMaterial].filter(Boolean).join(', ')}>
                <div className="flex flex-wrap gap-2 mb-3">
                  {MATERIALS.map(m => <Pill key={m} label={m} selected={styleSettings.material === m} onClick={() => updateStyle({ material: m })} />)}
                </div>
                <input type="text" value={styleSettings.customMaterial} onChange={(e) => updateStyle({ customMaterial: e.target.value })} placeholder="Add specific material e.g. Obsidian" className="w-full bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white focus:border-purple-500 outline-none text-sm" />
              </Accordion>
            </div>
          </Section>

          {/* 4. VISUAL STYLE & CAMERA */}
          <Section 
            title="3. Describe the visual style" 
            isOpen={openSectionId === 3} 
            onToggle={() => toggleSection(3)}
            generatedText={visualString}
          >
            <div className="space-y-3">
              <Accordion title="Art Style" icon={<Palette size={18} />} info="Visual aesthetic." preview={[...styleSettings.artStyles, styleSettings.customArtStyle].filter(Boolean).join(', ')}>
                <div className="flex flex-wrap gap-2 mb-3">
                  {ART_STYLES.map(s => <Pill key={s} label={s} selected={styleSettings.artStyles.includes(s)} onClick={() => toggleStyleList('artStyles', s)} />)}
                </div>
                <input type="text" value={styleSettings.customArtStyle} onChange={(e) => updateStyle({ customArtStyle: e.target.value })} placeholder="Add specific style e.g. Bauhaus" className="w-full bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white focus:border-purple-500 outline-none text-sm" />
              </Accordion>

              <Accordion title="Color Palette" icon={<Droplet size={18} />} info="Dominant colors and tones." preview={[styleSettings.colorPalette, styleSettings.customColorPalette].filter(Boolean).join(', ')}>
                <div className="flex flex-wrap gap-2 mb-3">
                  {COLORS.map(c => <Pill key={c} label={c} selected={styleSettings.colorPalette === c} onClick={() => updateStyle({ colorPalette: c })} />)}
                </div>
                <input type="text" value={styleSettings.customColorPalette} onChange={(e) => updateStyle({ customColorPalette: e.target.value })} placeholder="Add specific colors e.g. Neon Pink" className="w-full bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white focus:border-purple-500 outline-none text-sm" />
              </Accordion>

              <Accordion title="Film & Camera Type" icon={<Aperture size={18} />} info="Specific camera models or film stocks." preview={[styleSettings.filmType, styleSettings.customFilmType].filter(Boolean).join(', ')}>
                <div className="flex flex-wrap gap-2 mb-3">
                  {FILM_TYPES.map(f => <Pill key={f} label={f} selected={styleSettings.filmType === f} onClick={() => updateStyle({ filmType: f })} />)}
                </div>
                <input type="text" value={styleSettings.customFilmType} onChange={(e) => updateStyle({ customFilmType: e.target.value })} placeholder="Add specific film e.g. IMAX" className="w-full bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white focus:border-purple-500 outline-none text-sm" />
              </Accordion>

              <Accordion title="Composition" icon={<Frame size={18} />} info="Visual arrangement of elements." preview={[styleSettings.composition, styleSettings.customComposition].filter(Boolean).join(', ')}>
                <div className="flex flex-wrap gap-2 mb-3">
                  {COMPOSITIONS.map(c => <Pill key={c} label={c} selected={styleSettings.composition === c} onClick={() => updateStyle({ composition: c })} />)}
                </div>
                <input type="text" value={styleSettings.customComposition} onChange={(e) => updateStyle({ customComposition: e.target.value })} placeholder="Add specific composition e.g. Fibonacci spiral" className="w-full bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white focus:border-purple-500 outline-none text-sm" />
              </Accordion>

              <Accordion title="Lighting" icon={<Zap size={18} />} info="Lighting conditions." preview={[styleSettings.lighting, styleSettings.customLighting].filter(Boolean).join(', ')}>
                <div className="flex flex-wrap gap-2 mb-3">
                  {LIGHTING.map(l => <Pill key={l} label={l} selected={styleSettings.lighting === l} onClick={() => updateStyle({ lighting: l })} />)}
                </div>
                <input type="text" value={styleSettings.customLighting} onChange={(e) => updateStyle({ customLighting: e.target.value })} placeholder="Add specific lighting e.g. Bioluminescent glow" className="w-full bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white focus:border-purple-500 outline-none text-sm" />
              </Accordion>

              <Accordion title="Camera Angle" icon={<Eye size={18} />} info="Perspective of the shot." preview={[styleSettings.cameraAngle, styleSettings.customCameraAngle].filter(Boolean).join(', ')}>
                <div className="flex flex-wrap gap-2 mb-3">
                  {CAMERA_ANGLES.map(c => <Pill key={c} label={c} selected={styleSettings.cameraAngle === c} onClick={() => updateStyle({ cameraAngle: c })} />)}
                </div>
                <input type="text" value={styleSettings.customCameraAngle} onChange={(e) => updateStyle({ customCameraAngle: e.target.value })} placeholder="Add specific angle e.g. Drone shot" className="w-full bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white focus:border-purple-500 outline-none text-sm" />
              </Accordion>

               <Accordion title="Shot Type" icon={<Camera size={18} />} info="Framing of the subject." preview={[styleSettings.shotType, styleSettings.customShotType].filter(Boolean).join(', ')}>
                <div className="flex flex-wrap gap-2 mb-3">
                  {SHOT_TYPES.map(s => <Pill key={s} label={s} selected={styleSettings.shotType === s} onClick={() => updateStyle({ shotType: s })} />)}
                </div>
                <input type="text" value={styleSettings.customShotType} onChange={(e) => updateStyle({ customShotType: e.target.value })} placeholder="Add specific shot type e.g. Selfie" className="w-full bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white focus:border-purple-500 outline-none text-sm" />
              </Accordion>

              <Accordion title="Quality" icon={<Sparkles size={18} />} info="Resolution and finish." preview={[styleSettings.quality, styleSettings.customQuality].filter(Boolean).join(', ')}>
                <div className="flex flex-wrap gap-2 mb-3">
                  {QUALITY.map(q => <Pill key={q} label={q} selected={styleSettings.quality === q} onClick={() => updateStyle({ quality: q })} />)}
                </div>
                <input type="text" value={styleSettings.customQuality} onChange={(e) => updateStyle({ customQuality: e.target.value })} placeholder="Add specific quality e.g. 8k" className="w-full bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white focus:border-purple-500 outline-none text-sm" />
              </Accordion>

              <Accordion title="Effects" icon={<Wand2 size={18} />} info="Post-processing effects." preview={[...styleSettings.effects, styleSettings.customEffect].filter(Boolean).join(', ')}>
                <div className="flex flex-wrap gap-2 mb-3">
                  {EFFECTS.map(ef => <Pill key={ef} label={ef} selected={styleSettings.effects.includes(ef)} onClick={() => toggleStyleList('effects', ef)} />)}
                </div>
                <input type="text" value={styleSettings.customEffect} onChange={(e) => updateStyle({ customEffect: e.target.value })} placeholder="Add specific effects e.g. Chromatic aberration" className="w-full bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white focus:border-purple-500 outline-none text-sm" />
              </Accordion>
            </div>
          </Section>

          {/* 4. ADDITIONAL DETAILS */}
          <Section 
            title="4. Additional Specifics" 
            isOpen={openSectionId === 4} 
            onToggle={() => toggleSection(4)}
            generatedText={mainPrompt}
          >
            <div className="flex items-center gap-2 mb-4">
                <PenTool size={20} className="text-blue-400" />
                <span className="text-sm text-slate-400">Add any specific details that the buttons above didn't cover.</span>
            </div>
            <textarea
              value={mainPrompt}
              onChange={(e) => setMainPrompt(e.target.value)}
              placeholder="E.g. The character is holding a red balloon. There are birds flying in the background..."
              className="w-full h-24 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
            />
          </Section>

          {/* 5. TOOL SELECTION */}
          <Section 
            title="5. ImageAI tool selection" 
            isOpen={openSectionId === 5} 
            onToggle={() => toggleSection(5)}
            generatedText={toolString}
          > 
            <div className="flex flex-wrap gap-3">
              <Pill label="Midjourney" selected={settings.tool === 'midjourney'} onClick={() => updateSetting('tool', 'midjourney')} />
              <Pill label="ChatGPT / Gemini" selected={settings.tool === 'chatgpt'} onClick={() => updateSetting('tool', 'chatgpt')} />
            </div>
          </Section>

          {/* 6. MIDJOURNEY PARAMS */}
          <Section 
            title="6. Midjourney Parameters" 
            isOpen={openSectionId === 6} 
            onToggle={() => toggleSection(6)}
            generatedText={mjString}
          >
            {settings.tool !== 'midjourney' ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-500 space-y-2">
                <Info size={32} className="opacity-50" />
                <p className="font-medium">Choose Midjourney as the tool to modify these</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Accordion title="Model" info="Choose which Midjourney model you want to use." preview={settings.model}>
                  <div className="flex flex-wrap gap-3">
                    <Pill label="Latest" selected={settings.model === 'v7'} onClick={() => updateSetting('model', 'v7')} />
                    <Pill label="Legacy" selected={settings.model === 'v6'} onClick={() => updateSetting('model', 'v6')} />
                    <Pill label="Niji (Anime/manga)" selected={settings.model === 'niji'} onClick={() => updateSetting('model', 'niji')} />
                  </div>
                </Accordion>

                <Accordion title="Aspect Ratio" info="Choose what aspect ratio you want the images to be in." preview={settings.aspectRatio === 'custom' ? settings.customAR : settings.aspectRatio}>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {['1:1', '4:5', '3:4', '9:16', '16:9'].map((ratio) => <Pill key={ratio} label={ratio} selected={settings.aspectRatio === ratio} onClick={() => updateSetting('aspectRatio', ratio)} />)}
                    <Pill label="Custom" selected={settings.aspectRatio === 'custom'} onClick={() => updateSetting('aspectRatio', 'custom')} />
                  </div>
                  {settings.aspectRatio === 'custom' && <input type="text" value={settings.customAR} onChange={(e) => updateSetting('customAR', e.target.value)} placeholder="e.g. 21:9" className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-full focus:border-blue-500 outline-none" />}
                </Accordion>

                <Accordion title={`Chaos`} info="Add more variety to your image results. If you want each image to look more different, increase the chaos value." preview={settings.chaos > 0 ? settings.chaos.toString() : ''}>
                  <div className="px-2">
                      <input type="range" min="0" max="100" value={settings.chaos} onChange={(e) => updateSetting('chaos', parseInt(e.target.value))} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400" />
                      <div className="flex justify-between text-xs text-slate-400 mt-3 font-mono"><span>0</span><span>100</span></div>
                  </div>
                </Accordion>

                <Accordion title={`Stylize`} info="Changes how much artistic creativity is applied to your image. With a low value, it follows your prompt very closely. With a higher value, it's giving Midjourney more freedom to interpret your idea (can stray from the exact details of your prompt)." preview={settings.stylize > 0 ? settings.stylize.toString() : ''}>
                  <div className="px-2">
                      <input type="range" min="0" max="1000" value={settings.stylize} onChange={(e) => updateSetting('stylize', parseInt(e.target.value))} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400" />
                      <div className="flex justify-between text-xs text-slate-400 mt-3 font-mono"><span>0</span><span>1000</span></div>
                  </div>
                </Accordion>

                <Accordion title={`Weird`} info="Make your images quirky and unconventional. When you use it, you’re telling Midjourney to take some creative risks." preview={settings.weird > 0 ? settings.weird.toString() : ''}>
                  <div className="px-2">
                      <input type="range" min="0" max="3000" step="10" value={settings.weird} onChange={(e) => updateSetting('weird', parseInt(e.target.value))} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400" />
                      <div className="flex justify-between text-xs text-slate-400 mt-3 font-mono"><span>0</span><span>3000</span></div>
                  </div>
                </Accordion>

                <Accordion title={`Repeat`} info="Tell Midjourney to run your prompt multiple times." preview={settings.repeat > 1 ? `${settings.repeat} times` : ''}>
                  <div className="flex items-center gap-4">
                    <input type="number" min="1" max="10" value={settings.repeat} onChange={(e) => { let val = parseInt(e.target.value); if(val > 10) val = 10; if(val < 1) val = 1; updateSetting('repeat', val); }} className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-24 text-center focus:border-blue-500 outline-none font-mono text-lg" />
                    <span className="text-slate-400 font-medium">Times</span>
                  </div>
                </Accordion>

                <Accordion title="Tile" info="Create a larger pattern, like wallpaper." preview={settings.tile ? 'Active' : ''}>
                  <label className="flex items-center gap-4 cursor-pointer group p-2 hover:bg-slate-800/50 rounded-lg transition-colors">
                      <div className={`w-8 h-8 border-2 rounded transition-all flex items-center justify-center ${settings.tile ? 'bg-blue-600 border-blue-600' : 'border-slate-500 group-hover:border-blue-400'}`}>
                        {settings.tile && <Check size={20} className="text-white" />}
                      </div>
                      <input type="checkbox" checked={settings.tile} onChange={(e) => updateSetting('tile', e.target.checked)} className="hidden" />
                      <span className="text-lg text-slate-300 group-hover:text-white transition-colors">Enable Tiling Mode</span>
                  </label>
                </Accordion>
              </div>
            )}
          </Section>

        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 p-6 z-50 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">Generated Prompt</span>
            {generatedString && (
               <span className="text-xs text-slate-500 font-mono">{generatedString.length} chars</span>
            )}
          </div>
          <div className="flex gap-3">
            <input 
                readOnly 
                value={generatedString}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-5 py-4 text-slate-100 font-mono text-sm focus:outline-none focus:border-blue-500 shadow-inner"
            />
            <button 
                onClick={copyToClipboard}
                className={`px-8 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg ${
                    copied ? 'bg-green-600 text-white scale-95' : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 active:scale-95'
                }`}
            >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? 'Copied' : 'Copy'}
            </button>
            <button 
              onClick={resetAll}
              className="px-4 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset all settings"
          >
              Reset
          </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MidjourneyBuilder;