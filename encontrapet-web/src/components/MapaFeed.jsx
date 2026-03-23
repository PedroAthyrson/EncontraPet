import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function MapCenterUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 12);
        }
    }, [center, map]);
    return null;
}

export default function MapaFeed({ anuncios }) { 
    const [centroMapa, setCentroMapa] = useState([-7.11532, -34.86105]);
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCentroMapa([latitude, longitude]);
                },
                (error) => {
                    console.error("Erro ao pegar geolocalização:", error);
                }
            );
        }
    }, []);

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden shadow-sm border-2 border-gray-100 z-0 relative">
            <MapContainer center={centroMapa} zoom={11} scrollWheelZoom={false} className="h-full w-full absolute inset-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Componente que move o mapa para o usuário */}
                <MapCenterUpdater center={centroMapa} />

                {/* Percorre todos os anúncios para renderizar os pinos */}
                {anuncios.map((ad) => {
                    if (!ad.latitude || !ad.longitude) return null;

                    const isPerdido = ad.status === 'PERDIDO';
                    const nome = isPerdido ? ad.animal?.nome : ad.titulo;
                    const foto = isPerdido ? ad.animal?.fotoUrl : ad.animalEncontradoFotoUrl;

                    return (
                        <Marker
                            key={ad.id}
                            position={[ad.latitude, ad.longitude]}
                            icon={isPerdido ? redIcon : greenIcon}
                        >
                            <Popup className="rounded-xl">
                                <div className="text-center w-36">
                                    {foto ? (
                                        <img src={foto} alt={nome} className="w-full h-24 object-cover rounded-lg mb-2 shadow-sm" />
                                    ) : (
                                        <div className="w-full h-24 bg-gray-200 rounded-lg mb-2 flex items-center justify-center text-xs text-gray-500 shadow-sm">Sem foto</div>
                                    )}
                                    <p className="font-bold text-sm text-gray-900 truncate">{nome}</p>
                                    <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${isPerdido ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {isPerdido ? 'Perdido' : 'Encontrado'}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}