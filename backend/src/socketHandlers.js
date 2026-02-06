import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const translationsPath = path.join(__dirname, 'translations.json');
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf-8'));

const translationMap = {};
translations.translations.forEach((item) => {
  translationMap[item.english.toLowerCase()] = {
    spanish: item.spanish,
    german: item.german,
  };
});

export function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('translate', (data) => {
      const { text, targetLanguage } = data;
      console.log(`Translating "${text}" to ${targetLanguage}`);

      const lowerText = text.toLowerCase().trim();
      const translation = translationMap[lowerText];

      if (translation) {
        const result = {
          original: text,
          translated:
            targetLanguage === 'spanish'
              ? translation.spanish
              : translation.german,
          targetLanguage,
          status: 'success',
        };
        socket.emit('translation', result);
      } else {
        const result = {
          original: text,
          translated: `[No translation found for "${text}"]`,
          targetLanguage,
          status: 'not-found',
        };
        socket.emit('translation', result);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}
