
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VocabularyItem } from './types';
import { CloseIcon, SoundHighIcon, FlashIcon, SparklesIcon, LibraryIcon } from './components/Icons';
import { playNaturalSpeech } from './services/speechService';

interface VocabVaultScreenProps {
  savedVocab: VocabularyItem[];
  onBack: () => void;
  onRemove: (item: VocabularyItem) => void;
}

const VocabVaultScreen: React.FC<VocabVaultScreenProps> = ({ savedVocab, onBack, onRemove }) => {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<VocabularyItem | null>(null);

  const filteredVocab = useMemo(() => {
    return savedVocab.filter(v => 
      v.word.toLowerCase().includes(search.toLowerCase()) || 
      v.meaning.toLowerCase().includes(search.toLowerCase())
    );
  }, [savedVocab, search]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[200] bg-[#0A0A0A] flex flex-col pt-16 px-6 pb-40 overflow-hidden"
    >
      {/* Header Area */}
      <header className="mb-8 px-2">
         <div className="flex justify-between items-start mb-10">
            <div>
               <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-[#CCFF00] mb-2">ARCHIVE SYSTEM</h2>
               <h3 className="text-4xl font-heading font-black tracking-tighter leading-none uppercase">Vocab Vault</h3>
            </div>
            <button onClick={onBack} className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-xl active:scale-90 transition-transform">
               <CloseIcon size={22} />
            </button>
         </div>

         {/* Search Bar */}
         <div className="relative">
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter your urban lexicon..."
              className="w-full h-16 bg-zinc-900/50 border border-white/5 rounded-[24px] px-8 text-sm font-sans font-bold text-white focus:border-[#CCFF00]/30 outline-none transition-all placeholder:text-zinc-700"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-700">
               <FlashIcon size={20} />
            </div>
         </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
         {filteredVocab.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
               {filteredVocab.map((item, idx) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedItem(item)}
                    className="p-6 rounded-[32px] bg-zinc-900/30 border border-white/5 flex items-center justify-between group cursor-pointer hover:border-[#CCFF00]/20 transition-all"
                  >
                     <div className="flex-1">
                        <h4 className="text-2xl font-heading font-black text-white group-hover:text-[#CCFF00] transition-colors">{item.word}</h4>
                        <p className="text-xs font-sans font-bold text-zinc-500 mt-1 truncate max-w-[200px]">{item.meaning}</p>
                     </div>
                     <button 
                       onClick={(e) => { e.stopPropagation(); playNaturalSpeech(item.word); }}
                       className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-[#CCFF00] active:scale-90 transition-transform"
                     >
                        <SoundHighIcon size={20} />
                     </button>
                  </motion.div>
               ))}
            </div>
         ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-12">
               <div className="w-20 h-20 rounded-[32px] bg-zinc-900 flex items-center justify-center text-zinc-800 mb-6">
                  <LibraryIcon size={40} />
               </div>
               <h4 className="text-lg font-heading font-black text-zinc-600 uppercase tracking-tighter">Your Vault is Empty</h4>
               <p className="text-xs font-sans font-bold text-zinc-800 mt-2 uppercase tracking-widest">Start saving words from your lessons to build your lexicon.</p>
            </div>
         )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
         {selectedItem && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl p-8 flex items-center justify-center"
              onClick={() => setSelectedItem(null)}
            >
               <motion.div 
                 initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                 className="w-full max-w-sm bg-zinc-900 rounded-[56px] p-10 border border-white/10 shadow-2xl"
                 onClick={e => e.stopPropagation()}
               >
                  <div className="flex justify-between items-start mb-8">
                     <div className="space-y-1">
                        <span className="text-[10px] font-sans font-black text-[#CCFF00] uppercase tracking-[0.4em]">VOCAB UNIT</span>
                        <h3 className="text-5xl font-heading font-black tracking-tighter leading-none">{selectedItem.word}</h3>
                     </div>
                     <button onClick={() => setSelectedItem(null)} className="p-2 text-zinc-600"><CloseIcon size={24} /></button>
                  </div>

                  <div className="space-y-8 mb-10">
                     <div className="p-6 bg-black/40 rounded-[32px] border border-white/5">
                        <p className="text-[10px] font-sans font-black text-zinc-700 uppercase tracking-widest mb-3">Meaning</p>
                        <p className="text-xl font-sans font-bold text-zinc-200">{selectedItem.meaning}</p>
                     </div>

                     <div className="space-y-3">
                        <p className="text-[10px] font-sans font-black text-[#CCFF00] uppercase tracking-widest flex items-center gap-2">
                           <SparklesIcon size={12} /> Urban Nuance
                        </p>
                        <p className="text-sm font-sans font-bold text-zinc-500 leading-relaxed italic">{selectedItem.nuance_vi}</p>
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <button 
                       onClick={() => playNaturalSpeech(selectedItem.word)}
                       className="flex-1 py-5 bg-[#CCFF00] text-black rounded-[24px] font-sans font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform"
                     >
                        <SoundHighIcon size={18} /> LISTEN
                     </button>
                     <button 
                       onClick={() => { onRemove(selectedItem); setSelectedItem(null); }}
                       className="px-8 py-5 bg-zinc-800 text-zinc-500 rounded-[24px] font-sans font-black uppercase text-xs tracking-widest active:scale-95 transition-transform"
                     >
                        REMOVE
                     </button>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VocabVaultScreen;
