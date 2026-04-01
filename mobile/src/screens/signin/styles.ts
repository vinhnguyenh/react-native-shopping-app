import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native';

interface ISignInStyles {
  safeArea: ViewStyle;
  screen: ViewStyle;
  contentContainer: ViewStyle;
  card: ViewStyle;
  logoBadge: ViewStyle;
  logoGraphic: ImageStyle;
  title: TextStyle;
  subtitle: TextStyle;
  segmentedControl: ViewStyle;
  segmentButton: ViewStyle;
  segmentButtonActive: ViewStyle;
  segmentText: TextStyle;
  segmentTextActive: TextStyle;
  formGroup: ViewStyle;
  label: TextStyle;
  input: TextStyle;
  inputError: TextStyle;
  fieldErrorText: TextStyle;
  forgotPasswordButton: ViewStyle;
  forgotPasswordText: TextStyle;
  biometricToggle: ViewStyle;
  checkbox: ViewStyle;
  checkboxChecked: ViewStyle;
  biometricToggleText: TextStyle;
  primaryButton: ViewStyle;
  primaryButtonDisabled: ViewStyle;
  primaryButtonText: TextStyle;
  secondaryButton: ViewStyle;
  secondaryButtonIcon: ImageStyle;
  secondaryButtonText: TextStyle;
  dividerRow: ViewStyle;
  divider: ViewStyle;
  dividerText: TextStyle;
  socialRow: ViewStyle;
  socialButton: ViewStyle;
  socialButtonIcon: ImageStyle;
  socialButtonText: TextStyle;
  termsText: TextStyle;
  termsLink: TextStyle;
  submitErrorText: TextStyle;
}

export const styles = StyleSheet.create<ISignInStyles>({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 26,
    shadowColor: '#1F2937',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 9999,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0DF2F21A',
    marginBottom: 20,
  },
  logoGraphic: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 16,
    lineHeight: 24,
    color: '#6B7280',
    textAlign: 'center',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F3F5F8',
    borderRadius: 12,
    padding: 4,
    marginBottom: 28,
  },
  segmentButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  segmentText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
    color: '#7A8394',
  },
  segmentTextActive: {
    color: '#25324B',
  },
  formGroup: {
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
  fieldErrorText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    color: '#DC2626',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: -2,
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#0DF2F2',
    fontWeight: '500',
  },
  biometricToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D6DCE5',
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#22D3EE',
    borderColor: '#22D3EE',
  },
  biometricToggleText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
  primaryButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#0DF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#0DF2F2',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: '#111827',
  },
  secondaryButton: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#A5F3FC',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  secondaryButtonIcon: {
    width: 18,
    height: 19,
    resizeMode: 'contain',
    marginRight: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: '#22D3EE',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5EAF1',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 12,
    marginBottom: 26,
  },
  socialButton: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  socialButtonIcon: {
    width: 18,
    height: 19,
    resizeMode: 'contain',
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#374151',
  },
  termsText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  termsLink: {
    color: '#8A93A3',
    textDecorationLine: 'underline',
  },
  submitErrorText: {
    marginBottom: 12,
    fontSize: 13,
    lineHeight: 18,
    color: '#DC2626',
    textAlign: 'center',
  },
});
