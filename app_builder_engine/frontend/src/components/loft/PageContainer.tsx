import React from 'react';

export interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: number | string;
  padding?: 'small' | 'default' | 'large';
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 1440,
  padding = 'default',
  className = '',
}) => {
  const paddingMap = {
    small: 'p-4',
    default: 'p-6 lg:p-8',
    large: 'p-8 lg:p-12',
  };

  return (
    <div
      className={`w-full mx-auto ${paddingMap[padding]} ${className}`}
      style={{ maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }}
    >
      {children}
    </div>
  );
};
