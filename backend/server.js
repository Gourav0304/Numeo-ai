import { Server } from 'socket.io';
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Load translations
const translationsPath = path.join(__dirname, 'translations.json');
const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf-8'));

// Create a map for quick lookup
const translationMap = {};
translations.translations.forEach((item) => {
  translationMap[item.english.toLowerCase()] = {
    spanish: item.spanish,
    german: item.german,
  };
});

// Handle socket connections
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
          targetLanguage === 'spanish' ? translation.spanish : translation.german,
        targetLanguage,
        status: 'success',
      };
      socket.emit('translation', result);
    } else {
      // If no exact match, try partial match or return a message
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

const PORT = 3002;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
