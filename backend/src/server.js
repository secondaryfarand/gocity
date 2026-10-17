import express from 'express';  
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDatabase } from './config/db.config.js';
import apiRouter from './routes/router.js';

const app = express();

app.use(cors());
app.use(express.json());

await connectDatabase();
app.use('/api', apiRouter)  ;
app.get('/api/test', (req, res) => {
  res.json({ message: "Database dan Server Berhasil Sinkron!" });
});
 
// Penanganan __dirname di ES Modules (Wajib ditambahkan jika nanti ingin menyatukan build di Vercel/Render)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server Backend Production berjalan di Port http://localhost:${PORT}`);
});
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server Backend berjalan di Port http://localhost:${PORT}`);
  });
}

export default app;
