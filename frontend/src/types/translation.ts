export const TargetLanguage = {
  Spanish: 'spanish',
  German: 'german',
} as const;

export type TargetLanguage = typeof TargetLanguage[keyof typeof TargetLanguage];

export interface Translation {
  original: string;
  translated: string;
  targetLanguage: TargetLanguage;
  status: 'success' | 'not-found';
}
