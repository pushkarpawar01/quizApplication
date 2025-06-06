import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

export const config = {
  port: process.env.PORT || 5000
};

// Log on startup to verify it's loading
console.log("Configuration loaded:", 
  "PORT:", config.port);
