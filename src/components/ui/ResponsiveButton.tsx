import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface ResponsiveButtonProps {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  children,
  to,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  className = '',
  disabled = false,
  fullWidth = false,
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    min-h-[clamp(44px,4vw,56px)]
    min-w-[clamp(44px,8vw,120px)]
    px-[clamp(0.75rem,2vw,1.5rem)]
    py-[clamp(0.625rem,1.5vw,0.875rem)]
    font-semibold
    rounded-lg
    transition-all duration-200
    touch-manipulation
    active:scale-[0.98]
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };

  const sizeClasses = {
    sm: 'text-[clamp(0.875rem,2vw,1rem)]',
    md: 'text-[clamp(0.875rem,2vw,1.125rem)]',
    lg: 'text-[clamp(1rem,2.5vw,1.25rem)]',
  };

  const iconSizeClasses = {
    sm: 'h-[clamp(0.875rem,2vw,1rem)] w-[clamp(0.875rem,2vw,1rem)]',
    md: 'h-[clamp(1rem,2.5vw,1.25rem)] w-[clamp(1rem,2.5vw,1.25rem)]',
    lg: 'h-[clamp(1.125rem,3vw,1.5rem)] w-[clamp(1.125rem,3vw,1.5rem)]',
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const iconClasses = `${iconSizeClasses[size]} ${iconPosition === 'left' ? 'mr-2' : 'ml-2'}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className={iconClasses} />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className={iconClasses} />}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
};

export default ResponsiveButton;

