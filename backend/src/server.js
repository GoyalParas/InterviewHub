import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {connectDB} from './lib/db.js';
import cors from 'cors';
import {inngest, functions} from './lib/inngest.js';
import {serve} from 'inngest/express';


import {ENV} from './lib/env.js';  

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use("/api/inngest", serve({ client: inngest, functions }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log(ENV.PORT);



app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Hello from the backend!' });
});

if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'dist')));

  app.get(/.*/,  (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'dist', 'index.html'));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {   
    console.error('Failed to connect to MongoDB', error);
  }
};

startServer();