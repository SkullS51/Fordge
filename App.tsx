
import React, { useState } from 'react';
import Canvas from './components/Canvas';
import MusicStudio from './components/MusicStudio';
import Marketplace from './components/Marketplace';
import { StudioMode, Artwork } from './types';
import { Palette, Skull, ShoppingBag, Feather, Code2 } from 'lucide-react'; // Added Code2 icon
import { ForeverRawLanding } from './components/ForeverRawLanding';
import CodeForge from './components/CodeForge'; // Import the new CodeForge component

const App: React.FC = () => {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [mode, setMode] = useState<StudioMode>(StudioMode.PAINT);
  const [artworks, setArtworks] = useState<Artwork[]>([
    {
      id: '1',
      title: 'Neon Wasteland',
      image: 'https://picsum.photos/seed/cyber1/400/400',
      price: '0.25',
      creator: 'Pixel_Drifter',
      genre: 'Cyberpunk'
    },
    {
      id: '2',
      title: 'Midnight Echo',
      image: 'https://picsum.photos/seed/dark1/400/400',
      price: '0.15',
      creator: 'GhostWriter',
      genre: 'Abstract Noir'
    }
  ]);

  const saveArtwork = (imageUrl: string) => {
    const newArt: Artwork = {
      id: Date.now().toString(),
      title: 'New Forge #' + (artworks.length + 1),
      image: imageUrl,
      price: (Math.random() * 0.4 + 0.05).toFixed(2),
      creator: 'Current_Artist',
      genre: 'Original Studio Piece'
    };
    setArtworks([newArt, ...artworks]);
    setMode(StudioMode.MARKET);
  };

  if (showLandingPage) {
    return <ForeverRawLanding onEnterStudio={() => setShowLandingPage(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-200">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-lg shadow-lg shadow-red-600/20">
            <Skull className="text-white" size={20} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-metal tracking-tighter text-white leading-none">
              STUDIO<span className="text-red-600">FORGE</span>
            </h1>
            <span className="text-[8px] text-slate-500 uppercase tracking-[0.4em] font-bold">Art & Lyrics</span>
          </div>
        </div>

        <nav className="flex items-center bg-black/40 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode(StudioMode.PAINT)}
            className={`px-4 sm:px-6 py-2 rounded-lg flex items-center gap-2 transition-all font-bold text-[10px] uppercase tracking-widest ${mode === StudioMode.PAINT ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white hover:bg-slate-800/50'}`}
          >
            <Palette size={14} />
            <span className="hidden xs:inline">Canvas</span>
          </button>
          <button
            onClick={() => setMode(StudioMode.LYRICS)}
            className={`px-4 sm:px-6 py-2 rounded-lg flex items-center gap-2 transition-all font-bold text-[10px] uppercase tracking-widest ${mode === StudioMode.LYRICS ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white hover:bg-slate-800/50'}`}
          >
            <Feather size={14} />
            <span className="hidden xs:inline">Lyrics</span>
          </button>
          <button
            onClick={() => setMode(StudioMode.CODE_FORGE)} // New button for Code Forge
            className={`px-4 sm:px-6 py-2 rounded-lg flex items-center gap-2 transition-all font-bold text-[10px] uppercase tracking-widest ${mode === StudioMode.CODE_FORGE ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white hover:bg-slate-800/50'}`}
          >
            <Code2 size={14} />
            <span className="hidden xs:inline">Code</span>
          </button>
          <button
            onClick={() => setMode(StudioMode.MARKET)}
            className={`px-4 sm:px-6 py-2 rounded-lg flex items-center gap-2 transition-all font-bold text-[10px] uppercase tracking-widest ${mode === StudioMode.MARKET ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white hover:bg-slate-800/50'}`}
          >
            <ShoppingBag size={14} />
            <span className="hidden xs:inline">Market</span>
          </button>
        </nav>

        <button className="hidden sm:block px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">
          Connect
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        {mode === StudioMode.PAINT && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h2 className="text-5xl font-metal text-white mb-2 uppercase tracking-tighter">Art Studio</h2>
              <p className="text-slate-400 text-sm font-light italic">Paint your vision. Apply AI mutations. Sell your soul's work.</p>
            </div>
            <Canvas onSave={saveArtwork} />
          </div>
        )}

        {mode === StudioMode.LYRICS && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h2 className="text-5xl font-metal text-white mb-2 uppercase tracking-tighter">Lyric Forge</h2>
              <p className="text-slate-400 text-sm font-light italic">Enter your style and story. Let the AI manifest your words.</p>
            </div>
            <MusicStudio />
          </div>
        )}

        {mode === StudioMode.CODE_FORGE && ( // New Code Forge section
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h2 className="text-5xl font-metal text-white mb-2 uppercase tracking-tighter">Code Forge</h2>
              <p className="text-slate-400 text-sm font-light italic">Summon type-safe code for your immortal applications. (Requires backend integration)</p>
            </div>
            <CodeForge />
          </div>
        )}

        {mode === StudioMode.MARKET && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Marketplace artworks={artworks} />
          </div>
        )}
      </main>

      <footer className="p-6 text-center text-[10px] text-slate-700 uppercase tracking-[0.4em] font-bold border-t border-slate-900 bg-slate-950/50 backdrop-blur-sm">
        Studio Forge &copy; 2025 • Digital Relics & Verses
      </footer>
    </div>
  );
};

export default App;