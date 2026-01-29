import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Staff {
  id: string;
  username: string;
  role: string;
  email?: string;
  phone?: string;
  fullName?: string;
}

interface AuthState {
  staff: Staff | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (staff: Staff, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadAuth: () => Promise<void>;
  updateProfile: (profileData: Partial<Staff>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  staff: null,
  token: null,
  isAuthenticated: false,

  login: async (staff, token) => {
    await AsyncStorage.setItem('staff', JSON.stringify(staff));
    await AsyncStorage.setItem('token', token);
    set({ staff, token, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.removeItem('staff');
    await AsyncStorage.removeItem('token');
    set({ staff: null, token: null, isAuthenticated: false });
  },

  loadAuth: async () => {
    try {
      const staffJson = await AsyncStorage.getItem('staff');
      const token = await AsyncStorage.getItem('token');
      if (staffJson && token) {
        const staff = JSON.parse(staffJson);
        set({ staff, token, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
    }
  },

  updateProfile: async (profileData) => {
    try {
      const currentStaff = useAuthStore.getState().staff;
      if (currentStaff) {
        const updatedStaff = { ...currentStaff, ...profileData };
        await AsyncStorage.setItem('staff', JSON.stringify(updatedStaff));
        set({ staff: updatedStaff });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },
}));