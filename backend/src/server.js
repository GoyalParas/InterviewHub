import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import {ENV} from './lib/env.js';  

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log(ENV.PORT);

const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Hello from the backend!' });
});

if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'dist')));

  app.get(/.*/,  (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'dist', 'index.html'));
  });
}

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});