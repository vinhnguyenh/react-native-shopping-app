// src/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../home-screen';
import { ProfileScreen } from '../profile-screen';
import { StyleSheet } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import ListScreen from '../list-screen';
import SavedScreen from '../saved-screen';

const Tab = createBottomTabNavigator();

const MainNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={
                {
                    headerShown: false,
                    tabBarActiveTintColor: '#22D3EE',
                    tabBarInactiveTintColor: '#94A3B8',
                    tabBarStyle: styles.tabBar,
                    tabBarLabelStyle: styles.label,
                }
            }
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{
                tabBarLabel: 'Shop',
                tabBarIcon: ({ color, size }) => (
                    <MaterialDesignIcons name="shopping" size={22} color={color} />
                ),
            }} />

            <Tab.Screen name="Tab3" component={ListScreen} options={{
                tabBarLabel: 'Categories',
                tabBarIcon: ({ color, size }) => (
                    <MaterialDesignIcons name="view-grid-outline" size={22} color={color} />
                ),

            }} />

            <Tab.Screen name="Saved" component={SavedScreen} options={{
                tabBarLabel: 'Saved',
                tabBarIcon: ({ color, size }) => (
                    <MaterialDesignIcons name="heart-outline" size={22} color={color} />
                ),
            }} />

            <Tab.Screen name="Profile" component={ProfileScreen} options={{
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color, size }) => (
                    <MaterialDesignIcons name="account-outline" size={22} color={color} />
                ),
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
