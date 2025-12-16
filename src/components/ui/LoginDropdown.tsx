import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronDown, ChevronUp, User, Building2, Briefcase } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface LoginOption {
  path: string;
  label: string;
  color: string;
  bgColor: string;
  hoverBgColor: string;
  icon: React.ElementType;
}

const LoginDropdown: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loginOptions: LoginOption[] = [
    {
      path: '/login/worker',
      label: t('landing.loginAsWorker'),
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      hoverBgColor: 'hover:bg-green-100',
      icon: User,
    },
    {
      path: '/login/establishment',
      label: t('landing.loginAsEstablishment'),
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      hoverBgColor: 'hover:bg-orange-100',
      icon: Building2,
    },
    {
      path: '/login/department',
      label: t('landing.loginAsDepartment'),
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      hoverBgColor: 'hover:bg-blue-100',
      icon: Briefcase,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Use a small delay to prevent immediate closing when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside, { passive: true });
        document.addEventListener('touchstart', handleClickOutside, { passive: true });
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Track if we've handled a touch event to prevent double-firing
  const touchHandledRef = useRef(false);

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    // If this is a click after a touch event, ignore it
    if (touchHandledRef.current) {
      touchHandledRef.current = false;
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  // Handle touch events separately to prevent double-firing
  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    touchHandledRef.current = true;
    setIsOpen((prev) => !prev);
    // Reset the flag after a short delay
    setTimeout(() => {
      touchHandledRef.current = false;
    }, 300);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        onClick={toggleDropdown}
        onTouchStart={handleTouchStart}
        type="button"
        className={`
          w-full
          min-h-[clamp(44px,5vw,56px)]
          flex items-center justify-between
          px-[clamp(1rem,3vw,1.5rem)]
          py-[clamp(0.75rem,2vw,1rem)]
          bg-white
          border-2 border-gray-300
          rounded-lg
          text-left
          font-semibold
          text-[clamp(0.875rem,2vw,1rem)]
          text-gray-900
          hover:border-blue-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          transition-all duration-200
          touch-manipulation
          active:scale-[0.98]
        `}
        style={{ WebkitTapHighlightColor: 'transparent' }}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center">
          <Shield className="h-[clamp(1rem,2.5vw,1.25rem)] w-[clamp(1rem,2.5vw,1.25rem)] text-blue-600 mr-3 flex-shrink-0" />
          <span>{t('landing.loginOptions')}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-[clamp(1rem,2.5vw,1.25rem)] w-[clamp(1rem,2.5vw,1.25rem)] flex-shrink-0" />
        ) : (
          <ChevronDown className="h-[clamp(1rem,2.5vw,1.25rem)] w-[clamp(1rem,2.5vw,1.25rem)] flex-shrink-0" />
        )}
      </button>

      {isOpen && (
        <div
          className={`
            absolute top-full left-0 right-0 mt-2
            bg-white
            border border-gray-200
            rounded-lg
            shadow-[0_4px_16px_rgba(0,0,0,0.15)]
            z-[9999]
            overflow-hidden
            animate-slide-up
            max-h-[min(80vh,400px)]
            overflow-y-auto
          `}
          role="menu"
          style={{
            maxWidth: '100%',
            WebkitOverflowScrolling: 'touch',
          }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {loginOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Link
                key={index}
                to={option.path}
                className={`
                  block
                  w-full
                  min-h-[clamp(44px,5vw,56px)]
                  flex items-center
                  px-[clamp(1rem,3vw,1.5rem)]
                  py-[clamp(0.75rem,2vw,1rem)]
                  ${option.bgColor}
                  ${option.color}
                  ${option.hoverBgColor}
                  transition-colors duration-200
                  touch-manipulation
                  border-b border-gray-100 last:border-b-0
                  active:opacity-80
                `}
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                }}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Icon className="h-[clamp(1rem,2.5vw,1.25rem)] w-[clamp(1rem,2.5vw,1.25rem)] mr-3 flex-shrink-0" />
                <span className="text-[clamp(0.875rem,2vw,1rem)] font-medium">{option.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LoginDropdown;

