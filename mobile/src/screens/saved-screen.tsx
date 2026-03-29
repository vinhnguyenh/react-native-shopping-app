import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

interface SavedScreenStyles {
  container: ViewStyle;
  subtitle: TextStyle;
  title: TextStyle;
}

const styles = StyleSheet.create<SavedScreenStyles>({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
    textAlign: 'center',
  },
  title: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16,
  },
});

const SavedScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <MaterialDesignIcons name="heart-outline" size={42} color="#22D3EE" />
      <Text style={styles.title}>Saved items</Text>
      <Text style={styles.subtitle}>
        Favorites are not connected yet. This tab is ready for the next step.
      </Text>
    </View>
  );
};

export default SavedScreen;
