import React from 'react';
import { Spin, Empty, Button, Result } from 'antd';
import { LoadingOutlined, InboxOutlined, ReloadOutlined } from '@ant-design/icons';

export interface LoadingStateProps {
  tip?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  tip = 'Carregando recursos...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: '#F56738' }} spin />} />
      <span className="text-xs text-loft-muted font-medium mt-3">{tip}</span>
    </div>
  );
};

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nenhum registro encontrado',
  description = 'Não há itens correspondentes aos critérios selecionados ou cadastrados.',
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`p-8 sm:p-12 text-center bg-[#F8FAFC] rounded-xl border border-dashed border-[#CBD2D9] ${className}`}>
      <Empty
        image={<InboxOutlined className="text-4xl text-[#9FB3C8]" />}
        description={
          <div className="mt-2">
            <div className="font-bold text-sm text-loft-dark">{title}</div>
            <div className="text-xs text-loft-muted max-w-md mx-auto mt-1">{description}</div>
          </div>
        }
      >
        {actionText && onAction && (
          <Button
            type="primary"
            onClick={onAction}
            className="bg-loft-orange hover:bg-[#E05326] border-none font-semibold text-xs mt-3 shadow-2xs"
          >
            {actionText}
          </Button>
        )}
      </Empty>
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Falha ao carregar dados',
  description = 'Ocorreu um erro na comunicação com o backend ou processamento da solicitação.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-8 text-center bg-white rounded-xl border border-[#FCA5A5] ${className}`}>
      <Result
        status="error"
        title={<span className="text-base font-bold text-loft-dark">{title}</span>}
        subTitle={<span className="text-xs text-loft-muted">{description}</span>}
        extra={
          onRetry && (
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={onRetry}
              className="bg-loft-orange hover:bg-[#E05326] border-none font-semibold text-xs"
            >
              Tentar Novamente
            </Button>
          )
        }
      />
    </div>
  );
};
