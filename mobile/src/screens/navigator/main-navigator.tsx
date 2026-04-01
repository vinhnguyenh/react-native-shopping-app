// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { HomeScreen } from '@/screens/home/HomeScreen';
import ListScreen from '@/screens/list-screen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import SavedScreen from '@/screens/saved-screen';

const Tab = createBottomTabNavigator();

const renderHomeTabIcon = ({ color }: { color: string; size: number }) => (
    <MaterialDesignIcons name="shopping" size={22} color={color} />
);

const renderCategoriesTabIcon = ({ color }: { color: string; size: number }) => (
    <MaterialDesignIcons name="view-grid-outline" size={22} color={color} />
);

const renderSavedTabIcon = ({ color }: { color: string; size: number }) => (
    <MaterialDesignIcons name="heart-outline" size={22} color={color} />
);

const renderProfileTabIcon = ({ color }: { color: string; size: number }) => (
    <MaterialDesignIcons name="account-outline" size={22} color={color} />
);

const MainNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={
                {
                    headerShown: false,
                    lazy: true,
                    freezeOnBlur: true,
                    detachInactiveScreens: true,
                    tabBarActiveTintColor: '#22D3EE',
                    tabBarInactiveTintColor: '#94A3B8',
                    tabBarStyle: styles.tabBar,
                    tabBarLabelStyle: styles.label,
                }
            }
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{
                tabBarLabel: 'Shop',
                tabBarIcon: renderHomeTabIcon,
            }} />

            <Tab.Screen name="Tab3" component={ListScreen} options={{
                tabBarLabel: 'Categories',
                tabBarIcon: renderCategoriesTabIcon,

            }} />

            <Tab.Screen name="Saved" component={SavedScreen} options={{
                tabBarLabel: 'Saved',
                tabBarIcon: renderSavedTabIcon,
            }} />

            <Tab.Screen name="Profile" component={ProfileScreen} options={{
                tabBarLabel: 'Profile',
                tabBarIcon: renderProfileTabIcon,
            }} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: 12,
        fontWeight: '600',
    },
    tabBar: {
        height: 70,
        paddingBottom: 8,
        paddingTop: 8,
    }
});

export default MainNavigator;
