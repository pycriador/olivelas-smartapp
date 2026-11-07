import React from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { catalogService } from '@/services/catalog.service';
import type { CreateComponentPayload } from '@/types/api.types';

interface CreateComponentModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CreateComponentModal: React.FC<CreateComponentModalProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      const payload: CreateComponentPayload = {
        name: values.name,
        category: values.category,
        type: values.type || 'UI Component',
        description: values.description,
        framework: values.framework || 'React / Ant Design (Copan)',
        dependencies: values.dependencies ? values.dependencies.split(',').map((d: string) => d.trim()) : [],
        rules: ['rule-copan-design-system'],
        specs: ['sdd-loft-component-catalog'],
        tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [],
        preview_code: values.preview_code || `<${values.name} />`,
      };
      await catalogService.createComponent(payload);
      message.success('Componente cadastrado com sucesso!');
      form.resetFields();
      onSuccess();
    } catch (err: any) {
      if (err.errorFields) return;
      message.error(`Erro ao cadastrar componente: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Cadastrar Novo Componente Copan"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={submitting}
      okText="Cadastrar Componente"
      cancelText="Cancelar"
      width={640}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="Nome do Componente"
          rules={[{ required: true, message: 'Informe o nome do componente' }]}
        >
          <Input placeholder="Ex: LoftPropertyCard" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Categoria"
          rules={[{ required: true, message: 'Selecione uma categoria' }]}
        >
          <Select
            placeholder="Selecione a categoria"
            options={[
              { value: 'Navigation', label: 'Navigation' },
              { value: 'Data Display', label: 'Data Display' },
              { value: 'Feedback', label: 'Feedback' },
              { value: 'Forms & Inputs', label: 'Forms & Inputs' },
              { value: 'Layout', label: 'Layout' },
              { value: 'Domain Specific', label: 'Domain Specific' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descrição & Propósito"
          rules={[{ required: true, message: 'Informe a descrição do componente' }]}
        >
          <Input.TextArea rows={3} placeholder="Descreva o propósito funcional e uso recomendado..." />
        </Form.Item>

        <Form.Item name="dependencies" label="Dependências / Pacotes (separados por vírgula)">
          <Input placeholder="antd, @ant-design/icons, lucide-react" />
        </Form.Item>

        <Form.Item name="preview_code" label="Exemplo Canônico de Código (TSX)">
          <Input.TextArea
            rows={3}
            className="font-mono text-xs"
            placeholder="import { Card } from 'antd';&#10;export const MyComp = () => <Card>...</Card>;"
          />
        </Form.Item>

        <Form.Item name="tags" label="Tags">
          <Input placeholder="copan, ui, certified, loft" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
