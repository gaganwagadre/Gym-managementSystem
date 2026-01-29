import { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, Pressable, StyleProp, TextStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';

type FormFieldProps = TextInputProps & {
  label: string;
  required?: boolean;
  enableToggle?: boolean;
  style?: StyleProp<TextStyle>;
};

export function FormField({ label, required = false, enableToggle = false, secureTextEntry, style, ...rest }: FormFieldProps) {
  const [visible, setVisible] = useState(false);
  const shouldSecure = enableToggle ? !visible : secureTextEntry;

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      ) : null}
      <View style={styles.inputWrapper}>
        <TextInput style={[styles.input, style]} placeholderTextColor="#b0bccf" secureTextEntry={shouldSecure} {...rest} />
        {enableToggle && (
          <Pressable onPress={() => setVisible((prev) => !prev)} hitSlop={8}>
            <Feather name={visible ? 'eye-off' : 'eye'} size={20} color="#8a93a8" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1c2b4f',
    marginBottom: 6,
  },
  required: {
    color: '#0080ff',
    fontSize: 15,
    fontWeight: '600',
  },
  inputWrapper: {
    backgroundColor: '#f3f6fb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e6ef',
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
    color: '#1c2b4f',
  },
});