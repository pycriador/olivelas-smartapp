import React from 'react';
import { Modal, Tag } from 'antd';
import {
  SafetyCertificateOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  LineChartOutlined,
  AppstoreOutlined,
  BankOutlined,
} from '@ant-design/icons';

interface AppSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSwitcher: React.FC<AppSwitcherProps> = ({ isOpen, onClose }) => {
  const apps = [
    {
      id: 'fianca',
      title: 'Fiança Aluguel',
      subtitle: 'Esteira de Locação & Garantias',
      icon: <SafetyCertificateOutlined className="text-xl text-[#0B6B4F]" />,
      bg: 'bg-[#EAF9EF] border-[#B7EB8F]',
      badge: 'Ativo',
    },
    {
      id: 'crm',
      title: 'CRM 360',
      subtitle: 'Gestão de Clientes & Vendas',
      icon: <UsergroupAddOutlined className="text-xl text-[#F56738]" />,
      bg: 'bg-[#FFF2EC] border-[#FDC4B2]',
    },
    {
      id: 'motor-risco',
      title: 'Motor de Risco',
      subtitle: 'Decisão de Crédito em < 60s',
      icon: <LineChartOutlined className="text-xl text-[#2B6CB0]" />,
      bg: 'bg-[#EBF8FF] border-[#90CDF4]',
    },
    {
      id: 'adm-imoveis',
      title: 'Adm de Imóveis',
      subtitle: 'Portal de Repasses & Contratos',
      icon: <HomeOutlined className="text-xl text-[#805AD5]" />,
      bg: 'bg-[#FAF5FF] border-[#D6BCFA]',
    },
    {
      id: 'financiamento',
      title: 'Financiamento Imobiliário',
      subtitle: 'Simulações & Análise Bancária',
      icon: <BankOutlined className="text-xl text-[#D69E2E]" />,
      bg: 'bg-[#FEFCBF] border-[#F6E05E]',
    },
    {
      id: 'engine',
      title: 'App Builder Engine',
      subtitle: 'Plataforma & Governança SDD',
      icon: <AppstoreOutlined className="text-xl text-[#121619]" />,
      bg: 'bg-[#F2F4F8] border-[#E1E9EF]',
    },
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      title={
        <div className="flex items-center gap-2 pb-2 border-b border-[#E1E9EF]">
          <AppstoreOutlined className="text-[#F56738] text-lg" />
          <span className="font-bold text-base text-[#121619]">Ecossistema de Aplicações Loft</span>
        </div>
      }
    >
      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {apps.map((app) => (
          <div
            key={app.id}
            onClick={onClose}
            className={`p-3.5 rounded-xl border transition cursor-pointer hover:shadow-md flex items-start gap-3 ${app.bg}`}
          >
            <div className="p-2 bg-white rounded-lg shadow-sm">{app.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#121619]">{app.title}</span>
                {app.badge && <Tag color="success">{app.badge}</Tag>}
              </div>
              <p className="text-xs text-[#627D98] mt-0.5 truncate">{app.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
