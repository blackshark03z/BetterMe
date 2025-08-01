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
const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
  age: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
  goal: z.string().min(1, 'Vui lòng chọn mục tiêu tập luyện'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, loading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      weight: '',
      height: '',
      goal: '',
    },
  });

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const userData = {
        full_name: data.fullName,
        age: data.age ? parseInt(data.age) : undefined,
        weight: data.weight ? parseFloat(data.weight) : undefined,
        height: data.height ? parseFloat(data.height) : undefined,
        goal: data.goal,
      };

      const result = await signUp(data.email, data.password, userData);
      
      if (result.success) {
        console.log('Registration successful, navigating to dashboard...');
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
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
              <Ionicons name="arrow-back" size={24} color={colors.text.primary as any} />
            </TouchableOpacity>
            <Text style={styles.title}>Đăng ký</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Logo/Brand */}
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <Ionicons name="fitness" size={48} color={colors.primary[500]} />
            </View>
            <Text style={styles.brandTitle}>BetterMe</Text>
            <Text style={styles.brandSubtitle}>
              Bắt đầu hành trình chuyển đổi sức khỏe
            </Text>
          </View>

          {/* Register Form */}
          <Card variant="elevated" padding="lg" style={styles.formCard}>
            <Text style={styles.formTitle}>Tạo tài khoản mới</Text>
            
            {/* Error Display */}
            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color={colors.error[500]} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Họ và tên</Text>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Nhập họ và tên của bạn"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                                         error={!!errors.fullName}
                     errorText={errors.fullName?.message || ''}
                    leftIcon="person-outline"
                  />
                )}
              />
            </View>

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
                     errorText={errors.email?.message || ''}
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
                     errorText={errors.password?.message || ''}
                     leftIcon="lock-closed-outline"
                     rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                     onRightIconPress={() => setShowPassword(!showPassword)}
                   />
                 )}
               />
             </View>

             {/* Confirm Password Input */}
             <View style={styles.inputContainer}>
               <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
               <Controller
                 control={control}
                 name="confirmPassword"
                 render={({ field: { onChange, onBlur, value } }) => (
                   <Input
                     placeholder="Nhập lại mật khẩu"
                     value={value}
                     onChangeText={onChange}
                     onBlur={onBlur}
                     secureTextEntry={!showConfirmPassword}
                     error={!!errors.confirmPassword}
                     errorText={errors.confirmPassword?.message || ''}
                     leftIcon="lock-closed-outline"
                     rightIcon={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                     onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                   />
                 )}
               />
             </View>

             {/* Personal Info Section */}
             <Text style={styles.sectionTitle}>Thông tin cá nhân (tùy chọn)</Text>

             {/* Age Input */}
             <View style={styles.inputContainer}>
               <Text style={styles.inputLabel}>Tuổi</Text>
               <Controller
                 control={control}
                 name="age"
                 render={({ field: { onChange, onBlur, value } }) => (
                   <Input
                     placeholder="Nhập tuổi"
                     value={value || ''}
                     onChangeText={onChange}
                     onBlur={onBlur}
                     keyboardType="numeric"
                     error={!!errors.age}
                     errorText={errors.age?.message || ''}
                     leftIcon="calendar-outline"
                   />
                 )}
               />
             </View>

             {/* Weight Input */}
             <View style={styles.inputContainer}>
               <Text style={styles.inputLabel}>Cân nặng (kg)</Text>
               <Controller
                 control={control}
                 name="weight"
                 render={({ field: { onChange, onBlur, value } }) => (
                   <Input
                     placeholder="Nhập cân nặng"
                     value={value || ''}
                     onChangeText={onChange}
                     onBlur={onBlur}
                     keyboardType="numeric"
                     error={!!errors.weight}
                     errorText={errors.weight?.message || ''}
                     leftIcon="scale-outline"
                   />
                 )}
               />
             </View>

                           {/* Height Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Chiều cao (cm)</Text>
                <Controller
                  control={control}
                  name="height"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Nhập chiều cao"
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="numeric"
                      error={!!errors.height}
                      errorText={errors.height?.message || ''}
                      leftIcon="resize-outline"
                    />
                  )}
                />
              </View>

                             {/* Fitness Goal Selection */}
               <View style={styles.inputContainer}>
                 <Text style={styles.inputLabel}>Mục tiêu tập luyện *</Text>
                 <Controller
                   control={control}
                   name="goal"
                   render={({ field: { onChange, onBlur, value } }) => (
                     <View style={styles.pickerContainer}>
                       <TouchableOpacity
                         style={[
                           styles.goalOption,
                           value === 'lose_fat' && styles.goalOptionSelected
                         ]}
                         onPress={() => onChange('lose_fat')}
                       >
                         <Ionicons 
                           name="trending-down" 
                           size={20} 
                           color={value === 'lose_fat' ? colors.primary[500] : colors.text.secondary} 
                         />
                         <Text style={[
                           styles.goalText,
                           value === 'lose_fat' && styles.goalTextSelected
                         ]}>
                           Giảm mỡ
                         </Text>
                       </TouchableOpacity>
                       
                       <TouchableOpacity
                         style={[
                           styles.goalOption,
                           value === 'gain_muscle' && styles.goalOptionSelected
                         ]}
                         onPress={() => onChange('gain_muscle')}
                       >
                         <Ionicons 
                           name="fitness" 
                           size={20} 
                           color={value === 'gain_muscle' ? colors.primary[500] : colors.text.secondary} 
                         />
                         <Text style={[
                           styles.goalText,
                           value === 'gain_muscle' && styles.goalTextSelected
                         ]}>
                           Tăng cơ
                         </Text>
                       </TouchableOpacity>
                       
                       <TouchableOpacity
                         style={[
                           styles.goalOption,
                           value === 'maintain' && styles.goalOptionSelected
                         ]}
                         onPress={() => onChange('maintain')}
                       >
                         <Ionicons 
                           name="heart" 
                           size={20} 
                           color={value === 'maintain' ? colors.primary[500] : colors.text.secondary} 
                         />
                         <Text style={[
                           styles.goalText,
                           value === 'maintain' && styles.goalTextSelected
                         ]}>
                           Duy trì
                         </Text>
                       </TouchableOpacity>
                     </View>
                   )}
                 />
                 {errors.goal && (
                   <Text style={styles.errorText}>{errors.goal.message}</Text>
                 )}
               </View>

            {/* Register Button */}
            <Button
              title="Đăng ký"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
              icon="person-add-outline"
            />

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                Bằng cách đăng ký, bạn đồng ý với{' '}
                <Text style={styles.termsLink}>Điều khoản sử dụng</Text>
                {' '}và{' '}
                <Text style={styles.termsLink}>Chính sách bảo mật</Text>
              </Text>
            </View>
          </Card>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.signInLink}>Đăng nhập ngay</Text>
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
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  registerButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  termsContainer: {
    marginTop: spacing.sm,
  },
  termsText: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary[500],
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  signInText: {
    ...typography.body2,
    color: colors.text.secondary,
  },
     signInLink: {
     ...typography.body2,
     color: colors.primary[500],
     fontWeight: '600',
   },
   pickerContainer: {
     marginTop: spacing.xs,
   },
   goalOption: {
     flexDirection: 'row',
     alignItems: 'center',
     padding: spacing.md,
     backgroundColor: colors.background.light,
     borderRadius: spacing.sm,
     marginBottom: spacing.xs,
     borderWidth: 1,
     borderColor: colors.border.light,
   },
   goalOptionSelected: {
     backgroundColor: colors.primary[50],
     borderColor: colors.primary[500],
   },
   goalText: {
     ...typography.body1,
     color: colors.text.secondary,
     marginLeft: spacing.sm,
     flex: 1,
   },
   goalTextSelected: {
     color: colors.primary[500],
     fontWeight: '600',
   },
 }); 