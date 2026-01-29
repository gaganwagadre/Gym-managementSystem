import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ROUTES } from '../src/utils/routes';

import { Image } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={{ width: 205, height: 70, resizeMode: 'contain' }}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Sign In to FitCRM</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="youremail@gmail.com"
                placeholderTextColor="#b0bccf"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#b0bccf"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#8a93a8" />
              </Pressable>
            </View>
          </View>

          <View style={styles.optionsRow}>
            <Pressable 
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Feather name="check" size={14} color="#5572ff" />}
              </View>
              <Text style={styles.checkboxLabel}>Remember me</Text>
            </Pressable>
            <Pressable onPress={() => router.push(ROUTES.FORGOT_PASSWORD)}>
              <Text style={styles.forgotLink}>Forgot Password?</Text>
            </Pressable>
          </View>

          <Pressable 
            style={styles.signInButton}
            onPress={() => router.push(ROUTES.DASHBOARD)}
          >
            <Text style={styles.signInText}>Sign In</Text>
            <Feather name="arrow-right" size={18} color="#fff" />
          </Pressable>

          <Pressable 
            onPress={() => router.push(ROUTES.SIGNUP)}
            style={styles.bottomLink}
          >
            <Text style={styles.bottomLinkText}>Don't have an account?</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F8FA',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'stretch',
    minHeight: '100%',
    justifyContent: 'center',
    width:500,
    marginLeft:'auto',
    marginRight:'auto'
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#0c2c45',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1b2948',
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a5568',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#1b2948',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#cbd5e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#e6f0ff',
    borderColor: '#5572ff',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#4a5568',
    fontWeight: '500',
  },
  forgotLink: {
    fontSize: 14,
    color: '#8a93a8',
    fontWeight: '500',
  },
  signInButton: {
    width: '100%',
    height: 54,
    borderRadius: 12,
    backgroundColor: '#5572ff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
    shadowColor: '#5572ff',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  signInText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  bottomLink: {
    alignItems: 'center',
  },
  bottomLinkText: {
    color: '#5572ff',
    fontWeight: '600',
    fontSize: 14,
  },
});

