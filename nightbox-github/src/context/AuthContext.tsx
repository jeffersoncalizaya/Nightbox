'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserAccount {
  name: string;
  email: string;
  password?: string;
  createdAt: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  user: UserAccount | null;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  registerUser: (name: string, email: string, password: string) => AuthResponse;
  loginUser: (email: string, password: string) => AuthResponse;
  requestPasswordReset: (email: string) => AuthResponse;
  resetPassword: (email: string, token: string, newPassword: string) => AuthResponse;
  logout: () => void;
}

const AUTH_KEY = 'nightbox_current_user_v2';
const USERS_LIST_KEY = 'nightbox_registered_users_v2';
const RESET_TOKENS_KEY = 'nightbox_reset_tokens';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Validador de Gmail válido
export function isValidGmail(email: string): boolean {
  const clean = email.trim().toLowerCase();
  const gmailRegex = /^[a-z0-9](\.?[a-z0-9_-]){4,}@gmail\.com$/i;
  return gmailRegex.test(clean);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Erro ao carregar sessão do usuário:', e);
    }
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Cadastro de Novo Usuário (Nome + Gmail + Senha)
  const registerUser = (name: string, email: string, password: string): AuthResponse => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) return { success: false, message: 'Por favor, informe o seu Nome.' };
    
    if (!cleanEmail) {
      return { success: false, message: 'Por favor, informe o seu Gmail.' };
    }

    if (!isValidGmail(cleanEmail)) {
      return { 
        success: false, 
        message: 'Informe um Gmail válido terminado em @gmail.com (ex: seunome@gmail.com).' 
      };
    }

    if (!password.trim() || password.length < 3) {
      return { success: false, message: 'A senha deve ter pelo menos 3 caracteres.' };
    }

    try {
      const rawUsers = localStorage.getItem(USERS_LIST_KEY);
      const users: UserAccount[] = rawUsers ? JSON.parse(rawUsers) : [];

      const existing = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (existing) {
        return {
          success: false,
          message: 'Já existe uma conta cadastrada com esse Gmail. Mude para a aba "Acessar Conta" para entrar.'
        };
      }

      const newUser: UserAccount = {
        name: cleanName,
        email: cleanEmail,
        password: password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));

      // Conecta o usuário recém-criado
      setUser(newUser);
      localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
      return { success: true };
    } catch (e) {
      console.error('Erro no cadastro:', e);
      return { success: false, message: 'Erro ao cadastrar. Tente novamente.' };
    }
  };

  // Login de Usuário Existente (Gmail + Senha)
  const loginUser = (email: string, password: string): AuthResponse => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) return { success: false, message: 'Informe o seu Gmail cadastrado.' };
    
    if (!isValidGmail(cleanEmail)) {
      return { 
        success: false, 
        message: 'Formato inválido. O e-mail deve terminar em @gmail.com' 
      };
    }

    if (!password.trim()) return { success: false, message: 'Digite a sua Senha.' };

    try {
      const rawUsers = localStorage.getItem(USERS_LIST_KEY);
      const users: UserAccount[] = rawUsers ? JSON.parse(rawUsers) : [];

      const found = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (!found) {
        return {
          success: false,
          message: 'Nenhuma conta encontrada com esse Gmail. Clique na aba "Criar Conta" para se cadastrar.'
        };
      }

      if (found.password && found.password !== password) {
        return { success: false, message: 'Senha incorreta. Verifique e tente novamente.' };
      }

      // Conecta o usuário
      setUser(found);
      localStorage.setItem(AUTH_KEY, JSON.stringify(found));
      return { success: true };
    } catch (e) {
      console.error('Erro no login:', e);
      return { success: false, message: 'Erro ao entrar. Tente novamente.' };
    }
  };

  // Solicitação de Redefinição de Senha
  const requestPasswordReset = (email: string): AuthResponse => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) return { success: false, message: 'Informe o seu Gmail para recuperar a senha.' };

    if (!isValidGmail(cleanEmail)) {
      return { success: false, message: 'Informe um Gmail válido terminado em @gmail.com' };
    }

    try {
      const rawUsers = localStorage.getItem(USERS_LIST_KEY);
      const users: UserAccount[] = rawUsers ? JSON.parse(rawUsers) : [];

      const found = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (!found) {
        return { 
          success: false, 
          message: 'Não encontramos nenhuma conta com esse Gmail. Verifique ou crie uma conta nova.' 
        };
      }

      // Gera token seguro de redefinição
      const token = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      const rawTokens = localStorage.getItem(RESET_TOKENS_KEY);
      const tokens: { email: string; token: string; expiresAt: number }[] = rawTokens ? JSON.parse(rawTokens) : [];
      
      // Expira em 2 horas
      tokens.push({
        email: cleanEmail,
        token,
        expiresAt: Date.now() + 2 * 60 * 60 * 1000
      });

      localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(tokens));

      return { 
        success: true, 
        message: `Link de redefinição enviado com sucesso para ${cleanEmail}!` 
      };
    } catch (e) {
      console.error('Erro na recuperação de senha:', e);
      return { success: false, message: 'Erro ao processar solicitação. Tente novamente.' };
    }
  };

  // Concluir redefinição de senha com token
  const resetPassword = (email: string, token: string, newPassword: string): AuthResponse => {
    const cleanEmail = email.trim().toLowerCase();
    if (!newPassword.trim() || newPassword.length < 3) {
      return { success: false, message: 'A nova senha deve ter no mínimo 3 caracteres.' };
    }

    try {
      const rawTokens = localStorage.getItem(RESET_TOKENS_KEY);
      const tokens: { email: string; token: string; expiresAt: number }[] = rawTokens ? JSON.parse(rawTokens) : [];
      
      const validToken = tokens.find(t => t.email === cleanEmail && t.token === token && t.expiresAt > Date.now());
      if (!validToken) {
        return { success: false, message: 'Link de redefinição expirado ou inválido. Solicite um novo.' };
      }

      const rawUsers = localStorage.getItem(USERS_LIST_KEY);
      const users: UserAccount[] = rawUsers ? JSON.parse(rawUsers) : [];

      const userIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
      if (userIndex === -1) {
        return { success: false, message: 'Usuário não encontrado.' };
      }

      users[userIndex].password = newPassword;
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));

      // Remove token usado
      const remainingTokens = tokens.filter(t => t.token !== token);
      localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(remainingTokens));

      return { success: true, message: 'Senha alterada com sucesso! Você já pode entrar com sua nova senha.' };
    } catch (e) {
      console.error('Erro ao redefinir senha:', e);
      return { success: false, message: 'Erro ao redefinir senha. Tente novamente.' };
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        registerUser,
        loginUser,
        requestPasswordReset,
        resetPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
