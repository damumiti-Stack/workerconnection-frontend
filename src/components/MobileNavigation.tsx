import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Building2, Shield, Menu, Calendar, Users, BarChart3, Smartphone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Capacitor } from '@capacitor/core';

const MobileNavigation: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const isMobile = window.innerWidth <= 768 || Capacitor.isNativePlatform();

  if (!isMobile || !user) {
    return null;
  }

  const getNavItems = () => {
    const baseItems = [
      { icon: Home, label: t('navigation.home'), path: '/' }
    ];

    switch (user.type) {
      case 'worker':
        return [
          ...baseItems,
          { icon: Shield, label: t('navigation.dashboard'), path: '/dashboard/worker' },
          { icon: Calendar, label: t('worker.attendance'), path: '/attendance/history' },
          { icon: User, label: t('navigation.profile'), path: '/profile/worker' },
          { icon: Menu, label: t('navigation.more'), path: '/settings' },
          { icon: Smartphone, label: t('mobile.downloadApp'), path: '/mobile' }
        ];
      
      case 'establishment':
        return [
          ...baseItems,
          { icon: Building2, label: t('navigation.dashboard'), path: '/dashboard/establishment' },
          { icon: Users, label: t('establishment.workers'), path: '/workers/management' },
          { icon: User, label: t('navigation.profile'), path: '/profile/establishment' },
          { icon: Menu, label: t('navigation.more'), path: '/settings' },
          { icon: Smartphone, label: t('mobile.downloadApp'), path: '/mobile' }
        ];
      
      case 'department':
        return [
          ...baseItems,
          { icon: BarChart3, label: t('navigation.dashboard'), path: '/dashboard/department' },
          { icon: Users, label: t('department.workers'), path: '/establishments/management' },
          { icon: Shield, label: t('department.applications'), path: '/applications/review' },
          { icon: Menu, label: t('navigation.more'), path: '/settings' },
          { icon: Smartphone, label: t('mobile.downloadApp'), path: '/mobile' }
        ];
      
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden safe-area-bottom overflow-x-auto"
      style={{
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div 
        className="flex items-center justify-around"
        style={{
          paddingTop: 'clamp(0.5rem, 1.5vw, 0.75rem)',
          paddingBottom: 'clamp(0.5rem, 1.5vw, 0.75rem)',
          paddingLeft: 'clamp(0.25rem, 1vw, 0.5rem)',
          paddingRight: 'clamp(0.25rem, 1vw, 0.5rem)',
        }}
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex flex-col items-center rounded-lg transition-colors touch-manipulation ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              style={{
                minWidth: 'clamp(44px, 12vw, 70px)',
                minHeight: 'clamp(44px, 12vw, 70px)',
                padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                gap: '0.25rem',
              }}
            >
              <Icon 
                style={{
                  width: 'clamp(1.25rem, 3vw, 1.5rem)',
                  height: 'clamp(1.25rem, 3vw, 1.5rem)',
                }}
              />
              <span 
                className="font-medium text-center"
                style={{
                  fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
                  lineHeight: '1.2',
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;