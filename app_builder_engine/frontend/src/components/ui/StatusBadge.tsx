import React from 'react';
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status?.toLowerCase()) {
    case 'published':
    case 'active':
      return (
        <Tag color="success" icon={<CheckCircleOutlined />}>
          {status}
        </Tag>
      );
    case 'in development':
      return (
        <Tag color="processing" icon={<SyncOutlined spin />}>
          {status}
        </Tag>
      );
    case 'draft':
      return (
        <Tag color="warning" icon={<ClockCircleOutlined />}>
          {status}
        </Tag>
      );
    case 'deprecated':
    case 'archived':
      return (
        <Tag color="default" icon={<CloseCircleOutlined />}>
          {status}
        </Tag>
      );
    default:
      return <Tag>{status}</Tag>;
  }
};
