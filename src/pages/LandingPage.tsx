import React from 'react';
import { Users, Building2, Shield, CheckCircle, Smartphone, ArrowRight, User, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ResponsiveButton from '../components/ui/ResponsiveButton';
import ResponsiveCard from '../components/ui/ResponsiveCard';

const LandingPage: React.FC = () => {
  const { t } = useLanguage();

  const benefits = [
    t('landing.benefits.secure'),
    t('landing.benefits.multilang'),
    t('landing.benefits.realtime'),
    t('landing.benefits.reporting'),
    t('landing.benefits.mobile'),
    t('landing.benefits.compliance')
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
        style={{
          paddingTop: 'clamp(3rem, 8vw, 6rem)',
          paddingBottom: 'clamp(3rem, 8vw, 6rem)',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-10" aria-hidden="true"></div>
        <div 
          className="relative max-w-[min(90rem,95vw)] mx-auto"
          style={{
            paddingLeft: 'clamp(1rem, 4vw, 2rem)',
            paddingRight: 'clamp(1rem, 4vw, 2rem)',
          }}
        >
          <div className="text-center">
            <h1 
              className="font-bold mb-[clamp(1rem,3vw,1.5rem)]"
              style={{
                fontSize: 'clamp(1.875rem, 5vw, 3.75rem)',
                lineHeight: '1.2',
              }}
            >
              {t('landing.title')}
            </h1>
            <p 
              className="mb-[clamp(1.5rem,4vw,2rem)] text-blue-100"
              style={{
                fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
                lineHeight: '1.5',
              }}
            >
              {t('landing.subtitle')}
            </p>
            <p 
              className="mb-[clamp(2rem,5vw,3rem)] text-blue-200 mx-auto"
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                maxWidth: 'min(48rem, 90vw)',
                lineHeight: '1.6',
              }}
            >
              {t('landing.description')}
            </p>
            <ResponsiveButton
              to="/register"
              variant="secondary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="bg-white text-blue-600 hover:bg-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
            >
              {t('landing.getStarted')}
            </ResponsiveButton>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section 
        className="bg-gray-50"
        style={{
          paddingTop: 'clamp(3rem, 8vw, 6rem)',
          paddingBottom: 'clamp(3rem, 8vw, 6rem)',
        }}
      >
        <div 
          className="max-w-[min(90rem,95vw)] mx-auto"
          style={{
            paddingLeft: 'clamp(1rem, 4vw, 2rem)',
            paddingRight: 'clamp(1rem, 4vw, 2rem)',
          }}
        >
          <div 
            className="text-center mb-[clamp(2rem,5vw,4rem)]"
          >
            <h2 
              className="font-bold text-gray-900 mb-[clamp(1rem,3vw,1.5rem)]"
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                lineHeight: '1.3',
              }}
            >
              {t('landing.quickAccess')}
            </h2>
            <p 
              className="text-gray-600"
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                lineHeight: '1.6',
              }}
            >
              {t('landing.quickAccessSubtitle')}
            </p>
          </div>

          <div 
            className="grid gap-[clamp(1rem,3vw,1.5rem)]"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))',
            }}
          >
            {/* Worker Registration */}
            <ResponsiveCard
              to="/register/worker"
              icon={Users}
              iconColor="text-green-600"
              title={t('landing.registerAsWorker')}
              description={t('landing.workerRegistrationDesc')}
              hover
            >
              <div className="flex items-center text-green-600 group-hover:text-green-700 mt-auto">
                <span 
                  className="font-medium"
                  style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                >
                  {t('common.start')}
                </span>
                <ArrowRight 
                  className="ml-2"
                  style={{
                    width: 'clamp(1rem, 2.5vw, 1.25rem)',
                    height: 'clamp(1rem, 2.5vw, 1.25rem)',
                  }}
                />
              </div>
            </ResponsiveCard>

            {/* Establishment Registration */}
            <ResponsiveCard
              to="/register/establishment"
              icon={Building2}
              iconColor="text-orange-600"
              title={t('landing.registerAsEstablishment')}
              description={t('landing.establishmentRegistrationDesc')}
              hover
            >
              <div className="flex items-center text-orange-600 group-hover:text-orange-700 mt-auto">
                <span 
                  className="font-medium"
                  style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                >
                  {t('common.start')}
                </span>
                <ArrowRight 
                  className="ml-2"
                  style={{
                    width: 'clamp(1rem, 2.5vw, 1.25rem)',
                    height: 'clamp(1rem, 2.5vw, 1.25rem)',
                  }}
                />
              </div>
            </ResponsiveCard>

            {/* Mobile App Download */}
            <ResponsiveCard
              to="/mobile"
              icon={Smartphone}
              iconColor="text-purple-600"
              title={t('mobile.downloadApp')}
              description={t('mobile.getStarted')}
              hover
            >
              <div className="flex items-center text-purple-600 group-hover:text-purple-700 mt-auto">
                <span 
                  className="font-medium"
                  style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                >
                  {t('mobile.downloadApp')}
                </span>
                <ArrowRight 
                  className="ml-2"
                  style={{
                    width: 'clamp(1rem, 2.5vw, 1.25rem)',
                    height: 'clamp(1rem, 2.5vw, 1.25rem)',
                  }}
                />
              </div>
            </ResponsiveCard>

            {/* Login Options - Dropdown for Mobile/PWA, Individual Buttons for Desktop */}
            <ResponsiveCard
              className="flex flex-col"
              hover={false}
            >
              <div className="flex items-center mb-[clamp(0.75rem,2vw,1rem)]">
                <Shield 
                  className="text-blue-600 mr-3 flex-shrink-0"
                  style={{
                    width: 'clamp(1.25rem, 3vw, 2rem)',
                    height: 'clamp(1.25rem, 3vw, 2rem)',
                  }}
                />
                <h3 
                  className="font-semibold text-gray-900"
                  style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                  }}
                >
                  {t('landing.loginOptions')}
                </h3>
              </div>
              
              {/* Login Options - Always show as list */}
              <div 
                className="space-y-[clamp(0.75rem,2vw,1rem)]"
              >
                <Link
                  to="/login/worker"
                  className="block w-full text-center rounded-lg transition-colors touch-manipulation bg-green-50 text-green-700 hover:bg-green-100 active:bg-green-200"
                  style={{
                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                    minHeight: '44px',
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                    fontWeight: '500',
                  }}
                >
                  <div className="flex items-center justify-center">
                    <User 
                      style={{
                        width: 'clamp(1rem, 2.5vw, 1.25rem)',
                        height: 'clamp(1rem, 2.5vw, 1.25rem)',
                      }}
                      className="mr-2"
                    />
                    <span>{t('landing.loginAsWorker')}</span>
                  </div>
                </Link>
                <Link
                  to="/login/establishment"
                  className="block w-full text-center rounded-lg transition-colors touch-manipulation bg-orange-50 text-orange-700 hover:bg-orange-100 active:bg-orange-200"
                  style={{
                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                    minHeight: '44px',
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                    fontWeight: '500',
                  }}
                >
                  <div className="flex items-center justify-center">
                    <Building2 
                      style={{
                        width: 'clamp(1rem, 2.5vw, 1.25rem)',
                        height: 'clamp(1rem, 2.5vw, 1.25rem)',
                      }}
                      className="mr-2"
                    />
                    <span>{t('landing.loginAsEstablishment')}</span>
                  </div>
                </Link>
                <Link
                  to="/login/department"
                  className="block w-full text-center rounded-lg transition-colors touch-manipulation bg-blue-50 text-blue-700 hover:bg-blue-100 active:bg-blue-200"
                  style={{
                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                    minHeight: '44px',
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                    fontWeight: '500',
                  }}
                >
                  <div className="flex items-center justify-center">
                    <Briefcase 
                      style={{
                        width: 'clamp(1rem, 2.5vw, 1.25rem)',
                        height: 'clamp(1rem, 2.5vw, 1.25rem)',
                      }}
                      className="mr-2"
                    />
                    <span>{t('landing.loginAsDepartment')}</span>
                  </div>
                </Link>
              </div>
            </ResponsiveCard>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section 
        className="bg-white"
        style={{
          paddingTop: 'clamp(3rem, 8vw, 6rem)',
          paddingBottom: 'clamp(3rem, 8vw, 6rem)',
        }}
      >
        <div 
          className="max-w-[min(90rem,95vw)] mx-auto"
          style={{
            paddingLeft: 'clamp(1rem, 4vw, 2rem)',
            paddingRight: 'clamp(1rem, 4vw, 2rem)',
          }}
        >
          <div 
            className="grid gap-[clamp(2rem,5vw,3rem)] items-center"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 28rem), 1fr))',
            }}
          >
            <div>
              <h2 
                className="font-bold text-gray-900 mb-[clamp(1rem,3vw,1.5rem)]"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                  lineHeight: '1.3',
                }}
              >
                {t('landing.whyChoose')}
              </h2>
              <p 
                className="text-gray-600 mb-[clamp(1.5rem,4vw,2rem)]"
                style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                  lineHeight: '1.6',
                }}
              >
                {t('landing.whyChooseSubtitle')}
              </p>
              <div 
                className="space-y-[clamp(0.75rem,2vw,1rem)]"
              >
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle 
                      className="text-green-500 mr-3 flex-shrink-0"
                      style={{
                        width: 'clamp(1.25rem, 3vw, 1.5rem)',
                        height: 'clamp(1.25rem, 3vw, 1.5rem)',
                        minWidth: '1.25rem',
                      }}
                    />
                    <span 
                      className="text-gray-700"
                      style={{
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                        lineHeight: '1.6',
                      }}
                    >
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl text-white"
                style={{
                  padding: 'clamp(1.5rem, 4vw, 2rem)',
                }}
              >
                <h3 
                  className="font-bold mb-[clamp(1rem,3vw,1.5rem)]"
                  style={{
                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                    lineHeight: '1.3',
                  }}
                >
                  {t('landing.getStartedToday')}
                </h3>
                <p 
                  className="text-blue-100 mb-[clamp(1rem,3vw,1.5rem)]"
                  style={{
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                    lineHeight: '1.6',
                  }}
                >
                  {t('landing.getStartedTodaySubtitle')}
                </p>
                <ResponsiveButton
                  to="/register"
                  variant="secondary"
                  size="md"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  {t('landing.startRegistration')}
                </ResponsiveButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
