import React from 'react';
import { Tag } from 'antd';

export type EntityStatus =
  | 'Published'
  | 'Ready'
  | 'Active'
  | 'Approved'
  | 'Valid'
  | 'Draft'
  | 'Planning'
  | 'In Review'
  | 'Pending'
  | 'Deprecated'
  | 'Archived'
  | 'Failed'
  | 'Rejected'
  | string;

export interface StatusTagProps {
  status: EntityStatus;
  size?: 'small' | 'default';
  className?: string;
}

export const StatusTag: React.FC<StatusTagProps> = ({
  status,
  size = 'default',
  className = '',
}) => {
  const normalized = (status || 'Planning').toUpperCase();

  let color = 'default';
  let bgClass = 'bg-loft-bg text-[#486581] border-[#CBD2D9]';

  if (['PUBLISHED', 'READY', 'ACTIVE', 'APPROVED', 'VALID', 'SUCCESS'].includes(normalized)) {
    color = 'success';
    bgClass = 'bg-[#EAF9EF] text-[#0B6B4F] border-[#B7E9C6]';
  } else if (['DRAFT', 'PLANNING', 'IN REVIEW', 'PENDING', 'IN_PROGRESS'].includes(normalized)) {
    color = 'warning';
    bgClass = 'bg-[#FFFBEA] text-[#BD7B00] border-[#FCE588]';
  } else if (['DEPRECATED', 'ARCHIVED'].includes(normalized)) {
    color = 'default';
    bgClass = 'bg-loft-bg text-loft-muted border-[#CBD2D9]';
  } else if (['FAILED', 'REJECTED', 'ERROR', 'INVALID'].includes(normalized)) {
    color = 'error';
    bgClass = 'bg-[#FEECEB] text-[#E74C3C] border-[#FCA5A5]';
  }

  return (
    <Tag
      color={color}
      className={`font-semibold rounded-md border text-[11px] px-2 py-0.5 m-0 inline-flex items-center ${
        size === 'small' ? 'text-[10px] px-1.5 py-0' : ''
      } ${bgClass} ${className}`}
    >
      {status}
    </Tag>
  );
};
