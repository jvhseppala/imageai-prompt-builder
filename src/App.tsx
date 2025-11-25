import React, { useState, useEffect, ReactNode } from 'react';
import { 
  Info, Copy, Check, ChevronDown, ChevronUp, 
  Palette, Camera, Zap, Mountain, Eye, Sparkles, Wand2 
} from 'lucide-react';

// --- TYPES ---
interface PillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

interface AccordionProps {
  title: string;
  icon?: ReactNode; // NEW: Optional icon for the header
  info: string;
  children: ReactNode;
  disabled?: boolean;
  preview?: string;
}

interface Subject {
  id: number;
  name: string;
  age: string;
  isCustomAge: boolean;
  action: string;
  isCustomAction: boolean;
  clothing: string[]; 
  customClothing: string;
  isCustomClothing: boolean;
}

// NEW: Global Style Interface
interface StyleSettings {
  artStyles: string[];
  customArtStyle: string;
  isCustomArtStyle: boolean;

  quality: string;
  isCustomQuality: boolean;

  shotType: string;
  isCustomShotType: boolean;

  environment: string;
  isCustomEnvironment: boolean;

  lighting: string;
  isCustomLighting: boolean;

  cameraAngle: string;
  isCustomCameraAngle: boolean;

  effects: string[];
  customEffect: string;
  isCustomEffect: boolean;
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

// 1. Existing Lists
const ACTIONS = ['Standing relaxed', 'Walking forward', 'Sitting on chair', 'Running', 'Leaning against wall', 'Crossed arms', 'Looking over shoulder', 'Floating', 'Fighting stance', 'Lying down', 'Jumping'];
const CLOTHING = ['Casual T-shirt', 'Jeans', 'Suit', 'Hoodie', 'Joggers', 'Leather Jacket', 'Summer Dress', 'Cyberpunk Armor', 'Space Suit', 'Swimwear', 'Robes', 'Uniform', 'Trench coat'];
const AGES = ['20s', '30s', '40s', '50s', '60s'];

// 2. NEW Lists from Screenshots
const ART_STYLES = ['Photorealistic', 'Cinematic', 'Cyberpunk', 'Steampunk', 'Baroque painting', 'Impressionist', 'Watercolor', 'Oil painting', 'Pixel art', 'Anime', 'Manga', '3D render', 'Claymation', 'Low-poly', 'Vector art', 'Pop art'];
const QUALITY = ['Ultra-detailed', 'Hyper-realistic', 'Professional grade', 'Magazine cover quality', 'CG cinematic', 'Film grain texture'];
const SHOT_TYPES = ['Extreme close-up', 'Close-up', 'Medium shot', 'Full body', 'Long shot', 'Macro shot', 'Wide shot'];
const ENVIRONMENTS = ['Studio backdrop', 'City street', 'Futuristic city', 'Medieval village', 'Forest clearing', 'Tropical beach', 'Desert dunes', 'Mountain ridge', 'Arctic tundra', 'Underwater reef', 'Space station', 'Rooftop garden', 'Cyberpunk alley', 'Modern bedroom', 'Cozy living room', 'Messy home garage'];
const LIGHTING = ['Natural daylight', 'Golden hour', 'Blue hour', 'Neon rim light', 'Softbox studio', 'Dramatic backlight', 'Rim light', 'Low-key', 'High-key', 'Film-noir lighting', 'Soft ambient glow', 'Harsh midday sun', 'Single spotlight'];
const CAMERA_ANGLES = ["Bird's-eye view", 'High angle', 'Eye-level', 'Low angle', "Worm's-eye view", 'Dutch angle', 'Isometric', 'Over-the-shoulder', 'Top-down'];
const EFFECTS = ['Motion blur', 'Glitch RGB shift', 'VHS noise', 'Film grain', 'Dispersion effect', 'Double exposure'];

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
  
  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  return (
    <div className={`border border-slate-700 rounded-xl mb-4 bg-slate-800/40 w-full relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/60 transition-colors ${isOpen ? 'rounded-t-xl' : 'rounded-xl'}`}
      >
        <div className="flex items-center gap-3 min-w-0"> 
          {/* Icon Render */}
          {icon && <span className="text-slate-400">{icon}</span>}
          
          <span className="font-semibold text-lg text-slate-100 truncate">{title}</span>
          
          <div className="group relative flex items-center flex-shrink-0">
            <Info size={18} className="text-slate-500 hover:text-blue-400 transition-colors cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 w-72 bg-slate-950 text-xs text-slate-300 p-3 rounded-lg border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50">
              {info}
            </div>
          </div>
        </div>

        {/* PREVIEW TEXT */}
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

// --- MAIN COMPONENT ---

const MidjourneyBuilder = () => {
  const [mainPrompt, setMainPrompt] = useState<string>("");
  const [generatedString, setGeneratedString] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Subject State
  const [subjectCount, setSubjectCount] = useState<1 | 2 | 3>(1);
  const [subjects, setSubjects] = useState<Subject[]>([
    { 
      id: 1, name: '', 
      age: '', isCustomAge: false,
      action: '', isCustomAction: false,
      clothing: [], customClothing: '', isCustomClothing: false 
    }
  ]);

  // NEW: Global Style State
  const [styleSettings, setStyleSettings] = useState<StyleSettings>({
    artStyles: [], customArtStyle: '', isCustomArtStyle: false,
    quality: '', isCustomQuality: false,
    shotType: '', isCustomShotType: false,
    environment: '', isCustomEnvironment: false,
    lighting: '', isCustomLighting: false,
    cameraAngle: '', isCustomCameraAngle: false,
    effects: [], customEffect: '', isCustomEffect: false,
  });

  const [settings, setSettings] = useState<Settings>({
    tool: 'midjourney',
    model: 'v7',
    aspectRatio: '1:1',
    customAR: '',
    chaos: 0,
    stylize: 0,
    repeat: 1,
    tile: false,
    weird: 0
  });

  // --- LOGIC HANDLERS ---

  // Handle Subject Count
  useEffect(() => {
    setSubjects(prev => {
      if (subjectCount > prev.length) {
        const newSubjects = [...prev];
        for (let i = prev.length; i < subjectCount; i++) {
          newSubjects.push({ 
            id: i + 1, name: '', 
            age: '', isCustomAge: false,
            action: '', isCustomAction: false,
            clothing: [], customClothing: '', isCustomClothing: false 
          });
        }
        return newSubjects;
      } else {
        return prev.slice(0, subjectCount);
      }
    });
  }, [subjectCount]);

  // Update specific subject field
  const updateSubject = (id: number, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(sub => {
      if (sub.id === id) return { ...sub, ...updates };
      return sub;
    }));
  };

  const toggleSubjectList = (id: number, listKey: 'clothing', item: string) => {
    setSubjects(prev => prev.map(sub => {
      if (sub.id === id) {
        const list = sub[listKey];
        const hasItem = list.includes(item);
        return { ...sub, [listKey]: hasItem ? list.filter(c => c !== item) : [...list, item] };
      }
      return sub;
    }));
  };

  // Update Global Styles
  const updateStyle = (updates: Partial<StyleSettings>) => {
    setStyleSettings(prev => ({ ...prev, ...updates }));
  };

  const toggleStyleList = (listKey: 'artStyles' | 'effects', item: string) => {
    setStyleSettings(prev => {
      const list = prev[listKey];
      const hasItem = list.includes(item);
      return { 
        ...prev, 
        [listKey]: hasItem ? list.filter(i => i !== item) : [...list, item] 
      };
    });
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // --- MASTER PROMPT GENERATOR ---
  useEffect(() => {
    let parts: string[] = [];

    // 1. Main Concept
    if (mainPrompt.trim()) parts.push(mainPrompt.trim());

    // 2. Subject Descriptions
    const subjectTexts = subjects.map(sub => {
      const hasContent = sub.name || sub.age || sub.action || sub.clothing.length > 0 || sub.customClothing;
      if (!hasContent) return '';
      
      let sentence = sub.name ? sub.name : 'Subject'; 
      if (sub.age) sentence += ` in their ${sub.age}`;
      
      const allClothing = [...sub.clothing];
      if (sub.customClothing.trim()) allClothing.push(sub.customClothing.trim());
      if (allClothing.length > 0) sentence += ` wearing ${allClothing.join(" and ")}`;
      
      if (sub.action) sentence += `, ${sub.action}`;
      return sentence;
    }).filter(s => s !== '');

    if (subjectTexts.length > 0) parts.push(subjectTexts.join(". ") + ".");

    // 3. Global Atmosphere & Style
    let styles: string[] = [];
    
    // Environment
    if (styleSettings.environment) styles.push(`set in ${styleSettings.environment}`);
    
    // Lighting
    if (styleSettings.lighting) styles.push(`${styleSettings.lighting} lighting`);
    
    // Shot & Angle
    if (styleSettings.shotType) styles.push(styleSettings.shotType);
    if (styleSettings.cameraAngle) styles.push(styleSettings.cameraAngle);
    
    // Art Styles (Array + Custom)
    const allArtStyles = [...styleSettings.artStyles];
    if (styleSettings.customArtStyle) allArtStyles.push(styleSettings.customArtStyle);
    if (allArtStyles.length > 0) styles.push(`${allArtStyles.join(", ")} style`);

    // Quality
    if (styleSettings.quality) styles.push(styleSettings.quality);

    // Effects (Array + Custom)
    const allEffects = [...styleSettings.effects];
    if (styleSettings.customEffect) allEffects.push(styleSettings.customEffect);
    if (allEffects.length > 0) styles.push(allEffects.join(", "));

    if (styles.length > 0) parts.push(styles.join(", ") + ".");

    // 4. Midjourney Parameters
    if (settings.tool === 'midjourney') {
      let mjParams: string[] = [];
      if (settings.model === 'niji') mjParams.push('--niji');
      else if (settings.model === 'v7') mjParams.push('--v 7');
      else if (settings.model === 'v6') mjParams.push('--v 6');

      if (settings.aspectRatio === 'custom' && settings.customAR) mjParams.push(`--ar ${settings.customAR}`);
      else if (settings.aspectRatio !== 'custom') mjParams.push(`--ar ${settings.aspectRatio}`);

      if (settings.chaos > 0) mjParams.push(`--c ${settings.chaos}`);
      if (settings.stylize > 0) mjParams.push(`--s ${settings.stylize}`);
      if (settings.weird > 0) mjParams.push(`--w ${settings.weird}`);
      if (settings.repeat > 1) mjParams.push(`--r ${settings.repeat}`);
      if (settings.tile) mjParams.push('--tile');

      if (mjParams.length > 0) parts.push(mjParams.join(" "));
    }

    setGeneratedString(parts.join(" "));
  }, [settings, mainPrompt, subjects, styleSettings]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    setSettings({ tool: 'midjourney', model: 'v7', aspectRatio: '1:1', customAR: '', chaos: 0, stylize: 0, repeat: 1, tile: false, weird: 0 });
    setSubjects([{ id: 1, name: '', age: '', isCustomAge: false, action: '', isCustomAction: false, clothing: [], customClothing: '', isCustomClothing: false }]);
    setStyleSettings({ artStyles: [], customArtStyle: '', isCustomArtStyle: false, quality: '', isCustomQuality: false, shotType: '', isCustomShotType: false, environment: '', isCustomEnvironment: false, lighting: '', isCustomLighting: false, cameraAngle: '', isCustomCameraAngle: false, effects: [], customEffect: '', isCustomEffect: false });
    setSubjectCount(1);
    setMainPrompt("");
    setGeneratedString("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col items-center">
      
      <div className="w-full max-w-5xl px-6 py-12 space-y-10 pb-40 flex flex-col items-center">
        
        {/* Header */}
        <header className="text-center space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            ImageAI Prompt Builder
          </h1>
          <p className="text-slate-400 text-lg">Craft the basic prompt parameters. Paste to Gemini and use the gem called "ImageAI Prompt Optimizer" to further improve it.</p>
        </header>

        {/* Main Input */}
        <div className="space-y-3 w-full">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-1">Main Concept</label>
          <textarea
            value={mainPrompt}
            onChange={(e) => setMainPrompt(e.target.value)}
            placeholder="E.g. A cyberpunk city skyline at night..."
            className="w-full h-32 bg-slate-900/80 border border-slate-700 rounded-xl p-5 text-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all shadow-inner"
          />
        </div>

        {/* Controls Container */}
        <div className="w-full space-y-4">
          
          <Accordion 
            title="Tool" 
            info="Choose which AI tool you want to use."
            preview={settings.tool === 'midjourney' ? 'Midjourney' : 'ChatGPT'}
          >
            <div className="flex flex-wrap gap-3">
              <Pill label="Midjourney" selected={settings.tool === 'midjourney'} onClick={() => updateSetting('tool', 'midjourney')} />
              <Pill label="ChatGPT / Gemini" selected={settings.tool === 'chatgpt'} onClick={() => updateSetting('tool', 'chatgpt')} />
            </div>
          </Accordion>

          {/* MIDJOURNEY PARAMS */}
          <Accordion 
            title="Midjourney Parameters" 
            info="Advanced settings specific to Midjourney generation."
          >
            {settings.tool !== 'midjourney' ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-500 space-y-2">
                <Info size={32} className="opacity-50" />
                <p className="font-medium">Choose Midjourney as the tool to modify these</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Accordion title="Model" info="Choose which Midjourney model version to use." preview={settings.model}>
                  <div className="flex flex-wrap gap-3">
                    <Pill label="Latest" selected={settings.model === 'v7'} onClick={() => updateSetting('model', 'v7')} />
                    <Pill label="Legacy" selected={settings.model === 'v6'} onClick={() => updateSetting('model', 'v6')} />
                    <Pill label="Niji (Anime/manga)" selected={settings.model === 'niji'} onClick={() => updateSetting('model', 'niji')} />
                  </div>
                </Accordion>

                <Accordion title="Aspect Ratio" info="Choose what width-to-height aspect ratio you want the images to be in." preview={settings.aspectRatio === 'custom' ? settings.customAR : settings.aspectRatio}>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {['1:1', '4:5', '3:4', '9:16', '16:9'].map((ratio) => (
                      <Pill key={ratio} label={ratio} selected={settings.aspectRatio === ratio} onClick={() => updateSetting('aspectRatio', ratio)} />
                    ))}
                    <Pill label="Custom" selected={settings.aspectRatio === 'custom'} onClick={() => updateSetting('aspectRatio', 'custom')} />
                  </div>
                  {settings.aspectRatio === 'custom' && (
                    <div className="animate-in fade-in slide-in-from-top-2 bg-slate-900 p-4 rounded-lg border border-slate-700">
                      <label className="text-xs text-slate-400 mb-2 block uppercase font-bold">Custom Ratio</label>
                      <input type="text" value={settings.customAR} onChange={(e) => updateSetting('customAR', e.target.value)} placeholder="e.g. 21:9" className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-full focus:border-blue-500 outline-none" />
                    </div>
                  )}
                </Accordion>

                <Accordion title={`Chaos`} info="0-100. Add more variety to your image results." preview={settings.chaos > 0 ? settings.chaos.toString() : ''}>
                  <div className="px-2">
                      <input type="range" min="0" max="100" value={settings.chaos} onChange={(e) => updateSetting('chaos', parseInt(e.target.value))} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400" />
                      <div className="flex justify-between text-xs text-slate-400 mt-3 font-mono"><span>0 (Reliable)</span><span>100 (Chaotic)</span></div>
                  </div>
                </Accordion>

                <Accordion title={`Stylize`} info="0-1000. Changes how much artistic creativity is applied." preview={settings.stylize > 0 ? settings.stylize.toString() : ''}>
                  <div className="px-2">
                      <input type="range" min="0" max="1000" value={settings.stylize} onChange={(e) => updateSetting('stylize', parseInt(e.target.value))} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400" />
                      <div className="flex justify-between text-xs text-slate-400 mt-3 font-mono"><span>0 (Strict)</span><span>1000 (Artistic)</span></div>
                  </div>
                </Accordion>

                <Accordion title={`Weird`} info="0-3000. Make your images quirky and unconventional." preview={settings.weird > 0 ? settings.weird.toString() : ''}>
                  <div className="px-2">
                      <input type="range" min="0" max="3000" step="10" value={settings.weird} onChange={(e) => updateSetting('weird', parseInt(e.target.value))} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400" />
                      <div className="flex justify-between text-xs text-slate-400 mt-3 font-mono"><span>0</span><span>3000 (Very Weird)</span></div>
                  </div>
                </Accordion>

                <Accordion title={`Repeat`} info="Run the prompt multiple times." preview={settings.repeat > 1 ? `${settings.repeat} times` : ''}>
                  <div className="flex items-center gap-4">
                    <input type="number" min="1" max="10" value={settings.repeat} onChange={(e) => { let val = parseInt(e.target.value); if(val > 10) val = 10; if(val < 1) val = 1; updateSetting('repeat', val); }} className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-24 text-center focus:border-blue-500 outline-none font-mono text-lg" />
                    <span className="text-slate-400 font-medium">Times</span>
                  </div>
                </Accordion>

                <Accordion title="Tile" info="Create seamless patterns, like wallpaper." preview={settings.tile ? 'Active' : ''}>
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
          </Accordion>

           {/* --- SUBJECT BUILDER --- */}
           <div className="pt-4 pb-2 border-t border-slate-800">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-200">Subject Details</h2>
                    <div className="group relative flex items-center">
                        <Info size={16} className="text-slate-500 hover:text-blue-400 transition-colors cursor-help" />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-48 bg-slate-950 text-xs text-slate-300 p-2 rounded border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-xl">
                        Define your subject(s) in the image
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
                   {[1, 2, 3].map(num => (
                     <button
                       key={num}
                       onClick={() => setSubjectCount(num as 1 | 2 | 3)}
                       className={`px-3 py-1 text-xs font-bold rounded transition-colors ${subjectCount === num ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                     >
                       {num} Subject{num > 1 ? 's' : ''}
                     </button>
                   ))}
                </div>
             </div>
             
             {subjects.map((subject) => (
               <div key={subject.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8">
                 {/* Header for Subject */}
                 <div className="flex items-center gap-3 mb-3 pl-1">
                    <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center border border-purple-500/30 text-purple-300 font-bold text-sm">
                        {subject.id}
                    </div>
                    <span className="text-purple-300 font-semibold tracking-wide uppercase text-sm">Subject {subject.id}</span>
                 </div>

                 {/* Subject Name */}
                 <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4 mb-4">
                    <label className="text-xs text-slate-500 uppercase font-bold mb-2 block">Who is this subject?</label>
                    <input 
                      type="text" 
                      placeholder="e.g. A futuristic samurai / An orange tabby cat"
                      value={subject.name}
                      onChange={(e) => updateSubject(subject.id, { name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                    />
                 </div>

                 <div className="space-y-3">
                    <Accordion title="Age" info="Approximate age of the subject." preview={subject.age}>
                      <div className="flex flex-wrap gap-2 mb-2">
                         {AGES.map(age => (
                           <Pill key={age} label={age} selected={subject.age === age && !subject.isCustomAge} onClick={() => updateSubject(subject.id, { age: age, isCustomAge: false })} />
                         ))}
                         <Pill label="Custom" selected={subject.isCustomAge} onClick={() => updateSubject(subject.id, { isCustomAge: !subject.isCustomAge })} />
                      </div>
                      {subject.isCustomAge && (
                        <input type="text" value={subject.age} onChange={(e) => updateSubject(subject.id, { age: e.target.value })} placeholder="e.g. toddler / ancient" className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-full focus:border-purple-500 outline-none mt-2" />
                      )}
                    </Accordion>

                    <Accordion title="Clothing / Attire" info="What is the subject wearing?" preview={[...subject.clothing, subject.customClothing].filter(Boolean).join(', ')}>
                      <div className="flex flex-wrap gap-2 mb-2">
                         {CLOTHING.map(item => (
                           <Pill key={item} label={item} selected={subject.clothing.includes(item)} onClick={() => toggleSubjectList(subject.id, 'clothing', item)} />
                         ))}
                         <Pill label="Custom" selected={subject.isCustomClothing} onClick={() => updateSubject(subject.id, { isCustomClothing: !subject.isCustomClothing })} />
                      </div>
                      {subject.isCustomClothing && (
                        <input type="text" value={subject.customClothing} onChange={(e) => updateSubject(subject.id, { customClothing: e.target.value })} placeholder="e.g. Red Scarf" className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-full focus:border-purple-500 outline-none mt-2" />
                      )}
                    </Accordion>

                    <Accordion title="Action / Pose" info="What is the subject doing?" preview={subject.action}>
                      <div className="flex flex-wrap gap-2 mb-2">
                         {ACTIONS.map(action => (
                           <Pill key={action} label={action} selected={subject.action === action && !subject.isCustomAction} onClick={() => updateSubject(subject.id, { action: action, isCustomAction: false })} />
                         ))}
                         <Pill label="Custom" selected={subject.isCustomAction} onClick={() => updateSubject(subject.id, { isCustomAction: !subject.isCustomAction })} />
                      </div>
                      {subject.isCustomAction && (
                        <input type="text" value={subject.action} onChange={(e) => updateSubject(subject.id, { action: e.target.value })} placeholder="e.g. Dancing" className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-full focus:border-purple-500 outline-none mt-2" />
                      )}
                    </Accordion>
                 </div>
               </div>
             ))}
          </div>

          {/* --- NEW: GLOBAL ATMOSPHERE & STYLE --- */}
          <div className="pt-4 pb-2 border-t border-slate-800">
            <h2 className="text-xl font-bold text-slate-200 mb-6">Global Atmosphere & Style</h2>
            <div className="space-y-3">
              
              {/* STYLE (Multi) */}
              <Accordion title="Art Style" icon={<Palette size={18} />} info="Visual aesthetic (Select multiple)." preview={[...styleSettings.artStyles, styleSettings.customArtStyle].filter(Boolean).join(', ')}>
                <div className="flex flex-wrap gap-2 mb-2">
                  {ART_STYLES.map(s => <Pill key={s} label={s} selected={styleSettings.artStyles.includes(s)} onClick={() => toggleStyleList('artStyles', s)} />)}
                  <Pill label="Custom" selected={styleSettings.isCustomArtStyle} onClick={() => updateStyle({ isCustomArtStyle: !styleSettings.isCustomArtStyle })} />
                </div>
                {styleSettings.isCustomArtStyle && <input type="text" value={styleSettings.customArtStyle} onChange={(e) => updateStyle({ customArtStyle: e.target.value })} placeholder="e.g. Bauhaus, Ukiyo-e" className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-full focus:border-purple-500 outline-none mt-2" />}
              </Accordion>

              {/* ENVIRONMENT (Single) */}
              <Accordion title="Environment" icon={<Mountain size={18} />} info="Where is the scene taking place?" preview={styleSettings.environment}>
                <div className="flex flex-wrap gap-2 mb-2">
                  {ENVIRONMENTS.map(e => <Pill key={e} label={e} selected={styleSettings.environment === e && !styleSettings.isCustomEnvironment} onClick={() => updateStyle({ environment: e, isCustomEnvironment: false })} />)}
                  <Pill label="Custom" selected={styleSettings.isCustomEnvironment} onClick={() => updateStyle({ isCustomEnvironment: !styleSettings.isCustomEnvironment })} />
                </div>
                {styleSettings.isCustomEnvironment && <input type="text" value={styleSettings.environment} onChange={(e) => updateStyle({ environment: e.target.value })} placeholder="e.g. Inside a volcano" className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-full focus:border-purple-500 outline-none mt-2" />}
              </Accordion>

              {/* LIGHTING (Single) */}
              <Accordion title="Lighting" icon={<Zap size={18} />} info="Lighting conditions." preview={styleSettings.lighting}>
                <div className="flex flex-wrap gap-2 mb-2">
                  {LIGHTING.map(l => <Pill key={l} label={l} selected={styleSettings.lighting === l && !styleSettings.isCustomLighting} onClick={() => updateStyle({ lighting: l, isCustomLighting: false })} />)}
                  <Pill label="Custom" selected={styleSettings.isCustomLighting} onClick={() => updateStyle({ isCustomLighting: !styleSettings.isCustomLighting })} />
                </div>
                {styleSettings.isCustomLighting && <input type="text" value={styleSettings.lighting} onChange={(e) => updateStyle({ lighting: e.target.value })} placeholder="e.g. Bioluminescent glow" className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-full focus:border-purple-500 outline-none mt-2" />}
              </Accordion>

              {/* CAMERA ANGLE (Single) */}
              <Accordion title="Camera Angle" icon={<Eye size={18} />} info="Perspective of the shot." preview={styleSettings.cameraAngle}>
                <div className="flex flex-wrap gap-2 mb-2">
                  {CAMERA_ANGLES.map(c => <Pill key={c} label={c} selected={styleSettings.cameraAngle === c && !styleSettings.isCustomCameraAngle} onClick={() => updateStyle({ cameraAngle: c, isCustomCameraAngle: false })} />)}
                  <Pill label="Custom" selected={styleSettings.isCustomCameraAngle} onClick={() => updateStyle({ isCustomCameraAngle: !styleSettings.isCustomCameraAngle })} />
                </div>
                {styleSettings.isCustomCameraAngle && <input type="text" value={styleSettings.cameraAngle} onChange={(e) => updateStyle({ cameraAngle: e.target.value })} placeholder="e.g. GoPro footage" className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-full focus:border-purple-500 outline-none mt-2" />}
              </Accordion>

               {/* SHOT TYPE (Single) */}
               <Accordion title="Shot Type" icon={<Camera size={18} />} info="Framing of the subject." preview={styleSettings.shotType}>
                <div className="flex flex-wrap gap-2 mb-2">
                  {SHOT_TYPES.map(s => <Pill key={s} label={s} selected={styleSettings.shotType === s && !styleSettings.isCustomShotType} onClick={() => updateStyle({ shotType: s, isCustomShotType: false })} />)}
                  <Pill label="Custom" selected={styleSettings.isCustomShotType} onClick={() => updateStyle({ isCustomShotType: !styleSettings.isCustomShotType })} />
                </div>
                {styleSettings.isCustomShotType && <input type="text" value={styleSettings.shotType} onChange={(e) => updateStyle({ shotType: e.target.value })} placeholder="e.g. Selfie" className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-full focus:border-purple-500 outline-none mt-2" />}
              </Accordion>

              {/* QUALITY (Single) */}
              <Accordion title="Quality" icon={<Sparkles size={18} />} info="Resolution and finish." preview={styleSettings.quality}>
                <div className="flex flex-wrap gap-2 mb-2">
                  {QUALITY.map(q => <Pill key={q} label={q} selected={styleSettings.quality === q && !styleSettings.isCustomQuality} onClick={() => updateStyle({ quality: q, isCustomQuality: false })} />)}
                  <Pill label="Custom" selected={styleSettings.isCustomQuality} onClick={() => updateStyle({ isCustomQuality: !styleSettings.isCustomQuality })} />
                </div>
                {styleSettings.isCustomQuality && <input type="text" value={styleSettings.quality} onChange={(e) => updateStyle({ quality: e.target.value })} placeholder="e.g. 8k resolution" className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-full focus:border-purple-500 outline-none mt-2" />}
              </Accordion>

              {/* EFFECTS (Multi) */}
              <Accordion title="Effects" icon={<Wand2 size={18} />} info="Post-processing effects (Select multiple)." preview={[...styleSettings.effects, styleSettings.customEffect].filter(Boolean).join(', ')}>
                <div className="flex flex-wrap gap-2 mb-2">
                  {EFFECTS.map(ef => <Pill key={ef} label={ef} selected={styleSettings.effects.includes(ef)} onClick={() => toggleStyleList('effects', ef)} />)}
                  <Pill label="Custom" selected={styleSettings.isCustomEffect} onClick={() => updateStyle({ isCustomEffect: !styleSettings.isCustomEffect })} />
                </div>
                {styleSettings.isCustomEffect && <input type="text" value={styleSettings.customEffect} onChange={(e) => updateStyle({ customEffect: e.target.value })} placeholder="e.g. Chromatic aberration" className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-full focus:border-purple-500 outline-none mt-2" />}
              </Accordion>
            </div>
          </div>



        </div>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 p-6 z-50 shadow-2xl">
        <div className="max-w-5xl mx-auto flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">Raw Prompt to paste into Gemini</span>
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