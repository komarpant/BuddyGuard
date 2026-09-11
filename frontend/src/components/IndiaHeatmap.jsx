import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons based on severity
const getMarkerIcon = (severity) => {
  const color = severity === 'Critical' ? 'red' : severity === 'Medium' ? 'orange' : 'green';
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

export default function IndiaHeatmap() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/incidents')
      .then(res => {
        if (!res.ok) throw new Error("Backend endpoint missing");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setIncidents(data);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch(err => {
        console.log("Backend offline or missing endpoint, using seed data.");
        setIncidents([
          { case_id: "CAS-001", city: "Delhi", lat: 28.6139, lng: 77.2090, category: "Extortion", severity: "Critical", status: "Resolved" },
          { case_id: "CAS-002", city: "Mumbai", lat: 19.0760, lng: 72.8777, category: "Vulgarity", severity: "Medium", status: "Review" },
          { case_id: "CAS-003", city: "Bengaluru", lat: 12.9716, lng: 77.5946, category: "Bullying", severity: "Low", status: "Reported" },
        ]);
      });
  }, []);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#EFEAE2] flex flex-col h-full min-h-[500px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">All-India Cyberbullying Heatmap</h3>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Critical</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Medium</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Low</span>
        </div>
      </div>

      <div className="flex-1 rounded-2xl overflow-hidden border border-[#EFEAE2] relative z-0">
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {Array.isArray(incidents) && incidents.map((inc, idx) => (
            <Marker key={idx} position={[inc.lat, inc.lng]} icon={getMarkerIcon(inc.severity)}>
              <Popup className="rounded-xl">
                <div className="p-1">
                  <h4 className="font-bold text-sm mb-1">{inc.city} ({inc.case_id})</h4>
                  <p className="text-xs text-slate-600 mb-1"><strong>Category:</strong> {inc.category}</p>
                  <p className="text-xs text-slate-600 mb-1"><strong>Status:</strong> {inc.status}</p>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${inc.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                      inc.severity === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>
                    {inc.severity}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}