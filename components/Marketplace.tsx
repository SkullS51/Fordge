
import React from 'react';
import { ShoppingCart, User, Tag, ShieldCheck } from 'lucide-react';
import { Artwork } from '../types';

interface MarketplaceProps {
  artworks: Artwork[];
}

const Marketplace: React.FC<MarketplaceProps> = ({ artworks }) => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-metal text-white tracking-widest">Bazaar of Chaos</h2>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm hover:bg-slate-700 transition">Latest Drops</button>
          <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm hover:bg-slate-700 transition">Most Brutal</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {artworks.map((art) => (
          <div key={art.id} className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-red-600 transition duration-300 shadow-xl">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={art.image} 
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-[10px] text-red-500 font-bold uppercase flex items-center gap-1">
                <ShieldCheck size={12} />
                Verified Metal
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-red-500 transition">{art.title}</h3>
                <span className="text-red-500 font-bold">{art.price} ETH</span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <User size={14} />
                <span>{art.creator}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Tag size={12} />
                <span>{art.genre}</span>
              </div>

              <button className="w-full mt-2 py-2 bg-red-900/20 hover:bg-red-900 text-red-500 hover:text-white border border-red-900/50 rounded-lg flex items-center justify-center gap-2 transition font-bold">
                <ShoppingCart size={16} />
                Collect
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {artworks.length === 0 && (
        <div className="text-center py-20 bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-800">
          <p className="text-slate-500 italic">No relics forged yet. Enter the Forge to create art.</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
