import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Input } from '../src/components';
import { staticData } from '../src/utils/staticData';
import { ROUTES } from '../src/utils/routes';

export default function SignupScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'staff',
  });

  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!formData.username.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await staticData.signup(
        formData.username.trim(),
        formData.password,
        formData.role
      );

      Alert.alert('Success', 'Account created successfully! Please login.', [
        { text: 'OK', onPress: () => router.replace(ROUTES.LOGIN) },
      ]);
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.response?.data?.detail || 'Signup failed. Please try again.'
      );
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
        <TouchableOpacity onPress={() => router.replace(ROUTES.LOGIN)}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Sign Up - Staff</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
          />
          <View style={styles.inputwrapper}>
          <Input
            placeholder="Username"
            value={formData.username}
            onChangeText={(t) => setFormData({ ...formData, username: t })}
            leftIcon="person-outline"
            style={styles.input}
          />

          <Input
            placeholder="Password"
            value={formData.password}
            onChangeText={(t) => setFormData({ ...formData, password: t })}
            leftIcon="lock-closed-outline"
            secureTextEntry
            style={styles.input}
          />

          <Input
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(t) =>
              setFormData({ ...formData, confirmPassword: t })
            }
            leftIcon="lock-closed-outline"
            secureTextEntry
            style={styles.input}
          />
         </View>
          <Button
            title="CREATE ACCOUNT"
            onPress={handleSignup}
            loading={loading}
            fullWidth
            style={styles.signupButton}
          />

          <TouchableOpacity onPress={() => router.replace(ROUTES.LOGIN)}>
            <Text style={styles.loginText}>Already have an account? Login</Text>
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
  inputwrapper: {
    width:'100%',
    },
    
  headerBar: {
    height: 60,
    backgroundColor: '#1E88E5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },

  backButton: {
    color: '#fff',
    fontSize: 28,
    marginRight: 10,
    marginTop: -2,
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

  input: {
  width: '100%',
  outlineWidth: 0,
  outlineColor: 'transparent',
  },

  signupButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 30,
    marginTop: 12,
  },

  loginText: {
    marginTop: 14,
    textAlign: 'center',
    color: '#1E88E5',
    fontWeight: '600',
  },
});
