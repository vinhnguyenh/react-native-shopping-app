import React, { memo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

interface ProfileActionCardProps {
  accentColor?: string;
  iconName: string;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
}

const ProfileActionCardComponent: React.FC<ProfileActionCardProps> = ({
  accentColor = '#475569',
  iconName,
  label,
  onPress,
  showChevron = false,
}) => (
  <Pressable accessibilityRole="button" onPress={onPress} style={styles.actionCard}>
    <View style={styles.actionLeft}>
      <View style={styles.actionIconBox}>
        <MaterialDesignIcons name={iconName} size={20} color={accentColor} />
      </View>
      <Text style={[styles.actionText, { color: accentColor }]}>{label}</Text>
    </View>

    {showChevron ? (
      <MaterialDesignIcons name="chevron-right" size={22} color="#CBD5E1" />
    ) : null}
  </Pressable>
);

export const ProfileActionCard = memo(ProfileActionCardComponent);

interface ProfileActionCardStyles {
  actionCard: ViewStyle;
  actionIconBox: ViewStyle;
  actionLeft: ViewStyle;
  actionText: TextStyle;
}

const styles = StyleSheet.create<ProfileActionCardStyles>({
  actionCard: {
    minHeight: 74,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.04,
    shadowRadius: 18,
    elevation: 2,
  },
  actionIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
