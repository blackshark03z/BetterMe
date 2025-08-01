import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Input, Card } from '../../src/components/ui';
import { colors, spacing, typography } from '../../src/theme';
import { useAuthStore } from '../../src/store/authStore';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await signIn(data.email, data.password);
      
      if (result.success) {
        console.log('Login successful, navigating to dashboard...');
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleForgotPassword = () => {
    Alert.prompt(
      'Quên mật khẩu',
      'Nhập email của bạn để nhận link reset password:',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Gửi',
          onPress: (email) => {
            if (email) {
              // TODO: Implement password reset
              Alert.alert('Thành công', 'Email reset password đã được gửi!');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Đăng nhập</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Logo/Brand */}
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="fitness" size={48} color={colors.primary[500]} />
            </View>
            <Text style={styles.brandTitle}>BetterMe</Text>
            <Text style={styles.brandSubtitle}>
              Hành trình chuyển đổi sức khỏe của bạn
            </Text>
          </View>

          {/* Login Form */}
          <Card variant="elevated" padding="lg" style={styles.formCard}>
            <Text style={styles.formTitle}>Chào mừng trở lại!</Text>
            
            {/* Error Display */}
            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color={colors.error[500]} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Nhập email của bạn"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    error={!!errors.email}
                    errorText={errors.email?.message}
                    leftIcon="mail-outline"
                  />
                )}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mật khẩu</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Nhập mật khẩu"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    error={!!errors.password}
                    errorText={errors.password?.message}
                    leftIcon="lock-closed-outline"
                    rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                    onRightIconPress={() => setShowPassword(!showPassword)}
                  />
                )}
              />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              title="Đăng nhập"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
              icon="log-in-outline"
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>hoặc</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtons}>
              <Button
                title="Google"
                variant="outlined"
                onPress={() => Alert.alert('Coming soon', 'Google login sẽ có sẵn sớm!')}
                style={styles.socialButton}
                icon="logo-google"
              />
              <Button
                title="Apple"
                variant="outlined"
                onPress={() => Alert.alert('Coming soon', 'Apple login sẽ có sẵn sớm!')}
                style={styles.socialButton}
                icon="logo-apple"
              />
            </View>
          </Card>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.signUpLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  brandSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brandTitle: {
    ...typography.h1,
    color: colors.primary[500],
    marginBottom: spacing.xs,
  },
  brandSubtitle: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  formCard: {
    marginBottom: spacing.lg,
  },
  formTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error[50],
    padding: spacing.sm,
    borderRadius: spacing.xs,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.body2,
    color: colors.error[500],
    marginLeft: spacing.xs,
    flex: 1,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.body1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    ...typography.body2,
    color: colors.primary[500],
  },
  loginButton: {
    marginBottom: spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  dividerText: {
    ...typography.body2,
    color: colors.text.secondary,
    marginHorizontal: spacing.md,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  socialButton: {
    flex: 1,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  signUpText: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  signUpLink: {
    ...typography.body2,
    color: colors.primary[500],
    fontWeight: '600',
  },
}); 