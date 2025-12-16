import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface ResponsiveCardProps {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  iconColor?: string;
  title?: string;
  description?: string;
  className?: string;
  hover?: boolean;
}

const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  to,
  onClick,
  icon: Icon,
  iconColor,
  title,
  description,
  className = '',
  hover = true,
}) => {
  const baseClasses = `
    bg-white rounded-xl
    shadow-[0_2px_8px_rgba(0,0,0,0.08)]
    border border-gray-200
    p-[clamp(1rem,3vw,1.5rem)]
    transition-all duration-200
    flex flex-col
    ${hover ? 'hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]' : ''}
    ${onClick || to ? 'cursor-pointer touch-manipulation' : ''}
  `;

  const classes = `${baseClasses} ${className}`.replace(/\s+/g, ' ').trim();

  const iconClass = iconColor || 'text-gray-700';

  const content = (
    <>
      {(Icon || title) && (
        <div className="flex items-center mb-[clamp(0.75rem,2vw,1rem)]">
          {Icon && (
            <Icon 
              className={`h-[clamp(1.25rem,3vw,2rem)] w-[clamp(1.25rem,3vw,2rem)] flex-shrink-0 mr-3 ${iconClass}`}
            />
          )}
          {title && (
            <h3 className="text-[clamp(1rem,2.5vw,1.25rem)] font-semibold text-gray-900">
              {title}
            </h3>
          )}
        </div>
      )}
      {description && (
        <p className="text-[clamp(0.875rem,2vw,1rem)] text-gray-600 mb-[clamp(0.75rem,2vw,1rem)]">
          {description}
        </p>
      )}
      <div className="flex-1">
        {children}
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div onClick={onClick} className={classes}>
        {content}
      </div>
    );
  }

  return <div className={classes}>{content}</div>;
};

export default ResponsiveCard;

