import React, { FC, useState } from 'react';
import { AxiosError } from 'axios';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ImageAssets from '@/assets/images';
import { useAuth } from '@/contexts/auth-context';
import { ITextInput } from '@/types/text-input';
import { SignInScreenField } from '@/screens/signin/SignInScreenField';
import { styles } from './styles';

interface IApiErrorResponse {
  error?: {
    message?: string;
  };
}

export const SignInScreen: FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState<ITextInput>({
    value: 'johndoe',
    error: '',
  });
  const [password, setPassword] = useState<ITextInput>({
    value: 'secret123',
    error: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleSignIn = async (): Promise<void> => {
    if (!username.value.trim()) {
      setUsername(currentValue => ({
        ...currentValue,
        error: 'Username is required.',
      }));
      return;
    }

    if (!password.value.trim()) {
      setPassword(currentValue => ({
        ...currentValue,
        error: 'Password is required.',
      }));
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError('');
      await login(username.value.trim(), password.value);
    } catch (error) {
      const axiosError = error as AxiosError<IApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.error?.message ??
        axiosError.message ??
        'Login failed.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.logoBadge}>
            <Image source={ImageAssets.lock} style={styles.logoGraphic} />
          </View>

          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Please enter your details</Text>

          <View style={styles.segmentedControl}>
            <Pressable
              style={[styles.segmentButton, styles.segmentButtonActive]}>
              <Text style={[styles.segmentText, styles.segmentTextActive]}>
                Login
              </Text>
            </Pressable>
            <Pressable style={styles.segmentButton}>
              <Text style={styles.segmentText}>Sign Up</Text>
            </Pressable>
          </View>

          <SignInScreenField
            value={username.value}
            onChangeText={(text: string) => {
              setUsername({value: text, error: ''});
              setSubmitError('');
            }}
            inputStyle={styles.input}
            containerStyle={styles.formGroup}
            labelStyle={styles.label}
            errorText={username.error}
            label="Username"
            placeholder="johndoe"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <SignInScreenField
            value={password.value}
            onChangeText={(text: string) => {
              setPassword({value: text, error: ''});
              setSubmitError('');
            }}
            inputStyle={styles.input}
            containerStyle={styles.formGroup}
            labelStyle={styles.label}
            errorText={password.error}
            label="Password"
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
          />

          <Pressable style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>

          {submitError ? (
            <Text style={styles.submitErrorText}>{submitError}</Text>
          ) : null}

          <Pressable
            style={[
              styles.primaryButton,
              isSubmitting ? styles.primaryButtonDisabled : null,
            ]}
            onPress={handleSignIn}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#0F172A" />
            ) : (
              <Text style={styles.primaryButtonText}>Sign In</Text>
            )}
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
            <Pressable style={styles.socialButton}>
              <Image
                source={ImageAssets.google}
                style={styles.socialButtonIcon}
              />
              <Text style={styles.socialButtonText}>Google</Text>
            </Pressable>
            <Pressable style={styles.socialButton}>
              <Image
                source={ImageAssets.facebook}
                style={styles.socialButtonIcon}
              />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </Pressable>
          </View>

          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {'\n'}and <Text style={styles.termsLink}>Privacy Policy.</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
