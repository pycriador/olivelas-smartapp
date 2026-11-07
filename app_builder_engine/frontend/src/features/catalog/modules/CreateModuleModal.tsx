import React from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { catalogService } from '@/services/catalog.service';
import type { CreateModulePayload } from '@/types/api.types';
import type { Component } from '@/types/domain.types';

interface CreateModuleModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  components: Component[];
}

export const CreateModuleModal: React.FC<CreateModuleModalProps> = ({
  open,
  onCancel,
  onSuccess,
  components,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const payload: CreateModulePayload = {
        name: values.name,
        category: values.category,
        description: values.description,
        components: values.components || [],
        dependencies: values.dependencies ? values.dependencies.split(',').map((d: string) => d.trim()) : [],
        rules: ['rule-copan-design-system'],
        specs: ['sdd-loft-frontend-fsd'],
      };
      await catalogService.createModule(payload);
      message.success('Módulo criado com sucesso!');
      form.resetFields();
      onSuccess();
    } catch (err: any) {
      if (err.errorFields) return;
      message.error(`Erro ao criar módulo: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Cadastrar Novo Módulo de Domínio"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={submitting}
      okText="Cadastrar Módulo"
      cancelText="Cancelar"
      width={640}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="Nome do Módulo"
          rules={[{ required: true, message: 'Informe o nome do módulo' }]}
        >
          <Input placeholder="Ex: Proposal Management" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Categoria de Domínio"
          rules={[{ required: true, message: 'Selecione uma categoria' }]}
        >
          <Select
            placeholder="Selecione a categoria"
            options={[
              { value: 'Core Services', label: 'Core Services' },
              { value: 'Business Domain', label: 'Business Domain' },
              { value: 'Analytics & Reporting', label: 'Analytics & Reporting' },
              { value: 'Operations & Workflow', label: 'Operations & Workflow' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descrição Funcional"
          rules={[{ required: true, message: 'Informe a descrição' }]}
        >
          <Input.TextArea rows={3} placeholder="Descreva os serviços e responsabilidades do módulo..." />
        </Form.Item>

        <Form.Item name="components" label="Componentes Copan Vinculados">
          <Select
            mode="multiple"
            placeholder="Selecione os componentes"
            options={components.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
          />
        </Form.Item>

        <Form.Item name="dependencies" label="Dependências Internas (IDs separados por vírgula)">
          <Input placeholder="mod-auth-identity, mod-users" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
