import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone } from 'lucide-react';
import api from '../services/api';

export default function Cadastro() {
    const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', senha: '' });
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        try {
            await api.post('/usuarios', formData);

            alert('Conta criada com sucesso! Pode agora fazer o login.');

            navigate('/login');

        } catch (error) {
            console.error("Erro no cadastro", error);
            if (error.response && error.response.status === 400) {
                setErro('Dados inválidos ou e-mail já registado. Verifique os campos.');
            } else {
                setErro('Erro ao tentar ligar ao servidor. Tente mais tarde.');
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-sans">
            {/* Lado Esquerdo - Painel Azul */}
            <div className="md:w-5/12 bg-indigo-500 text-white flex flex-col justify-center items-center p-10 text-center">
                <h1 className="text-4xl font-bold mb-6">Bem-vindo de volta</h1>
                <p className="mb-8 text-lg">Acesse a sua conta</p>
                <Link
                    to="/login"
                    className="px-12 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-indigo-500 transition-colors"
                >
                    ENTRAR
                </Link>
            </div>

            {/* Lado Direito - Formulário */}
            <div className="md:w-7/12 bg-white flex justify-center items-center p-10">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-indigo-500 text-center mb-10">Criar a sua conta</h2>

                    {/* Mensagem de Erro */}
                    {erro && <p className="text-red-500 font-bold mb-4 text-center bg-red-50 p-3 rounded-lg border border-red-200">{erro}</p>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="text" name="nome" placeholder="Nome" required
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl outline-none text-gray-900 placeholder-gray-600 focus:border-indigo-500 transition-colors font-medium"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="email" name="email" placeholder="E-mail" required
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl outline-none text-gray-900 placeholder-gray-600 focus:border-indigo-500 transition-colors font-medium"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="tel" name="telefone" placeholder="Telefone" required
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl outline-none text-gray-900 placeholder-gray-600 focus:border-indigo-500 transition-colors font-medium"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="password" name="senha" placeholder="Senha" required minLength="6"
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl outline-none text-gray-900 placeholder-gray-600 focus:border-indigo-500 transition-colors font-medium"
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600 transition-colors shadow-lg mt-4 cursor-pointer"
                        >
                            CADASTRAR
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}