import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HardHat, Phone, Lock, Eye, EyeOff, Fingerprint } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/FormInput';
import BiometricAuth from '../components/BiometricAuth';
import { Capacitor } from '@capacitor/core';
import API_CONFIG, { getSamlLoginUrl } from '../api/config';
import toast, { Toaster } from "react-hot-toast";

const WorkerLogin: React.FC = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    mobileNumber: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = t('forms.validation.mobile');
    } else if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = t('forms.validation.mobile');
    }

    if (!formData.password.trim()) {
      newErrors.password = t('forms.validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!validateForm()) return;

  //   setIsLoading(true);

  //   // Simulate API call
  //   setTimeout(() => {
  //     // Mock successful login
  //     login({
  //       id: '1',
  //       type: 'worker',
  //       name: 'John Doe',
  //       mobileNumber: formData.mobileNumber
  //     });

  //     setIsLoading(false);
  //     navigate('/dashboard/worker');
  //   }, 1000);
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔵 Worker Login clicked');

    if (!validateForm()) {
      console.log('❌ Validation failed');
      return;
    }

    console.log('✅ Validation passed');

    // Construct SAML redirect URL
    // Use helper to route through Proxy on Web (fixes Cookie issue)
    const samlUrl = getSamlLoginUrl('worker');

    console.log('🔄 Redirecting to SAML:', samlUrl);

    // Direct redirect - no async, no loading state blocking
    window.location.href = samlUrl;
  };


  const handleBiometricAuth = () => {
    setShowBiometric(true);
  };

  // const handleBiometricSuccess = () => {
  //   // Simulate successful biometric login
  //   login({
  //     id: 1,
  //     type: 'worker',
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     fullName: 'John Doe',
  //     mobileNumber: 9876543210,
  //     lastLoggedIn: new Date().toISOString()
  //   });

  //   navigate('/dashboard/worker');
  // };
  const handleBiometricSuccess = () => {
    // simulate API response for worker
    const apiResponse = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      fullName: "John Doe",
      mobileNumber: 9876543210,
      emailId: "john@example.com",
      lastLoggedIn: new Date().toISOString(),
    };

    // map response → normalized User object
    login({
      type: "worker",
      id: apiResponse.id,
      firstName: apiResponse.firstName,
      lastName: apiResponse.lastName,
      fullName: apiResponse.fullName,
      mobileNumber: apiResponse.mobileNumber,
      emailId: apiResponse.emailId,
      lastLoggedIn: apiResponse.lastLoggedIn,
      establishmentId: 0,
      estmtWorkerId: 0,
      establishmentName: "Unknown Establishment",
      workLocation: "Unknown",
      status: "W",
    });

    navigate("/dashboard/worker");
  };

  // If biometric auth is showing, render that component
  if (showBiometric) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <BiometricAuth
          onAuthenticated={handleBiometricSuccess}
          onCancel={() => setShowBiometric(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HardHat className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {t('landing.loginAsWorker')}
          </h2>
          <p className="mt-2 text-gray-600">
            {t('worker.login')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="space-y-4">
              <div className="relative">
                <Phone className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
                <FormInput
                  label={t('worker.mobileNumber')}
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(value) => setFormData(prev => ({ ...prev, mobileNumber: value }))}
                  placeholder={t('forms.placeholders.enterMobile')}
                  required
                  maxLength={10}
                  pattern="[0-9]*"
                  error={errors.mobile}
                  className="pl-10"
                  autoComplete='new-tel'
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
                <FormInput
                  label={t('auth.password')}
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                  placeholder={t('auth.password')}
                  required
                  error={errors.password}
                  className="pl-10 pr-10"
                  autoComplete='new-password'
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? t('auth.signingIn') : t('auth.signIn')}
            </button>

            {isNative && (
              <button
                type="button"
                onClick={handleBiometricAuth}
                className="w-full mt-3 flex justify-center py-3 px-4 border border-green-600 rounded-lg shadow-sm text-sm font-medium text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <Fingerprint className="h-5 w-5 mr-2" />
                Use Biometric Login
              </button>
            )}
          </div>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            {t('auth.dontHaveAccount')}{' '}
            <Link
              to="/register/worker"
              className="font-medium text-green-600 hover:text-green-700"
            >
              {t('landing.registerAsWorker')}
            </Link>
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            {t('navigation.login')} {t('common.as')}{' '}
            <Link to="/login/establishment" className="text-orange-600 hover:text-orange-700">
              {t('establishment.establishment')}
            </Link>
            {' '}{t('common.or')}{' '}
            <Link to="/login/department" className="text-blue-600 hover:text-blue-700">
              {t('department.department')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkerLogin;