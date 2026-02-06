interface MicControlsProps {
  isListening: boolean;
  connected: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const MicControls = ({
  isListening,
  connected,
  onStart,
  onStop,
}: MicControlsProps) => {
  return (
    <div className="mic-wrapper">
      <button
        onClick={isListening ? onStop : onStart}
        disabled={!connected}
        className={`mic ${isListening ? 'listening' : ''}`}
      >
        {isListening ? '⏹' : '🎤'}
      </button>
      <p className="mic-hint">{isListening ? 'Listening…' : 'Tap to speak'}</p>
    </div>
  );
}
