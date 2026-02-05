interface TranscriptCardProps {
  transcript: string;
  isFinal: boolean;
  onTranslate: () => void;
}

export default function TranscriptCard({
  transcript,
  isFinal,
  onTranslate,
}: TranscriptCardProps) {
  if (!transcript) {
    return null;
  }

  return (
    <div className="transcript">
      <small>{isFinal ? 'Final transcript' : 'Listening'}</small>
      <p>{transcript}</p>

      {!isFinal && (
        <button className="translate-btn" onClick={onTranslate}>
          Translate
        </button>
      )}
    </div>
  );
}
