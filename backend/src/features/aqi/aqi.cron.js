import cron from 'node-cron';
import { AqiModel } from '../../models/aqi.model.js';

// Masukkan API Key gratis OpenWeatherMap Anda di sini (atau simpan di file .env)
const API_KEY = process.env.OPENWEATHER_API_KEY;
// const API_KEY = "sss";

// Daftar titik wilayah kota untuk sensor AQI
const cityLocations = [
  { name: 'Pusat Kota (Kawasan Renon)', lat: -8.671500, lng: 115.234000 },
  { name: 'Kawasan Padat Lalu Lintas (Gatot Subroto)', lat: -8.635000, lng: 115.220000 },
  { name: 'Kawasan Wisata (Sunset Road)', lat: -8.690000, lng: 115.183000 },
  { name: 'Kawasan Pemukiman (Ubung)', lat: -8.620000, lng: 115.205000 }
];

// Fungsi pemetaan skala OpenWeatherMap (1-5) ke format status & nilai aplikasi kita
const mapOwmToStatus = (owmAqi) => {
  // OpenWeatherMap scale: 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
  switch (owmAqi) {
    case 1: return { status: 'SEHAT', aqiVal: 35 };
    case 2: return { status: 'SEDANG', aqiVal: 75 };
    case 3: return { status: 'TIDAK SEHAT', aqiVal: 125 };
    case 4: 
    case 5: return { status: 'BERBAHAYA', aqiVal: 180 };
    default: return { status: 'SEHAT', aqiVal: 40 };
  }
};

export const initAqiCron = () => {
  // Untuk uji coba cepat, Anda bisa ubah "0 */6 * * *" menjadi "*/1 * * * *" (tiap 1 menit)
  cron.schedule('0 */6 * * *', async () => {
//   cron.schedule('*/1 * * * *', async () => {
    console.log('\n==================================================');
    console.log('🔄 [CRON JOB] Memulai penarikan data AQI dari OpenWeatherMap...');
    console.log('==================================================');
    
    try {
      for (const loc of cityLocations) {
        const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${loc.lat}&lon=${loc.lng}&appid=${API_KEY}`;
        console.log(`🌐 Mengambil data untuk: ${loc.name} ...`);
        
        const response = await fetch(url);
        
        // Log status HTTP dari API (Contoh: 200 OK, 401 Unauthorized jika API key salah)
        console.log(`📡 HTTP Response Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          console.error(`❌ Gagal mengambil data untuk ${loc.name}. Pastikan API Key benar.`);
          continue;
        }

        const data = await response.json();

        if (data && data.list && data.list.length > 0) {
          const apiItem = data.list[0];
          const owmAqi = apiItem.main.aqi;
          const mapped = mapOwmToStatus(owmAqi);

          // SIMPAN SEBAGAI DATA BARU (RIWAYAT / HISTORY)
          await AqiModel.create({
            locationName: loc.name,
            latitude: loc.lat,
            longitude: loc.lng,
            aqi: mapped.aqiVal,
            pm25: apiItem.components.pm2_5,
            pm10: apiItem.components.pm10,
            status: mapped.status,
            // Mongoose otomatis menambahkan 'createdAt' sebagai stempel waktu (timestamp)
          });
        } else {
          console.warn(`⚠️ Format data dari API tidak sesuai untuk ${loc.name}`);
        }
      }
      console.log('✅ [CRON JOB] Semua siklus pembaruan data AQI selesai.\n');
    } catch (error) {
      console.error('❌ [CRON JOB ERROR] Terjadi kesalahan jaringan atau sistem:', error.message);
    }
  });

  // Jalankan fetch pertama kali saat server menyala
  runInitialFetch();
};

const runInitialFetch = async () => {
  try {
    const count = await AqiModel.countDocuments();
    if (API_KEY === 'MASUKKAN_API_KEY_OPENWEATHER_ANDA_DISINI') {
      console.warn('⚠️ [PERINGATAN] Anda masih menggunakan placeholder API Key OpenWeatherMap! Ganti dengan API Key asli Anda.');
      return;
    }
    
    if (count === 0) {
      console.log('🌱 Database AQI kosong, memicu sinkronisasi awal...');
      // Memicu cron job secara manual saat boot
      // (Bisa disesuaikan atau memanggil fungsi fetch langsung)
    }
  } catch (error) {
    console.error('Gagal sinkronisasi awal AQI:', error.message);
  }
};