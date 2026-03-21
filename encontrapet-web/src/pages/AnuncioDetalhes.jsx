import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Info, Send, User, Trash2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';

// Ícones do mapa
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

export default function AnuncioDetalhes() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [anuncio, setAnuncio] = useState(null);
    const [loading, setLoading] = useState(true);

    const [comentarios, setComentarios] = useState([]);
    const [novoComentario, setNovoComentario] = useState('');
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        const fetchDetalhes = async () => {
            try {
                const response = await api.get(`/anuncios/${id}`);
                setAnuncio(response.data);

                try {
                    const resComentarios = await api.get(`/anuncios/${id}/comentarios`);
                    setComentarios(resComentarios.data);
                } catch (e) { console.log("Rota de comentários não encontrada ou vazia."); }

            } catch (error) {
                console.error("Erro ao buscar detalhes:", error);
                alert("Anúncio não encontrado!");
                navigate('/feed');
            } finally {
                setLoading(false);
            }
        };
        fetchDetalhes();
    }, [id, navigate]);

    const handleEnviarComentario = async (e) => {
        e.preventDefault();
        if (!novoComentario.trim()) return;

        setEnviando(true);
        try {
            const response = await api.post(`/anuncios/${id}/comentarios`, {
                texto: novoComentario
            });

            setComentarios([...comentarios, response.data]);
            setNovoComentario('');

        } catch (error) {
            console.error("Erro ao enviar comentário:", error);
            alert("Erro ao enviar comentário.");
        } finally {
            setEnviando(false);
        }
    };

    const handleExcluirAnuncio = async () => {
        const confirmacao = window.confirm("Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.");

        if (confirmacao) {
            try {
                await api.delete(`/anuncios/${id}`);
                alert("Anúncio excluído com sucesso!");
                navigate('/feed');
            } catch (error) {
                console.error("Erro ao excluir:", error);
                alert("Erro: Você não tem permissão para excluir este anúncio ou ele não existe mais.");
            }
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><p className="text-xl text-gray-500 animate-pulse">Carregando detalhes...</p></div>;
    if (!anuncio) return null;

    const isPerdido = anuncio.status === 'PERDIDO';
    const nome = isPerdido ? anuncio.animal?.nome : anuncio.titulo;
    const racaEspecie = isPerdido ? `${anuncio.animal?.especie} • ${anuncio.animal?.raca}` : 'Animal Encontrado';
    const foto = isPerdido ? anuncio.animal?.fotoUrl : anuncio.animalEncontradoFotoUrl;
    const caracteristica = isPerdido ? anuncio.animal?.cor : anuncio.animalEncontradoDescricao;
    const dataFormatada = new Date(anuncio.dataCriacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-12">
            {/* Header Simples */}
            <header className="bg-indigo-500 text-white h-20 flex items-center shadow-md px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto w-full flex items-center">
                    <Link to="/feed" className="flex items-center text-indigo-100 hover:text-white transition font-medium">
                        <ArrowLeft size={24} className="mr-2" /> Voltar ao Feed
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* COLUNA ESQUERDA: FOTO E INFORMAÇÕES */}
                    <div className="lg:w-2/3 space-y-6">

                        {/* Card Principal */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="relative h-96 bg-gray-200">
                                {foto ? (
                                    <img src={foto} alt={nome} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">Sem foto disponível</div>
                                )}
                                <span className={`absolute top-4 left-4 px-4 py-1.5 text-sm font-bold rounded-full shadow-md text-white ${isPerdido ? 'bg-red-500' : 'bg-emerald-500'}`}>
                                    {isPerdido ? 'Animal Perdido' : 'Animal Encontrado'}
                                </span>
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">{nome}</h1>

                                    {/* Só mostra o botão de excluir se o usuário estiver logado */}
                                    {localStorage.getItem('token') && (
                                        <button
                                            onClick={handleExcluirAnuncio}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Excluir Anúncio"
                                        >
                                            <Trash2 size={22} />
                                        </button>
                                    )}
                                </div>
                                <p className="text-lg text-gray-500 font-medium mb-6">{racaEspecie}</p>

                                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">Detalhes do Ocorrido</h2>
                                <p className="text-gray-700 leading-relaxed mb-6">{anuncio.descricaoEvento}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <div className="flex items-start">
                                        <MapPin className="text-indigo-500 mt-1 mr-3 flex-shrink-0" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500 font-semibold">Localização</p>
                                            <p className="text-gray-800">{anuncio.cidade} - {anuncio.estado}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Calendar className="text-indigo-500 mt-1 mr-3 flex-shrink-0" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500 font-semibold">Data do Registo</p>
                                            <p className="text-gray-800">{dataFormatada}</p>
                                        </div>
                                    </div>
                                    {caracteristica && (
                                        <div className="flex items-start sm:col-span-2 mt-2">
                                            <Info className="text-indigo-500 mt-1 mr-3 flex-shrink-0" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-500 font-semibold">Características / Descrição Física</p>
                                                <p className="text-gray-800">{caracteristica}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Card do Mapa Focado */}
                        {anuncio.latitude && anuncio.longitude && (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <MapPin className="mr-2 text-indigo-500" /> Localização Exata
                                </h2>
                                <div className="h-64 rounded-xl overflow-hidden relative z-0 border-2 border-gray-100">
                                    <MapContainer center={[anuncio.latitude, anuncio.longitude]} zoom={16} scrollWheelZoom={false} className="h-full w-full absolute inset-0">
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <Marker position={[anuncio.latitude, anuncio.longitude]} icon={isPerdido ? redIcon : greenIcon}>
                                            <Popup>Local da ocorrência</Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* COLUNA DIREITA: USUÁRIO E COMENTÁRIOS */}
                    <div className="lg:w-1/3 space-y-6">

                        {/* Card do Anunciante */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 text-center">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500">
                                <User size={40} />
                            </div>
                            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Anunciante</p>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">{anuncio.nomeUsuario || "Usuário do EncontraPet"}</h3>
                            <a href={`mailto:contato@exemplo.com`} className="block w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-bold transition">
                                Entrar em Contato
                            </a>
                        </div>

                        {/* Secção de Comentários */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col h-[500px]">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Comentários e Pistas</h2>

                            {/* Lista de Comentários */}
                            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                                {comentarios.length === 0 ? (
                                    <p className="text-center text-gray-500 text-sm italic mt-10">Nenhum comentário ainda. Tem alguma pista? Deixe uma mensagem abaixo!</p>
                                ) : (
                                    comentarios.map(com => (
                                        <div key={com.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-sm text-gray-900">{com.nomeUsuario || "Usuário"}</span>
                                                <span className="text-xs text-gray-500">{new Date(com.dataCriacao).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-700">{com.texto}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Input de Novo Comentário (Com verificação de Login) */}
                            {localStorage.getItem('token') ? (
                                <form onSubmit={handleEnviarComentario} className="relative mt-auto">
                                    <input
                                        type="text"
                                        value={novoComentario}
                                        onChange={(e) => setNovoComentario(e.target.value)}
                                        placeholder="Escreva um comentário..."
                                        className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                    />
                                    <button
                                        type="submit"
                                        disabled={enviando || !novoComentario.trim()}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition cursor-pointer"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            ) : (
                                <div className="mt-auto bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
                                    <p className="text-sm text-indigo-800 font-medium mb-2">Faça login para deixar um comentário ou pista.</p>
                                    <Link to="/login" className="inline-block px-6 py-2 bg-indigo-500 text-white text-sm font-bold rounded-lg hover:bg-indigo-600 transition">
                                        Ir para o Login
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}