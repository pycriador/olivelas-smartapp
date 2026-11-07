import axios from 'axios';
import { Proposal, ApiResponse, ApiListResponse, ChatMessageResult } from '../types/domain.types';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const proposalApi = {
  list: async (status?: string, search?: string): Promise<Proposal[]> => {
    const res = await apiClient.get<ApiListResponse<Proposal>>('/proposals', {
      params: { status, search },
    });
    return res.data.data;
  },

  getById: async (id: string): Promise<Proposal> => {
    const res = await apiClient.get<ApiResponse<Proposal>>(`/proposals/${id}`);
    return res.data.data;
  },

  create: async (payload: Partial<Proposal>): Promise<Proposal> => {
    const res = await apiClient.post<ApiResponse<Proposal>>('/proposals', payload);
    return res.data.data;
  },

  update: async (id: string, updates: Partial<Proposal>): Promise<Proposal> => {
    const res = await apiClient.put<ApiResponse<Proposal>>(`/proposals/${id}`, updates);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/proposals/${id}`);
  },
};

export const chatApi = {
  sendMessage: async (message: string, history: any[] = []): Promise<ChatMessageResult> => {
    try {
      const res = await apiClient.post<ApiResponse<ChatMessageResult>>('/chat/message', {
        message,
        history,
      });
      return res.data.data;
    } catch (e) {
      return {
        reply: `Olá! Sou o Assistente Copilot Olivelas. Entendi sua mensagem sobre "${message}". No momento estou operando em modo mock autônomo. Posso te ajudar com Fiança Aluguel, documentação, ou suporte técnico!`,
        sender: 'assistant',
        intent: 'fallback_mock',
        confidence: 0.95,
        suggested_actions: ['Como funciona a Fiança?', 'Ver requisitos de crédito', 'Falar com especialista'],
      };
    }
  },
};
