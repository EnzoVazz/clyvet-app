import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from 'react-native';
import { colors } from '../theme';

type Props = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'success' | 'danger' | 'ghost';
};

export function PrimaryButton({ title, loading, variant = 'primary', disabled, ...props }: Props) {
  const backgroundColor =
    variant === 'success' ? colors.success : variant === 'danger' ? colors.danger : variant === 'ghost' ? 'transparent' : colors.primary;

  return (
    <Pressable
      {...props}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor, borderWidth: variant === 'ghost' ? 1 : 0, borderColor: colors.border },
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? <ActivityIndicator color={variant === 'ghost' ? colors.text : '#fff'} /> : (
        <Text style={[styles.text, variant === 'ghost' && { color: colors.text }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
