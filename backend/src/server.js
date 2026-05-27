import express from 'express';
import dotenv from 'dotenv';

import {ENV} from './lib/env.js';  

dotenv.config();

console.log(ENV.PORT);

const app = express();

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from the backend!' });
});

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});