import React from 'react';
import { Card, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

export interface KPIWidgetProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  tooltip?: string;
  badgeColor?: string;
  onClick?: () => void;
  className?: string;
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({
  title,
  value,
  prefix,
  suffix,
  trend,
  tooltip,
  badgeColor = '#F56738',
  onClick,
  className = '',
}) => {
  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      className={`border border-loft-border shadow-2xs rounded-xl transition-all duration-200 hover:border-[#CBD2D9] ${className}`}
      bodyStyle={{ padding: '20px' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-loft-muted uppercase tracking-wider">
            {title}
          </span>
          {tooltip && (
            <Tooltip title={tooltip}>
              <InfoCircleOutlined className="text-[#9FB3C8] text-xs cursor-help" />
            </Tooltip>
          )}
        </div>
        {prefix && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-2xs"
            style={{ backgroundColor: `${badgeColor}15`, color: badgeColor }}
          >
            {prefix}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className="text-2xl lg:text-3xl font-black text-loft-dark tracking-tight">
          {value}
          {suffix && <span className="text-xs text-loft-muted ml-1 font-medium">{suffix}</span>}
        </div>

        {trend && (
          <span
            className={`text-xs font-bold px-1.5 py-0.5 rounded ${
              trend.isPositive
                ? 'bg-[#EAF9EF] text-[#0B6B4F]'
                : 'bg-[#FEECEB] text-[#E74C3C]'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </Card>
  );
};
