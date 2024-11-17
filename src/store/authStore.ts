import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  balance: number;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateBalance: (amount: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  balance: 0,
  login: async (email: string, password: string) => {
    if (email === 'vk7480954294@gmail.com' && password === '123456') {
      set({
        user: {
          id: 'admin',
          email,
          name: 'Admin',
          role: 'admin',
          borrowedBooks: [],
          fines: 0,
          balance: 1000
        },
        isAuthenticated: true,
      });
    } else {
      // Simulate user login
      set({
        user: {
          id: 'user1',
          email,
          name: 'User',
          role: 'user',
          borrowedBooks: [],
          fines: 0,
          balance: 100
        },
        isAuthenticated: true,
      });
    }
  },
  signup: async (email: string, password: string, name: string) => {
    set({
      user: {
        id: Date.now().toString(),
        email,
        name,
        role: 'user',
        borrowedBooks: [],
        fines: 0,
        balance: 0
      },
      isAuthenticated: true,
    });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  updateBalance: (amount: number) => 
    set((state) => ({ 
      user: state.user ? {
        ...state.user,
        balance: (state.user.balance || 0) + amount
      } : null 
    })),
}));
