import React from 'react';

export interface ContentSectionProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  description,
  actions,
  children,
  className = '',
  bordered = true,
}) => {
  return (
    <section
      className={`bg-white rounded-xl ${
        bordered ? 'border border-loft-border shadow-2xs' : ''
      } p-5 sm:p-6 mb-6 ${className}`}
    >
      {(title || description || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-loft-bg gap-3">
          <div>
            {title && (
              <h3 className="text-base font-bold text-loft-dark tracking-tight m-0">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-loft-muted mt-1 mb-0">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
};
