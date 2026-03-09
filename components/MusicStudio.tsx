
import React, { useState } from 'react';
import { Sparkles, Type, BookOpen, Quote, PenTool, Hash, Copy, Check, Feather } from 'lucide-react';
import { generateLyrics } from '../services/geminiService';
import { LyricResult } from '../types';

const MusicStudio: React.FC = () => {
  const [style, setStyle] = useState('Dark Alternative Rock');
  const [theme, setTheme] = useState('The feeling of being lost in a neon city at 3 AM');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<LyricResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!style || !theme) return;
    setIsGenerating(true);
    setResult(null);
    try {
      const data = await generateLyrics(theme, style);
      setResult(data);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(`${result.title}\n\n${result.lyrics}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] shadow-2xl backdrop-blur-md">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Hash size={14} className="text-red-500" />
              Music Style / Genre
            </label>
            <input 
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="e.g. Grungy 90s Rock, Jazz Noir..."
              className="w-full bg-black/40 border border-slate-700 rounded-xl px-5 py-3 text-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 outline-none transition-all placeholder:text-slate-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <PenTool size={14} className="text-red-500" />
              Lyric Theme / Story
            </label>
            <textarea 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="What is the song about?"
              className="w-full h-32 bg-black/40 border border-slate-700 rounded-xl px-5 py-3 text-slate-200 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 outline-none transition-all resize-none placeholder:text-slate-600"
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-red-900/20 active:scale-[0.98]"
          >
            {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={18} />}
            <span className="uppercase tracking-widest text-xs">{isGenerating ? 'Generating...' : 'Forge Lyrics'}</span>
          </button>
        </div>

        <div className="flex flex-col justify-center items-center p-8 border-2 border-dashed border-slate-800 rounded-[1.5rem] bg-black/20 text-center">
          {result ? (
            <div className="w-full space-y-4 text-left">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-metal text-white tracking-tight">{result.title}</h3>
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{result.genre}</p>
                </div>
                <button onClick={copyToClipboard} className="text-slate-500 hover:text-white transition-colors">
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-800">
                <pre className="text-slate-300 font-serif text-sm leading-relaxed whitespace-pre-wrap italic">
                  {result.lyrics}
                </pre>
              </div>
            </div>
          ) : (
            <>
              <Feather size={40} className="text-slate-700 mb-4 opacity-30" />
              <p className="text-slate-500 text-sm italic font-light">The ink is still in the bottle. Fill out the style and theme to start writing.</p>
            </>
          )}
        </div>
      </div>

      {result && (
        <div className="text-center pt-8 opacity-40">
          <BookOpen size={20} className="mx-auto text-slate-500 mb-2" />
          <p className="text-[9px] uppercase font-bold tracking-[0.5em] text-slate-600 italic">Composition Finished</p>
        </div>
      )}
    </div>
  );
};

export default MusicStudio;
