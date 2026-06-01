import app from '../src/server.js';
import { connectDB } from '../src/lib/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connect error', err);
    // Still pass the request to the app; app handlers may handle failures.
  }

  return app(req, res);
}
