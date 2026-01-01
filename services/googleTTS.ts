/**
 * Google Cloud Text-to-Speech Service
 *
 * Uses Google Cloud TTS API for native-sounding speech synthesis
 * Voice: en-US-Neural2-J (male, natural-sounding American English)
 */

const GOOGLE_TTS_API_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';

interface TTSRequest {
  input: {
    text: string;
  };
  voice: {
    languageCode: string;
    name: string;
    ssmlGender: string;
  };
  audioConfig: {
    audioEncoding: string;
    pitch: number;
    speakingRate: number;
  };
}

let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

/**
 * Initialize AudioContext (lazy loading)
 */
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Stop currently playing audio
 */
export function stopSpeech() {
  if (currentSource) {
    try {
      currentSource.stop();
      currentSource.disconnect();
      currentSource = null;
    } catch (e) {
      // Ignore errors from already stopped sources
    }
  }
}

/**
 * Play text using Google Cloud Text-to-Speech
 *
 * @param text - Text to synthesize
 * @returns Promise that resolves when speech starts playing
 */
export async function playGoogleTTS(text: string): Promise<void> {
  const apiKey = import.meta.env.VITE_GOOGLE_TTS_API_KEY;

  if (!apiKey) {
    console.warn('Google TTS API key not configured, falling back to browser TTS');
    // Fallback to browser TTS
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
    return;
  }

  // Stop any currently playing audio
  stopSpeech();

  const requestBody: TTSRequest = {
    input: {
      text: text
    },
    voice: {
      languageCode: 'en-US',
      name: 'en-US-Neural2-J', // Natural male voice
      ssmlGender: 'MALE'
    },
    audioConfig: {
      audioEncoding: 'MP3',
      pitch: 0,
      speakingRate: 1.0
    }
  };

  try {
    const response = await fetch(`${GOOGLE_TTS_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.status}`);
    }

    const data = await response.json();
    const audioContent = data.audioContent;

    // Decode base64 audio
    const audioData = atob(audioContent);
    const arrayBuffer = new ArrayBuffer(audioData.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < audioData.length; i++) {
      view[i] = audioData.charCodeAt(i);
    }

    // Play audio using Web Audio API
    const ctx = getAudioContext();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start(0);

    currentSource = source;

    // Clean up when audio finishes
    source.onended = () => {
      if (currentSource === source) {
        currentSource = null;
      }
    };

  } catch (error) {
    console.error('Google TTS error:', error);
    // Fallback to browser TTS on error
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

/**
 * Check if audio is currently playing
 */
export function isSpeaking(): boolean {
  return currentSource !== null;
}
