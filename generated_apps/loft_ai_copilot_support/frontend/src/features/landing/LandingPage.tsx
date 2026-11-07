import React, { useState } from 'react';
import { Card, Button, Row, Col, Statistic, Tag, Modal, Form, Input, message } from 'antd';
import {
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  UsergroupAddOutlined,
  HomeOutlined,
  LineChartOutlined,
  ArrowRightOutlined,
  ApiOutlined,
  CloudServerOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/ui/PageHeader';

interface LandingPageProps {
  appName: string;
  onExploreDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ appName, onExploreDashboard }) => {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [form] = Form.useForm();

  const products = [
    {
      id: 'fianca',
      name: 'Fiança Aluguel Digital',
      category: 'Garantia Locatícia',
      description: 'Locação residencial e comercial sem fiador e sem depósito caução. Análise instantânea em menos de 60 segundos com score preditivo.',
      icon: <SafetyCertificateOutlined className="text-2xl text-[#0B6B4F]" />,
      stats: 'Aprovação em < 60s',
      highlightColor: 'border-l-4 border-l-[#0B6B4F]',
      tagColor: 'green',
      features: ['Análise automática de crédito via IA', 'Zero custo de adesão para a imobiliária', 'Garantia de pagamento pontual do aluguel'],
    },
    {
      id: 'crm',
      name: 'CRM 360 & Gestão de Leads',
      category: 'Vendas & Negociações',
      description: 'Pipeline integrado para corretores e imobiliárias gerenciarem propostas, contratos, visitas e esteiras de atendimento de ponta a ponta.',
      icon: <UsergroupAddOutlined className="text-2xl text-[#F56738]" />,
      stats: '+42% Conversão',
      highlightColor: 'border-l-4 border-l-[#F56738]',
      tagColor: 'orange',
      features: ['Distribuição inteligente de leads', 'Assinatura digital integrada', 'Dashboard analítico em tempo real'],
    },
    {
      id: 'risco',
      name: 'Motor de Risco & Decisão',
      category: 'Inteligência Financeira',
      description: 'Modelos de machine learning que cruzam birôs de crédito e histórico transacional para oferecer a máxima segurança jurídica e zero inadimplência.',
      icon: <LineChartOutlined className="text-2xl text-[#2B6CB0]" />,
      stats: '99.4% Assertividade',
      highlightColor: 'border-l-4 border-l-[#2B6CB0]',
      tagColor: 'blue',
      features: ['Antifraude biométrico e validação KYC', 'Score preditivo de inadimplência', 'Políticas customizáveis por região'],
    },
    {
      id: 'portal',
      name: 'Portal Imobiliário & Repasses',
      category: 'Gestão Operacional',
      description: 'Central de autoatendimento para proprietários, inquilinos e imobiliárias com controle de extratos, boletos e repasses automáticos via Pix.',
      icon: <HomeOutlined className="text-2xl text-[#805AD5]" />,
      stats: 'Pix Instantâneo',
      highlightColor: 'border-l-4 border-l-[#805AD5]',
      tagColor: 'purple',
      features: ['Emissão automatizada de boletos', 'Divisão inteligente de repasse (Split)', 'Extrato financeiro 100% transparente'],
    },
  ];

  const handleContactSubmit = (values: any) => {
    message.success(`Obrigado, ${values.name}! Nossa equipe de consultores entrará em contato em instantes.`);
    setDemoModalOpen(false);
    form.resetFields();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title={appName}
        subtitle="Apresentação institucional completa de produtos, garantias e soluções digitais Olivelas."
        badge={
          <span className="bg-[#FFF2EC] text-[#F56738] border border-[#FDC4B2] text-xs font-bold px-2.5 py-1 rounded-full">
            Olivelas Copan Design System
          </span>
        }
        actions={
          <div className="flex items-center gap-3">
            <Button onClick={() => setDemoModalOpen(true)}>
              Agendar Demonstração
            </Button>
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              onClick={onExploreDashboard}
              className="bg-[#F56738] hover:bg-[#D94616]"
            >
              Acessar Painel de Gestão
            </Button>
          </div>
        }
      />

      {/* 1. HERO SECTION */}
      <div className="bg-gradient-to-br from-white via-[#FFF9F6] to-[#FFF2EC] border border-[#FDC4B2] rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFEDE6] text-[#F56738] rounded-full text-xs font-bold uppercase tracking-wider">
            <RocketOutlined /> Soluções Imobiliárias Enterprise
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#121619] tracking-tight leading-tight">
            Tecnologia e Segurança para <span className="text-[#F56738]">Transformar</span> o Mercado Imobiliário
          </h1>
          <p className="text-base md:text-lg text-[#627D98] leading-relaxed">
            Oferecemos uma suíte completa de produtos integrados para locação, análise de crédito, CRM e repasses financeiros com a confiabilidade e padrão de qualidade Olivelas.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Button
              type="primary"
              size="large"
              icon={<ThunderboltOutlined />}
              onClick={() => setDemoModalOpen(true)}
              className="bg-[#F56738] hover:bg-[#D94616] font-semibold h-12 px-6"
            >
              Falar com um Consultor
            </Button>
            <Button
              size="large"
              onClick={onExploreDashboard}
              className="font-semibold h-12 px-6 border-[#E1E9EF] hover:border-[#F56738] hover:text-[#F56738]"
            >
              Ver Painel Operacional
            </Button>
          </div>
        </div>
      </div>

      {/* 2. KPI / METRICS STATS SECTION */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
            <Statistic
              title={<span className="text-xs font-bold text-[#627D98] uppercase">Volume Transacionado</span>}
              value="R$ 4.8B+"
              valueStyle={{ color: '#F56738', fontWeight: 800 }}
              prefix={<LineChartOutlined />}
            />
            <div className="text-xs text-[#20A483] font-medium mt-1">▲ +35% no último ano fiscal</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
            <Statistic
              title={<span className="text-xs font-bold text-[#627D98] uppercase">Tempo de Análise</span>}
              value="< 60 seg"
              valueStyle={{ color: '#0B6B4F', fontWeight: 800 }}
              prefix={<ThunderboltOutlined />}
            />
            <div className="text-xs text-[#627D98] font-medium mt-1">Decisão preditiva em tempo real</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
            <Statistic
              title={<span className="text-xs font-bold text-[#627D98] uppercase">Imobiliárias Parceiras</span>}
              value="3.500+"
              valueStyle={{ color: '#121619', fontWeight: 800 }}
              prefix={<HomeOutlined />}
            />
            <div className="text-xs text-[#627D98] font-medium mt-1">Em todas as capitais do Brasil</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
            <Statistic
              title={<span className="text-xs font-bold text-[#627D98] uppercase">Índice de Confiança</span>}
              value="99.8%"
              valueStyle={{ color: '#20A483', fontWeight: 800 }}
              prefix={<SafetyCertificateOutlined />}
            />
            <div className="text-xs text-[#627D98] font-medium mt-1">Zero inadimplência repassada</div>
          </Card>
        </Col>
      </Row>

      {/* 3. SHOWCASE DE PRODUTOS & SOLUÇÕES */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#121619]">Soluções em Destaque</h2>
          <p className="text-sm text-[#627D98]">Conheça os produtos do ecossistema Olivelas projetados para maximizar a sua operação.</p>
        </div>

        <Row gutter={[16, 16]}>
          {products.map((p) => (
            <Col xs={24} md={12} key={p.id}>
              <Card
                bordered={false}
                className={`h-full shadow-sm rounded-xl bg-white border border-[#E1E9EF] transition-all hover:shadow-md ${p.highlightColor}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#F2F4F8] rounded-xl">{p.icon}</div>
                    <div>
                      <h3 className="font-bold text-base text-[#121619]">{p.name}</h3>
                      <Tag color={p.tagColor} className="mt-0.5">{p.category}</Tag>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-[#F2F4F8] text-[#334E68] rounded-md">
                    {p.stats}
                  </span>
                </div>

                <p className="text-sm text-[#627D98] mt-4 leading-relaxed">
                  {p.description}
                </p>

                <div className="mt-4 pt-4 border-t border-[#E1E9EF] space-y-2">
                  {p.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#334E68]">
                      <CheckCircleOutlined className="text-[#20A483]" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-end">
                  <Button
                    type="link"
                    icon={<ArrowRightOutlined />}
                    onClick={() => {
                      setSelectedProduct(p);
                    }}
                    className="text-[#F56738] p-0 font-semibold"
                  >
                    Ver Especificações
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 4. PILARES DE ENGENHARIA & COMPLIANCE */}
      <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
        <h2 className="text-lg font-bold text-[#121619] mb-4">Padrão Arquitetural & Segurança Enterprise</h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#E1E9EF] space-y-2">
              <div className="flex items-center gap-2 text-[#0B6B4F] font-bold text-sm">
                <LockOutlined /> Zero Trust & LGPD
              </div>
              <p className="text-xs text-[#627D98]">
                Isolamento multi-tenant rigoroso, mascaramento de dados sensíveis (PII) e controle de acesso RBAC granular.
              </p>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#E1E9EF] space-y-2">
              <div className="flex items-center gap-2 text-[#F56738] font-bold text-sm">
                <CloudServerOutlined /> API First & Clean Arch
              </div>
              <p className="text-xs text-[#627D98]">
                Contratos tipados com FastAPI e Pydantic v2, envelope padronizado de responses e arquitetura modular.
              </p>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#E1E9EF] space-y-2">
              <div className="flex items-center gap-2 text-[#2B6CB0] font-bold text-sm">
                <ApiOutlined /> Observabilidade 360°
              </div>
              <p className="text-xs text-[#627D98]">
                Trilhas de auditoria imutáveis, tracing de requisições e métricas de desempenho prontas para produção.
              </p>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 5. MODAL DE AGENDAMENTO / CONTATO */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <RocketOutlined className="text-[#F56738]" />
            <span>Solicitar Apresentação Executiva</span>
          </div>
        }
        open={demoModalOpen}
        onCancel={() => setDemoModalOpen(false)}
        onOk={() => form.submit()}
        okText="Enviar Solicitação"
        cancelText="Cancelar"
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleContactSubmit} className="pt-2">
          <Form.Item name="name" label="Nome Completo" rules={[{ required: true, message: 'Informe seu nome' }]}>
            <Input placeholder="Ex: Rodrigo Albuquerque" />
          </Form.Item>
          <Form.Item name="email" label="E-mail Corporativo" rules={[{ required: true, type: 'email', message: 'E-mail inválido' }]}>
            <Input placeholder="Ex: rodrigo@imobiliaria.com.br" />
          </Form.Item>
          <Form.Item name="company" label="Empresa / Imobiliária" rules={[{ required: true, message: 'Informe sua empresa' }]}>
            <Input placeholder="Ex: Prime Imóveis SP" />
          </Form.Item>
          <Form.Item name="phone" label="Telefone / WhatsApp" rules={[{ required: true, message: 'Informe seu telefone' }]}>
            <Input placeholder="Ex: (11) 98765-4321" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 6. MODAL DE DETALHES DO PRODUTO */}
      <Modal
        title={selectedProduct?.name}
        open={!!selectedProduct}
        onCancel={() => setSelectedProduct(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedProduct(null)}>
            Fechar
          </Button>,
          <Button
            key="demo"
            type="primary"
            className="bg-[#F56738] hover:bg-[#D94616]"
            onClick={() => {
              setSelectedProduct(null);
              setDemoModalOpen(true);
            }}
          >
            Quero Contratar
          </Button>,
        ]}
        centered
      >
        {selectedProduct && (
          <div className="space-y-4 py-2">
            <Tag color={selectedProduct.tagColor}>{selectedProduct.category}</Tag>
            <p className="text-sm text-[#121619]">{selectedProduct.description}</p>
            <div className="p-3 bg-[#F2F4F8] rounded-lg">
              <span className="text-xs font-bold text-[#627D98] uppercase">Principais Recursos</span>
              <ul className="mt-2 space-y-1.5 text-xs text-[#334E68]">
                {selectedProduct.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-[#20A483]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
