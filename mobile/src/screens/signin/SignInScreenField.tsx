import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface SignInScreenFieldProps extends TextInputProps {
  errorText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  label: string;
  labelStyle?: StyleProp<TextStyle>;
}

export const SignInScreenField: React.FC<SignInScreenFieldProps> = ({
  errorText,
  containerStyle,
  inputStyle,
  label,
  labelStyle,
  ...props
}) => (
  <View style={[styles.container, containerStyle]}>
    <Text style={[styles.label, labelStyle]}>{label}</Text>
    <TextInput
      {...props}
      style={[styles.input, errorText ? styles.inputError : null, inputStyle]}
    />
    {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D9E0EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#6B7280',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#F87171',
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    color: '#DC2626',
  },
});
