
import { GoogleGenAI } from "@google/genai";
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { playNaturalSpeech } from '../services/speechService';
import { CloseIcon, FlashIcon, SoundHighIcon } from './Icons';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface Definition {
  word: string;
  meaning: string;
}

interface Props {
  onBack: () => void;
  scenario: string;
  context_vi: string;
}

const UrbanChat: React.FC<Props> = ({ onBack, scenario, context_vi }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeDef, setActiveDef] = useState<Definition | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatSession = useRef<any>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setMessages([{ role: 'model', text: "⚠️ API key not configured. Add VITE_GEMINI_API_KEY to .env.local" }]);
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    chatSession.current = ai.chats.create({
      model: 'gemini-2.0-flash-exp',
      config: {
        systemInstruction: `You are an ELITE URBAN PROFESSIONAL roleplay coach. Scenario: ${scenario}. Context: ${context_vi}

🎯 YOUR MISSION:
- Help users master modern urban English through immersive conversation
- Respond naturally like a native speaker in real urban situations
- Provide real-time feedback to optimize their language to sound more "street-smart"

📋 RESPONSE STRUCTURE:
1. MAIN RESPONSE (English only):
   - Use natural, modern urban vocabulary
   - Incorporate slang, phrasal verbs, and idioms
   - Mark important vocabulary: **word|Nghĩa tiếng Việt**

2. URBAN OPTIMIZATION (when user's English is too formal):
   - Format: 🔥 URBAN UPGRADE: [Original] → [Cooler version]
   - Example: "I would like coffee" → "Can I get a coffee?" or "Coffee, please!"

3. FEEDBACK (occasionally):
   - 💬 STREET TIP: [Quick tip about urban usage]
   - Example: "💬 STREET TIP: 'Yo' is casual greeting among friends, not for formal settings"

🎨 STYLE GUIDE:
- Be conversational and engaging
- Use contractions (I'm, you're, we'll)
- Mix short and long sentences
- Show personality and emotion
- Respond to context, not just words

🚫 NEVER:
- Use Vietnamese in main conversation
- Be overly formal or academic
- Explain grammar unless asked
- Break character from the scenario

Remember: You're not a teacher, you're a cool urban friend helping them sound natural!`,
      },
    });

    const startChat = async () => {
      setIsTyping(true);
      try {
        const result = await chatSession.current.sendMessage({ message: "Yo! Just stepped in. What are we vibing with?" });
        setMessages([{ role: 'model', text: result.text }]);
      } catch (e) {
        console.error(e);
      } finally {
        setIsTyping(false);
      }
    };
    startChat();
  }, [scenario]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    
    setIsTyping(true);
    try {
      const result = await chatSession.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Signal's dropping. Come again?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const cleanTextForTTS = (text: string) => {
    return text.replace(/\*\*(.*?)\|(.*?)\*\*/g, "$1")
               .replace(/\*\*(.*?)\*\*/g, "$1");
  };

  const renderMessageText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        const [word, meaning] = content.split('|');
        if (!meaning) return <span key={i} className="font-bold">{word}</span>;
        
        return (
          <button
            key={i}
            onClick={() => setActiveDef({ word, meaning })}
            className="inline-block px-2 py-1 mx-0.5 bg-[#CCFF00]/10 border-b-2 border-[#CCFF00] text-[#CCFF00] font-bold rounded-sm active:scale-95 transition-transform"
          >
            {word}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 z-[300] bg-[#0A0A0A] flex flex-col text-white font-sans overflow-hidden"
    >
      <AnimatePresence>
        {activeDef && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDef(null)}
              className="fixed inset-0 z-[450] bg-black/80 backdrop-blur-[8px]"
            />
            
            <div className="fixed inset-0 z-[500] pointer-events-none flex items-end sm:items-center justify-center px-4 pb-10 sm:pb-0">
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="pointer-events-auto w-full max-w-[380px] bg-[#161618] border border-white/10 p-8 rounded-[48px] flex flex-col items-center shadow-2xl"
              >
                <div className="w-12 h-1.5 bg-white/10 rounded-full mb-8" />
                
                <div className="w-full flex justify-between items-start mb-6">
                   <div className="space-y-1">
                      <span className="text-[10px] font-sans font-black text-[#CCFF00] uppercase tracking-[0.4em]">DEFINITION</span>
                      <h4 className="text-4xl font-heading font-black tracking-tighter text-white uppercase leading-none">{activeDef.word}</h4>
                   </div>
                   <button onClick={() => setActiveDef(null)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 active:scale-90 transition-all">
                      <CloseIcon size={20} />
                   </button>
                </div>

                <div className="w-full p-6 bg-white/[0.03] rounded-[32px] border border-white/5 mb-8">
                   <p className="text-lg font-sans font-bold text-zinc-300 leading-snug">{activeDef.meaning}</p>
                </div>

                <button 
                  onClick={() => playNaturalSpeech(activeDef.word)}
                  className="w-full py-5 rounded-2xl bg-[#CCFF00] text-black font-sans font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform"
                >
                  <SoundHighIcon size={20} /> HEAR PRONUNCIATION
                </button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <header className="p-6 pt-16 pb-8 border-b border-white/5 shrink-0 bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]/90 backdrop-blur-xl z-[10]">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5 active:scale-90 transition-transform hover:bg-white/10">
             <CloseIcon size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse shadow-[0_0_10px_#CCFF00]" />
            <span className="text-[9px] font-sans font-black uppercase tracking-widest text-[#CCFF00]">LIVE</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-[#CCFF00] to-[#CCFF00]/60 flex items-center justify-center shadow-[0_10px_30px_rgba(204,255,0,0.2)]">
              <FlashIcon size={28} color="#0A0A0A" />
            </div>
            <div>
              <h2 className="text-3xl font-heading font-black uppercase tracking-tighter leading-none text-white">Street Talk</h2>
              <p className="text-xs font-sans font-bold text-zinc-500 mt-1 tracking-wide">Sandbox</p>
            </div>
          </div>

          <div className="pl-[68px] space-y-1">
            <p className="text-[11px] font-sans font-black uppercase tracking-[0.3em] text-[#CCFF00]/60">SCENARIO</p>
            <p className="text-sm font-sans font-bold text-zinc-400">{scenario}</p>
            <p className="text-xs font-sans font-medium text-zinc-600 italic">{context_vi}</p>
          </div>
        </div>
      </header>

      <div 
        ref={scrollRef} 
        className={`flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 transition-all duration-700 ${activeDef ? 'blur-[8px] opacity-40 scale-[0.98]' : ''}`}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex items-center gap-3 mb-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                 <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                   msg.role === 'user'
                     ? 'bg-[#CCFF00]/10 border border-[#CCFF00]/20'
                     : 'bg-white/5 border border-white/10'
                 }`}>
                   <div className={`w-1.5 h-1.5 rounded-full ${msg.role === 'user' ? 'bg-[#CCFF00]' : 'bg-zinc-500'}`} />
                   <span className="text-[9px] font-sans font-black uppercase tracking-[0.25em] text-zinc-400">
                      {msg.role === 'user' ? 'YOU' : 'URBAN GURU'}
                   </span>
                 </div>
                 {msg.role === 'model' && (
                    <button
                      onClick={() => playNaturalSpeech(cleanTextForTTS(msg.text))}
                      className="w-9 h-9 flex items-center justify-center bg-[#CCFF00]/10 text-[#CCFF00] rounded-full border border-[#CCFF00]/20 active:scale-90 transition-all hover:bg-[#CCFF00]/20"
                    >
                       <SoundHighIcon size={16} />
                    </button>
                 )}
              </div>

              <div className={`max-w-[85%] p-6 rounded-[32px] backdrop-blur-md border shadow-lg ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-[#CCFF00]/15 to-[#CCFF00]/5 border-[#CCFF00]/30 text-white rounded-tr-[8px]'
                  : 'bg-gradient-to-br from-white/[0.06] to-white/[0.02] border-white/10 text-zinc-100 rounded-tl-[8px]'
              }`}>
                <p className="text-[15px] font-sans font-medium leading-relaxed tracking-tight">
                  {renderMessageText(msg.text)}
                </p>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-start gap-3"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                <span className="text-[9px] font-sans font-black uppercase tracking-[0.25em] text-zinc-400">URBAN GURU</span>
              </div>
              <div className="flex gap-2.5 p-5 bg-gradient-to-br from-white/[0.06] to-white/[0.02] rounded-[32px] rounded-tl-[8px] border border-white/10 w-24">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.4, 1, 0.4]
                    }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15 }}
                    className="w-2 h-2 bg-[#CCFF00] rounded-full shadow-[0_0_8px_rgba(204,255,0,0.5)]"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="p-6 pb-12 bg-[#0A0A0A] border-t border-white/5">
         <div className="flex gap-3 bg-white/[0.04] p-2 pl-6 rounded-full border border-white/10 focus-within:border-[#CCFF00]/40 transition-all shadow-lg">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Vibe check... type here"
              className="flex-1 bg-transparent border-none outline-none font-sans font-bold text-sm text-white placeholder:text-zinc-700 py-3"
            />
            <button 
              onClick={handleSend}
              className="w-12 h-12 rounded-full bg-[#CCFF00] text-black flex items-center justify-center active:scale-90 transition-transform shadow-[0_5px_15px_rgba(204,255,0,0.3)]"
            >
              <FlashIcon size={20} />
            </button>
         </div>
      </footer>
    </motion.div>
  );
};

export default UrbanChat;
