import React from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { catalogService } from '@/services/catalog.service';
import type { CreateRulePayload } from '@/types/api.types';

interface CreateRuleModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CreateRuleModal: React.FC<CreateRuleModalProps> = ({
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
      const payload: CreateRulePayload = {
        name: values.name,
        category: values.category,
        severity: values.severity,
        description: values.description,
        rule_statement: values.rule_statement,
        rationale: values.rationale,
        good_example: values.good_example || '',
        bad_example: values.bad_example || '',
        applies_to: values.applies_to ? values.applies_to.split(',').map((a: string) => a.trim()) : [],
      };
      await catalogService.createRule(payload);
      message.success('Regra cadastrada com sucesso!');
      form.resetFields();
      onSuccess();
    } catch (err: any) {
      if (err.errorFields) return;
      message.error(`Erro ao cadastrar regra: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Cadastrar Nova Golden Rule"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={submitting}
      okText="Cadastrar Regra"
      cancelText="Cancelar"
      width={700}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          label="Nome da Regra"
          rules={[{ required: true, message: 'Informe o nome da regra' }]}
        >
          <Input placeholder="Ex: Loft Copan Component Usage" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="category"
            label="Categoria"
            rules={[{ required: true, message: 'Selecione uma categoria' }]}
          >
            <Select
              placeholder="Categoria"
              options={[
                { value: 'Frontend & UI', label: 'Frontend & UI' },
                { value: 'Architecture', label: 'Architecture' },
                { value: 'API & Security', label: 'API & Security' },
                { value: 'State Management', label: 'State Management' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="severity"
            label="Severidade"
            rules={[{ required: true, message: 'Selecione a severidade' }]}
          >
            <Select
              placeholder="Severidade"
              options={[
                { value: 'MANDATORY', label: 'MANDATORY (Obrigatória)' },
                { value: 'RECOMMENDED', label: 'RECOMMENDED (Recomendada)' },
                { value: 'OPTIONAL', label: 'OPTIONAL (Opcional)' },
              ]}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="rule_statement"
          label="Declaração da Regra (Statement)"
          rules={[{ required: true, message: 'Informe a declaração da regra' }]}
        >
          <Input.TextArea rows={2} placeholder="Ex: Componentes devem utilizar exclusivamente tokens Copan..." />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descrição Resumida"
          rules={[{ required: true, message: 'Informe uma descrição' }]}
        >
          <Input placeholder="Resumo em uma linha..." />
        </Form.Item>

        <Form.Item name="rationale" label="Justificativa Técnica (Rationale)">
          <Input.TextArea rows={2} placeholder="Por que esta regra é importante para a engenharia da Loft?" />
        </Form.Item>

        <Form.Item name="good_example" label="Exemplo Correto (Good Code)">
          <Input.TextArea
            rows={3}
            className="font-mono text-xs"
            placeholder="// ✓ Correto&#10;import { Button } from 'antd';"
          />
        </Form.Item>

        <Form.Item name="bad_example" label="Exemplo Incorreto (Anti-pattern)">
          <Input.TextArea
            rows={3}
            className="font-mono text-xs"
            placeholder="// ✕ Incorreto&#10;<button style={{ background: 'orange' }}>"
          />
        </Form.Item>

        <Form.Item name="applies_to" label="Aplica-se a (separado por vírgula)">
          <Input placeholder="frontend, react, components, pages" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
