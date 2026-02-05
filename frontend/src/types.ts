export interface Translation {
  original: string;
  translated: string;
  targetLanguage: 'spanish' | 'german';
  status: 'success' | 'not-found';
}
