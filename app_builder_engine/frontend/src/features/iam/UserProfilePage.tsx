import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Typography, Form, Input, Button, Tag, Space, Divider, message, Select } from 'antd';
import { KeyOutlined, SaveOutlined, LockOutlined } from '@ant-design/icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { PageContainer } from '@/components/loft/PageContainer';
import { ContentSection } from '@/components/loft/ContentSection';
import { useAuthStore } from '@/stores/authStore';
import { iamService } from '@/services/iam.service';
import type { IamUser } from '@/types/iam.types';

const { Title, Text } = Typography;

export const UserProfilePage: React.FC = () => {
  const { user, checkAuth } = useAuthStore();
  const [userData, setUserData] = useState<IamUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const data = await iamService.getUser(user.id);
      setUserData(data);
      profileForm.setFieldsValue({
        name: data.name,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        language: data.language,
        timezone_name: data.timezone_name,
      });
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (values: any) => {
    if (!user) return;
    setLoading(true);
    try {
      await iamService.updateUser(user.id, values);
      message.success('Perfil atualizado com sucesso!');
      await checkAuth();
      fetchProfile();
    } catch (err: any) {
      message.error(err.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values: any) => {
    if (values.new_password !== values.confirm_password) {
      message.error('A nova senha e a confirmação não coincidem.');
      return;
    }
    setPwdLoading(true);
    try {
      await iamService.changePassword({
        current_password: values.current_password,
        new_password: values.new_password,
      });
      message.success('Senha alterada com sucesso!');
      passwordForm.resetFields();
    } catch (err: any) {
      message.error(err.message || 'Erro ao alterar senha. Verifique a senha atual.');
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Meu Perfil & Segurança"
        subtitle="Gerencie suas informações pessoais, idioma e credenciais de acesso"
        breadcrumbs={[
          { title: 'Início' },
          { title: 'Perfil' },
        ]}
      />
      <Row gutter={[24, 24]}>
        {/* Left Column: Profile Card */}
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 12, textAlign: 'center', border: '1px solid #E5E7EB' }}>
            <Avatar
              size={96}
              src={userData?.avatar_url || user?.avatar_url}
              style={{ background: '#FF774A', marginBottom: 16 }}
            >
              {user?.name.charAt(0)}
            </Avatar>
            <Title level={4} style={{ margin: 0, color: '#111827' }}>
              {user?.name}
            </Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
              @{user?.username} • {user?.email}
            </Text>
            <Tag color="magenta" style={{ fontWeight: 600, padding: '4px 12px', borderRadius: 12 }}>
              {user?.role}
            </Tag>

            <Divider style={{ margin: '20px 0' }} />

            <div style={{ textAlign: 'left' }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Grupos Pertencentes
              </Text>
              <Space size={6} wrap style={{ marginBottom: 16 }}>
                {user?.groups.map((g, i) => (
                  <Tag key={i} color="orange">{g}</Tag>
                ))}
              </Space>

              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Privilégios Habilitados
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {user?.permissions.includes('*') ? 'Acesso Global Irrestrito (*)' : `${user?.permissions.length} permissões ativas`}
              </Text>
            </div>
          </Card>
        </Col>

        {/* Right Column: Edit Forms */}
        <Col xs={24} md={16}>
          <ContentSection title="Informações Pessoais">
            <Form form={profileForm} layout="vertical" onFinish={handleUpdateProfile}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="first_name" label="Primeiro Nome" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="last_name" label="Sobrenome" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="language" label="Idioma de Preferência" initialValue="pt-BR">
                    <Select>
                      <Select.Option value="pt-BR">Português (Brasil)</Select.Option>
                      <Select.Option value="en-US">English (US)</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="timezone_name" label="Fuso Horário" initialValue="America/Sao_Paulo">
                    <Select>
                      <Select.Option value="America/Sao_Paulo">Brasília (GMT-3)</Select.Option>
                      <Select.Option value="UTC">UTC (Universal)</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                style={{ background: '#FF774A', borderColor: '#FF774A' }}
              >
                Salvar Informações
              </Button>
            </Form>
          </ContentSection>

          <ContentSection title="Alteração de Senha">
            <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
              <Form.Item
                name="current_password"
                label="Senha Atual"
                rules={[{ required: true, message: 'Insira sua senha atual' }]}
              >
                <Input.Password prefix={<LockOutlined style={{ color: '#9CA3AF' }} />} placeholder="••••••••••••" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="new_password"
                    label="Nova Senha"
                    rules={[{ required: true, min: 8, message: 'Mínimo de 8 caracteres' }]}
                  >
                    <Input.Password prefix={<KeyOutlined style={{ color: '#9CA3AF' }} />} placeholder="••••••••••••" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="confirm_password"
                    label="Confirmar Nova Senha"
                    rules={[{ required: true, message: 'Confirme a nova senha' }]}
                  >
                    <Input.Password prefix={<KeyOutlined style={{ color: '#9CA3AF' }} />} placeholder="••••••••••••" />
                  </Form.Item>
                </Col>
              </Row>

              <Button
                type="primary"
                htmlType="submit"
                icon={<LockOutlined />}
                loading={pwdLoading}
                style={{ background: '#111827', borderColor: '#111827' }}
              >
                Atualizar Senha
              </Button>
            </Form>
          </ContentSection>
        </Col>
      </Row>
    </PageContainer>
  );
};
