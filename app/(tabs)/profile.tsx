import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Card, Button } from '../../src/components/ui';
import { colors, spacing, typography } from '../../src/theme';
import { useAuthStore } from '../../src/store/authStore';

export default function ProfileScreen() {
  const { user, signOut, loading } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Sign out error:', error);
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Thông tin cá nhân',
      subtitle: 'Chỉnh sửa thông tin cá nhân',
      onPress: () => Alert.alert('Coming soon', 'Tính năng này sẽ có sẵn sớm!'),
    },
    {
      icon: 'fitness-outline',
      title: 'Mục tiêu fitness',
      subtitle: 'Thiết lập mục tiêu của bạn',
      onPress: () => Alert.alert('Coming soon', 'Tính năng này sẽ có sẵn sớm!'),
    },
    {
      icon: 'notifications-outline',
      title: 'Thông báo',
      subtitle: 'Quản lý thông báo',
      onPress: () => Alert.alert('Coming soon', 'Tính năng này sẽ có sẵn sớm!'),
    },
    {
      icon: 'shield-outline',
      title: 'Bảo mật',
      subtitle: 'Cài đặt bảo mật tài khoản',
      onPress: () => Alert.alert('Coming soon', 'Tính năng này sẽ có sẵn sớm!'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Trợ giúp',
      subtitle: 'Hướng dẫn sử dụng',
      onPress: () => Alert.alert('Coming soon', 'Tính năng này sẽ có sẵn sớm!'),
    },
    {
      icon: 'information-circle-outline',
      title: 'Về ứng dụng',
      subtitle: 'Thông tin phiên bản',
      onPress: () => Alert.alert('BetterMe', 'Phiên bản 1.0.0\nWellness Transformation App'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Hồ sơ</Text>
        </View>

        {/* User Info Card */}
        <Card variant="elevated" padding="lg" style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color={colors.primary[500]} />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {user?.user_metadata?.full_name || 'User'}
              </Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.userStats}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>7</Text>
                  <Text style={styles.statLabel}>Ngày liên tiếp</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>24</Text>
                  <Text style={styles.statLabel}>Workouts</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>156</Text>
                  <Text style={styles.statLabel}>Calories</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Cài đặt</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon as any} size={20} color={colors.primary[500]} />
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <Button
            title="Đăng xuất"
            onPress={handleSignOut}
            loading={loading}
            disabled={loading}
            variant="outlined"
            style={styles.signOutButton}
            icon="log-out-outline"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text.primary,
  },
  userCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  userStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary[500],
  },
  statLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  menuSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  menuSubtitle: {
    fontSize: typography.fontSizes.sm,
    color: colors.text.secondary,
  },
  signOutSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  signOutButton: {
    marginTop: spacing.md,
  },
}); 