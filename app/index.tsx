import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Input } from '../src/components';
import { useAuthStore } from '../src/store/authStore';
import { staticData } from '../src/utils/staticData';
import { ROUTES } from '../src/utils/routes';

export default function LoginScreen() {
  const router = useRouter();
  const { isAuthenticated, login, loadAuth } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { staff, token } = await staticData.login(
        username.trim(),
        password.trim()
      );
      await login(staff, token);
      router.replace(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="light" />
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>Log in - Staff</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
          />
          <View style={styles.input}>
          <Input
            label=""
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            leftIcon="person-outline"
             
          />

          <Input
            label=""
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            leftIcon="lock-closed-outline"
            secureTextEntry
            
          />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Button
            title="LOG IN"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            style={styles.loginButton}
          />

          {/* Dark Blue Button */}
          <Button
            title="NEW ? SIGN UP"
            onPress={() => router.push(ROUTES.SIGNUP)}
            fullWidth
            style={styles.signupButton}
          />

          <View style={styles.footer}>
            <TouchableOpacity>
              <Text style={styles.footerText}>Forgot Password</Text>
            </TouchableOpacity>

            <Text style={styles.footerDivider}> | </Text>

            <TouchableOpacity>
              <Text style={styles.footerText}>Login With OTP</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
input: {
  width: '100%',
},
  headerBar: {
    height: 60,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    paddingLeft: 20,
  },

  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  logo: {
    width: 180,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 20,
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
  },

  loginButton: {
    backgroundColor: '#AECBFF',
    borderRadius: 30,
    marginTop: 10,
  },

  signupButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 30,
    marginTop: 12,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },

  footerText: {
    color: '#1E88E5',
    fontSize: 14,
  },

  footerDivider: {
    marginHorizontal: 8,
    color: '#333',
  },

  contactButton: {
    marginTop: 12,
  },

  contactText: {
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: '600',
  },
});
