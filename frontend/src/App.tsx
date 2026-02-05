import { useState, useEffect, useCallback } from 'react';
import { useVoiceRecording } from './hooks/useVoiceRecording';
import { initializeSocket, sendTranslationRequest } from './socket';
import AppHeader from './components/AppHeader';
import LanguageSwitch from './components/LanguageSwitch';
import MicControls from './components/MicControls';
import TranscriptCard from './components/TranscriptCard';
import ErrorBanner from './components/ErrorBanner';
import TranslationHistory from './components/TranslationHistory';
import type { Translation } from './types';
import './App.css';

export default function App() {
  const {
    isListening,
    transcript,
    isFinal,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecording();

  const [targetLanguage, setTargetLanguage] =
    useState<'spanish' | 'german'>('spanish');
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = initializeSocket();

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('translation', (data: Translation) => {
      setTranslations(prev => [data, ...prev]);
      resetTranscript();
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('translation');
    };
  }, [resetTranscript]);

  const handleRecordingComplete = useCallback(() => {
    if (transcript.trim() && isFinal) {
      sendTranslationRequest(transcript, targetLanguage);
    }
  }, [transcript, isFinal, targetLanguage]);

  useEffect(() => {
    if (isFinal && transcript.trim()) {
      handleRecordingComplete();
    }
  }, [handleRecordingComplete, isFinal, transcript]);

  return (
    <div className="app-root">
      <div className="app-container">
        <AppHeader connected={connected} />
        <LanguageSwitch
          targetLanguage={targetLanguage}
          onChange={setTargetLanguage}
        />
        <MicControls
          isListening={isListening}
          connected={connected}
          onStart={startListening}
          onStop={stopListening}
        />
        <TranscriptCard
          transcript={transcript}
          isFinal={isFinal}
          onTranslate={() => sendTranslationRequest(transcript, targetLanguage)}
        />
        <ErrorBanner error={error} />
        <TranslationHistory translations={translations} />
      </div>
    </div>
  );
}
