// Menggunakan sintaks ES Modules modern (import)
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint API sederhana
app.get('/api/test', (req, res) => {
  res.json({ message: "Koneksi Fullstack Berhasil dengan ES Modules!" });
});

// Penanganan __dirname di ES Modules (Wajib ditambahkan jika nanti ingin menyatukan build di Vercel/Render)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server Backend (ESM) berjalan di http://localhost:${PORT}`);
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server Backend (ESM) berjalan di http://localhost:${PORT}`);
  });
}

export default app;
