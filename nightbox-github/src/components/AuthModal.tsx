'use client';

import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  UserPlus, 
  LogIn, 
  KeyRound, 
  ArrowLeft,
  Send
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthModal() {
  const { 
    user, 
    isLoggedIn, 
    isAuthModalOpen, 
    closeAuthModal, 
    registerUser, 
    loginUser, 
    requestPasswordReset, 
    logout 
  } = useAuth();

  // Modo: 'login' | 'register' | 'forgot_password'
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>('login');

  // Campos do Formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSentEmail, setResetSentEmail] = useState('');

  if (!isAuthModalOpen) return null;

  const handleTabChange = (targetMode: 'login' | 'register' | 'forgot_password') => {
    setMode(targetMode);
    setErrorMsg('');
    setSuccessMsg('');
    setIsSendingReset(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'login') {
      const res = loginUser(email, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Erro ao entrar na conta.');
        return;
      }
      setSuccessMsg('Login realizado com sucesso! Bem-vindo de volta.');
      setTimeout(() => {
        setName('');
        setEmail('');
        setPassword('');
        setSuccessMsg('');
        closeAuthModal();
      }, 1000);
    } else if (mode === 'register') {
      const res = registerUser(name, email, password);
      if (!res.success) {
        setErrorMsg(res.message || 'Erro ao criar a conta.');
        return;
      }
      setSuccessMsg('Conta criada com sucesso! Você já está conectado.');
      setTimeout(() => {
        setName('');
        setEmail('');
        setPassword('');
        setSuccessMsg('');
        closeAuthModal();
      }, 1000);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSendingReset(true);

    const res = requestPasswordReset(email);
    setIsSendingReset(false);

    if (!res.success) {
      setErrorMsg(res.message || 'Erro ao enviar link de recuperação.');
      return;
    }

    setResetSentEmail(email.trim().toLowerCase());
    setSuccessMsg(res.message || 'Link de recuperação enviado com sucesso!');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeAuthModal}
    >
      <div
        className="bg-[#121217] border border-zinc-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {isLoggedIn && user ? (
          /* Usuário Já Logado */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-500 border border-red-500/40 flex items-center justify-center mx-auto">
              <User className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Você está conectado como
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                {user.name}
              </h3>
              <span className="text-xs text-red-400 font-medium">
                {user.email}
              </span>
            </div>

            <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs text-zinc-300">
              Sua conta está ativa e você receberá as confirmações de pedidos diretamente no seu Gmail!
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={closeAuthModal}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/30 cursor-pointer"
              >
                Continuar Comprando
              </button>
              <button
                onClick={() => {
                  logout();
                }}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition border border-zinc-800 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair da Conta</span>
              </button>
            </div>
          </div>
        ) : mode === 'forgot_password' ? (
          /* Tela de Recuperação de Senha */
          <div>
            <div className="text-center mb-5">
              <button
                type="button"
                onClick={() => handleTabChange('login')}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition mb-3 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar para o Login</span>
              </button>

              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Redefinir sua Senha
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Digite o seu Gmail cadastrado para receber o link oficial de redefinição de senha.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs space-y-2 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="font-bold text-white text-sm">E-mail Enviado com Sucesso!</div>
                  <p>
                    Enviamos o link de redefinição para <strong>{resetSentEmail}</strong>. Verifique sua caixa de entrada e spam.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleTabChange('login')}
                  className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                >
                  Voltar para Acessar Conta
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Seu Gmail Cadastrado *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="seuemail@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition"
                    />
                    <Mail className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    Enviaremos instruções seguras para este e-mail.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-red-600/40 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSendingReset ? (
                    <span>Enviando link...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar Link de Redefinição</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Abas e Formulário de Login / Cadastro */
          <div>
            {/* Cabeçalho */}
            <div className="text-center mb-5">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Área do Cliente
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Conecte seu Gmail para acompanhar o status e confirmação dos pedidos.
              </p>
            </div>

            {/* Duas Abas Claras e Destacadas */}
            <div className="grid grid-cols-2 p-1 bg-zinc-950 border border-zinc-800 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => handleTabChange('login')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  mode === 'login'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Acessar Conta</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('register')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  mode === 'register'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Criar Conta</span>
              </button>
            </div>

            {/* Alertas */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Formulário com os campos */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo Nome (Apenas no Cadastro) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Nome Completo ou Como quer ser chamado *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Oliveira"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition"
                    />
                    <User className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Campo Gmail (Obrigatório em ambos) */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Seu Gmail Oficial (@gmail.com) *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="seuemail@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition"
                  />
                  <Mail className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Enviaremos a confirmação do pagamento e o código do pedido para este Gmail.
                </span>
              </div>

              {/* Campo Senha */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  {mode === 'login' ? 'Sua Senha *' : 'Criar uma Senha *'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder={mode === 'login' ? 'Digite sua senha' : 'Crie sua senha de acesso'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition"
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Opção "Esqueceu sua senha?" pequena abaixo do campo de senha (apenas no Login) */}
                {mode === 'login' && (
                  <div className="flex justify-end mt-1.5">
                    <button
                      type="button"
                      onClick={() => handleTabChange('forgot_password')}
                      className="text-[11px] text-zinc-400 hover:text-red-400 transition underline underline-offset-2 cursor-pointer"
                    >
                      Esqueceu sua senha?
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-red-600/40 active:scale-95 cursor-pointer mt-3"
              >
                {mode === 'login' ? 'Entrar na Conta' : 'Cadastrar e Conectar'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
