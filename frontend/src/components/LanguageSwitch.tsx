import { TargetLanguage } from '../types';

interface LanguageSwitchProps {
  targetLanguage: TargetLanguage;
  onChange: (language: TargetLanguage) => void;
}

export const LanguageSwitch = ({
  targetLanguage,
  onChange,
}: LanguageSwitchProps) => {
  return (
    <div className="language-switch">
      {([TargetLanguage.Spanish, TargetLanguage.German] as const).map(lang => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={targetLanguage === lang ? 'active' : ''}
        >
          {lang === TargetLanguage.Spanish ? '🇪🇸 Spanish' : '🇩🇪 German'}
        </button>
      ))}
    </div>
  );
}
