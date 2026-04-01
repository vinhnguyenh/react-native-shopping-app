import React, { useCallback, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

import { useAuth } from '@/contexts/auth-context';
import { User } from '@/models/user';
import { ProfileActionCard } from '@/screens/profile/ProfileActionCard';

interface ProfileScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

interface ProfileDetails {
  fullName: string;
  username: string;
  membership: string;
  email: string;
  firstName: string;
  lastName: string;
  age: string;
}

const buildProfileDetails = (user: User | null): ProfileDetails => {
  const firstName = user?.firstName?.trim() || 'John';
  const lastName = user?.lastName?.trim() || 'Doe';
  const fullName = [firstName, lastName].join(' ').trim();
  const username = user?.username?.trim() || 'johndoe_official';

  return {
    fullName: fullName.length > 0 ? fullName : 'John Doe',
    username: username.startsWith('@') ? username : `@${username}`,
    membership: user ? 'PREMIUM MEMBER' : 'GUEST MEMBER',
    email: user?.email?.trim() || 'john.doe@example.com',
    firstName,
    lastName,
    age: user?.age ? String(user.age) : '28',
  };
};

const getInitials = (fullName: string): string =>
  fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(name => name.charAt(0).toUpperCase())
    .join('');

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { logout, token, user } = useAuth();
  const profileUser: User | null = token ? user : null;
  const details = useMemo(() => buildProfileDetails(profileUser), [profileUser]);
  const avatarText = useMemo(() => getInitials(details.fullName), [details.fullName]);

  const handleBackPress = useCallback((): void => {
    navigation.navigate('Home');
  }, [navigation]);

  const handleAuthPress = useCallback((): void => {
    if (profileUser) {
      void logout();
      return;
    }

    navigation.navigate('SignIn');
  }, [logout, navigation, profileUser]);

  const handleOrderHistoryPress = useCallback((): void => {
    navigation.navigate('Home');
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            onPress={handleBackPress}
            style={styles.iconButton}
          >
            <MaterialDesignIcons name="chevron-left" size={24} color="#0F172A" />
          </Pressable>

          <Text style={styles.headerTitle}>Profile Settings</Text>

          <Pressable accessibilityRole="button" style={styles.iconButton}>
            <MaterialDesignIcons name="cog-outline" size={22} color="#0F172A" />
          </Pressable>
        </View>

        <ScrollView
          bounces={false}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileCard}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{avatarText || 'JD'}</Text>
              </View>

              <Pressable accessibilityRole="button" style={styles.editBadge}>
                <MaterialDesignIcons name="pencil" size={14} color="#083344" />
              </Pressable>
            </View>

            <Text style={styles.name}>{details.fullName}</Text>
            <Text style={styles.username}>{details.username}</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>{details.membership}</Text>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Account Details</Text>
              <Pressable accessibilityRole="button">
                <Text style={styles.editText}>Edit Details</Text>
              </Pressable>
            </View>

            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>EMAIL ADDRESS</Text>
              <View style={styles.emailField}>
                <Text style={styles.emailValue}>{details.email}</Text>
              </View>
            </View>

            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>FIRST NAME</Text>
              <Text style={styles.detailValue}>{details.firstName}</Text>
            </View>

            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>LAST NAME</Text>
              <Text style={styles.detailValue}>{details.lastName}</Text>
            </View>

            <View style={styles.detailBlock}>
              <Text style={styles.detailLabel}>AGE</Text>
              <Text style={styles.detailValue}>{details.age}</Text>
            </View>
          </View>

          <ProfileActionCard
            iconName="bag-personal-outline"
            label="Order History"
            onPress={handleOrderHistoryPress}
            showChevron
          />

          <ProfileActionCard
            iconName={profileUser ? 'logout' : 'login'}
            label={profileUser ? 'Logout' : 'Login'}
            onPress={handleAuthPress}
            accentColor="#FF5D55"
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  contentContainer: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 28,
    gap: 18,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#FBC3AF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#D6D3D1',
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1F2937',
  },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#22D3EE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
  },
  username: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '500',
    color: '#94A3B8',
  },
  badge: {
    marginTop: 14,
    borderRadius: 999,
    backgroundColor: '#ECFEFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#22D3EE',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.05,
    shadowRadius: 22,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  editText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#22D3EE',
  },
  detailBlock: {
    marginBottom: 14,
  },
  detailLabel: {
    marginBottom: 6,
    fontSize: 12,
    fontWeight: '800',
    color: '#B5BDC9',
  },
  emailField: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  emailValue: {
    fontSize: 16,
    color: '#94A3B8',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#334155',
  },
});

export { ProfileScreen };
