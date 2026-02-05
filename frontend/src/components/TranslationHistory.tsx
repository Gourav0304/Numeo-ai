import type { Translation } from '../types';

interface TranslationHistoryProps {
  translations: Translation[];
}

export default function TranslationHistory({
  translations,
}: TranslationHistoryProps) {
  if (translations.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {translations.map((t, i) => (
        <div key={i} className="bubble-group">
          <div className="bubble original">{t.original}</div>
          <div className="bubble translated">
            {t.status === 'success' ? t.translated : 'Translation not found'}
          </div>
        </div>
      ))}
    </div>
  );
}
