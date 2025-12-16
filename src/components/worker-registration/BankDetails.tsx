import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import FormInput from '../FormInput';

interface BankDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const BankDetails: React.FC<BankDetailsProps> = ({
  formData,
  setFormData,
  onNext,
  onPrevious
}) => {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.accountNumber?.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }

    if (!formData.confirmAccountNumber?.trim()) {
      newErrors.confirmAccountNumber = 'Please confirm account number';
    } else if (formData.accountNumber !== formData.confirmAccountNumber) {
      newErrors.confirmAccountNumber = 'Account numbers do not match';
    }

    if (!formData.bankName?.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!formData.ifscCode?.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.trim())) {
      newErrors.ifscCode = 'Please enter a valid IFSC code';
    }

    if (!formData.branchName?.trim()) {
      newErrors.branchName = 'Branch name is required';
    }

    if (!formData.branchAddress?.trim()) {
      newErrors.branchAddress = 'Branch address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CreditCard className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">
          {t('worker.bankDetails')}
        </h2>
        <p className="text-gray-600 mt-2">
          Please provide your bank account details for benefit transfers
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormInput
            label={t('worker.accountNumber')}
            value={formData.accountNumber || ''}
            onChange={(value) => setFormData({ ...formData, accountNumber: value })}
            placeholder="Enter account number"
            required
            error={errors.accountNumber}
          />
          
          <FormInput
            label={t('worker.confirmAccountNumber')}
            value={formData.confirmAccountNumber || ''}
            onChange={(value) => setFormData({ ...formData, confirmAccountNumber: value })}
            placeholder="Re-enter account number"
            required
            error={errors.confirmAccountNumber}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormInput
            label={t('worker.bankName')}
            value={formData.bankName || ''}
            onChange={(value) => setFormData({ ...formData, bankName: value })}
            placeholder="Enter bank name"
            required
            error={errors.bankName}
          />
          
          <FormInput
            label={t('worker.ifscCode')}
            value={formData.ifscCode || ''}
            onChange={(value) => setFormData({ ...formData, ifscCode: value.toUpperCase() })}
            placeholder="Enter IFSC code"
            maxLength={11}
            required
            error={errors.ifscCode}
          />
        </div>

        <FormInput
          label={t('worker.branchName')}
          value={formData.branchName || ''}
          onChange={(value) => setFormData({ ...formData, branchName: value })}
          placeholder="Enter branch name"
          required
          error={errors.branchName}
        />

        <FormInput
          label={t('worker.branchAddress')}
          value={formData.branchAddress || ''}
          onChange={(value) => setFormData({ ...formData, branchAddress: value })}
          placeholder="Enter branch address"
          required
          error={errors.branchAddress}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Important Information</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Ensure all bank details are accurate to avoid payment delays</li>
          <li>• Account should be active and in your name</li>
          <li>• IFSC code should be correct for your bank branch</li>
          <li>• Keep your passbook/cheque ready for document upload</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          {t('common.previous')}
        </button>
        
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  );
};

export default BankDetails;