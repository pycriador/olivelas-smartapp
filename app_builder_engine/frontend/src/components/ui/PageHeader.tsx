import React from 'react';
import { Breadcrumb } from 'antd';

interface BreadcrumbItem {
  title: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  badge,
}) => {
  return (
    <div className="bg-white border-b border-loft-border px-8 py-5 mb-6 -mx-8 -mt-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-2">
          <Breadcrumb
            items={breadcrumbs.map((b) => ({
              title: b.onClick ? (
                <a onClick={(e) => { e.preventDefault(); b.onClick?.(); }}>
                  {b.title}
                </a>
              ) : (
                b.title
              ),
            }))}
          />
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-loft-dark tracking-tight">{title}</h1>
            {badge}
          </div>
          {subtitle && (
            <p className="text-sm text-loft-muted mt-1">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
};
