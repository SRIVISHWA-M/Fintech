import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { apiRequest } from '../../../services/api';
import colors from '../../../theme/colors';

const VerifyEmailPage = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');
  
  const token = route.params?.token;

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await apiRequest('/auth/verify-email', {
          method: 'POST',
          body: { token }
        });
        setStatus('success');
        setMessage(response.message || 'Email verified successfully. You can now log in.');
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Verification failed. The token may be expired or invalid.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {status === 'loading' && (
          <>
            <ActivityIndicator size="large" color={colors.success} style={{ marginBottom: 20 }} />
            <Text style={styles.title}>Verifying Email</Text>
            <Text style={styles.text}>Please wait while we verify your email address...</Text>
          </>
        )}
        
        {status === 'success' && (
          <>
            <Ionicons name="checkmark-circle" size={64} color={colors.success} style={{ marginBottom: 16 }} />
            <Text style={styles.title}>Success!</Text>
            <Text style={styles.text}>{message}</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Go to Login</Text>
            </TouchableOpacity>
          </>
        )}

        {status === 'error' && (
          <>
            <Ionicons name="close-circle" size={64} color={colors.error || '#EF4444'} style={{ marginBottom: 16 }} />
            <Text style={styles.title}>Verification Failed</Text>
            <Text style={styles.text}>{message}</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Return to Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.success,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 16,
  }
});

export default VerifyEmailPage;
