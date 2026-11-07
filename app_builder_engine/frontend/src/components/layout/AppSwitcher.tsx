import React from 'react';
import { CheckOutlined } from '@ant-design/icons';

interface AppSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  currentProduct?: string;
}

interface ProductItem {
  id: string;
  name: string;
  description: string;
  url: string;
  isCurrent?: boolean;
}

interface UtilityItem {
  id: string;
  name: string;
  url: string;
}

export const AppSwitcher: React.FC<AppSwitcherProps> = ({
  isOpen,
  onClose,
  currentProduct = 'app-builder',
}) => {
  if (!isOpen) return null;

  const mainProducts: ProductItem[] = [
    {
      id: 'app-builder',
      name: 'App Builder Engine',
      description: 'Catálogo de componentes, especificações e composição de blueprints.',
      url: '/dashboard',
      isCurrent: currentProduct === 'app-builder',
    },
    {
      id: 'fianca',
      name: 'Fiança Aluguel',
      description: 'Garantias para o seu contrato de aluguel rápido e mais fácil.',
      url: '#',
      isCurrent: currentProduct === 'fianca',
    },
    {
      id: 'sites',
      name: 'Sites',
      description: 'O site profissional para sua imobiliária atrair mais clientes.',
      url: '#',
    },
    {
      id: 'adm-imoveis',
      name: 'Adm Imóveis',
      description: 'Gerencie seus contratos de aluguel, propostas e cobranças.',
      url: '#',
    },
    {
      id: 'crm',
      name: 'CRM',
      description: 'Gerencie as publicações dos seus imóveis e seus clientes em um único lugar.',
      url: '#',
    },
    {
      id: 'financiamento',
      name: 'Financiamento Imobiliário',
      description: 'Simule, aprove e acompanhe financiamento imobiliário em tempo real.',
      url: '#',
    },
    {
      id: 'portal-loft',
      name: 'Portal Loft',
      description: 'Acompanhe seus anúncios e integrações em tempo real.',
      url: '#',
    },
  ];

  const utilityLinks: UtilityItem[] = [
    { id: 'qualifica', name: 'Qualifica Leads', url: '#' },
    { id: 'clube', name: 'Clube Loft', url: '#' },
    { id: 'credsign', name: 'CredSign', url: '#' },
    { id: 'assistente', name: 'Assistente Loft', url: '#' },
    { id: 'selo', name: 'Selo de tecnologia Loft', url: '#' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Waffle Panel anchored fixed to left: 0 below the 64px header */}
      <div
        className="fixed top-16 left-0 w-[540px] max-w-[90vw] bg-white border-r border-b border-loft-border shadow-2xl z-50 p-6 overflow-y-auto max-h-[calc(100vh-4rem)] rounded-br-2xl"
        style={{ animation: 'fadeInSlide 0.15s ease-out' }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-loft-bg mb-5">
          <p className="text-base text-loft-dark m-0 font-normal">
            Produtos e <strong className="font-bold text-loft-orange">Soluções</strong>
          </p>
          <button
            onClick={onClose}
            className="text-xs text-loft-muted hover:text-loft-dark px-2 py-1 rounded-sm bg-loft-bg hover:bg-loft-border transition"
          >
            Fechar ✕
          </button>
        </div>

        {/* Main Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {mainProducts.map((p) => {
            const isSelected = p.isCurrent;
            return (
              <a
                key={p.id}
                href={p.url}
                onClick={(e) => {
                  if (p.url === '#' || p.url.startsWith('/')) {
                    e.preventDefault();
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between min-h-[86px] ${
                  isSelected
                    ? 'bg-[#EAF9EF] border-[#B7E9C6] shadow-2xs'
                    : 'bg-white border-loft-border hover:border-[#CBD2D9] hover:bg-[#F9FAFB] hover:shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-[#0B6B4F]">
                    {p.name}
                  </span>
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-[#0B6B4F] text-white flex items-center justify-center text-[10px]">
                      <CheckOutlined />
                    </span>
                  ) : (
                    <span className="text-xs text-loft-muted font-bold">→</span>
                  )}
                </div>
                <span className="text-[11px] text-[#486581] leading-snug">
                  {p.description}
                </span>
              </a>
            );
          })}
        </div>

        {/* Secondary Utility Links (Pills with Loft Key Marker) */}
        <div>
          <span className="text-[11px] font-bold text-loft-muted uppercase tracking-wider block mb-2.5">
            Soluções & Ferramentas Integradas
          </span>
          <div className="flex flex-wrap gap-2">
            {utilityLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F8FAFC] border border-loft-border hover:border-[#FF774A] hover:bg-white text-xs font-medium text-loft-dark transition shadow-2xs"
              >
                {/* Loft Key Marker: orange hollow circle + solid horizontal line */}
                <div className="flex items-center">
                  <div className="w-[9px] h-[9px] rounded-full border-[1.5px] border-[#FF774A]" />
                  <div className="w-[6px] h-[2px] bg-[#FF774A]" />
                </div>
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
