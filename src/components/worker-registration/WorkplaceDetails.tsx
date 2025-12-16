import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import FormInput from '../FormInput';
import FormSelect from '../FormSelect';
import { TRADES_OF_WORK, WORKER_CATEGORIES } from '../../utils/constants';

interface WorkplaceDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const WorkplaceDetails: React.FC<WorkplaceDetailsProps> = ({
  formData,
  setFormData,
  onNext,
  onPrevious
}) => {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employerName?.trim()) {
      newErrors.employerName = 'Employer name is required';
    }

    if (!formData.constructionOrg?.trim()) {
      newErrors.constructionOrg = 'Construction organisation name is required';
    }

    if (!formData.tradeOfWork) {
      newErrors.tradeOfWork = 'Trade of work is required';
    }

    if (!formData.workerCategory) {
      newErrors.workerCategory = 'Worker category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const tradeOptions = TRADES_OF_WORK.map(trade => ({
    value: trade.toLowerCase().replace(/\s+/g, '_'),
    label: trade
  }));

  const categoryOptions = WORKER_CATEGORIES.map(category => ({
    value: category.toLowerCase().replace(/-/g, '_'),
    label: category
  }));

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Briefcase className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">
          {t('worker.workplaceDetails')}
        </h2>
        <p className="text-gray-600 mt-2">
          Please provide your workplace and employment details
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FormInput
            label={t('worker.employerName')}
            value={formData.employerName || ''}
            onChange={(value) => setFormData({ ...formData, employerName: value })}
            placeholder="Enter employer name"
            required
            error={errors.employerName}
          />
          
          <FormInput
            label={t('worker.constructionOrg')}
            value={formData.constructionOrg || ''}
            onChange={(value) => setFormData({ ...formData, constructionOrg: value })}
            placeholder="Enter construction organisation name"
            required
            error={errors.constructionOrg}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormSelect
            label={t('worker.tradeOfWork')}
            value={formData.tradeOfWork || ''}
            onChange={(value) => setFormData({ ...formData, tradeOfWork: value })}
            options={tradeOptions}
            placeholder="Select your trade"
            required
            error={errors.tradeOfWork}
          />
          
          <FormSelect
            label={t('worker.workerCategory')}
            value={formData.workerCategory || ''}
            onChange={(value) => setFormData({ ...formData, workerCategory: value })}
            options={categoryOptions}
            placeholder="Select worker category"
            required
            error={errors.workerCategory}
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Information</h3>
        <p className="text-blue-800 text-sm">
          Please ensure all workplace details are accurate as they will be used for employment verification and benefits calculation.
        </p>
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

export default WorkplaceDetails;