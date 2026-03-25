import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, MapPin, AlignLeft, Camera, PawPrint, Tag } from 'lucide-react';
import api from '../services/api';
import MapaSelecao from '../components/MapaSelecao';
import Swal from 'sweetalert2';

export default function NovoAnuncio() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    const [statusA, setStatusA] = useState('PERDIDO');

    const [anuncioData, setAnuncioData] = useState({
        titulo: '',
        descricaoEvento: '',
        cidade: '',
        estado: '',
        animalEncontradoDescricao: '',
        animalEncontradoFotoUrl: '',
        latitude: null,
        longitude: null
    });

    const [uploading, setUploading] = useState(false);

    const [meusPets, setMeusPets] = useState([]);
    const [petSelecionado, setPetSelecionado] = useState('');
    const [precisaCadastrarPet, setPrecisaCadastrarPet] = useState(false);
    const [petData, setPetData] = useState({
        nome: '', especie: 'Cachorro', raca: '', cor: '', fotoUrl: ''
    });

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await api.get('/animais');
                setMeusPets(response.data);
                if (response.data.length > 0) {
                    setPetSelecionado(response.data[0].id);
                } else {
                    setPrecisaCadastrarPet(true);
                }
            } catch (err) {
                console.error("Erro ao buscar pets", err);
            }
        };
        fetchPets();
    }, []);

    const handleAnuncioChange = (e) => setAnuncioData({ ...anuncioData, [e.target.name]: e.target.value });
    const handlePetChange = (e) => setPetData({ ...petData, [e.target.name]: e.target.value });

    const handleUploadFoto = async (e, tipo) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const imageUrl = response.data.url;
            if (tipo === 'PERDIDO') {
                setPetData({ ...petData, fotoUrl: imageUrl });
            } else if (tipo === 'ENCONTRADO') {
                setAnuncioData({ ...anuncioData, animalEncontradoFotoUrl: imageUrl });
            }

        } catch (error) {
            console.error("Erro no upload:", error);
            Swal.fire({
                title: 'Erro!',
                text: 'Não foi possível enviar a foto.',
                icon: 'error',
                confirmButtonColor: '#6366f1',
                customClass: { popup: 'rounded-3xl' }
            });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro('');

        try {
            let idAnimalFinal = null;

            if (statusA === 'PERDIDO') {
                if (precisaCadastrarPet) {
                    const petResponse = await api.post('/animais', petData);
                    idAnimalFinal = petResponse.data.id;
                } else {
                    idAnimalFinal = petSelecionado;
                }
            }

            const payload = {
                titulo: anuncioData.titulo,
                descricaoEvento: anuncioData.descricaoEvento,
                status: statusA,
                cidade: anuncioData.cidade,
                estado: anuncioData.estado,
                latitude: anuncioData.latitude,
                longitude: anuncioData.longitude,
                idAnimal: statusA === 'PERDIDO' ? idAnimalFinal : null,
                animalEncontradoDescricao: statusA === 'ENCONTRADO' ? anuncioData.animalEncontradoDescricao : null,
                animalEncontradoFotoUrl: statusA === 'ENCONTRADO' ? anuncioData.animalEncontradoFotoUrl : null,
            };

            await api.post('/anuncios', payload);

            await Swal.fire({
                title: 'Publicado!',
                text: 'Seu anúncio já está disponível no Feed para toda a comunidade.',
                icon: 'success',
                confirmButtonColor: '#6366f1',
                customClass: { popup: 'rounded-3xl' }
            });
            navigate('/feed');

        } catch (error) {
            console.error("Erro ao publicar:", error);
            setErro('Ocorreu um erro ao publicar o anúncio. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans">
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

                {/* Header do Card */}
                <div className="bg-indigo-500 p-6 text-center">
                    <h1 className="text-3xl font-bold text-white">Criar Anúncio</h1>
                    <p className="text-indigo-100 mt-2">Ajude a comunidade do EncontraPet</p>
                </div>

                <div className="p-8">
                    {/* Toggle de Status (Perdido / Encontrado) */}
                    <div className="flex space-x-4 mb-8">
                        <button
                            type="button"
                            onClick={() => setStatusA('PERDIDO')}
                            className={`flex-1 py-3 rounded-xl font-bold transition flex items-center justify-center ${statusA === 'PERDIDO' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            <AlertCircle size={20} className="mr-2" /> Perdi um Pet
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusA('ENCONTRADO')}
                            className={`flex-1 py-3 rounded-xl font-bold transition flex items-center justify-center ${statusA === 'ENCONTRADO' ? 'bg-emerald-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            <CheckCircle2 size={20} className="mr-2" /> Encontrei um Pet
                        </button>
                    </div>

                    {erro && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-center font-medium">{erro}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Informações Gerais do Evento */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Detalhes do Ocorrido</h2>

                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Título do Anúncio *</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input type="text" name="titulo" required value={anuncioData.titulo} onChange={handleAnuncioChange} placeholder="Ex: Procura-se Poodle Branco..." className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Cidade *</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input type="text" name="cidade" required value={anuncioData.cidade} onChange={handleAnuncioChange} placeholder="Ex: João Pessoa" className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Estado *</label>
                                    <input type="text" name="estado" required value={anuncioData.estado} onChange={handleAnuncioChange} placeholder="Ex: PB" maxLength="2" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition uppercase" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Descrição do Evento *</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-4 top-4 text-gray-400" size={18} />
                                    <textarea name="descricaoEvento" required value={anuncioData.descricaoEvento} onChange={handleAnuncioChange} rows="3" placeholder="Onde foi visto por último? Tem coleira? É dócil?" className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition resize-none"></textarea>
                                </div>
                            </div>
                        </div>

                        {/* O MAPA ENTRA AQUI */}
                        <div className="pt-2">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Localização Exata no Mapa *</label>
                            <p className="text-xs text-gray-500 mb-3">Navegue pelo mapa e clique no local exato para adicionar um pino de localização.</p>

                            <MapaSelecao
                                onLocationSelect={(lat, lng) => setAnuncioData({ ...anuncioData, latitude: lat, longitude: lng })}
                            />

                            {!anuncioData.latitude && (
                                <p className="text-xs text-red-500 mt-2 font-medium">Por favor, clique no mapa para marcar a localização.</p>
                            )}
                        </div>

                        {/* SEÇÃO DINÂMICA: PERDIDO */}
                        {statusA === 'PERDIDO' && (
                            <div className="space-y-4 pt-4">
                                <h2 className="text-xl font-bold text-gray-800 border-b pb-2 flex justify-between items-center">
                                    Qual Pet se perdeu?
                                    {!precisaCadastrarPet && (
                                        <button type="button" onClick={() => setPrecisaCadastrarPet(true)} className="text-sm text-indigo-500 hover:underline font-semibold">
                                            + Cadastrar outro pet
                                        </button>
                                    )}
                                </h2>

                                {!precisaCadastrarPet ? (
                                    <select
                                        value={petSelecionado}
                                        onChange={(e) => setPetSelecionado(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition font-medium"
                                    >
                                        {meusPets.map(pet => (
                                            <option key={pet.id} value={pet.id}>{pet.nome} ({pet.especie} - {pet.cor})</option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 space-y-4">
                                        <p className="text-sm text-indigo-600 font-medium mb-2">Vamos cadastrar o seu pet no sistema rapidamente:</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" name="nome" placeholder="Nome do Pet *" required value={petData.nome} onChange={handlePetChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400" />
                                            <select name="especie" required value={petData.especie} onChange={handlePetChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400">
                                                <option value="Cachorro">Cachorro</option>
                                                <option value="Gato">Gato</option>
                                                <option value="Passaro">Pássaro</option>
                                                <option value="Outro">Outro</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" name="raca" placeholder="Raça" value={petData.raca} onChange={handlePetChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400" />
                                            <input type="text" name="cor" placeholder="Cor predominante" value={petData.cor} onChange={handlePetChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400" />
                                        </div>

                                        {/* NOVO CAMPO DE FOTO (PERDIDO) */}
                                        <div className="mt-4">
                                            <label className="block text-sm font-semibold text-gray-600 mb-1">Foto do Pet</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleUploadFoto(e, 'PERDIDO')}
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                            />
                                            {uploading && <p className="text-sm text-indigo-500 mt-2 font-medium animate-pulse">Enviando foto...</p>}
                                            {petData.fotoUrl && (
                                                <img src={petData.fotoUrl} alt="Preview do Pet" className="mt-4 h-32 w-32 object-cover rounded-xl shadow-md border-2 border-indigo-100" />
                                            )}
                                        </div>

                                        {meusPets.length > 0 && (
                                            <button type="button" onClick={() => setPrecisaCadastrarPet(false)} className="text-sm text-gray-500 hover:text-gray-700 underline mt-2 block">Cancelar novo pet e escolher da lista</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SEÇÃO DINÂMICA: ENCONTRADO */}
                        {statusA === 'ENCONTRADO' && (
                            <div className="space-y-4 pt-4">
                                <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Características do Pet Encontrado</h2>
                                <div className="relative">
                                    <PawPrint className="absolute left-4 top-4 text-gray-400" size={18} />
                                    <textarea name="animalEncontradoDescricao" required value={anuncioData.animalEncontradoDescricao} onChange={handleAnuncioChange} rows="2" placeholder="Descreva o animal (ex: Gato preto, olhos verdes, assustado...)" className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-400 outline-none transition resize-none"></textarea>
                                </div>

                                {/* NOVO CAMPO DE FOTO (ENCONTRADO) */}
                                <div className="mt-4">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Foto do Pet Encontrado</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleUploadFoto(e, 'ENCONTRADO')}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                    />
                                    {uploading && <p className="text-sm text-indigo-500 mt-2 font-medium animate-pulse">Enviando foto...</p>}
                                    {anuncioData.animalEncontradoFotoUrl && (
                                        <img src={anuncioData.animalEncontradoFotoUrl} alt="Preview do Pet Encontrado" className="mt-4 h-32 w-32 object-cover rounded-xl shadow-md border-2 border-indigo-100" />
                                    )}
                                </div>

                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition flex items-center justify-center mt-8 ${(loading || uploading) ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                            {loading ? 'Publicando...' : 'Publicar Anúncio'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/feed')}
                            className="w-full py-3 text-gray-500 font-semibold hover:text-gray-800 transition"
                        >
                            Cancelar e Voltar
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}