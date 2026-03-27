import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthStore {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAdmin: false,
  loading: true,

  signIn: async (email: string, password: string) => {
    set({ loading: true });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ user: null, isAdmin: false, loading: false });
      throw error;
    }

    if (data.user) {
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (!adminData) {
        await supabase.auth.signOut();
        set({ user: null, isAdmin: false, loading: false });
        throw new Error('User is not an admin');
      }

      set({ user: data.user, isAdmin: true, loading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAdmin: false });
  },

  checkAuth: async () => {
    set({ loading: true });

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        set({ user, isAdmin: !!adminData, loading: false });
      } else {
        set({ user: null, isAdmin: false, loading: false });
      }
    } catch (error) {
      set({ user: null, isAdmin: false, loading: false });
    }
  },
}));
