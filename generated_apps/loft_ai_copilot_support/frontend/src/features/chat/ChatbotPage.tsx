import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Tag, Card, Avatar, Tooltip, message, Badge } from 'antd';
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  ClearOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  ApiOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';
import { ChatMessage } from '../../types/domain.types';
import { chatApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';

interface ChatbotPageProps {
  appName: string;
}

export const ChatbotPage: React.FC<ChatbotPageProps> = ({ appName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: 'Olá! Eu sou o Assistente Inteligente Loft Copan. Como posso ajudar você hoje com fiança locatícia, análise de crédito ou soluções imobiliárias?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'Como funciona a Fiança Aluguel?',
        'Quais documentos necessários?',
        'Qual a taxa e tempo de aprovação?',
        'Como integrar via API?',
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || loading) return;

    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const response = await chatApi.sendMessage(messageContent);
      const assistantMessage: ChatMessage = {
        id: `msg_asst_${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: response.intent,
        suggestedActions: response.suggested_actions,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      message.error('Erro ao processar mensagem com o assistente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'msg_welcome_reset',
        sender: 'assistant',
        text: 'Histórico limpo! Em que posso te apoiar agora?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          'Como funciona a Fiança Aluguel?',
          'Quais documentos necessários?',
        ],
      },
    ]);
  };

  const quickPrompts = [
    {
      title: 'Fiança Aluguel',
      desc: 'Como funciona a garantia locatícia sem fiador',
      icon: <SafetyCertificateOutlined className="text-[#F56738]" />,
      query: 'Como funciona a Fiança Aluguel da Loft?',
    },
    {
      title: 'Documentação & KYC',
      desc: 'Quais documentos são exigidos para aprovação',
      icon: <FileProtectOutlined className="text-[#0B6B4F]" />,
      query: 'Quais documentos necessários para análise de crédito?',
    },
    {
      title: 'Taxas & Prazos',
      desc: 'Valores, prazos de aprovação e parcelamento',
      icon: <ThunderboltOutlined className="text-[#D69E2E]" />,
      query: 'Qual a taxa média da fiança e o tempo de resposta?',
    },
    {
      title: 'Integração API',
      desc: 'Endpoints REST e webhooks para imobiliárias',
      icon: <ApiOutlined className="text-[#2B6CB0]" />,
      query: 'Como integrar a API da Loft no meu sistema?',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <PageHeader
        title={`${appName} — AI Copilot Assistant`}
        subtitle="Assistente cognitivo conversacional com tokens do Design System Loft Copan e inferência ágil."
        badge={<Badge status="processing" color="#20A483" text="Copilot Ativo (Clean Architecture Mock)" />}
        actions={
          <Button
            icon={<ClearOutlined />}
            onClick={handleClear}
            className="text-[#627D98] hover:text-[#121619]"
          >
            Limpar Conversa
          </Button>
        }
      />

      {/* Quick Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickPrompts.map((p, idx) => (
          <div
            key={idx}
            onClick={() => handleSend(p.query)}
            className="p-3 bg-white rounded-xl border border-[#E1E9EF] hover:border-[#F56738] hover:shadow-md transition cursor-pointer flex items-start gap-2.5"
          >
            <div className="p-2 bg-[#FFF2EC] rounded-lg text-base shrink-0">{p.icon}</div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#121619] block truncate">{p.title}</span>
              <span className="text-[11px] text-[#627D98] block truncate">{p.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Container Card */}
      <Card
        className="rounded-2xl border-[#E1E9EF] shadow-sm flex flex-col overflow-hidden"
        bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '520px' }}
      >
        {/* Messages Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#FAFBFD]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <Avatar
                size="default"
                style={{
                  backgroundColor: m.sender === 'user' ? '#121619' : '#F56738',
                  color: '#FFFFFF',
                }}
                icon={m.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
                className="shrink-0 shadow-sm"
              />

              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-[#121619] text-white rounded-tr-none'
                    : 'bg-white border border-[#E1E9EF] text-[#121619] rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span
                    className={`text-[11px] font-bold ${
                      m.sender === 'user' ? 'text-[#CBD2D9]' : 'text-[#F56738]'
                    }`}
                  >
                    {m.sender === 'user' ? 'Você' : 'Loft Copilot'}
                  </span>
                  <span
                    className={`text-[10px] ${
                      m.sender === 'user' ? 'text-[#9FB3C8]' : 'text-[#829AB1]'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>

                <p className="whitespace-pre-line leading-relaxed text-[13px]">{m.text}</p>

                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#EEF2F6] flex flex-wrap gap-1.5">
                    {m.suggestedActions.map((action, i) => (
                      <Tag
                        key={i}
                        color="orange"
                        onClick={() => handleSend(action)}
                        className="cursor-pointer hover:opacity-80 text-[11px] font-medium py-0.5 px-2 rounded-md border-[#FDC4B2] bg-[#FFF2EC] text-[#F56738]"
                      >
                        ⚡ {action}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <Avatar
                size="default"
                style={{ backgroundColor: '#F56738', color: '#FFFFFF' }}
                icon={<RobotOutlined />}
                className="shrink-0 shadow-sm"
              />
              <div className="bg-white border border-[#E1E9EF] rounded-2xl rounded-tl-none px-4 py-3 text-xs text-[#627D98] flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#F56738] animate-ping" />
                <span>Loft Copilot digitando resposta...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-white border-t border-[#E1E9EF] flex items-center gap-2">
          <Input.TextArea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Digite sua dúvida sobre fiança, contratos ou serviços Loft (pressione Enter para enviar)..."
            autoSize={{ minRows: 1, maxRows: 3 }}
            className="resize-none rounded-xl border-[#CBD2D9] focus:border-[#F56738]"
            disabled={loading}
          />
          <Tooltip title="Enviar Mensagem (Enter)">
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => handleSend()}
              loading={loading}
              className="bg-[#F56738] hover:bg-[#D94616] h-10 px-5 rounded-xl font-semibold shadow-sm shrink-0"
            >
              Enviar
            </Button>
          </Tooltip>
        </div>
      </Card>
    </div>
  );
};
