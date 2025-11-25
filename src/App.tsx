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

const Accordion: React.FC<AccordionProps> = ({ title, info, children, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    if (disabled) setIsOpen(false);
  }, [disabled]);

  return (
    // CHANGE 1: Removed 'overflow-hidden' so the tooltip can "escape" the box
    // CHANGE 2: Added 'relative' context
    <div className={`border border-slate-700 rounded-xl mb-4 bg-slate-800/40 w-full relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        // CHANGE 3: Logic for rounded corners. 
        // If closed -> Round ALL corners. 
        // If open -> Round only TOP corners (so it connects to the content).
        className={`w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/60 transition-colors ${isOpen ? 'rounded-t-xl' : 'rounded-xl'}`}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-lg text-slate-100">{title}</span>
          
          {/* Tooltip Group */}
          <div className="group relative flex items-center">
            <Info size={18} className="text-slate-500 hover:text-blue-400 transition-colors cursor-help" />
            
            {/* Tooltip Content */}
            {/* CHANGE 4: Added z-50 to ensure it sits on top of other accordions */}
            {/* CHANGE 5: Changed positioning to 'bottom-full mb-2' for better alignment */}
            <div className="absolute left-0 bottom-full mb-2 w-72 bg-slate-950 text-xs text-slate-300 p-3 rounded-lg border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50">
              {info}
            </div>
          </div>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-slate-400"/> : <ChevronDown size={20} className="text-slate-400"/>}
      </button>
      
      {isOpen && (
        // CHANGE 6: Added 'rounded-b-xl' to match the bottom corners
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

  useEffect(() => {
    let params: string[] = [];
    let fullPrompt = mainPrompt.trim();

    if (settings.tool === 'midjourney') {
      if (settings.model === 'niji') params.push('--niji');
      else if (settings.model === 'v7') params.push('--v 7');
      else if (settings.model === 'v6') params.push('--v 6');

      if (settings.aspectRatio === 'custom' && settings.customAR) {
        params.push(`--ar ${settings.customAR}`);
      } else if (settings.aspectRatio !== 'custom') {
        params.push(`--ar ${settings.aspectRatio}`);
      }

      if (settings.chaos > 0) params.push(`--c ${settings.chaos}`);
      if (settings.stylize > 0) params.push(`--s ${settings.stylize}`);
      if (settings.weird > 0) params.push(`--weird ${settings.weird}`);
      if (settings.repeat > 1) params.push(`--r ${settings.repeat}`);
      if (settings.tile) params.push('--tile');

      if (params.length > 0) {
        fullPrompt += " " + params.join(" ");
      }
    }
    setGeneratedString(fullPrompt);
  }, [settings, mainPrompt]);

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
    setMainPrompt("");
    setGeneratedString("");
  };

  return (
    // FIX 1: Flex col + items-center on the outer container forces horizontal centering
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col items-center">
      
      {/* FIX 2: max-w-5xl keeps it constrained, w-full fills that constraint */}
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
            placeholder="E.g. A cyberpunk cat eating noodles in Tokyo..."
            className="w-full h-40 bg-slate-900/80 border border-slate-700 rounded-xl p-5 text-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all shadow-inner"
          />
        </div>

        {/* Controls Container - Ensure w-full here */}
        <div className="w-full space-y-4">
          
          <Accordion 
            title="Tool" 
            info="Choose which AI tool you want to use."
          >
            <div className="flex flex-wrap gap-3">
              <Pill label="Midjourney" selected={settings.tool === 'midjourney'} onClick={() => updateSetting('tool', 'midjourney')} />
              <Pill label="ChatGPT / Gemini" selected={settings.tool === 'chatgpt'} onClick={() => updateSetting('tool', 'chatgpt')} />
            </div>
          </Accordion>

          <Accordion 
            title="Model" 
            info="Choose which Midjourney model version to use."
            disabled={settings.tool !== 'midjourney'}
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
            disabled={settings.tool !== 'midjourney'}
          >
            <div className="flex flex-wrap gap-3 mb-6">
              {['1:1', '4:5', '3:4', '9:16', '16:9'].map((ratio) => (
                <Pill 
                  key={ratio} 
                  label={ratio} 
                  selected={settings.aspectRatio === ratio} 
                  onClick={() => updateSetting('aspectRatio', ratio)} 
                />
              ))}
              <Pill 
                label="Custom" 
                selected={settings.aspectRatio === 'custom'} 
                onClick={() => updateSetting('aspectRatio', 'custom')} 
              />
            </div>
            
            {settings.aspectRatio === 'custom' && (
              <div className="animate-in fade-in slide-in-from-top-2 bg-slate-900 p-4 rounded-lg border border-slate-700">
                <label className="text-xs text-slate-400 mb-2 block uppercase font-bold">Custom Ratio</label>
                <input 
                  type="text" 
                  value={settings.customAR}
                  onChange={(e) => updateSetting('customAR', e.target.value)}
                  placeholder="e.g. 21:9"
                  className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-full focus:border-blue-500 outline-none"
                />
              </div>
            )}
          </Accordion>

          <Accordion 
            title={`Chaos`} 
            info="0-100. Add more variety to your image results. If you want each image to look more different, increase the chaos value. "
            disabled={settings.tool !== 'midjourney'}
          >
            <div className="px-2">
                <input 
                type="range" min="0" max="100" value={settings.chaos}
                onChange={(e) => updateSetting('chaos', parseInt(e.target.value))}
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-3 font-mono">
                <span>0 (Reliable)</span>
                <span>100 (Chaotic)</span>
                </div>
            </div>
          </Accordion>

          <Accordion 
            title={`Stylize`} 
            info="0-1000. Changes how much artistic creativity is applied to your image. With a low value, it follows your prompt very closely. With a higher value, it's giving Midjourney more freedom  to interpret your idea (can stray from the exact details of your prompt)."
            disabled={settings.tool !== 'midjourney'}
          >
            <div className="px-2">
                <input 
                type="range" min="0" max="1000" value={settings.stylize}
                onChange={(e) => updateSetting('stylize', parseInt(e.target.value))}
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-3 font-mono">
                <span>0 (Strict)</span>
                <span>1000 (Artistic)</span>
                </div>
            </div>
          </Accordion>

          <Accordion 
            title={`Weird`} 
            info="0-3000. Make your images quirky and unconventional. When you use it, you’re telling Midjourney to take some creative risks."
            disabled={settings.tool !== 'midjourney'}
          >
             <div className="px-2">
                <input 
                type="range" min="0" max="3000" step="10" value={settings.weird}
                onChange={(e) => updateSetting('weird', parseInt(e.target.value))}
                className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-3 font-mono">
                <span>0</span>
                <span>3000 (Very Weird)</span>
                </div>
            </div>
          </Accordion>

          <Accordion 
            title={`Repeat`} 
            info="Run the prompt multiple times."
            disabled={settings.tool !== 'midjourney'}
          >
             <div className="flex items-center gap-4">
              <input 
                type="number" min="1" max="10" value={settings.repeat}
                onChange={(e) => {
                    let val = parseInt(e.target.value);
                    if(val > 10) val = 10;
                    if(val < 1) val = 1;
                    updateSetting('repeat', val);
                }}
                className="bg-slate-950 border border-slate-600 rounded px-4 py-3 text-white w-24 text-center focus:border-blue-500 outline-none font-mono text-lg"
              />
              <span className="text-slate-400 font-medium">Times</span>
             </div>
          </Accordion>

          <Accordion 
            title="Tile" 
            info="Create seamless patterns, like wallpaper."
            disabled={settings.tool !== 'midjourney'}
          >
             <label className="flex items-center gap-4 cursor-pointer group p-2 hover:bg-slate-800/50 rounded-lg transition-colors">
                <div className={`w-8 h-8 border-2 rounded transition-all flex items-center justify-center ${settings.tile ? 'bg-blue-600 border-blue-600' : 'border-slate-500 group-hover:border-blue-400'}`}>
                   {settings.tile && <Check size={20} className="text-white" />}
                </div>
                <input 
                  type="checkbox" 
                  checked={settings.tile} 
                  onChange={(e) => updateSetting('tile', e.target.checked)}
                  className="hidden"
                />
                <span className="text-lg text-slate-300 group-hover:text-white transition-colors">Enable Tiling Mode</span>
             </label>
          </Accordion>

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