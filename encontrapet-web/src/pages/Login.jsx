import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, UserCircle2 } from 'lucide-react';
import api from '../services/api'; 

export default function Login() {
    const [credentials, setCredentials] = useState({ email: '', senha: '' });
    const [erro, setErro] = useState(''); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        try {
            const resposta = await api.post('/auth/login', credentials);
            
            const token = resposta.data.token; 
            
            localStorage.setItem('token', token);
            
            alert('Login realizado com sucesso!');
            navigate('/feed');

        } catch (error) {
            console.error("Erro no login", error);
            setErro('E-mail ou senha incorretos. Tente novamente.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-200 flex justify-center items-center p-4 font-sans">
            {/* Card Azul */}
            <div className="bg-indigo-500 rounded-3xl p-8 sm:p-12 w-full max-w-md shadow-2xl flex flex-col items-center">
                <UserCircle2 size={100} className="text-white mb-8" strokeWidth={1.5} />

                {/* Mostra mensagem de erro se houver */}
                {erro && <p className="text-red-300 font-bold mb-4">{erro}</p>}

                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-200" size={20} />
                        <input
                            type="email" name="email" placeholder="E-mail" required
                            className="w-full pl-12 pr-4 py-4 rounded-xl outline-none text-gray-200 bg-indigo-600 placeholder-gray-300 focus:ring-4 focus:ring-indigo-300"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-200" size={20} />
                        <input
                            type="password" name="senha" placeholder="Senha" required
                            className="w-full pl-12 pr-4 py-4 rounded-xl outline-none text-gray-200 bg-indigo-600 placeholder-gray-300 focus:ring-4 focus:ring-indigo-300"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="pt-4 flex flex-col items-center">
                        <button
                            type="submit"
                            className="px-12 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-indigo-500 transition-colors w-full sm:w-auto cursor-pointer"
                        >
                            Entrar
                        </button>

                        <Link to="/cadastro" className="text-indigo-200 mt-6 text-sm hover:text-white underline">
                            Não possui conta? Cadastre-se aqui
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}