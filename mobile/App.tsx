import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';

import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { SignInScreen } from '@/screens/signin/SignInScreen';
import MainNavigator from '@/screens/navigator/main-navigator';
import store from '@/stores/store';

const Stack = createNativeStackNavigator();

interface IAppStyles {
  loadingContainer: ViewStyle;
}

const styles = StyleSheet.create<IAppStyles>({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FB',
  },
});

const App = (): React.JSX.Element => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { initializing, token } = useAuth();

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22D3EE" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
