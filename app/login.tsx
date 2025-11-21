import { Feather } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import { loginSchema } from '../services/validation';
import { AppDispatch, RootState } from '../store';
import { clearError } from '../store/slices/authSlice';

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { theme, isDarkMode } = useTheme();
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      // For demo purposes, allow any username/password combination
      if (data.username.length > 0 && data.password.length > 0) {
        // Simulate successful login with demo user
        const demoUser = {
          id: 1,
          username: data.username,
          email: data.username.includes('@') ? data.username : `${data.username}@demo.com`,
          firstName: data.username.charAt(0).toUpperCase() + data.username.slice(1),
          lastName: 'User',
          image: 'https://robohash.org/' + data.username + '?set=set2&size=150x150',
          token: 'demo-token-' + Date.now(),
        };
        
        // Simulate API call delay
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 500);
      } else {
        Alert.alert('Error', 'Please enter username and password');
      }
    } catch (error) {
      Alert.alert('Login Error', 'Failed to login. Please try again.');
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert('Social Login', `${provider} login not implemented yet`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={[styles.logo, { backgroundColor: theme.primary }]}>
          <Feather name="activity" size={32} color="#fff" />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Your Game, Your Stats</Text>
      </View>

      <View style={[styles.formContainer, { backgroundColor: theme.background }]}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Email / Username</Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Feather name="user" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter your email or username"
                  placeholderTextColor={theme.textSecondary}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            )}
          />
          {errors.username && <Text style={[styles.errorText, { color: theme.primary }]}>{errors.username.message}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Feather name="lock" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.textSecondary}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Feather 
                    name={showPassword ? "eye" : "eye-off"} 
                    size={20} 
                    color={theme.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && <Text style={[styles.errorText, { color: theme.primary }]}>{errors.password.message}</Text>}
        </View>

        <TouchableOpacity>
          <Text style={[styles.forgotPassword, { color: theme.primary }]}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.loginButton, { backgroundColor: theme.primary }, isLoading && styles.disabledButton]} 
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.orText, { color: theme.textSecondary }]}>OR</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => handleSocialLogin('Google')}
          >
            <Feather name="globe" size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => handleSocialLogin('Apple')}
          >
            <Feather name="smartphone" size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => handleSocialLogin('Facebook')}
          >
            <Feather name="users" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
          <Text style={[styles.signupText, { color: theme.textSecondary }]}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={[styles.signupLink, { color: theme.primary }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 60,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E53E3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 5,
  },
  forgotPassword: {
    color: '#E53E3E',
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#E53E3E',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 40,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#E53E3E',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
});