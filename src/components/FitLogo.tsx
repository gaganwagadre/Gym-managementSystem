import { Text, View, StyleSheet } from 'react-native';

type FitLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
  showText?: boolean;
  dark?: boolean;
};

const sizeMap = {
  sm: { icon: 24, text: 16 },
  md: { icon: 32, text: 20 },
  lg: { icon: 40, text: 24 },
};

export function FitLogo({ size = 'md', centered = true, showText = true, dark = false }: FitLogoProps) {
  const { icon, text } = sizeMap[size];

  return (
    <View style={[styles.wrapper, centered && styles.centered]}>
      <View style={[styles.iconContainer, { width: icon, height: icon }]}>
        <View style={styles.iconInner} />
        <View style={styles.iconDot} />
      </View>
      {showText && <Text style={[styles.text, dark && styles.textDark, { fontSize: text }]}>FitCRMPlus</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  centered: {
    alignSelf: 'center',
  },
  iconContainer: {
    backgroundColor: '#5572ff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconInner: {
    width: '60%',
    height: '60%',
    backgroundColor: '#fff',
    borderRadius: 4,
    position: 'absolute',
  },
  iconDot: {
    width: 6,
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
    position: 'absolute',
    top: 2,
    right: 2,
  },
  text: {
    fontWeight: '700',
    color: '#1b2948',
    letterSpacing: 0.5,
  },
  textDark: {
    color: '#fff',
  },
});