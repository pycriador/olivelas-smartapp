import React, { useState, useEffect } from 'react';
import { Card, Button, message } from 'antd';
import { CopyOutlined, ApiOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingState } from '@/components/ui/FeedbackStates';
import { aiService } from '@/services/ai.service';

export const AIApiContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      try {
        const data = await aiService.getAgentContracts();
        setContracts(data);
      } catch (err: any) {
        message.error(`Falha ao carregar contratos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  if (loading) return <LoadingState tip="Carregando contratos de API..." />;

  return (
    <div>
      <PageHeader
        title="Contratos da API para Agentes de IA"
        subtitle="Especificação OpenAPI dos endpoints de consumo direto para agentes como Cursor, Claude Code e Antigravity"
      />

      <Card
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ApiOutlined className="text-loft-orange" />
              <span>Contratos de Consulta de Conhecimento e Blueprint</span>
            </div>
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(contracts, null, 2));
                message.success('Contratos copiados para a área de transferência!');
              }}
            >
              Copiar Esquema
            </Button>
          </div>
        }
        className="shadow-2xs"
      >
        <div className="space-y-4">
          <p className="text-sm text-loft-dark">
            Agentes de IA podem interagir com o App Builder Engine através de chamadas HTTP padronizadas para obter especificações e compor planos de projeto.
          </p>

          <pre className="p-4 bg-loft-dark text-loft-success rounded-lg text-xs font-mono overflow-x-auto max-h-[500px]">
            {JSON.stringify(contracts, null, 2)}
          </pre>
        </div>
      </Card>
    </div>
  );
};
