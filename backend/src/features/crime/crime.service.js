import { CrimeModel } from '../../models/crime.model.js';

export const fetchAndShiftCrimeData = async () => {
  try {
    console.log('🔄 [CRON/SERVICE] Mengambil data kejahatan dari UK Police API...');
    
    // Contoh mengambil data kejahatan jalanan (street-crime) dari area tertentu di UK (London misal)
    const response = await fetch('https://data.police.uk/api/crimes-at-location?date=2024-01&lat=51.5074&lng=-0.1278');
    const crimes = await response.json();

    if (!Array.isArray(crimes) || crimes.length === 0) {
      console.log('⚠️ Tidak ada data kejahatan yang diterima.');
      return;
    }

    // Bersihkan data lama jika ingin di-refresh total
    await CrimeModel.deleteMany({});

    // Bounding Box Target di Indonesia (Contoh: Area Denpasar/Bali: Lat sekitar -8.65, Lng sekitar 115.22)
    // Kita lakukan normalisasi & pergeseran matematis dari koordinat UK ke Indonesia
    const targetBaseLat = -8.6700; 
    const targetBaseLng = 115.2100;

    const shiftedCrimes = crimes.slice(0, 50).map((item, index) => {
      // Simulasi pergeseran acak terkontrol di sekitar area target Indonesia
      const randomLatOffset = (Math.sin(index) * 0.05); 
      const randomLngOffset = (Math.cos(index) * 0.05);

      return {
        category: item.category || 'general-crime',
        latitude: targetBaseLat + randomLatOffset,
        longitude: targetBaseLng + randomLngOffset,
        streetName: item.location?.street?.name || 'Kawasan Kota',
        severity: item.category === 'violent-crime' ? 3 : 1
      };
    });

    // Simpan ke MongoDB
    await CrimeModel.insertMany(shiftedCrimes);
    console.log(`✅ Berhasil menyimpan ${shiftedCrimes.length} data titik kerawanan kriminalitas terlokalisasi.`);
  } catch (error) {
    console.error('❌ Gagal mengambil data kejahatan:', error.message);
  }
};