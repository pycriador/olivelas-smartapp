import React from 'react';
import {
  UserOutlined,
  LockOutlined,
  ArrowLeftOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  WarningOutlined,
} from '@ant-design/icons';

export interface IconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
  style?: React.CSSProperties;
}

const sizeMap: Record<string, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
};

function wrapIcon(AntIcon: React.ComponentType<any>): React.FC<IconProps> {
  return ({ size = 'md', color, style }) => (
    <AntIcon style={{ fontSize: sizeMap[size] || 16, color, ...style }} />
  );
}

export const UserIcon = wrapIcon(UserOutlined);
export const LockIcon = wrapIcon(LockOutlined);
export const ArrowLeftIcon = wrapIcon(ArrowLeftOutlined);
export const MailIcon = wrapIcon(MailOutlined);
export const ShieldIcon = wrapIcon(SafetyCertificateOutlined);
export const PlusIcon = wrapIcon(PlusOutlined);
export const SearchIcon = wrapIcon(SearchOutlined);
export const TrashIcon = wrapIcon(DeleteOutlined);
export const PencilIcon = wrapIcon(EditOutlined);
export const WarningIcon = wrapIcon(WarningOutlined);
