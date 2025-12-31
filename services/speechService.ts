
import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Base64 decoder helper for converting API response to byte array
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
 * Audio decoding helper for raw PCM data returned by the Gemini TTS API
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
 * Service to play natural-sounding speech using Gemini 2.5 Flash TTS.
 * This implementation is more robust and specifically handles errors to avoid
 * the '[object Object]' log output by stringifying error details.
 */
export const playNaturalSpeech = async (text: string) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key is missing from environment variables");

    // Initialize the Gemini API client
    const ai = new GoogleGenAI({ apiKey });
    
    // Use the dedicated Gemini TTS model for high-quality audio generation
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // 'Kore' is one of the high-quality prebuilt voices optimized for clear speech
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    // Extract the raw audio bytes (PCM format)
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("Gemini TTS API returned no audio content");
    }

    // Initialize AudioContext - using 24000Hz as standard for Gemini TTS output
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const outputAudioContext = new AudioContextClass({ sampleRate: 24000 });
    
    // Decode the PCM data and prepare for playback
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1 // Mono channel
    );

    const source = outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputAudioContext.destination);
    
    // Handle potential auto-play restrictions by resuming the context
    if (outputAudioContext.state === 'suspended') {
      await outputAudioContext.resume();
    }
    
    source.start();
  } catch (error: any) {
    // Fix: Robust error logging to prevent [object Object] output
    const errorMessage = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    console.warn(`[SpeechService] Gemini TTS failed. Reason: ${errorMessage}`);
    
    // Critical Fallback: Use browser's built-in Web Speech API if AI TTS fails
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }
};
