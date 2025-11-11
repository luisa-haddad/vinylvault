import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const storedUser = await AsyncStorage.getItem('@vinylvault:user');
      const storedToken = await AsyncStorage.getItem('@vinylvault:token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        // Verificar se o token ainda é válido
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.data.user);
        } catch (error) {
          // Token inválido - limpar storage
          await signOut();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token } = response.data.data;

      setUser(userData);
      await AsyncStorage.setItem('@vinylvault:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@vinylvault:token', token);

      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao fazer login'
      };
    }
  }

  async function signUp(name, email, password) {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { user: userData, token } = response.data.data;

      setUser(userData);
      await AsyncStorage.setItem('@vinylvault:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@vinylvault:token', token);

      return { success: true };
    } catch (error) {
      console.error('Erro no registro:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao criar conta'
      };
    }
  }

  async function signOut() {
    setUser(null);
    await AsyncStorage.removeItem('@vinylvault:user');
    await AsyncStorage.removeItem('@vinylvault:token');
  }

  async function updateUser(userData) {
    setUser(userData);
    await AsyncStorage.setItem('@vinylvault:user', JSON.stringify(userData));
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

