
import Groq from "groq-sdk";
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { playGoogleTTS, stopSpeech } from '../services/googleTTS';
import { CloseIcon, FlashIcon, SoundHighIcon } from './Icons';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface Definition {
  word: string;
  meaning: string;
  pronunciation?: string;  // IPA pronunciation
  partOfSpeech?: string;   // (n), (v), (adj), (adv), etc.
  example?: string;        // Example sentence in English
  exampleVi?: string;      // Vietnamese translation of example
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
  const groqClient = useRef<Groq | null>(null);

  // Multi-layer protection against auto-play loops
  const hasAutoPlayedRef = useRef(false); // Track if initial greeting has been auto-played
  const playedMessagesRef = useRef(new Set<string>()); // Track all played messages
  const isPlayingRef = useRef(false); // Track if currently playing
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Track play timeout

  // Helper function to safely auto-play TTS (with protection against loops)
  const safeAutoPlay = (text: string, isInitialGreeting = false) => {
    // Clear any pending play timeout
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }

    // Check if already playing
    if (isPlayingRef.current) {
      return;
    }

    // Check if this exact message was already played
    if (playedMessagesRef.current.has(text)) {
      return;
    }

    // Check if initial greeting was already played (for greeting only)
    if (isInitialGreeting && hasAutoPlayedRef.current) {
      return;
    }

    // Mark as playing and add to played set
    isPlayingRef.current = true;
    playedMessagesRef.current.add(text);
    if (isInitialGreeting) {
      hasAutoPlayedRef.current = true;
    }

    // Schedule the actual TTS play
    playTimeoutRef.current = setTimeout(() => {
      const cleanText = cleanTextForTTS(text);
      playGoogleTTS(cleanText).finally(() => {
        isPlayingRef.current = false;
      });
    }, 500);
  };

  // Clean text for TTS (only read main conversation, skip tips)
  const cleanTextForTTS = (text: string) => {
    let cleaned = text;

    // CRITICAL: Remove URBAN UPGRADE and STREET TIP sections completely
    // These are for user reading only, NOT for TTS
    // Pattern: Remove from emoji/marker to end of that section
    cleaned = cleaned.replace(/🔥\s*URBAN UPGRADE:[\s\S]*?(?=💬\s*STREET TIP:|$)/gi, "");
    cleaned = cleaned.replace(/💬\s*STREET TIP:[\s\S]*?$/gi, "");

    // Remove vocabulary markup but keep only English word
    // This handles: **word|Vietnamese meaning** → word
    cleaned = cleaned.replace(/\*\*(.*?)\|(.*?)\*\*/g, "$1");

    // Remove remaining markdown bold
    // This handles: **word** → word
    cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, "$1");

    // Remove all emojis
    cleaned = cleaned.replace(/[🔥💬⚠️✅]/g, "");

    // Clean up extra whitespace
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    return cleaned;
  };

  // Use useMemo to prevent systemPrompt from changing on every render
  const systemPrompt = React.useMemo(() => `You are an ELITE URBAN PROFESSIONAL roleplay coach. Scenario: ${scenario}. Context: ${context_vi}

🎯 YOUR MISSION:
- Help users master modern urban English through immersive conversation
- Respond naturally like a native speaker in real urban situations
- Provide real-time feedback to optimize their language to sound more "street-smart"

📋 RESPONSE STRUCTURE:
1. MAIN RESPONSE (English only):
   - Use natural, modern urban vocabulary
   - Incorporate slang, phrasal verbs, and idioms
   - Mark important vocabulary with FULL format: **word|/pronunciation/|(pos)|meaning|example EN|example VI**
   - Format breakdown:
     * word: The vocabulary word
     * /pronunciation/: IPA pronunciation (e.g., /ləˈteɪ/)
     * (pos): Part of speech - (n), (v), (adj), (adv), (prep), (phrase)
     * meaning: Vietnamese meaning (CORRECT spelling!)
     * example EN: Short example sentence in English
     * example VI: Vietnamese translation of example
   - Example: **latte|/ˈlɑːteɪ/|(n)|cà phê sữa|Can I get a latte?|Cho tôi một ly cà phê sữa?**
   - Another: **chill|/tʃɪl/|(adj)|thư giãn, thoải mái|This place is pretty chill.|Chỗ này khá thoải mái.**

2. URBAN OPTIMIZATION (when user's English is too formal):
   - Format: 🔥 URBAN UPGRADE: [Original] → [Cooler version]
   - Example: "I would like coffee" → "Can I get a coffee?" or "Coffee, please!"

3. STREET TIPS (occasionally, IN VIETNAMESE):
   - 💬 STREET TIP: [Giải thích bằng tiếng Việt về cách dùng]
   - Example: "💬 STREET TIP: 'Yo' là lời chào thân mật giữa bạn bè, không dùng trong môi trường công sở hoặc trang trọng nhé!"

🎨 STYLE GUIDE:
- Be conversational and engaging
- Use contractions (I'm, you're, we'll)
- Mix short and long sentences
- Show personality and emotion
- Respond to context, not just words

🚫 NEVER:
- Use Vietnamese in main conversation (except in STREET TIP sections)
- Be overly formal or academic
- Explain grammar unless asked
- Break character from the scenario
- Use wrong Vietnamese spelling (always double-check: "cà phê" not "ca phê", "sữa" not "sửa")

Remember: You're not a teacher, you're a cool urban friend helping them sound natural!`, [scenario, context_vi]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      setMessages([{ role: 'assistant', text: "⚠️ Groq API key not configured.\n\n1. Get free key: https://console.groq.com/keys\n2. Add to .env.local: VITE_GROQ_API_KEY=your_key" }]);
      return;
    }

    groqClient.current = new Groq({
      apiKey,
      dangerouslyAllowBrowser: true
    });

    const startChat = async () => {
      setIsTyping(true);
      try {
        const completion = await groqClient.current!.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: "Start the conversation by greeting me and asking what I'd like according to the scenario." }
          ],
          temperature: 0.8,
          max_tokens: 1024
        });

        const responseText = completion.choices[0]?.message?.content || "Yo! What's good? How can I help you today?";
        setMessages([{ role: 'assistant', text: responseText }]);

        // Auto-play AI greeting (protected against loops)
        safeAutoPlay(responseText, true);
      } catch (e) {
        console.error('Error starting chat:', e);
        setMessages([{ role: 'assistant', text: "⚠️ Failed to connect. Check your API key and internet connection." }]);
      } finally {
        setIsTyping(false);
      }
    };
    startChat();
  }, [scenario]); // systemPrompt is memoized, only depend on scenario

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Cleanup on unmount to prevent memory leaks and lingering audio
  useEffect(() => {
    return () => {
      // Clear any pending timeout
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
      // Stop any playing audio
      stopSpeech();
      // Reset all flags
      hasAutoPlayedRef.current = false;
      playedMessagesRef.current.clear();
      isPlayingRef.current = false;
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !groqClient.current) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    setIsTyping(true);
    try {
      // Build conversation history
      const conversationHistory = [
        { role: 'system' as const, content: systemPrompt },
        ...messages.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.text
        })),
        { role: 'user' as const, content: userMsg }
      ];

      const completion = await groqClient.current.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: conversationHistory,
        temperature: 0.8,
        max_tokens: 1024
      });

      const responseText = completion.choices[0]?.message?.content || "Signal's dropping. Come again?";
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);

      // Auto-play AI response (protected against loops)
      safeAutoPlay(responseText, false);
    } catch (e) {
      console.error('Error sending message:', e);
      setMessages(prev => [...prev, { role: 'assistant', text: "Signal's dropping. Come again?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessageText = (text: string) => {
    // Split text into sections: main conversation, urban upgrade, street tip
    const sections = [];

    // Check for URBAN UPGRADE section
    const urbanUpgradeMatch = text.match(/🔥\s*URBAN UPGRADE:([\s\S]*?)(?=💬\s*STREET TIP:|$)/i);
    // Check for STREET TIP section
    const streetTipMatch = text.match(/💬\s*STREET TIP:([\s\S]*?)$/i);

    // Get main conversation (everything before tips)
    let mainText = text;
    if (urbanUpgradeMatch) {
      mainText = text.substring(0, text.indexOf(urbanUpgradeMatch[0]));
    } else if (streetTipMatch) {
      mainText = text.substring(0, text.indexOf(streetTipMatch[0]));
    }

    // Render main conversation with vocabulary highlighting
    const renderWithVocab = (content: string) => {
      const parts = content.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const innerContent = part.slice(2, -2);
          // Parse new format: word|/pronunciation/|(pos)|meaning|example EN|example VI
          const segments = innerContent.split('|');

          if (segments.length === 1) {
            // Old format or just bold text
            return <span key={i} className="font-bold">{segments[0]}</span>;
          }

          const word = segments[0];
          let pronunciation = '';
          let partOfSpeech = '';
          let meaning = segments[1] || '';
          let example = '';
          let exampleVi = '';

          // Check if we have the full new format (6 segments)
          if (segments.length >= 6) {
            pronunciation = segments[1]; // /pronunciation/
            partOfSpeech = segments[2];  // (pos)
            meaning = segments[3];       // Vietnamese meaning
            example = segments[4];       // Example sentence EN
            exampleVi = segments[5];     // Example sentence VI
          } else if (segments.length === 2) {
            // Old format: word|meaning
            meaning = segments[1];
          }

          return (
            <button
              key={i}
              onClick={() => setActiveDef({
                word,
                meaning,
                pronunciation,
                partOfSpeech,
                example,
                exampleVi
              })}
              className="inline-block px-2 py-1 mx-0.5 bg-[#CCFF00]/10 border-b-2 border-[#CCFF00] text-[#CCFF00] font-bold rounded-sm active:scale-95 transition-transform group relative"
              title={pronunciation ? `${pronunciation} ${partOfSpeech}` : meaning}
            >
              {word}
              {partOfSpeech && (
                <span className="ml-1 text-[10px] text-[#CCFF00]/60 font-normal">
                  {partOfSpeech}
                </span>
              )}
            </button>
          );
        }
        return <span key={i}>{part}</span>;
      });
    };

    // Main conversation
    sections.push(
      <div key="main" className="leading-relaxed">
        {renderWithVocab(mainText)}
      </div>
    );

    // Urban Upgrade section (with spacing)
    if (urbanUpgradeMatch) {
      sections.push(
        <div key="urban" className="mt-6 pt-6 border-t border-white/10">
          <div className="text-xs font-black uppercase tracking-widest text-[#CCFF00]/60 mb-2">
            🔥 URBAN UPGRADE
          </div>
          <div className="text-sm leading-relaxed text-zinc-300">
            {urbanUpgradeMatch[1].trim()}
          </div>
        </div>
      );
    }

    // Street Tip section (with spacing)
    if (streetTipMatch) {
      sections.push(
        <div key="street" className="mt-6 pt-6 border-t border-white/10">
          <div className="text-xs font-black uppercase tracking-widest text-[#CCFF00]/60 mb-2">
            💬 STREET TIP
          </div>
          <div className="text-sm leading-relaxed text-zinc-300">
            {streetTipMatch[1].trim()}
          </div>
        </div>
      );
    }

    return <>{sections}</>;
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
                   <div className="space-y-2 flex-1">
                      <span className="text-[10px] font-sans font-black text-[#CCFF00] uppercase tracking-[0.4em]">DEFINITION</span>
                      <div className="flex items-baseline gap-3">
                        <h4 className="text-4xl font-heading font-black tracking-tighter text-white uppercase leading-none">{activeDef.word}</h4>
                        {activeDef.partOfSpeech && (
                          <span className="text-sm font-sans font-bold text-zinc-500">{activeDef.partOfSpeech}</span>
                        )}
                      </div>
                      {activeDef.pronunciation && (
                        <p className="text-sm font-mono text-[#CCFF00]/80 tracking-wide">{activeDef.pronunciation}</p>
                      )}
                   </div>
                   <button onClick={() => setActiveDef(null)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 active:scale-90 transition-all">
                      <CloseIcon size={20} />
                   </button>
                </div>

                <div className="w-full p-6 bg-white/[0.03] rounded-[32px] border border-white/5 mb-6">
                   <p className="text-lg font-sans font-bold text-zinc-300 leading-snug">{activeDef.meaning}</p>
                </div>

                {activeDef.example && activeDef.exampleVi && (
                  <div className="w-full p-6 bg-white/[0.03] rounded-[32px] border border-white/5 mb-6 space-y-3">
                    <div className="text-[10px] font-sans font-black text-[#CCFF00]/60 uppercase tracking-[0.3em]">EXAMPLE</div>
                    <p className="text-sm font-sans font-medium text-white leading-relaxed italic">"{activeDef.example}"</p>
                    <p className="text-sm font-sans font-medium text-zinc-400 leading-relaxed">"{activeDef.exampleVi}"</p>
                  </div>
                )}

                <button
                  onClick={() => playGoogleTTS(activeDef.word)}
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
                 {msg.role === 'assistant' && (
                    <button
                      onClick={() => {
                        stopSpeech();
                        playGoogleTTS(cleanTextForTTS(msg.text));
                      }}
                      className="w-9 h-9 flex items-center justify-center bg-[#CCFF00]/10 text-[#CCFF00] rounded-full border border-[#CCFF00]/20 active:scale-90 transition-all hover:bg-[#CCFF00]/20"
                      title="Replay message"
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
