export interface Scene {
  id: number;
  title: string;
  bullets: string[];
  voiceOver: string;
  start: number; // in seconds
  end: number; // in seconds
  illustrationType: 'activities' | 'handshake' | 'benefits' | 'financial' | 'qa' | 'closing';
  textLayout?: 'left' | 'center' | 'split';
}

export interface VideoSettings {
  aspectRatio: '16:9' | '9:16';
  useNarratorTTS: boolean;
  useSFXChords: boolean;
  autoPlay: boolean;
  playbackSpeed: number; // 0.5, 1, 1.5, 2
  bgColorPreset: 'corporate' | 'modern-dark' | 'bright-trust';
}

export interface QAItem {
  question: string;
  answer: string;
  icon?: string;
}
