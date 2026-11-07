import React from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { projectsService } from '@/services/projects.service';
import type { CreateProjectPayload } from '@/types/api.types';
import type { Architecture, Module } from '@/types/domain.types';

interface CreateProjectModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  architectures: Architecture[];
  modules: Module[];
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  open,
  onCancel,
  onSuccess,
  architectures,
  modules,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const payload: CreateProjectPayload = {
        name: values.name,
        description: values.description,
        domain: values.domain,
        architecture_id: values.architecture_id,
        modules: values.modules || [],
        components: [],
        tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [],
      };
      await projectsService.createProject(payload);
      message.success('Projeto criado com sucesso!');
      form.resetFields();
      onSuccess();
    } catch (err: any) {
      if (err.errorFields) return;
      message.error(`Erro ao criar projeto: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Criar Novo Projeto de Engenharia"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={submitting}
      okText="Cadastrar Projeto"
      cancelText="Cancelar"
      width={600}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="Nome do Projeto"
          rules={[{ required: true, message: 'Informe o nome do projeto' }]}
        >
          <Input placeholder="Ex: Portal de Crédito Imobiliário" />
        </Form.Item>

        <Form.Item
          name="domain"
          label="Domínio de Negócio"
          rules={[{ required: true, message: 'Informe o domínio de negócio' }]}
        >
          <Select
            placeholder="Selecione o domínio"
            options={[
              { value: 'Fintech', label: 'Fintech' },
              { value: 'Real Estate', label: 'Real Estate' },
              { value: 'Operations', label: 'Operations' },
              { value: 'Legal', label: 'Legal' },
              { value: 'Core Engineering', label: 'Core Engineering' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="architecture_id"
          label="Arquitetura Padrão"
          rules={[{ required: true, message: 'Selecione uma arquitetura' }]}
        >
          <Select
            placeholder="Selecione a arquitetura base"
            options={architectures.map((a) => ({
              value: a.id,
              label: `${a.name} (${a.category})`,
            }))}
          />
        </Form.Item>

        <Form.Item name="modules" label="Módulos Iniciais">
          <Select
            mode="multiple"
            placeholder="Selecione os módulos"
            options={modules.map((m) => ({
              value: m.id,
              label: m.name,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descrição"
          rules={[{ required: true, message: 'Informe uma descrição' }]}
        >
          <Input.TextArea rows={3} placeholder="Descreva os objetivos deste projeto..." />
        </Form.Item>

        <Form.Item name="tags" label="Tags (separadas por vírgula)">
          <Input placeholder="react, fastapi, credit, production" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
