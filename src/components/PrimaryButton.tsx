import { Pressable, StyleSheet, Text, ViewStyle, StyleProp } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({ label, onPress, style }: PrimaryButtonProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 54,
    borderRadius: 12,
    backgroundColor: '#008cff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#008cff',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  pressed: {
    opacity: 0.9,
  },
  label: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
});