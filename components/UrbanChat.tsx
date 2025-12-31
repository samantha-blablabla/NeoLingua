
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatSession.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are an elite urban professional. Scenario: ${scenario}. 
        RESPONSE RULES:
        1. CONVERSE ONLY IN ENGLISH. Use high-end modern urban vocabulary.
        2. VOCAB FORMAT: **word|Vietnamese meaning**.
        3. No Vietnamese in the main text.
        4. If the user is too formal, provide a cooler alternative in [square brackets].`,
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

      <header className="p-6 pt-12 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#0A0A0A]/80 backdrop-blur-xl z-[10]">
        <button onClick={onBack} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5 active:scale-90 transition-transform">
           <CloseIcon size={20} />
        </button>
        <div className="text-center">
           <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-[#CCFF00]">STREET TALK</h2>
           <p className="text-[9px] font-sans font-bold text-zinc-600 uppercase mt-1 tracking-widest">Live Coaching</p>
        </div>
        <div className="w-12" />
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
              <div className={`flex items-center gap-3 mb-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                 <span className="text-[8px] font-sans font-black uppercase tracking-widest text-zinc-600">
                    {msg.role === 'user' ? 'YOU' : 'URBAN GURU'}
                 </span>
                 {msg.role === 'model' && (
                    <button 
                      onClick={() => playNaturalSpeech(cleanTextForTTS(msg.text))} 
                      className="w-10 h-10 flex items-center justify-center bg-[#CCFF00]/5 text-[#CCFF00] rounded-full active:scale-90 transition-all"
                    >
                       <SoundHighIcon size={16} />
                    </button>
                 )}
              </div>
              
              <div className={`max-w-[90%] p-5 rounded-[28px] backdrop-blur-md border ${
                msg.role === 'user' 
                  ? 'bg-[#CCFF00]/10 border-[#CCFF00]/20 text-white rounded-tr-none' 
                  : 'bg-white/[0.04] border-white/10 text-zinc-100 rounded-tl-none'
              }`}>
                <p className="text-[15px] font-sans font-medium leading-relaxed tracking-tight">
                  {renderMessageText(msg.text)}
                </p>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <div className="flex gap-2 p-4 bg-white/5 rounded-2xl w-20 border border-white/5">
              {[0, 1, 2].map(i => (
                <motion.div 
                  key={i} 
                  animate={{ opacity: [0.3, 1, 0.3] }} 
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full" 
                />
              ))}
            </div>
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
