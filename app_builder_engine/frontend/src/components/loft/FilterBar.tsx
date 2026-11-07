import React from 'react';
import { Input, Select, Button } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterField {
  key: string;
  label: string;
  options: FilterOption[];
  value?: string;
  placeholder?: string;
}

export interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  filters?: FilterField[];
  onFilterChange?: (key: string, value: string) => void;
  onResetFilters?: () => void;
  extraActions?: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Filtrar por nome, identificador ou tag...',
  filters = [],
  onFilterChange,
  onResetFilters,
  extraActions,
  className = '',
}) => {
  const hasActiveFilters = searchQuery !== '' || filters.some((f) => !!f.value && f.value !== 'all');

  return (
    <div
      className={`bg-white p-4 rounded-xl border border-loft-border shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 ${className}`}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        <Input
          prefix={<SearchOutlined className="text-loft-muted" />}
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          className="w-full sm:w-72 rounded-lg text-xs"
          size="middle"
        />

        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={filter.value || 'all'}
            onChange={(val) => onFilterChange?.(filter.key, val)}
            placeholder={filter.placeholder || filter.label}
            className="min-w-[140px] text-xs"
            size="middle"
            options={[
              { label: `Todos (${filter.label})`, value: 'all' },
              ...filter.options,
            ]}
          />
        ))}

        {hasActiveFilters && onResetFilters && (
          <Button
            type="text"
            icon={<ClearOutlined />}
            onClick={onResetFilters}
            className="text-xs text-loft-muted hover:text-[#E74C3C]"
            size="middle"
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      {extraActions && (
        <div className="flex items-center gap-2 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-loft-bg">
          {extraActions}
        </div>
      )}
    </div>
  );
};
