import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search } from 'lucide-react';
import Swal from 'sweetalert2';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, onLocationSelect }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return position === null ? null : <Marker position={position}></Marker>;
}

function MapUpdater({ center }) {
    const map = useMap();
    if (center) {
        map.flyTo(center, 16);
    }
    return null;
}

export default function MapaSelecao({ onLocationSelect }) {
    const [position, setPosition] = useState(null);
    const [mapCenter, setMapCenter] = useState([-7.11532, -34.86105]);

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchQuery) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                const newPos = { lat: parseFloat(lat), lng: parseFloat(lon) };

                setPosition(newPos);
                setMapCenter([newPos.lat, newPos.lng]);
                onLocationSelect(newPos.lat, newPos.lng);
            } else {
                Swal.fire({
                    title: 'Não encontrado',
                    text: 'Tente colocar a Rua, Número e Cidade (Ex: Avenida Epitácio Pessoa, João Pessoa).',
                    icon: 'warning',
                    confirmButtonColor: '#6366f1',
                    customClass: { popup: 'rounded-3xl' }
                });
            }
        } catch (error) {
            console.error("Erro ao buscar endereço:", error);
            Swal.fire({
                title: 'Erro de Conexão',
                text: 'Não foi possível buscar o endereço no momento.',
                icon: 'error',
                confirmButtonColor: '#6366f1',
                customClass: { popup: 'rounded-3xl' }
            });
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(e);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Digite a rua, bairro ou cidade para achar no mapa..."
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-400 transition-colors"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl font-bold hover:bg-indigo-200 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                    {isSearching ? 'Buscando...' : 'Buscar Local'}
                </button>
            </div>

            <div className="h-72 w-full rounded-xl overflow-hidden border-2 border-gray-200 z-0 relative">
                <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} className="h-full w-full absolute inset-0">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
                    <MapUpdater center={mapCenter} />
                </MapContainer>
            </div>
        </div>
    );
}