import { useState, useEffect, useCallback } from 'react';
import { useVoiceRecording } from './hooks/useVoiceRecording';
import { initializeSocket, sendTranslationRequest } from './socket';
import './App.css';

interface Translation {
  original: string;
  translated: string;
  targetLanguage: 'spanish' | 'german';
  status: 'success' | 'not-found';
}

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
        <header className="app-header">
          <h1>Voice Translator</h1>
          <h3>Speak once. Understand instantly.</h3>

          <div className={`connection ${connected ? 'ok' : 'bad'}`}>
            <span />
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </header>
        <div className="language-switch">
          {(['spanish', 'german'] as const).map(lang => (
            <button
              key={lang}
              onClick={() => setTargetLanguage(lang)}
              className={targetLanguage === lang ? 'active' : ''}
            >
              {lang === 'spanish' ? '🇪🇸 Spanish' : '🇩🇪 German'}
            </button>
          ))}
        </div>
        <div className="mic-wrapper">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={!connected}
            className={`mic ${isListening ? 'listening' : ''}`}
          >
            {isListening ? '⏹' : '🎤'}
          </button>
          <p className="mic-hint">
            {isListening ? 'Listening…' : 'Tap to speak'}
          </p>
        </div>
        {transcript && (
          <div className="transcript">
            <small>{isFinal ? 'Final transcript' : 'Listening'}</small>
            <p>{transcript}</p>

            {!isFinal && (
              <button
                className="translate-btn"
                onClick={() =>
                  sendTranslationRequest(transcript, targetLanguage)
                }
              >
                Translate
              </button>
            )}
          </div>
        )}
        {error && <div className="error">{error}</div>}
        {translations.length > 0 && (
          <div className="history">
            {translations.map((t, i) => (
              <div key={i} className="bubble-group">
                <div className="bubble original">{t.original}</div>
                <div className="bubble translated">
                  {t.status === 'success'
                    ? t.translated
                    : 'Translation not found'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
