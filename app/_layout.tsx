import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '../src/store/authStore';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { loadAuth } = useAuthStore();

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load authentication state
        await loadAuth();
        
        // Artificially delay for splash screen visibility (optional)
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // Hide the splash screen once the app is ready
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="members/index" />
        <Stack.Screen name="members/add" />
        <Stack.Screen name="members/[id]" />
        <Stack.Screen name="collections/index" />
        <Stack.Screen name="expenses/index" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="reports" />
      </Stack>
    </SafeAreaProvider>
  );
}
