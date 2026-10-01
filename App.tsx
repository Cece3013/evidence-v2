// App.tsx — Entry point
import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_KEY || ''}>
      <AppNavigator />
    </StripeProvider>
  );
}