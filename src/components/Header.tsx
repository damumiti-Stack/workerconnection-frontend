import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Globe, LogOut, Smartphone, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'te' : 'en');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 safe-top sticky top-0 z-30">
      <div 
        className="max-w-[min(90rem,100vw)] mx-auto"
        style={{
          paddingLeft: 'clamp(1rem, 4vw, 2rem)',
          paddingRight: 'clamp(1rem, 4vw, 2rem)',
        }}
      >
        <div 
          className="flex justify-between items-center"
          style={{
            minHeight: 'clamp(3.5rem, 8vw, 4rem)',
          }}
        >
          <Link 
            to="/" 
            className="flex items-center"
            style={{ gap: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}
          >
            <Users 
              className="text-blue-600 flex-shrink-0"
              style={{
                width: 'clamp(1.5rem, 4vw, 2rem)',
                height: 'clamp(1.5rem, 4vw, 2rem)',
              }}
            />
            <span 
              className="font-bold text-gray-900"
              style={{
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                lineHeight: '1.2',
              }}
            >
              {t('landing.title')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center" style={{ gap: 'clamp(0.5rem, 1.5vw, 1rem)' }}>
            <Link
              to="/mobile"
              className="flex items-center rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors touch-manipulation"
              style={{
                padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                minHeight: '44px',
                gap: '0.25rem',
              }}
            >
              <Smartphone 
                style={{
                  width: 'clamp(1rem, 2.5vw, 1.25rem)',
                  height: 'clamp(1rem, 2.5vw, 1.25rem)',
                }}
              />
              <span 
                className="font-medium"
                style={{
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                }}
              >
                {t('mobile.downloadApp')}
              </span>
            </Link>
            <button
              onClick={handleLanguageToggle}
              className="flex items-center rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors touch-manipulation"
              style={{
                padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                minHeight: '44px',
                gap: '0.25rem',
              }}
            >
              <Globe 
                style={{
                  width: 'clamp(1rem, 2.5vw, 1.25rem)',
                  height: 'clamp(1rem, 2.5vw, 1.25rem)',
                }}
              />
              <span 
                className="font-medium"
                style={{
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                }}
              >
                {language === 'en' ? 'తెలుగు' : 'English'}
              </span>
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors touch-manipulation"
                style={{
                  padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
                  minHeight: '44px',
                  gap: '0.25rem',
                }}
              >
                <LogOut 
                  style={{
                    width: 'clamp(1rem, 2.5vw, 1.25rem)',
                    height: 'clamp(1rem, 2.5vw, 1.25rem)',
                  }}
                />
                <span 
                  className="font-medium"
                  style={{
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  }}
                >
                  {t('navigation.logout')}
                </span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 transition-colors touch-manipulation"
            style={{
              minWidth: '44px',
              minHeight: '44px',
              padding: '0.5rem',
            }}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X 
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                }}
              />
            ) : (
              <Menu 
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                }}
              />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <nav 
            className="md:hidden border-t border-gray-200 py-4 animate-slide-up"
            style={{
              paddingTop: 'clamp(1rem, 3vw, 1.5rem)',
              paddingBottom: 'clamp(1rem, 3vw, 1.5rem)',
            }}
          >
            <div className="flex flex-col" style={{ gap: 'clamp(0.5rem, 1.5vw, 0.75rem)' }}>
              <Link
                to="/mobile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors touch-manipulation"
                style={{
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  minHeight: '44px',
                  gap: '0.5rem',
                }}
              >
                <Smartphone 
                  style={{
                    width: 'clamp(1rem, 2.5vw, 1.25rem)',
                    height: 'clamp(1rem, 2.5vw, 1.25rem)',
                  }}
                />
                <span 
                  className="font-medium"
                  style={{
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  }}
                >
                  {t('mobile.downloadApp')}
                </span>
              </Link>
              <button
                onClick={handleLanguageToggle}
                className="flex items-center rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors touch-manipulation"
                style={{
                  padding: 'clamp(0.75rem, 2vw, 1rem)',
                  minHeight: '44px',
                  gap: '0.5rem',
                }}
              >
                <Globe 
                  style={{
                    width: 'clamp(1rem, 2.5vw, 1.25rem)',
                    height: 'clamp(1rem, 2.5vw, 1.25rem)',
                  }}
                />
                <span 
                  className="font-medium"
                  style={{
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  }}
                >
                  {language === 'en' ? 'తెలుగు' : 'English'}
                </span>
              </button>

              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors touch-manipulation"
                  style={{
                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                    minHeight: '44px',
                    gap: '0.5rem',
                  }}
                >
                  <LogOut 
                    style={{
                      width: 'clamp(1rem, 2.5vw, 1.25rem)',
                      height: 'clamp(1rem, 2.5vw, 1.25rem)',
                    }}
                  />
                  <span 
                    className="font-medium"
                    style={{
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                    }}
                  >
                    {t('navigation.logout')}
                  </span>
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
