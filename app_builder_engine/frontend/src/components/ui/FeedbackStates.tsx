import React from 'react';
import { Empty, Button, Spin, Alert } from 'antd';
import { InboxOutlined, ReloadOutlined } from '@ant-design/icons';

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}> = ({
  title = 'Nenhum registro encontrado',
  description = 'Não há itens correspondentes aos filtros selecionados.',
  actionText,
  onAction,
}) => {
  return (
    <div className="py-12 flex flex-col items-center justify-center bg-white rounded-xl border border-loft-border">
      <Empty
        image={<InboxOutlined className="text-4xl text-loft-muted" />}
        description={
          <div>
            <div className="font-semibold text-base text-loft-dark">{title}</div>
            <div className="text-sm text-loft-muted mt-1">{description}</div>
          </div>
        }
      >
        {actionText && onAction && (
          <Button type="primary" onClick={onAction}>
            {actionText}
          </Button>
        )}
      </Empty>
    </div>
  );
};

export const LoadingState: React.FC<{ tip?: string }> = ({ tip = 'Carregando recursos...' }) => {
  return (
    <div className="py-16 flex flex-col items-center justify-center gap-3">
      <Spin size="large" />
      {tip && <span className="text-xs text-loft-muted font-medium">{tip}</span>}
    </div>
  );
};

export const ErrorState: React.FC<{
  message?: string;
  description?: string;
  onRetry?: () => void;
}> = ({
  message = 'Erro ao carregar dados',
  description = 'Ocorreu um erro ao comunicar com a API. Verifique a conexão com o servidor.',
  onRetry,
}) => {
  return (
    <div className="my-6">
      <Alert
        message={message}
        description={
          <div className="flex flex-col gap-3 mt-1">
            <span>{description}</span>
            {onRetry && (
              <div>
                <Button size="small" icon={<ReloadOutlined />} onClick={onRetry}>
                  Tentar novamente
                </Button>
              </div>
            )}
          </div>
        }
        type="error"
        showIcon
      />
    </div>
  );
};
