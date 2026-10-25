import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import 'leaflet.heat'; // Mengaktifkan plugin heatmap
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    // Format data untuk leaflet.heat: [lat, lng, intensity]
    const heatPoints = points.map(p => [p.latitude, p.longitude, p.severity || 1]);

    const heatLayer = L.heatLayer(heatPoints, {
      // radius: 25,
      radius: 50,
      // blur: 15,
      blur: 1,
      maxZoom: 17,
      gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' } // Gradasi warna zona aman ke zona merah
    });

    heatLayer.addTo(map);

    const canvas = map.getContainer().querySelector('canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
    }
    return () => {
      map.removeLayer(heatLayer); // Bersihkan layer saat komponen di-unmount
    };
  }, [map, points]);

  return null;
}

// Tambahkan aqiList pada props
export default function ComplaintMap({ complaints, cctvList = [], aqiList = [], crimeList = [], onSelectCCTV }) {
  const mappedComplaints = complaints.filter(
    (c) => c.latitude !== null && c.longitude !== null && !isNaN(c.latitude) && !isNaN(c.longitude)
  );

  const defaultCenter = [-8.409518, 115.188919]; 
  const centerPosition = mappedComplaints.length > 0 
    ? [mappedComplaints[0].latitude, mappedComplaints[0].longitude] 
    : defaultCenter;

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc' }}>
      <MapContainer center={centerPosition} zoom={11} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HeatmapLayer points={crimeList} />

        {/* 1. Marker Pengaduan Warga */}
        {mappedComplaints.map((complaint) => (
          <Marker key={complaint.ticketNumber} position={[complaint.latitude, complaint.longitude]}>
            <Popup>
              <div style={{ maxWidth: '200px' }}>
                <strong>Tiket: {complaint.ticketNumber}</strong>
                <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>Kategori:</strong> {complaint.category}</p>
                <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>Status:</strong> {complaint.status}</p>
                <p style={{ margin: '4px 0', fontSize: '12px' }}>{complaint.content.substring(0, 60)}...</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 2. Marker CCTV Kota */}
        {cctvList.map((cam) => (
          <Marker key={cam._id} position={[cam.latitude, cam.longitude]}>
            <Popup>
              <div style={{ maxWidth: '180px' }}>
                <strong>📹 CCTV Kota</strong>
                <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>{cam.name}</strong></p>
                <p style={{ margin: '4px 0', fontSize: '12px' }}>Status: {cam.status}</p>
                {onSelectCCTV && (
                  <button 
                    onClick={() => onSelectCCTV(cam)}
                    style={{ 
                      marginTop: '6px', padding: '4px 8px', background: '#007bff', 
                      color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold'
                    }}
                  >
                    Tonton Live
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 3. Marker Sensor Kualitas Udara (AQI) */}
        {aqiList.map((aqi) => (
          <Marker key={aqi._id} position={[aqi.latitude, aqi.longitude]}>
            <Popup>
              <div style={{ maxWidth: '180px' }}>
                <strong>🍃 Sensor Kualitas Udara</strong>
                <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>{aqi.locationName}</strong></p>
                <p style={{ margin: '4px 0', fontSize: '12px' }}>AQI Index: <strong>{aqi.aqi}</strong></p>
                <p style={{ margin: '4px 0', fontSize: '12px' }}>PM2.5: {aqi.pm25} | PM10: {aqi.pm10}</p>
                <span style={{ 
                  display: 'inline-block', marginTop: '4px', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold',
                  background: aqi.status === 'SEHAT' ? '#2ecc71' : aqi.status === 'SEDANG' ? '#f1c40f' : '#e74c3c',
                  color: '#fff'
                }}>
                  {aqi.status}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
}