export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

export interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  isFinal: boolean;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onresult:
    | ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void)
    | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

export interface SpeechRecognitionConstructor {
  new (): ISpeechRecognition;
  prototype: ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export interface UseVoiceRecordingReturn {
  isListening: boolean;
  transcript: string;
  isFinal: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}
