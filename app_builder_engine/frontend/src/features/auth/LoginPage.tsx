import React, { useEffect, useState } from 'react';
import {
  Flex,
  Container,
  UISpacer,
  Typography,
  Card,
  FeedbackBanner,
  TextField,
  Checkbox,
  Button,
  Link,
  Logo,
} from '@loft/react-loft';
import { UserIcon, LockIcon, ArrowLeftIcon } from '@loft/react-icons';
import { color } from '@loft/tokens-loft';
import { useAuthStore } from '@/stores/authStore';

interface LoginPageProps {
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, signup, fetchBootstrapStatus, bootstrapStatus, isLoading, error, clearError } = useAuthStore();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBootstrapStatus().then((status) => {
      if (status && status.first_user_will_be_global_admin) {
        setMode('signup');
      }
    });
  }, [fetchBootstrapStatus]);

  const isFirstUserBootstrap = Boolean(bootstrapStatus?.first_user_will_be_global_admin);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearError();
    setSubmitting(true);

    let success = false;
    if (mode === 'signup') {
      if (!name || !email || !password) {
        setSubmitting(false);
        return;
      }
      success = await signup({
        name,
        email,
        username: username || email.split('@')[0],
        password,
      });
    } else {
      if (!usernameOrEmail || !password) {
        setSubmitting(false);
        return;
      }
      success = await login(usernameOrEmail, password, rememberMe);
    }

    setSubmitting(false);
    if (success) {
      onNavigate('/dashboard');
    }
  };

  return (
    <Flex
      as="main"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh', background: color.background.secondary }}
    >
      <Container maxWidth="xs">
        <Flex flexDirection="column" gap="layoutBase04">
          <Flex flexDirection="column" alignItems="center" gap="base02">
            <Logo />
            <Typography textStyle="h2" as="h1">
              Olivelas SmartApp Builder
            </Typography>
            <Typography textStyle="paragraph-sm" variant="secondary">
              Identidade &amp; Controle de Acesso (IAM — Schema Isolado Supabase)
            </Typography>
          </Flex>

          <Card
            title={
              mode === 'signup'
                ? isFirstUserBootstrap
                  ? 'Primeiro Cadastro — Global Admin'
                  : 'Criar Conta na Plataforma'
                : 'Entrar na plataforma'
            }
          >
            <Flex gap="base02" style={{ marginBottom: 16 }}>
              <Button
                variant={mode === 'login' ? 'primary' : 'secondary'}
                type="button"
                fullWidth
                onClick={() => {
                  clearError();
                  setMode('login');
                }}
              >
                Entrar
              </Button>
              <Button
                variant={mode === 'signup' ? 'primary' : 'secondary'}
                type="button"
                fullWidth
                onClick={() => {
                  clearError();
                  setMode('signup');
                }}
              >
                {isFirstUserBootstrap ? '1º Cadastro (Admin)' : 'Cadastrar'}
              </Button>
            </Flex>

            {isFirstUserBootstrap && (
              <>
                <FeedbackBanner state="informative">
                  <strong>Configuração Inicial da Plataforma:</strong> Nenhum usuário cadastrado ainda. O{' '}
                  <strong>primeiro cadastro</strong> receberá automaticamente o papel de{' '}
                  <strong>Global Admin</strong>.
                </FeedbackBanner>
                <UISpacer xs="base04" />
              </>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <>
                  <FeedbackBanner state="negative">{error}</FeedbackBanner>
                  <UISpacer xs="base04" />
                </>
              )}

              <Flex flexDirection="column" gap="base04">
                {mode === 'signup' ? (
                  <>
                    <TextField
                      id="name"
                      name="name"
                      label="Nome completo"
                      placeholder="ex: Willian Jesus"
                      value={name}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                      addonBefore={<UserIcon size="sm" color={color.icon.muted} />}
                      required
                      fullWidth
                    />
                    <TextField
                      id="email"
                      name="email"
                      label="E-mail corporativo"
                      placeholder="ex: willian.jesus@olivelas.com"
                      value={email}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                      addonBefore={<UserIcon size="sm" color={color.icon.muted} />}
                      required
                      fullWidth
                    />
                    <TextField
                      id="username"
                      name="username"
                      label="Usuário (opcional)"
                      placeholder="ex: willian.jesus"
                      value={username}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)}
                      addonBefore={<UserIcon size="sm" color={color.icon.muted} />}
                      fullWidth
                    />
                  </>
                ) : (
                  <TextField
                    id="username_or_email"
                    name="username_or_email"
                    label="E-mail ou usuário"
                    placeholder="ex: willian.jesus@olivelas.com"
                    value={usernameOrEmail}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUsernameOrEmail(event.target.value)}
                    addonBefore={<UserIcon size="sm" color={color.icon.muted} />}
                    error={!!error}
                    required
                    fullWidth
                  />
                )}

                <TextField
                  id="password"
                  name="password"
                  label={mode === 'signup' ? 'Senha (mín. 8 caracteres com letras e números)' : 'Senha'}
                  type="password"
                  value={password}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                  addonBefore={<LockIcon size="sm" color={color.icon.muted} />}
                  error={!!error}
                  required
                  fullWidth
                />
              </Flex>

              <UISpacer xs="base03" />

              {mode === 'login' && (
                <Flex justifyContent="space-between" alignItems="center">
                  <Checkbox
                    id="remember_me"
                    label="Lembrar de mim"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <Link
                    href="#"
                    variant="primary"
                    textStyle="label-sm"
                    onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                      event.preventDefault();
                      setMode('signup');
                    }}
                  >
                    Criar nova conta
                  </Link>
                </Flex>
              )}

              <UISpacer xs="base06" />

              <Button
                variant="primary"
                type="submit"
                loading={submitting || isLoading}
                disabled={submitting || isLoading}
                fullWidth
              >
                {submitting || isLoading
                  ? 'Processando...'
                  : mode === 'signup'
                    ? isFirstUserBootstrap
                      ? 'Cadastrar como Global Admin'
                      : 'Criar conta'
                    : 'Entrar na plataforma'}
              </Button>

              <UISpacer xs="base02" />

              <Button
                variant="secondary"
                icon={<ArrowLeftIcon size="sm" />}
                iconPosition="left"
                fullWidth
                onClick={() => onNavigate('/')}
              >
                Voltar para a página inicial
              </Button>
            </form>
          </Card>
        </Flex>
      </Container>
    </Flex>
  );
};
