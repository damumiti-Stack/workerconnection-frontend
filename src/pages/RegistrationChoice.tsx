import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, ArrowRight, HardHat, Briefcase } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const RegistrationChoice: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-8 md:py-12 mobile-nav-spacing">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t('common.choose')} {t('navigation.register')} {t('common.type')}
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            {t('landing.quickAccessSubtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Worker Registration */}
          <Link
            to="/register/worker"
            className="group card-mobile hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 touch-manipulation"
          >
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-green-200 transition-colors">
                <HardHat className="h-8 w-8 md:h-10 md:w-10 text-green-600" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                {t('landing.registerAsWorker')}
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                {t('landing.workerRegistrationDesc')}
              </p>
              <div className="space-y-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
                <div className="flex items-center justify-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{t('worker.personalInfo')}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span>{t('worker.workplaceDetails')}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  <span>{t('worker.documentUpload')}</span>
                </div>
              </div>
              <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-green-600 text-white rounded-lg group-hover:bg-green-700 transition-colors font-semibold text-sm md:text-base">
                {t('landing.startRegistration')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </Link>

          {/* Establishment Registration */}
          <Link
            to="/register/establishment"
            className="group card-mobile hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 touch-manipulation"
          >
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-orange-200 transition-colors">
                <Building2 className="h-8 w-8 md:h-10 md:w-10 text-orange-600" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                {t('landing.registerAsEstablishment')}
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                {t('landing.establishmentRegistrationDesc')}
              </p>
              <div className="space-y-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
                <div className="flex items-center justify-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  <span>{t('establishment.businessDetails')}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{t('establishment.workerManagement')}</span>
                </div>
                <div className="flex items-center justify-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span>{t('establishment.projectDetails')}</span>
                </div>
              </div>
              <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-orange-600 text-white rounded-lg group-hover:bg-orange-700 transition-colors font-semibold text-sm md:text-base">
                {t('landing.startRegistration')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 md:mt-12 text-center">
          <p className="text-sm md:text-base text-gray-600 mb-4">
            {t('auth.alreadyHaveAccount')}
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            <Link
              to="/login/worker"
              className="px-3 md:px-4 py-2 text-green-600 hover:text-green-700 font-medium text-sm md:text-base touch-manipulation"
            >
              {t('landing.loginAsWorker')}
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              to="/login/establishment"
              className="px-3 md:px-4 py-2 text-orange-600 hover:text-orange-700 font-medium text-sm md:text-base touch-manipulation"
            >
              {t('landing.loginAsEstablishment')}
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              to="/login/department"
              className="px-3 md:px-4 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base touch-manipulation"
            >
              {t('landing.loginAsDepartment')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationChoice;