import { useState, useEffect } from 'react';
import { useVoiceRecording } from './hooks/useVoiceRecording';
import { initializeSocket, getSocket, sendTranslationRequest } from './socket';
import './App.css';

interface Translation {
  original: string;
  translated: string;
  targetLanguage: 'spanish' | 'german';
  status: 'success' | 'not-found';
}

function App() {
  const { isListening, transcript, isFinal, error, startListening, stopListening, resetTranscript } =
    useVoiceRecording();
  const [targetLanguage, setTargetLanguage] = useState<'spanish' | 'german'>('spanish');
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = initializeSocket();

    socket.on('connect', () => {
      setConnected(true);
      console.log('Connected to translation server');
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('translation', (data: Translation) => {
      console.log('Received translation:', data);
      setTranslations((prev) => [data, ...prev]);
      resetTranscript();
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('translation');
    };
  }, [resetTranscript]);

  const handleTranslate = () => {
    if (transcript.trim()) {
      sendTranslationRequest(transcript, targetLanguage);
    }
  };

  const handleRecordingComplete = () => {
    if (transcript.trim() && isFinal) {
      sendTranslationRequest(transcript, targetLanguage);
    }
  };

  useEffect(() => {
    if (isFinal && transcript.trim()) {
      handleRecordingComplete();
    }
  }, [isFinal, transcript]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎤 Voice Translator</h1>
          <p className="text-gray-600">Speak naturally and get instant translations</p>
        </div>

        {/* Connection Status */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-full font-semibold ${
            connected
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-600' : 'bg-red-600'}`}></span>
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {/* Main Controls */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Language Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Target Language
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setTargetLanguage('spanish')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  targetLanguage === 'spanish'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                🇪🇸 Spanish
              </button>
              <button
                onClick={() => setTargetLanguage('german')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  targetLanguage === 'german'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                🇩🇪 German
              </button>
            </div>
          </div>

          {/* Recording Button */}
          <div className="mb-6">
            <div className="flex gap-4 justify-center">
              <button
                onClick={startListening}
                disabled={isListening || !connected}
                className={`px-8 py-4 rounded-lg font-bold text-lg transition-all transform ${
                  isListening || !connected
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:scale-105'
                }`}
              >
                🎤 Start Recording
              </button>
              <button
                onClick={stopListening}
                disabled={!isListening}
                className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                  !isListening
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg'
                }`}
              >
                ⏹️ Stop Recording
              </button>
            </div>
            {isListening && (
              <div className="flex justify-center mt-4">
                <span className="flex items-center gap-2 text-indigo-600 font-semibold">
                  <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>
                  Listening...
                </span>
              </div>
            )}
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="mb-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-gray-600 font-semibold mb-1">
                  {isFinal ? '✓ Final Transcript' : '🔄 Interim Transcript'}
                </p>
                <p className={`text-lg ${isFinal ? 'text-gray-900 font-semibold' : 'text-gray-700 italic'}`}>
                  {transcript}
                </p>
              </div>
              {!isFinal && (
                <button
                  onClick={handleTranslate}
                  className="mt-3 w-full px-4 py-2 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 transition-all"
                >
                  📝 Translate Now
                </button>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700 font-semibold">❌ {error}</p>
            </div>
          )}
        </div>

        {/* Translations History */}
        {translations.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📚 Translations</h2>
            <div className="space-y-4">
              {translations.map((translation, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Original (English)
                      </p>
                      <p className="text-lg text-gray-900 font-semibold">{translation.original}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        {translation.targetLanguage === 'spanish' ? '🇪🇸 Spanish' : '🇩🇪 German'}
                      </p>
                      <p className={`text-lg font-semibold ${
                        translation.status === 'success'
                          ? 'text-indigo-700'
                          : 'text-yellow-600 italic'
                      }`}>
                        {translation.translated}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
