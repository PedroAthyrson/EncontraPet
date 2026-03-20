import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Info, MessageCircle, Plus, LogOut, Filter, Map } from 'lucide-react';
import api from '../services/api';
import MapaFeed from '../components/MapaFeed';

export default function Feed() {
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnuncios = async () => {
            try {
                const response = await api.get('/anuncios');
                setAnuncios(response.data);
            } catch (error) {
                console.error("Erro ao buscar anúncios:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnuncios();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans pb-10">

            {/* HEADER / NAVBAR */}
            <header className="bg-indigo-500 text-white sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

                    {/* Logo */}
                    <div className="flex-shrink-0 font-bold text-2xl tracking-tight">
                        Encontra<span className="text-indigo-200">Pet</span>
                    </div>

                    {/* Barra de Busca (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
                        <input
                            type="text"
                            placeholder="Buscar por cidade ou bairro..."
                            className="w-full pl-4 pr-10 py-2 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-200" size={20} />
                    </div>

                    {/* Ações do Usuário */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/novo-anuncio"
                            className="hidden sm:flex items-center bg-white text-indigo-500 px-4 py-2 rounded-full font-semibold hover:bg-indigo-50 transition"
                        >
                            <Plus size={18} className="mr-1" /> Criar Anúncio
                        </Link>

                        <button onClick={handleLogout} className="p-2 hover:bg-indigo-600 rounded-full transition" title="Sair">
                            <LogOut size={24} />
                        </button>
                    </div>
                </div>

                {/* Filtros Rápidos (Abaixo do Header) */}
                <div className="bg-indigo-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex space-x-3 overflow-x-auto text-sm">
                        <button className="flex items-center bg-indigo-500 px-4 py-1.5 rounded-full hover:bg-indigo-400 whitespace-nowrap"><Filter size={16} className="mr-1" /> Todos</button>
                        <button className="bg-indigo-500 px-4 py-1.5 rounded-full hover:bg-indigo-400 whitespace-nowrap">Cachorros</button>
                        <button className="bg-indigo-500 px-4 py-1.5 rounded-full hover:bg-indigo-400 whitespace-nowrap">Gatos</button>
                        <button className="bg-indigo-500 px-4 py-1.5 rounded-full hover:bg-indigo-400 whitespace-nowrap">Apenas Perdidos</button>
                    </div>
                </div>
            </header>

            {/* CONTEÚDO PRINCIPAL - DIVIDIDO EM DUAS COLUNAS NO DESKTOP */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
                <div className="flex flex-col-reverse lg:flex-row gap-8">

                    {/* COLUNA ESQUERDA: GRID DE CARDS (Ocupa o espaço restante) */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Últimos Registros</h2>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <p className="text-xl text-gray-500 font-semibold animate-pulse">Buscando pets...</p>
                            </div>
                        ) : anuncios.length === 0 ? (
                            <div className="text-center mt-20 text-gray-500 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                                <p className="text-2xl font-bold">Nenhum pet encontrado.</p>
                                <p className="mt-2">Seja o primeiro a criar um anúncio!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {anuncios.map((ad) => {
                                    const isPerdido = ad.status === 'PERDIDO';
                                    const nome = isPerdido ? ad.animal?.nome : ad.titulo;
                                    const racaEspecie = isPerdido ? `${ad.animal?.especie} • ${ad.animal?.raca}` : 'Animal Encontrado';
                                    const foto = isPerdido ? ad.animal?.fotoUrl : ad.animalEncontradoFotoUrl;
                                    const caracteristica = isPerdido ? ad.animal?.cor : ad.animalEncontradoDescricao;
                                    const dataFormatada = new Date(ad.dataCriacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });

                                    return (
                                        <div key={ad.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                                            <div className="relative h-48 w-full bg-gray-200">
                                                {foto ? (
                                                    <img src={foto} alt={nome} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">Sem foto</div>
                                                )}
                                                <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full shadow-sm text-white ${isPerdido ? 'bg-red-500' : 'bg-emerald-500'}`}>
                                                    {isPerdido ? 'Perdido' : 'Encontrado'}
                                                </span>
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col">
                                                <h3 className="text-lg font-bold text-gray-900 truncate">{nome}</h3>
                                                <p className="text-xs text-gray-500 font-medium mb-3">{racaEspecie}</p>
                                                <div className="space-y-1.5 text-xs text-gray-600 mb-4 flex-1">
                                                    <p className="flex items-center"><MapPin size={14} className="mr-2 text-indigo-400 flex-shrink-0" /> <span className="truncate">{ad.cidade} - {ad.estado}</span></p>
                                                    <p className="flex items-center"><Calendar size={14} className="mr-2 text-indigo-400 flex-shrink-0" /> {dataFormatada}</p>
                                                    {caracteristica && (
                                                        <p className="flex items-center"><Info size={14} className="mr-2 text-indigo-400 flex-shrink-0" /> <span className="truncate">{caracteristica}</span></p>
                                                    )}
                                                </div>
                                                <button className="w-full mt-auto bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-bold transition flex justify-center items-center text-sm">
                                                    <MessageCircle size={16} className="mr-2" />
                                                    Informações
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* COLUNA DIREITA: MAPA FIXO (Sticky) */}
                    <div className="lg:w-1/3 xl:w-[400px]">
                        {/* O "sticky top-24" faz o mapa descer acompanhando o scroll da tela */}
                        <div className="sticky top-24 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center mb-3">
                                <Map className="mr-2 text-indigo-500" size={20} /> Mapa Interativo
                            </h2>
                            {/* Definimos a altura do mapa aqui */}
                            <div className="h-[450px] rounded-xl overflow-hidden relative z-0">
                                <MapaFeed anuncios={anuncios} />
                            </div>
                            <p className="text-xs text-gray-400 mt-3 text-center">Clique nos marcadores para ver os detalhes</p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}