import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Phone, Send, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import FormInput from '../components/FormInput';

const ForgotPassword: React.FC = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1); // 1: Enter mobile, 2: Enter OTP, 3: Reset password
  const [formData, setFormData] = useState({
    mobile: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateMobile = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = t('forms.validation.mobile');
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = t('forms.validation.mobile');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtp = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.otp.trim()) {
      newErrors.otp = t('forms.validation.required');
    } else if (!/^\d{6}$/.test(formData.otp.trim())) {
      newErrors.otp = t('worker.enterOtp');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = t('forms.validation.required');
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = t('forms.validation.minLength').replace('{0}', '6');
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = t('forms.validation.required');
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('forms.validation.passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!validateMobile()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      alert(t('worker.otpSent'));
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 1000);
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(t('auth.passwordResetSent'));
      // In real app, redirect to login page
      window.location.href = '/login/worker';
    }, 1000);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('auth.resetPassword')}
              </h2>
              <p className="text-gray-600">
                {t('auth.resetPasswordDesc')}
              </p>
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
              <FormInput
                label={t('worker.mobileNumber')}
                type="tel"
                value={formData.mobile}
                onChange={(value) => setFormData(prev => ({ ...prev, mobile: value }))}
                placeholder={t('forms.placeholders.enterMobile')}
                required
                maxLength={10}
                pattern="[0-9]*"
                error={errors.mobile}
                className="pl-10"
              />
            </div>

            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                t('common.loading')
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {t('worker.generateOtp')}
                </>
              )}
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('worker.verifyOtp')}
              </h2>
              <p className="text-gray-600">
                {t('worker.otpSent')} {formData.mobile}
              </p>
            </div>

            <FormInput
              label={t('worker.enterOtp')}
              value={formData.otp}
              onChange={(value) => setFormData(prev => ({ ...prev, otp: value }))}
              placeholder={t('worker.enterOtp')}
              required
              maxLength={6}
              pattern="[0-9]*"
              error={errors.otp}
            />

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                {t('common.back')}
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? t('common.loading') : t('worker.verifyOtp')}
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={handleSendOtp}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {t('worker.generateOtp')}
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('auth.resetPassword')}
              </h2>
              <p className="text-gray-600">
                {t('auth.newPassword')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
                <FormInput
                  label={t('auth.newPassword')}
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(value) => setFormData(prev => ({ ...prev, newPassword: value }))}
                  placeholder={t('auth.newPassword')}
                  required
                  error={errors.newPassword}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-10 h-5 w-5 text-gray-400" />
                <FormInput
                  label={t('auth.confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
                  placeholder={t('auth.confirmPassword')}
                  required
                  error={errors.confirmPassword}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleResetPassword}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? t('common.loading') : t('auth.resetPassword')}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          {renderStep()}
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to="/login/worker" className="font-medium text-blue-600 hover:text-blue-700">
              {t('auth.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;