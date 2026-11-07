# Volume III — Loft Component Catalog

> **Catálogo oficial de componentes reutilizáveis para aplicações frontend padrão Loft**

**Versão:** 2.0  
**Atualizado:** Outubro de 2026  
**Base visual:** Loft Design System  
**Base técnica:** React + TypeScript + Copan  
**Dependências permitidas:** `@loft/react-loft` + `@loft/tokens-loft` + `@loft/react-icons` (pacotes privados — requer `NPM_TOKEN` com acesso ao escopo `@loft` no `.npmrc`)

---

# 1. Objetivo

O Loft Component Catalog define os componentes reutilizáveis de interface que ficam acima da camada base do Copan.

O catálogo existe para evitar que cada produto recrie padrões recorrentes de interface.

A arquitetura visual deve seguir:

```text
Copan (@loft/react-loft)
    ↓
Loft Design System
    ↓
Loft Component Catalog
    ↓
Product Components
    ↓
Application Pages
```

---

# 2. Relação entre os documentos

O ecossistema frontend Loft é dividido em quatro volumes.

```text
Volume I
Loft Frontend Foundation
        │
        │ arquitetura técnica
        ▼
Volume II
Loft Design System
        │
        │ linguagem visual
        ▼
Volume III
Loft Component Catalog
        │
        │ componentes reutilizáveis
        ▼
Volume IV
Frontend Specification
        │
        │ páginas e fluxos
        ▼
Application
```

---

# 3. O que é um Loft Component?

Um Loft Component é um componente reutilizável que:

- resolve uma necessidade recorrente;
- possui comportamento definido;
- utiliza Copan (`@loft/react-loft`) internamente;
- utiliza tokens do Loft Design System;
- possui API tipada;
- possui estados conhecidos;
- possui comportamento de acessibilidade;
- pode ser utilizado por diferentes produtos.

Exemplo:

```text
PageHeader
FilterBar
DataTable
EmptyState
KPIWidget
FormSection
PermissionMatrix
```

---

# 4. O que NÃO é um Loft Component?

Não transformar todo componente React em componente do catálogo.

Não entram automaticamente:

```text
UserAvatar
UserName
ProductImage
SpecificBusinessButton
```

se forem específicos de uma única feature.

A regra:

> Um componente deve entrar no catálogo quando sua reutilização for previsível e seu comportamento puder ser definido de forma estável.

---

# 5. Categorias

O catálogo é dividido em:

```text
01. Layout
02. Navigation
03. Page Structure
04. Feedback
05. Forms
06. Data Display
07. Actions
08. Filters
09. Search
10. Status
11. Dashboard
12. Domain Composition
13. Access Control
14. Files
15. Overlays
16. Utilities
```

---

# 6. Convenção de API

Todos os componentes devem:

- utilizar TypeScript;
- possuir props explícitas;
- evitar `any`;
- possuir valores padrão sensatos;
- evitar APIs excessivamente genéricas;
- utilizar composição quando necessário.

Exemplo:

```tsx
interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
}
```

---

# 7. Estados Padrão

Sempre que aplicável, componentes devem considerar:

```text
default
loading
disabled
error
empty
readonly
success
```

Não é obrigatório que todos os componentes tenham todos os estados.

---

# 8. Componentes de Layout

---

# 8.1 AppShell

## Propósito

Estrutura principal da aplicação.

## Composição

```text
AppShell
├── Header
├── Sidebar
├── Content
└── Optional Footer
```

## Props

```ts
interface AppShellProps {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

## Estados

- default
- sidebar collapsed
- mobile

## Regras

- sidebar deve respeitar permissões;
- conteúdo deve possuir largura fluida;
- layout deve ser responsivo.

---

# 8.2 PageContainer

## Propósito

Container padrão para páginas.

## Props

```ts
interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: number | string;
  padding?: 'small' | 'default' | 'large';
}
```

## Padrão

```text
padding: 32px
```

---

# 8.3 ContentSection

## Propósito

Agrupar conteúdo relacionado dentro de uma página.

## Props

```ts
interface ContentSectionProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}
```

---

# 9. Page Structure

---

# 9.1 PageHeader

## Propósito

Cabeçalho padrão de página.

## Anatomy

```text
Breadcrumb
Title
Description
Actions
```

## Props

```ts
interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: React.ReactNode;
  actions?: React.ReactNode;
  extra?: React.ReactNode;
}
```

## Exemplo

```text
Usuários
Gerencie usuários e permissões.

                         [ Criar usuário ]
```

## Regras

- título deve ser curto;
- descrição é opcional;
- ação principal deve aparecer à direita;
- mobile deve empilhar os elementos.

---

# 9.2 SectionHeader

## Propósito

Cabeçalho de uma seção.

## Props

```ts
interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}
```

---

# 9.3 BreadcrumbHeader

## Propósito

Combinar breadcrumb e título de página.

## Uso

Principalmente em aplicações com navegação hierárquica.

---

# 9.4 LoginScreen

## Propósito

Tela de autenticação padrão dos consoles administrativos Loft (Opsbase, OpsPages, App Builder Engine e afins): navegação de volta, seletor de idioma, identidade de marca, card de credenciais com estado de erro e indicador de segurança no rodapé. Referência de composição completa — não um componente único do Copan, e sim um exemplo de como montar uma tela inteira a partir das primitivas reais (`Flex`, `Container`, `Card`, `TextField`, `Button`, `FeedbackBanner`, `DropdownMenu`, `ActionButton`, `Typography`, `Logo`, `UISpacer`).

## Anatomy

```text
Flex (coluna, altura total)
└── Container (maxWidth="xs")
    ├── Flex (topo): Button "Voltar" (secondary + ArrowLeftIcon) | DropdownMenu de idioma (ActionButton trigger)
    ├── Flex (coluna, centralizado): Logo + Typography h2 (nome do produto) + Typography paragraph-sm secondary (subtítulo)
    ├── Card (title="Entrar na sua conta", subtitle="...")
    │   └── form
    │       ├── FeedbackBanner state="negative" (condicional, erro de login)
    │       ├── TextField "Usuário" (addonBefore UserIcon)
    │       ├── TextField "Senha" (type dinâmico, addonBefore LockIcon, addonAfter ActionButton de visibilidade)
    │       └── Button variant="primary" fullWidth loading={loading}
    └── Flex (rodapé): ShieldCheckIcon + "Autenticação segura via JWT" | "AWS RDS • multi-tenant"
```

## Props

```ts
interface LoginScreenProps {
  onSubmit: (credentials: { username: string; password: string }) => Promise<void>;
  onBackToLanding?: () => void;
  locale: 'pt-BR' | 'en' | 'es';
  onLocaleChange: (locale: 'pt-BR' | 'en' | 'es') => void;
}
```

## Implementação (Copan real — `@loft/react-loft` + `@loft/react-icons` + `@loft/tokens-loft`)

```tsx
import React, { useState } from 'react';
import {
  Flex,
  Container,
  UISpacer,
  Typography,
  Card,
  FeedbackBanner,
  TextField,
  Button,
  ActionButton,
  DropdownMenu,
  Logo,
} from '@loft/react-loft';
import {
  UserIcon,
  LockIcon,
  VisibilityIcon,
  VisibilityOffIcon,
  ArrowLeftIcon,
  ExpandMoreIcon,
  ShieldCheckIcon,
} from '@loft/react-icons';
import { color } from '@loft/tokens-loft';

const LOCALE_LABEL: Record<'pt-BR' | 'en' | 'es', string> = {
  'pt-BR': 'Português',
  en: 'English',
  es: 'Español',
};

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onSubmit,
  onBackToLanding,
  locale,
  onLocaleChange,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localeMenuOpen, setLocaleMenuOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      await onSubmit({ username, password });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Não foi possível entrar. Verifique usuário e senha.');
    } finally {
      setLoading(false);
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
          <Flex justifyContent="space-between" alignItems="center">
            {onBackToLanding ? (
              <Button variant="secondary" icon={<ArrowLeftIcon size="sm" />} iconPosition="left" onClick={onBackToLanding}>
                Voltar
              </Button>
            ) : <span />}

            <DropdownMenu
              open={localeMenuOpen}
              onDismiss={() => setLocaleMenuOpen(false)}
              dismissOnItemClick
              placement="bottom-end"
              menuItems={(Object.keys(LOCALE_LABEL) as Array<'pt-BR' | 'en' | 'es'>).map((key) => ({
                label: LOCALE_LABEL[key],
                onClick: () => onLocaleChange(key),
              }))}
            >
              <ActionButton aria-label="Selecionar idioma" title="Idioma" quiet onClick={() => setLocaleMenuOpen(true)}>
                <Flex alignItems="center" gap="base">
                  <Typography textStyle="label-sm">{LOCALE_LABEL[locale]}</Typography>
                  <ExpandMoreIcon size="sm" color={color.icon.muted} />
                </Flex>
              </ActionButton>
            </DropdownMenu>
          </Flex>

          <Flex flexDirection="column" alignItems="center" gap="base02">
            <Logo />
            <Typography textStyle="h2" as="h1">AIOps Opsbase</Typography>
            <Typography textStyle="paragraph-sm" variant="secondary">Console administrativo &middot; Loft</Typography>
          </Flex>

          <Card title="Entrar na sua conta" subtitle="Acesse o console administrativo do Opsbase">
            <form onSubmit={handleSubmit} noValidate>
              {errorMessage && (
                <>
                  <FeedbackBanner state="negative">{errorMessage}</FeedbackBanner>
                  <UISpacer xs="base04" />
                </>
              )}

              <Flex flexDirection="column" gap="base04">
                <TextField
                  id="username"
                  name="username"
                  label="Usuário"
                  placeholder="seu.usuario"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  addonBefore={<UserIcon size="sm" color={color.icon.muted} />}
                  error={!!errorMessage}
                  required
                  fullWidth
                />

                <TextField
                  id="password"
                  name="password"
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  addonBefore={<LockIcon size="sm" color={color.icon.muted} />}
                  addonAfter={
                    <ActionButton
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      quiet
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? <VisibilityOffIcon size="sm" color={color.icon.muted} /> : <VisibilityIcon size="sm" color={color.icon.muted} />}
                    </ActionButton>
                  }
                  error={!!errorMessage}
                  required
                  fullWidth
                />
              </Flex>

              <UISpacer xs="base06" />

              <Button variant="primary" type="submit" loading={loading} disabled={loading} fullWidth>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Card>

          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center" gap="base">
              <ShieldCheckIcon size="sm" color={color.feedback.positive.main} />
              <Typography textStyle="caption" variant="secondary">Autenticação segura via JWT</Typography>
            </Flex>
            <Typography textStyle="caption" variant="secondary">AWS RDS &bull; multi-tenant</Typography>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
};
```

## Regras

- Fundo da página em `color.background.secondary`, card no fundo padrão do próprio `Card` — nunca hex hardcoded nem tema escuro inventado (o Copan não documenta tokens de dark mode; não fabricar um).
- Erro de login usa `FeedbackBanner state="negative"` **e** marca `error` nos dois `TextField` — nunca só cor, sempre com texto explicando o problema.
- Toggle de mostrar/ocultar senha é um `ActionButton` (`aria-label` obrigatório) dentro de `addonAfter`, nunca um ícone clicável sem semântica de botão.
- Botão de submit reflete `loading` (desabilita e troca o texto) — nunca permitir duplo submit.
- Seletor de idioma é um `DropdownMenu` controlado (`open`/`onDismiss`), trigger `ActionButton` — nunca um `<select>` nativo estilizado à mão para isso.
- Ícone de marca é sempre o componente `Logo` do Copan — nunca um ícone genérico ou SVG copiado simulando a marca.

---

# 10. Navigation

---

# 10.1 SidebarNavigation

## Propósito

Navegação principal da aplicação.

## Responsabilidades

- apresentar módulos;
- indicar página ativa;
- agrupar funcionalidades;
- suportar collapse;
- respeitar permissões.

## Props

```ts
interface SidebarNavigationProps {
  items: NavigationItem[];
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}
```

---

# 10.2 NavigationItem

```ts
interface NavigationItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  permission?: string;
  children?: NavigationItem[];
}
```

---

# 10.3 UserMenu

## Propósito

Menu contextual do usuário autenticado.

## Deve suportar

- nome;
- avatar;
- perfil;
- configurações;
- logout.

---

# 10.4 Breadcrumb

Wrapper padronizado do `Breadcrumbs` do Copan (`@loft/react-loft`). É data-driven via a prop `items` (array de `{ text, href? }`) — não recebe children JSX.

## Regras

- utilizar somente quando houver hierarquia;
- último item representa a página atual;
- links anteriores devem ser navegáveis.

---

# 11. Feedback Components

---

# 11.1 LoadingState

## Propósito

Estado de carregamento.

## Variants

```text
page
section
inline
```

## Implementação

Preferir `CircularLoader` do Copan (`@loft/react-loft`) para indicar carregamento.

> O Copan não documenta um componente de placeholder tipo "Skeleton" — não inventar essa API. Para carregamentos estruturais (ex.: lista/tabela aparecendo progressivamente), usar `CircularLoader` centralizado na área de conteúdo, ou confirmar com o time de design system antes de criar um substituto local.

---

# 11.2 EmptyState

## Propósito

Representar ausência de dados.

## Anatomy

```text
Icon / Illustration
Title
Description
Action
```

## Props

```ts
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}
```

---

# 11.3 ErrorState

## Propósito

Representar falha de carregamento ou processamento.

## Props

```ts
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}
```

## Exemplo

```text
Não foi possível carregar os dados.

Ocorreu um problema ao consultar o servidor.

[ Tentar novamente ]
```

---

# 11.4 PermissionDenied

## Propósito

Representar ausência de autorização.

## Props

```ts
interface PermissionDeniedProps {
  title?: string;
  description?: string;
}
```

---

# 11.5 ResultState

Wrapper para estados completos:

```text
success
error
warning
info
```

O Copan não possui um componente "Result" equivalente ao do Ant Design — compor com `FeedbackBanner` (prop `state`: `positive`/`negative`/`warning`/`informative`) para o indicador semântico, `Typography` para título/descrição e `Button` (`variant="primary"`) para a ação, em vez de importar um único componente monolítico.

---

# 12. Forms

---

# 12.1 FormSection

## Propósito

Agrupar campos relacionados.

## Props

```ts
interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}
```

---

# 12.2 FormActions

## Propósito

Padronizar ações de formulário.

## Layout

```text
                         [ Cancelar ] [ Salvar ]
```

## Props

```ts
interface FormActionsProps {
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  disabled?: boolean;
}
```

---

# 12.3 FormField

Wrapper semântico para campos.

## Responsabilidades

- label;
- required;
- helper text;
- error;
- tooltip;
- acessibilidade.

---

# 12.4 SearchField

## Propósito

Campo de pesquisa padronizado.

## Props

```ts
interface SearchFieldProps {
  value?: string;
  placeholder?: string;
  loading?: boolean;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
}
```

## Comportamento

Pode utilizar debounce.

---

# 12.5 FilterField

Wrapper para filtros.

Deve suportar:

- label;
- value;
- clear;
- loading;
- disabled.

---

# 13. Filter Components

---

# 13.1 FilterBar

## Propósito

Agrupar filtros de uma página.

## Anatomy

```text
Filtros

[ Status ] [ Período ] [ Responsável ] [ Buscar ]

[ Aplicar ] [ Limpar ]
```

## Props

```ts
interface FilterBarProps {
  children: React.ReactNode;
  onApply?: () => void;
  onClear?: () => void;
  loading?: boolean;
}
```

---

# 13.2 FilterDrawer

## Propósito

Filtros complexos em telas com pouco espaço.

Utiliza o `Drawer` do Copan (`@loft/react-loft`) — props: `open`, `onDismiss`, `placement` (`"left"`/`"right"`).

---

# 13.3 ActiveFilters

## Propósito

Mostrar filtros atualmente aplicados.

Exemplo:

```text
Status: Ativo ×
Período: Agosto ×
```

---

# 14. Data Display

---

# 14.1 DataTable

## Propósito

Tabela padrão Loft para dados operacionais.

Base:

```text
Table + TableHead + TableBody + TableRow + TableHeader + TableData (Copan, @loft/react-loft)
```

## Requisitos

- loading;
- empty;
- error;
- pagination;
- sorting;
- filtering;
- row actions;
- selection.

## Props

```ts
interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}
```

```ts
interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  error?: boolean;
  pagination?: { current: number; pageSize: number; total: number; onChange: (page: number, pageSize: number) => void } | false;
  rowKey: string | ((record: T) => string);
}
```

## Implementação

Renderiza cada `DataTableColumn` como um par `TableHeader`/`TableData` (ambos com `asText`); o estado `loading` usa a prop `loading` do próprio `Table` do Copan (mostra overlay com loader). A paginação é um componente externo à `Table` — ver `14.6 Pagination` — o Copan não tem um `Table.Pagination` embutido.

---

# 14.2 DataTableActions

## Propósito

Padronizar ações por linha.

Regra:

```text
até 3 ações → visíveis
mais de 3 → Dropdown
```

---

# 14.3 DataTableToolbar

## Propósito

Barra superior da tabela.

Pode conter:

```text
Search
Filters
Export
Create
Bulk actions
```

---

# 14.4 DataTableEmpty

Empty state específico para tabelas.

Deve diferenciar:

```text
Nenhum dado cadastrado
```

de:

```text
Nenhum resultado encontrado para os filtros atuais
```

---

# 14.5 DataTableError

Estado de erro específico para tabelas.

---

# 14.6 Pagination

O Copan não possui um componente de paginação dedicado — compor com `Button` (variant="secondary", para os controles anterior/próximo) e `Typography` (para "Página X de Y"), seguindo o mesmo padrão de `27.1 BackButton` / `27.2 NextButton` / `27.3 PageNavigation` deste catálogo.

---

# 15. Status Components

---

# 15.1 StatusTag

## Propósito

Representar estados semânticos.

## Variants

```text
success
warning
error
info
neutral
premium
```

## Exemplo

```text
[ Ativo ]
[ Pendente ]
[ Cancelado ]
```

---

# 15.2 StatusBadge

Utilizar quando o status precisar de maior destaque visual.

---

# 15.3 StatusIndicator

Indicador compacto:

```text
● Ativo
● Offline
● Processando
```

A cor não deve ser o único indicador do estado.

---

# 16. Dashboard Components

---

# 16.1 KPIWidget

## Propósito

Apresentar indicador principal.

## Anatomy

```text
Título
Valor
Variação
Contexto
```

## Props

```ts
interface KPIWidgetProps {
  title: string;
  value: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  loading?: boolean;
}
```

---

# 16.2 KPIGrid

Agrupar KPIs.

Regra:

- 2–4 KPIs principais por linha em desktop;
- adaptação para mobile.

---

# 16.3 MetricCard

Card para métricas secundárias.

---

# 16.4 DashboardSection

Seção padronizada para dashboards.

---

# 16.5 ChartCard

Container para gráficos.

## Anatomy

```text
Title
Description
Actions
Chart
Legend
```

A biblioteca de gráficos deve ser escolhida conforme necessidade do produto.

O container deve permanecer independente da biblioteca de visualização.

---

# 17. Action Components

---

# 17.1 ActionBar

Agrupa ações relacionadas.

Exemplo:

```text
[ Exportar ] [ Importar ] [ Criar ]
```

---

# 17.2 BulkActionBar

Aparece quando registros são selecionados.

Exemplo:

```text
3 itens selecionados

[ Ativar ] [ Exportar ] [ Excluir ]
```

---

# 17.3 MoreActions

Menu para ações secundárias.

Base:

```text
Dropdown
```

---

# 17.4 ConfirmAction

Wrapper para ações que exigem confirmação.

Exemplo:

```text
[ Excluir ]
       ↓
Confirmar?
```

---

# 18. Overlay Components

---

# 18.1 ConfirmDialog

Confirmação padronizada.

## Props

```ts
interface ConfirmDialogProps {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
}
```

---

# 18.2 DetailDrawer

## Propósito

Mostrar detalhes sem abandonar a página atual.

---

# 18.3 FormDrawer

Drawer para formulários curtos ou médios.

Não utilizar para formulários extremamente complexos.

---

# 18.4 DetailModal

Modal para informações curtas.

---

# 19. File Components

---

# 19.1 FileUpload

## Propósito

Upload padronizado.

## Deve informar

- formatos aceitos;
- tamanho máximo;
- progresso;
- sucesso;
- erro.

---

# 19.2 FileList

Lista de arquivos anexados.

---

# 19.3 FileItem

Representa:

```text
Ícone
Nome
Tamanho
Status
Ações
```

---

# 19.4 FilePreview

Preview contextual quando o tipo de arquivo permitir.

---

# 20. Access Control Components

---

# 20.1 PermissionGate

## Propósito

Exibir conteúdo somente quando o usuário possuir determinada permissão.

## API

```tsx
<PermissionGate permission="users.delete">
  <Button variant="primary" onClick={openDeleteConfirmDialog}>Excluir</Button>
</PermissionGate>
```

> O Button do Copan não tem uma variant "danger" — ações destrutivas sinalizam isso via o `ConfirmDialog`/`Dialog` de confirmação (`warning`) que a ação abre, não por uma cor diferente no próprio botão (ver `17.4 ConfirmAction`).

---

# 20.2 PermissionButton

Botão integrado à autorização.

```tsx
<PermissionButton
  permission="users.delete"
  onClick={openDeleteConfirmDialog}
>
  Excluir
</PermissionButton>
```

---

# 20.3 PermissionMatrix

## Propósito

Interface para administrar permissões.

Exemplo:

```text
                Read   Create   Update   Delete

Users            ✓       ✓        ✓        ✓
Reports          ✓       -        -        -
Settings         ✓       -        ✓        -
```

---

# 20.4 RoleSelector

Selecionador padronizado de roles.

---

# 21. Search Components

---

# 21.1 GlobalSearch

Busca global da aplicação.

Pode suportar:

```text
Usuários
Imóveis
Pedidos
Relatórios
```

---

# 21.2 SearchResults

Resultados agrupados.

Exemplo:

```text
USUÁRIOS
João Silva

IMÓVEIS
Apartamento 102

RELATÓRIOS
Folha Agosto
```

---

# 21.3 SearchEmpty

Estado específico de busca sem resultados.

---

# 22. Domain Composition Components

Estes componentes são mais próximos do domínio, mas podem ser promovidos ao catálogo quando utilizados por múltiplos produtos.

---

# 22.1 EntityCard

Card genérico para entidades de negócio.

```ts
interface EntityCardProps {
  title: string;
  description?: string;
  image?: React.ReactNode;
  metadata?: React.ReactNode;
  status?: React.ReactNode;
  actions?: React.ReactNode;
}
```

---

# 22.2 EntityHeader

Cabeçalho de uma entidade.

Exemplo:

```text
[Avatar]

João Silva
Administrador

Status: Ativo

[ Editar ] [ Mais ]
```

---

# 22.3 EntityTimeline

Timeline de eventos.

Exemplo:

```text
25/08
Usuário criado

24/08
Permissão alterada

20/08
Convite enviado
```

---

# 22.4 ActivityTimeline

Timeline específica para atividades e auditoria.

---

# 22.5 MetadataList

Apresentar informações estruturadas:

```text
Nome          João Silva
E-mail        joao@email.com
Departamento  Engenharia
Status        Ativo
```

---

# 22.6 PropertyList

Variação de MetadataList orientada a propriedades.

---

# 23. Audit Components

---

# 23.1 AuditTimeline

Representar histórico de alterações.

Deve informar:

```text
Quem
O quê
Quando
Contexto
```

---

# 23.2 AuditEvent

Evento individual de auditoria.

---

# 23.3 ChangeSummary

Mostrar alterações:

```text
Status
Antes: Pendente
Depois: Aprovado
```

---

# 24. Notification Components

---

# 24.1 NotificationCenter

Central de notificações da aplicação.

---

# 24.2 NotificationItem

Representa uma notificação individual.

Estados:

```text
unread
read
```

---

# 24.3 NotificationBadge

Indicador de quantidade de notificações.

---

# 25. Wizard Components

---

# 25.1 StepWizard

Para processos sequenciais.

```text
1. Dados
   ↓
2. Configuração
   ↓
3. Revisão
   ↓
4. Conclusão
```

---

# 25.2 WizardStep

Representa uma etapa.

---

# 25.3 WizardActions

Ações:

```text
[ Voltar ] [ Continuar ]
```

Última etapa:

```text
[ Voltar ] [ Finalizar ]
```

---

# 26. Import / Export Components

---

# 26.1 ImportWizard

Fluxo:

```text
Upload
   ↓
Validação
   ↓
Preview
   ↓
Confirmação
   ↓
Processamento
   ↓
Resultado
```

---

# 26.2 ExportButton

Ação padronizada para exportação.

Deve possuir loading.

---

# 26.3 ExportDialog

Configuração de exportação.

Exemplo:

```text
Formato
[ CSV ]

Colunas
[x] Nome
[x] Status
[ ] Criado em

[ Cancelar ] [ Exportar ]
```

---

# 27. Pagination & Navigation Helpers

---

# 27.1 BackButton

Navegação contextual.

---

# 27.2 NextButton

Para fluxos sequenciais.

---

# 27.3 PageNavigation

Navegação entre páginas relacionadas.

---

# 28. Responsive Components

---

# 28.1 ResponsiveContainer

Controla largura e padding conforme breakpoint.

---

# 28.2 ResponsiveGrid

Grid baseado em breakpoints.

---

# 28.3 ResponsiveActions

Move ações para dropdown ou segunda linha em telas pequenas.

---

# 29. Component State Matrix

Todo componente relevante deve documentar seus estados.

Exemplo:

| Estado | Visual | Interação |
|---|---|---|
| Default | normal | disponível |
| Hover | destaque | disponível |
| Focus | outline | teclado |
| Loading | indicador | bloqueado |
| Disabled | reduzido | bloqueado |
| Error | feedback | disponível |
| Empty | mensagem | ação opcional |
| Readonly | visual estático | sem edição |

---

# 30. Component Documentation Standard

Todo componente oficial deve possuir documentação com:

```text
Nome
Propósito
Anatomy
Props
Variants
States
Interactions
Accessibility
Responsive Behavior
Examples
Do
Don't
```

---

# 31. Exemplo de Documentação

## DataTable

### Purpose

Exibir dados tabulares operacionais.

### Anatomy

```text
Toolbar
Header
Rows
Footer
Pagination
```

### Props

```ts
interface DataTableProps<T> {
  data: T[];
  columns: ColumnsType<T>;
  loading?: boolean;
  pagination?: TablePaginationConfig | false;
}
```

### States

```text
default
loading
empty
error
```

### Do

```text
Use pagination.
Keep actions grouped.
Use server-side filtering for large datasets.
```

### Don't

```text
Don't render thousands of records unnecessarily.
Don't place 10 actions in every row.
Don't hide errors.
```

---

# 32. Naming Convention

Componentes devem utilizar PascalCase.

```text
PageHeader
DataTable
FilterBar
EmptyState
KPIWidget
PermissionGate
```

Arquivos:

```text
PageHeader.tsx
DataTable.tsx
FilterBar.tsx
```

---

# 33. Folder Convention

Estrutura recomendada:

```text
src/
└── components/
    ├── layout/
    ├── navigation/
    ├── feedback/
    ├── forms/
    ├── data-display/
    ├── filters/
    ├── dashboard/
    ├── actions/
    ├── access-control/
    ├── files/
    └── domain/
```

---

# 34. Component Dependency Rules

Um componente do catálogo pode depender de:

```text
React
@loft/react-loft (Copan)
@loft/tokens-loft (Copan)
@loft/react-icons (Copan)
Loft utilities
```

Evitar dependência circular entre componentes.

Exemplo proibido:

```text
DataTable
 ↓
Dashboard
 ↓
DataTable
```

---

# 35. Component Composition

Preferir composição.

Exemplo:

```tsx
<PageHeader
  title="Usuários"
  description="Gerencie os usuários"
  actions={
    <Button variant="primary">
      Criar usuário
    </Button>
  }
/>
```

em vez de criar:

```text
UserManagementHeaderWithCreateButton
```

sem necessidade.

---

# 36. Business Logic

Componentes visuais devem possuir o mínimo possível de regra de negócio.

Preferir:

```text
Page
 ↓
Feature
 ↓
Hook
 ↓
Component
```

Exemplo:

```text
UsersPage
   ↓
useUsers
   ↓
DataTable
```

---

# 37. Server State

O catálogo não deve possuir fetching implícito.

Evitar:

```tsx
<DataTable endpoint="/users" />
```

Preferir:

```tsx
const { data, isLoading } = useUsers();

<DataTable
  data={data}
  loading={isLoading}
/>
```

Isso mantém os componentes reutilizáveis e independentes da API.

---

# 38. Permission Logic

Componentes podem receber autorização como propriedade.

Exemplo:

```tsx
<PermissionGate permission="users.update">
  <EditButton />
</PermissionGate>
```

O componente não deve assumir roles específicas.

Evitar:

```tsx
if (user.role === 'admin')
```

---

# 39. Accessibility Contract

Todo componente interativo deve possuir:

- teclado;
- foco;
- labels;
- estados acessíveis;
- suporte a leitores de tela quando aplicável.

---

# 40. Responsive Contract

Todo componente deve documentar comportamento em:

```text
desktop
tablet
mobile
```

quando aplicável.

---

# 41. Component Variants

Variants devem ser semânticas.

Exemplo:

```text
size:
small
default
large
```

e não:

```text
orange
orange2
orangeSmall
orangeLarge
```

---

# 42. Styling Rules

Prioridade:

```text
1. Copan token (@loft/tokens-loft)
2. Loft token (semântico, derivado do Copan)
3. Component token
4. CSS local
```

CSS local somente quando necessário.

---

# 43. No Hardcoded Design Values

Evitar:

```tsx
color: '#FF774A'
```

quando o valor já existir como token.

Evitar:

```tsx
margin: 13
```

quando o layout puder utilizar:

```text
8
16
24
32
48
```

---

# 44. Component Lifecycle

Componentes devem evitar efeitos colaterais inesperados.

Não executar automaticamente:

```text
API call
navigation
mutation
notification
```

apenas porque o componente foi montado, salvo quando isso fizer parte explícita de seu contrato.

---

# 45. Loading Strategy

O componente deve permitir que o estado de loading seja controlado externamente.

Preferir:

```tsx
<DataTable loading={isLoading} />
```

a:

```tsx
<DataTable />
```

que internamente decide quando buscar dados.

---

# 46. Error Strategy

Erros também devem ser controlados pela camada de aplicação.

Preferir:

```tsx
<ErrorState
  onRetry={refetch}
/>
```

---

# 47. Empty Strategy

Empty State deve distinguir:

```text
No Data
```

de:

```text
No Results
```

Exemplo:

### No Data

```text
Nenhum usuário cadastrado.

[ Criar usuário ]
```

### No Results

```text
Nenhum usuário encontrado.

Tente alterar os filtros.
```

---

# 48. Component Promotion

Um componente de produto pode ser promovido ao catálogo quando:

- aparece em pelo menos dois contextos;
- possui comportamento consistente;
- não depende de regras específicas de um único produto;
- possui API estável;
- possui documentação;
- possui testes.

---

# 49. Component Deprecation

Componentes obsoletos devem ser marcados como:

```text
deprecated
```

Não remover imediatamente.

Processo:

```text
New Component
      ↓
Deprecation
      ↓
Migration
      ↓
Removal
```

---

# 50. Versioning

Mudanças incompatíveis na API de componentes devem ser tratadas como breaking changes.

Exemplo:

```text
PageHeader v1
PageHeader v2
```

quando houver alteração significativa.

---

# 51. Testing Standard

Componentes do catálogo devem possuir testes.

Testar:

- renderização;
- interação;
- estados;
- acessibilidade básica;
- callbacks;
- variantes relevantes.

Não testar detalhes internos de implementação sem necessidade.

---

# 52. Visual Regression

Componentes críticos podem possuir testes de regressão visual.

Especialmente:

```text
PageHeader
DataTable
Forms
Modal
Dashboard
Navigation
```

---

# 53. Component Quality Checklist

Antes de promover um componente ao catálogo:

- [ ] Existe necessidade recorrente
- [ ] API estável
- [ ] TypeScript
- [ ] Tokens utilizados (`@loft/tokens-loft`)
- [ ] Copan (`@loft/react-loft`) utilizado
- [ ] Estados definidos
- [ ] Acessibilidade
- [ ] Responsividade
- [ ] Testes
- [ ] Documentação
- [ ] Exemplos
- [ ] Do / Don't

---

# 54. AI Component Generation Rules

Ao gerar componentes com IA:

> Antes de criar um novo componente, verificar se o Copan (`@loft/react-loft`) ou o Loft Component Catalog já possui uma solução.

> Não criar componentes duplicados.

> Não criar componentes apenas para encapsular um único componente Copan sem adicionar comportamento ou semântica.

> Componentes customizados devem utilizar tokens do Loft Design System.

> Componentes devem ser controláveis quando possuírem estado relevante.

> Não realizar chamadas HTTP diretamente dentro de componentes visuais.

> Não implementar autorização baseada em roles diretamente no componente.

> Preferir permissões semânticas.

> Todo componente deve possuir estados adequados.

> Todo componente interativo deve considerar acessibilidade.

> Não introduzir uma nova biblioteca visual (Ant Design, MUI, Chakra, Bootstrap, styled-components) — o Copan é a biblioteca de componentes mandatória.

> Sempre importar componentes reais de `@loft/react-loft` e tokens de `@loft/tokens-loft` — nunca copiar só a paleta de cores sobre outra biblioteca.

---

# 55. Component Priority

A implementação deve seguir esta prioridade:

## Tier 1 — Foundation Components

```text
PageHeader
PageContainer
LoadingState
EmptyState
ErrorState
FormSection
FormActions
DataTable
FilterBar
StatusTag
```

## Tier 2 — Productivity Components

```text
SearchField
FilterDrawer
BulkActionBar
DetailDrawer
ConfirmDialog
FileUpload
KPIWidget
EntityHeader
MetadataList
```

## Tier 3 — Domain Components

```text
PermissionMatrix
AuditTimeline
EntityTimeline
ImportWizard
ExportDialog
```

Componentes Tier 3 devem ser adicionados conforme necessidades reais dos produtos.

---

# 56. Initial Catalog

A primeira implementação do Design System deve priorizar:

```text
Layout
├── AppShell
├── PageContainer
├── PageHeader
└── ContentSection

Feedback
├── LoadingState
├── EmptyState
├── ErrorState
└── PermissionDenied

Forms
├── FormSection
├── FormActions
├── FormField
└── SearchField

Data
├── DataTable
├── DataTableToolbar
├── DataTableActions
└── Pagination

Filters
├── FilterBar
├── FilterDrawer
└── ActiveFilters

Status
├── StatusTag
├── StatusBadge
└── StatusIndicator

Dashboard
├── KPIWidget
├── KPIGrid
└── ChartCard

Access
├── PermissionGate
└── PermissionButton

Overlays
├── ConfirmDialog
├── DetailDrawer
└── FormDrawer

Files
├── FileUpload
├── FileList
└── FileItem
```

---

# 57. Future Catalog

Podem ser adicionados posteriormente:

```text
GlobalSearch
NotificationCenter
ImportWizard
ExportDialog
PermissionMatrix
AuditTimeline
EntityTimeline
EntityCard
EntityHeader
ChangeSummary
StepWizard
```

A inclusão deve ocorrer conforme necessidade real.

---

# 58. Final Architecture

O ecossistema final deve seguir:

```text
┌──────────────────────────────────────────────┐
│              APPLICATION                    │
│                                              │
│  Pages / Features / Business Logic          │
└───────────────────────┬──────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│         LOFT COMPONENT CATALOG              │
│                                              │
│ PageHeader  DataTable  FilterBar  KPIWidget │
│ EmptyState  FormSection  PermissionGate     │
│ EntityCard  AuditTimeline  etc.             │
└───────────────────────┬──────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│            LOFT DESIGN SYSTEM               │
│                                              │
│ Colors Typography Spacing Radius             │
│ Tokens Accessibility Layout Rules            │
└───────────────────────┬──────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│              COPAN (@loft/react-loft)       │
│                                              │
│ Button TextField Table Modal Select ...      │
└──────────────────────────────────────────────┘
```

---

# 59. Regra de Ouro

Antes de criar qualquer componente novo:

```text
1. Existe no Copan (@loft/react-loft)?
        │
       SIM
        │
        ▼
     Utilize-o.

        NÃO
        │
        ▼
2. Existe no Loft Component Catalog?
        │
       SIM
        │
        ▼
     Utilize-o.

        NÃO
        │
        ▼
3. Pode ser composto com componentes existentes?
        │
       SIM
        │
        ▼
     Componha.

        NÃO
        │
        ▼
4. É uma necessidade recorrente?
        │
       SIM
        │
        ▼
   Crie componente Loft.

        NÃO
        │
        ▼
   Mantenha local ao produto.
```

---

# 60. Princípio Final

O Loft Component Catalog não deve se tornar uma segunda versão do Copan.

Seu objetivo é resolver uma camada diferente:

```text
Copan (@loft/react-loft)
→ componentes básicos

Loft Design System
→ identidade visual + regras

Loft Component Catalog
→ padrões recorrentes de produto

Product Components
→ necessidades específicas do domínio

Pages
→ composição final
```

O resultado esperado é:

```text
                   LOFT FRONTEND
                         │
          ┌──────────────┴──────────────┐
          │                             │
     FOUNDATION                    DESIGN SYSTEM
          │                             │
   Como construir                 Como parecer
          │                             │
          └──────────────┬──────────────┘
                         │
                         ▼
               COMPONENT CATALOG
                         │
                Como reutilizar
                         │
                         ▼
                   APPLICATION
```

**O catálogo deve ser tratado como uma camada viva e evolutiva. Componentes somente devem ser promovidos para este catálogo quando possuírem comportamento suficientemente estável, reutilizável e documentado.**