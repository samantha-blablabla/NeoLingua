
import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Base64 decoder helper
 */
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Audio decoding helper for raw PCM data
 */
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Service to play natural native-sounding speech using Gemini 2.5 Flash TTS.
 */
export const playNaturalSpeech = async (text: string) => {
  try {
    // Fix: Using process.env.API_KEY directly for initialization as per GenAI guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using Zephyr voice for high-end native prosody
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say this naturally as a native urban professional: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore or Zephyr are expressive and modern
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio returned");

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const outputAudioContext = new AudioContextClass({ sampleRate: 24000 });
    
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1
    );

    const source = outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputAudioContext.destination);
    
    if (outputAudioContext.state === 'suspended') {
      await outputAudioContext.resume();
    }
    
    source.start();
  } catch (error: any) {
    console.warn(`[TTS] Gemini failed: ${error?.message}. Falling back to Browser TTS.`);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};
