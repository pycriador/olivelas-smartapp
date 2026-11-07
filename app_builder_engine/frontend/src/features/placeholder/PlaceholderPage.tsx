import React from 'react';
import { Button, Card, Tag } from 'antd';
import { InfoCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { useUIStore } from '@/stores/uiStore';

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  statusType: 'COMING_SOON' | 'NOT_CONFIGURED' | 'PLANNED';
  description: string;
  roadmapItems?: string[];
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  subtitle,
  statusType,
  description,
  roadmapItems = [],
}) => {
  const { setActiveView } = useUIStore();

  const getStatusTag = () => {
    switch (statusType) {
      case 'COMING_SOON':
        return <Tag color="orange" className="font-semibold text-xs px-2.5 py-0.5">COMING SOON</Tag>;
      case 'NOT_CONFIGURED':
        return <Tag color="default" className="font-semibold text-xs px-2.5 py-0.5">NOT CONFIGURED</Tag>;
      case 'PLANNED':
        return <Tag color="blue" className="font-semibold text-xs px-2.5 py-0.5">PLANNED</Tag>;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={[
          { title: 'Engineering Workspace' },
          { title: title },
        ]}
        actions={
          <Button icon={<ArrowLeftOutlined />} onClick={() => setActiveView('dashboard')}>
            Voltar ao Dashboard
          </Button>
        }
      />

      <Card className="mt-6 border border-loft-border shadow-2xs rounded-xl p-6 text-center bg-white">
        <div className="max-w-md mx-auto py-8">
          <div className="w-14 h-14 bg-loft-bg rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#486581]">
            <InfoCircleOutlined className="text-2xl" />
          </div>

          <div className="mb-3">{getStatusTag()}</div>

          <h2 className="text-lg font-bold text-loft-dark mb-2">{title}</h2>
          <p className="text-sm text-loft-muted leading-relaxed mb-6">
            {description}
          </p>

          {roadmapItems.length > 0 && (
            <div className="text-left bg-[#FAFBFD] p-4 rounded-lg border border-loft-border mb-6">
              <span className="text-xs font-bold text-[#334E68] uppercase tracking-wider block mb-2">
                Escopo Previsto no Roadmap:
              </span>
              <ul className="text-xs text-[#486581] space-y-1.5 list-disc list-inside">
                {roadmapItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-xs text-[#829AB1]">
            Em conformidade com as diretrizes do Engineering Workspace, nenhuma integração mockada ou fake functionality é executada nesta etapa.
          </div>
        </div>
      </Card>
    </div>
  );
};
