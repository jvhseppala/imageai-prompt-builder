import React, { useState, useEffect, ReactNode } from 'react';
import { Info, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

// --- TYPES ---
interface PillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

interface AccordionProps {
  title: string;
  info: string;
  children: ReactNode;
  disabled?: boolean;
  preview?: string;
}

// Updated Subject Interface
interface Subject {
  id: number;
  name: string;
  
  age: string;
  isCustomAge: boolean; // Toggle for custom input
  
  action: string;
  isCustomAction: boolean; // Toggle for custom input
  
  clothing: string[]; 
  customClothing: string; // Separate field for custom text
  isCustomClothing: boolean; // Toggle for custom input
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
const ACTIONS = [
  'Standing relaxed', 'Walking forward', 'Sitting on chair', 'Running', 
  'Leaning against wall', 'Crossed arms', 'Looking over shoulder', 
  'Floating', 'Fighting stance', 'Lying down', 'Jumping'
];

const CLOTHING = [
  'Casual T-shirt', 'Jeans', 'Suit', 'Hoodie', 'Joggers', 
  'Leather Jacket', 'Summer Dress', 'Cyberpunk Armor', 'Space Suit', 
  'Swimwear', 'Robes', 'Uniform', 'Trench coat'
];

const AGES = [
  '20s', '30s', '40s', '50s', '60s'
];

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

const Accordion: React.FC<AccordionProps> = ({ title, info, children, disabled = false, preview = '' }) => {
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
        {/* FIX: Removed 'overflow-hidden' from this container so the tooltip isn't clipped */}
        <div className="flex items-center gap-3 min-w-0"> 
          
          {/* FIX: Added 'truncate' here instead, so only the text gets cut off if too long */}
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

  // New Subject State
  const [subjectCount, setSubjectCount] = useState<1 | 2 | 3>(1);
  const [subjects, setSubjects] = useState<Subject[]>([
    { 
      id: 1, name: '', 
      age: '', isCustomAge: false,
      action: '', isCustomAction: false,
      clothing: [], customClothing: '', isCustomClothing: false 
    }
  ]);

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

  // Handle Subject Count Change
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
      if (sub.id === id) {
        return { ...sub, ...updates };
      }
      return sub;
    }));
  };

  const toggleClothing = (id: number, item: string) => {
    setSubjects(prev => prev.map(sub => {
      if (sub.id === id) {
        const hasItem = sub.clothing.includes(item);
        return {
          ...sub,
          clothing: hasItem 
            ? sub.clothing.filter(c => c !== item) 
            : [...sub.clothing, item]
        };
      }
      return sub;
    }));
  };

  // --- MASTER PROMPT GENERATOR ---
  useEffect(() => {
    let parts: string[] = [];

    // 1. Main Concept
    if (mainPrompt.trim()) parts.push(mainPrompt.trim());

    // 2. Subject Descriptions
    const subjectTexts = subjects.map(sub => {
      // Check if subject has any content
      const hasContent = sub.name || sub.age || sub.action || sub.clothing.length > 0 || sub.customClothing;
      if (!hasContent) return '';
      
      let sentence = sub.name ? sub.name : 'Subject'; 
      
      // Age
      if (sub.age) sentence += ` in their ${sub.age}`;
      
      // Clothing (Combine Predefined + Custom)
      const allClothing = [...sub.clothing];
      if (sub.customClothing.trim()) allClothing.push(sub.customClothing.trim());
      
      if (allClothing.length > 0) {
        const clothes = allClothing.join(" and ");
        sentence += ` wearing ${clothes}`;
      }
      
      // Action
      if (sub.action) {
        sentence += `, ${sub.action}`;
      }
      
      return sentence;
    }).filter(s => s !== '');

    if (subjectTexts.length > 0) {
      parts.push(subjectTexts.join(". ") + ".");
    }

    // 3. Midjourney Parameters
    if (settings.tool === 'midjourney') {
      let mjParams: string[] = [];
      
      if (settings.model === 'niji') mjParams.push('--niji');
      else if (settings.model === 'v7') mjParams.push('--v 7');
      else if (settings.model === 'v6') mjParams.push('--v 6');

      if (settings.aspectRatio === 'custom' && settings.customAR) {
        mjParams.push(`--ar ${settings.customAR}`);
      } else if (settings.aspectRatio !== 'custom') {
        mjParams.push(`--ar ${settings.aspectRatio}`);
      }

      if (settings.chaos > 0) mjParams.push(`--c ${settings.chaos}`);
      if (settings.stylize > 0) mjParams.push(`--s ${settings.stylize}`);
      if (settings.weird > 0) mjParams.push(`--weird ${settings.weird}`);
      if (settings.repeat > 1) mjParams.push(`--r ${settings.repeat}`);
      if (settings.tile) mjParams.push('--tile');

      if (mjParams.length > 0) {
        parts.push(mjParams.join(" "));
      }
    }

    setGeneratedString(parts.join(" "));
  }, [settings, mainPrompt, subjects]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    setSettings({
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
    setSubjects([{ 
      id: 1, name: '', 
      age: '', isCustomAge: false,
      action: '', isCustomAction: false,
      clothing: [], customClothing: '', isCustomClothing: false 
    }]);
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
            BouAI Image Prompt Builder
          </h1>
          <p className="text-slate-400 text-lg">Craft the basic prompt parameters. Paste to Gemini and use the gem called "xyz" to further improve it</p>
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
                <Accordion 
                    title="Model" 
                    info="Choose which Midjourney model version to use."
                    preview={settings.model}
                >
                  <div className="flex flex-wrap gap-3">
                    <Pill label="Latest" selected={settings.model === 'v7'} onClick={() => updateSetting('model', 'v7')} />
                    <Pill label="Legacy" selected={settings.model === 'v6'} onClick={() => updateSetting('model', 'v6')} />
                    <Pill label="Niji (Anime/manga)" selected={settings.model === 'niji'} onClick={() => updateSetting('model', 'niji')} />
                  </div>
                </Accordion>

                <Accordion 
                    title="Aspect Ratio" 
                    info="Choose what width-to-height aspect ratio you want the images to be in."
                    preview={settings.aspectRatio === 'custom' ? settings.customAR : settings.aspectRatio}
                >
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

                <Accordion 
                    title={`Chaos`} 
                    info="0-100. Add more variety to your image results."
                    preview={settings.chaos > 0 ? settings.chaos.toString() : ''}
                >
                  <div className="px-2">
                      <input type="range" min="0" max="100" value={settings.chaos} onChange={(e) => updateSetting('chaos', parseInt(e.target.value))} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400" />
                      <div className="flex justify-between text-xs text-slate-400 mt-3 font-mono"><span>0 (Reliable)</span><span>100 (Chaotic)</span></div>
                  </div>
                </Accordion>

                <Accordion 
                    title={`Stylize`} 
                    info="0-1000. Changes how much artistic creativity is applied."
                    preview={settings.stylize > 0 ? settings.stylize.toString() : ''}
                >
                  <div className="px-2">
                      <input type="range" min="0" max="1000" value={settings.stylize} onChange={(e) => updateSetting('stylize', parseInt(e.target.value))} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400" />
                      <div className="flex justify-between text-xs text-slate-400 mt-3 font-mono"><span>0 (Strict)</span><span>1000 (Artistic)</span></div>
                  </div>
                </Accordion>

                <Accordion 
                    title={`Weird`} 
                    info="0-3000. Make your images quirky and unconventional."
                    preview={settings.weird > 0 ? settings.weird.toString() : ''}
                >
                  <div className="px-2">
                      <input type="range" min="0" max="3000" step="10" value={settings.weird} onChange={(e) => updateSetting('weird', parseInt(e.target.value))} className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400" />
                      <div className="flex justify-between text-xs text-slate-400 mt-3 font-mono"><span>0</span><span>3000 (Very Weird)</span></div>
                  </div>
                </Accordion>

                <Accordion 
                    title={`Repeat`} 
                    info="Run the prompt multiple times."
                    preview={settings.repeat > 1 ? `${settings.repeat} times` : ''}
                >
                  <div className="flex items-center gap-4">
                    <input type="number" min="1" max="10" value={settings.repeat} onChange={(e) => { let val = parseInt(e.target.value); if(val > 10) val = 10; if(val < 1) val = 1; updateSetting('repeat', val); }} className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-24 text-center focus:border-blue-500 outline-none font-mono text-lg" />
                    <span className="text-slate-400 font-medium">Times</span>
                  </div>
                </Accordion>

                <Accordion 
                    title="Tile" 
                    info="Create seamless patterns, like wallpaper."
                    preview={settings.tile ? 'Active' : ''}
                >
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

          {/* SUBJECT BUILDER */}
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
             
             {/* LOOP THROUGH SUBJECTS */}
             {subjects.map((subject, index) => (
               <div key={subject.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8">
                 {/* Visual Header for Subject */}
                 <div className="flex items-center gap-3 mb-3 pl-1">
                    <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center border border-purple-500/30 text-purple-300 font-bold text-sm">
                        {subject.id}
                    </div>
                    <span className="text-purple-300 font-semibold tracking-wide uppercase text-sm">Subject {subject.id}</span>
                 </div>

                 {/* Subject Name Input */}
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

                 {/* Grouped Accordions for Subject */}
                 <div className="space-y-3">
                    
                    {/* AGE */}
                    <Accordion 
                        title="Age" 
                        info="Approximate age of the subject."
                        preview={subject.age}
                    >
                      <div className="flex flex-wrap gap-2 mb-2">
                         {AGES.map(age => (
                           <Pill 
                             key={age} label={age} 
                             selected={subject.age === age && !subject.isCustomAge} 
                             onClick={() => updateSubject(subject.id, { age: age, isCustomAge: false })} 
                           />
                         ))}
                         <Pill 
                            label="Custom" 
                            selected={subject.isCustomAge} 
                            onClick={() => updateSubject(subject.id, { isCustomAge: !subject.isCustomAge })} 
                         />
                      </div>
                      {/* Custom Age Input */}
                      {subject.isCustomAge && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <input 
                              type="text" 
                              value={subject.age}
                              onChange={(e) => updateSubject(subject.id, { age: e.target.value })}
                              placeholder="e.g. toddler / ancient / 25 years old"
                              className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-full focus:border-purple-500 outline-none mt-2"
                            />
                        </div>
                      )}
                    </Accordion>

                    {/* CLOTHING (Multi-select + Custom) */}
                    <Accordion 
                        title="Clothing / Attire" 
                        info="What is the subject wearing? (Select multiple)"
                        // Preview combines array + custom string
                        preview={[...subject.clothing, subject.customClothing].filter(Boolean).join(', ')}
                    >
                      <div className="flex flex-wrap gap-2 mb-2">
                         {CLOTHING.map(item => (
                           <Pill 
                             key={item} label={item} 
                             selected={subject.clothing.includes(item)} 
                             onClick={() => toggleClothing(subject.id, item)} 
                           />
                         ))}
                         <Pill 
                            label="Custom" 
                            selected={subject.isCustomClothing} 
                            onClick={() => updateSubject(subject.id, { isCustomClothing: !subject.isCustomClothing })} 
                         />
                      </div>
                      {/* Custom Clothing Input */}
                      {subject.isCustomClothing && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs text-slate-500 mb-1 block mt-2">Add more items (comma separated)</label>
                            <input 
                              type="text" 
                              value={subject.customClothing}
                              onChange={(e) => updateSubject(subject.id, { customClothing: e.target.value })}
                              placeholder="e.g. Red Scarf, Gold Chain"
                              className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-full focus:border-purple-500 outline-none"
                            />
                        </div>
                      )}
                    </Accordion>

                    {/* ACTION */}
                    <Accordion 
                        title="Action / Pose" 
                        info="What is the subject doing?"
                        preview={subject.action}
                    >
                      <div className="flex flex-wrap gap-2 mb-2">
                         {ACTIONS.map(action => (
                           <Pill 
                             key={action} label={action} 
                             selected={subject.action === action && !subject.isCustomAction} 
                             onClick={() => updateSubject(subject.id, { action: action, isCustomAction: false })} 
                           />
                         ))}
                         <Pill 
                            label="Custom" 
                            selected={subject.isCustomAction} 
                            onClick={() => updateSubject(subject.id, { isCustomAction: !subject.isCustomAction })} 
                         />
                      </div>
                      {/* Custom Action Input */}
                      {subject.isCustomAction && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <input 
                              type="text" 
                              value={subject.action}
                              onChange={(e) => updateSubject(subject.id, { action: e.target.value })}
                              placeholder="e.g. Dancing in the rain"
                              className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-full focus:border-purple-500 outline-none mt-2"
                            />
                        </div>
                      )}
                    </Accordion>
                 </div>
               </div>
             ))}
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