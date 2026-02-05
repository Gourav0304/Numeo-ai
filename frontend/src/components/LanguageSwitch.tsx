interface LanguageSwitchProps {
  targetLanguage: 'spanish' | 'german';
  onChange: (language: 'spanish' | 'german') => void;
}

export default function LanguageSwitch({
  targetLanguage,
  onChange,
}: LanguageSwitchProps) {
  return (
    <div className="language-switch">
      {(['spanish', 'german'] as const).map(lang => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={targetLanguage === lang ? 'active' : ''}
        >
          {lang === 'spanish' ? '🇪🇸 Spanish' : '🇩🇪 German'}
        </button>
      ))}
    </div>
  );
}
