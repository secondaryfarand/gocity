import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Perbaikan ikon default Leaflet di React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function ComplaintMap({ complaints }) {
  // Filter hanya pengaduan yang memiliki koordinat latitude & longitude valid
  const mappedComplaints = complaints.filter(
    (c) => c.latitude !== null && c.longitude !== null && !isNaN(c.latitude) && !isNaN(c.longitude)
  );

  // Titik tengah default (misalnya pusat kota / Bali)
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
      </MapContainer>
    </div>
  );
}