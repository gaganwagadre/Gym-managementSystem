import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { FitLogo, FormField, PrimaryButton } from '../src/components';
import { ROUTES } from '../src/utils/routes';

export default function MemberSignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [goals, setGoals] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <FitLogo size="lg" />
        <View style={styles.card}>
          <Text style={styles.title}>Join Fit CRM as a Member</Text>
          <Text style={styles.subtitle}>Track workouts, diet plans, and payments directly from the mobile dashboard.</Text>

          <FormField label="Full Name" placeholder="Enter your name" required value={fullName} onChangeText={setFullName} />
          <FormField label="Email" placeholder="Email" required keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <FormField label="Phone" placeholder="Phone number" required keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          <FormField label="Fitness Objective" placeholder="Weight loss, muscle gain..." value={goals} onChangeText={setGoals} />
          <FormField label="Password" placeholder="Create password" required enableToggle value={password} onChangeText={setPassword} secureTextEntry />

          <PrimaryButton label="Create Member Account" onPress={() => router.push(ROUTES.DASHBOARD)} />

          <Pressable onPress={() => router.push(ROUTES.MEMBER_LOGIN)} style={styles.bottomLink}>
            <Text style={styles.link}>Already a member? Sign in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f2f5fb',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    gap: 28,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#0c2c45',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1b2948',
  },
  subtitle: {
    color: '#6b7790',
    marginBottom: 24,
    marginTop: 4,
  },
  bottomLink: {
    marginTop: 18,
    alignItems: 'center',
  },
  link: {
    color: '#008cff',
    fontWeight: '600',
  },
});

