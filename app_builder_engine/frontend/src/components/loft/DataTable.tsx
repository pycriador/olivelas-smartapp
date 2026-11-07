import { Table, TableProps } from 'antd';

export interface DataTableProps<T> extends TableProps<T> {
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T extends object>({
  columns,
  dataSource,
  loading,
  pagination,
  rowKey = 'id',
  className = '',
  ...rest
}: DataTableProps<T>) {
  return (
    <div className={`w-full overflow-hidden rounded-xl border border-loft-border bg-white shadow-2xs ${className}`}>
      <Table<T>
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey={rowKey}
        pagination={
          pagination === false
            ? false
            : {
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total, range) => (
                  <span className="text-xs text-loft-muted font-medium">
                    Exibindo {range[0]}-{range[1]} de {total} registros
                  </span>
                ),
                ...pagination,
              }
        }
        scroll={{ x: 'max-content' }}
        size="middle"
        {...rest}
      />
    </div>
  );
}
