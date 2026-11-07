# Loft Design System

> **Sistema de Design para aplicações frontend padrão Loft**

**Versão:** 2.0  
**Atualizado:** Outubro de 2026  
**Base:** Copan Platform (`@loft/react-loft` + `@loft/tokens-loft`)  
**Implementação:** React + TypeScript + Copan

---

# 1. Objetivo

O Loft Design System define os princípios visuais, componentes, tokens, padrões de interação e convenções de composição para aplicações frontend da Loft.

O objetivo é garantir:

- consistência visual;
- consistência comportamental;
- acessibilidade;
- reutilização;
- velocidade de desenvolvimento;
- compatibilidade com ferramentas de IA;
- uso consistente da biblioteca de componentes real da Loft (Copan);
- identidade visual consistente com o ecossistema Loft.

O Design System deve ser utilizado em conjunto com o:

**Loft Frontend Foundation**

O Frontend Foundation define **como construir a aplicação**.

O Design System define **como a aplicação deve parecer e se comportar visualmente**.

---

# 2. Princípio Fundamental

O Copan é a biblioteca de componentes e tokens oficial da Loft — **é dependência técnica real e mandatória**, não uma referência visual a ser copiada sobre outra biblioteca.

Importar sempre:

```text
@loft/react-loft   (componentes)
@loft/tokens-loft  (tokens: color, spacing, typography, border)
@loft/react-icons  (ícones)
```

Esses pacotes são privados: requerem um `NPM_TOKEN` com acesso ao escopo `@loft` configurado no `.npmrc` do projeto (`//registry.npmjs.org/:_authToken=${NPM_TOKEN}`) — esperado em qualquer aplicação padrão Loft, pois é construída e operada por times internos.

A implementação pública deve utilizar:

```text
@loft/react-loft (Copan)
+
@loft/react-icons
+
Loft Design Tokens (@loft/tokens-loft)
+
Loft UI Conventions
```

Arquitetura:

```text
                 Copan (@loft/react-loft + @loft/tokens-loft)
                   │
          biblioteca de componentes real
                   │
                   ▼
           Loft Design System
                   │
        ┌──────────┴──────────┐
        │                     │
     Tokens              Componentes
        │                     │
        └──────────┬──────────┘
                   ▼
              Application
```

---

# 3. Design Principles

## 3.1 Clarity First

Interfaces devem priorizar compreensão.

Evitar:

- excesso de elementos;
- decoração sem função;
- excesso de cores;
- excesso de bordas;
- informações redundantes.

---

## 3.2 Consistency

O mesmo conceito deve possuir o mesmo comportamento em toda a aplicação.

Exemplo:

```text
Salvar
```

deve possuir comportamento visual consistente em diferentes telas.

---

## 3.3 Progressive Disclosure

Não apresentar todas as informações simultaneamente.

Priorizar:

```text
Informação principal
        ↓
Informação secundária
        ↓
Ações avançadas
```

---

## 3.4 Density With Hierarchy

Aplicações corporativas podem apresentar bastante informação, mas devem manter hierarquia visual.

A densidade deve ser controlada através de:

- espaçamento;
- tipografia;
- agrupamento;
- contraste;
- hierarquia;
- componentes.

---

## 3.5 Functional Design

Cada elemento visual deve possuir uma função.

Não utilizar:

- sombras decorativas excessivas;
- gradientes sem propósito;
- animações desnecessárias;
- ícones meramente ornamentais.

---

# 4. Design Tokens

Tokens são a fonte de verdade visual — vêm todos do pacote real `@loft/tokens-loft` (nunca hex/rgb hardcoded).

```tsx
import { color, spacing, typography, border } from '@loft/tokens-loft';
```

Componentes não devem possuir valores arbitrários espalhados pelo código.

---

# 5. Color System

## 5.1 Brand

### Primary

```text
color.background.brand       #FF774A
color.decorative.orange.main #FF774A
color.interaction.primary.main #F56738  (fundo real do Button variant="primary")
```

Uso: aplicado automaticamente por `<Button variant="primary">` — nunca setar a cor de marca manualmente via `style`/hex. Para outros usos (ex.: ícone de destaque): `color.icon.highlight` / `color.text.highlight` (`#FF774A`).

O Brand Orange **não deve ser utilizado como cor decorativa dominante**.

---

## 5.2 Premium

```text
color.background.premium     #BD7B00
color.interaction.premium.main #BD7B00
color.text.premium           #BD7B00
color.icon.premium           #BD7B00
```

Uso exclusivo para: funcionalidades premium, planos premium, benefícios especiais, indicadores VIP (`Button modifier="premium"`, `Tag modifier="premium"`).

Não utilizar Gold como substituto do Primary.

---

# 6. Semantic Colors (`color.feedback.*`)

```text
color.feedback.positive.main     #20A483   (+ .light #E4F0ED, fundos apenas)
color.feedback.warning.main      #FFA600   (+ .light #FFF3DE)
color.feedback.negative.main     #CE4242   (+ .light #FACDCD)
color.feedback.informative.main  #387BA8   (+ .light #F2F4F8)
color.feedback.neutral.main      #697077   (+ .light #DDE1E6)
```

Usados via a prop `state` de `Tag`, `FeedbackBanner`, `StatusLight`, `SnackBar` (`positive`/`warning`/`negative`/`informative`/`neutral` — não existe `info`/`success`/`error` como nome de state).

As cores semânticas devem comunicar significado. Não utilizar `color.feedback.negative` apenas porque "fica bonito" — reservar para erro/destrutivo real.

---

# 7. Decorative Colors (`color.decorative.*`)

```text
color.decorative.orange.main   #FF774A
color.decorative.yellow.main   #FFA600   (+ .light #FFF3DE)
color.decorative.green.main    #20A483   (+ .light #98CBC0)
color.decorative.purple.main   #7351BA
color.decorative.blue.light    #DDE1E6
color.decorative.brown.main    #6A5151   (+ .light #BC9F9F, .lighter #F7F2F2)
```

Uso: paletas de gráficos/dashboards e elementos puramente visuais — nunca para comunicar estado (isso é papel de `color.feedback.*`).

---

# 8. Background (`color.background.*`)

```text
color.background.primary    #FFFFFF   (superfície base)
color.background.secondary  #F2F4F8   (destaque leve)
color.background.tertiary   #DDE1E6   (contraste adicional)
color.background.inverted   #191F23
color.background.backdrop   #191F2380 (overlay de Dialog/Modal)
color.background.brand      #FF774A
color.background.premium    #BD7B00
```

Regra:

> O background da aplicação deve permanecer predominantemente neutro (`color.background.primary`/`.secondary`/`.tertiary`).

O Brand Orange (`color.background.brand`) não deve ser utilizado como background de grandes áreas.

---

# 9. Text & Icon Colors

```text
color.text.primary      #191F23
color.text.secondary    #697077
color.text.placeholder  #878D96
color.text.inverted     #FFFFFF
color.text.highlight    #FF774A
color.text.premium      #BD7B00

color.icon.primary      #191F23
color.icon.muted        #697077
color.icon.inverted     #FFFFFF
color.icon.highlight    #FF774A
color.icon.premium      #BD7B00
```

Hierarquia:

```text
text.primary
   ↓
text.secondary
   ↓
text.placeholder
```

Não existe `color.text.disabled`/`color.icon.secondary` no Copan — evitar inventar. Evitar utilizar a mesma intensidade visual para todas as informações.

---

# 10. Separator (`color.separator.*`)

```text
color.separator.main      #697077   (borda/divisor padrão)
color.separator.heavy     #191F23   (isolamento de conteúdo)
color.separator.light     #C1C7CD   (divisão sutil)
color.separator.inverted  #FFFFFF
```

Não existe `color.border.*` no Copan — usar `color.separator.*`. Separators devem ser discretos; não utilizar `.heavy` em todos os elementos.

---

# 11. Typography

## 11.1 Font Family

Fonte principal:

```text
Inter
```

Fallback:

```text
Arial, sans-serif
```

CSS:

```css
font-family: 'Inter', Arial, sans-serif;
```

---

# 12. Typography Scale

Usar sempre `<Typography textStyle="...">` do Copan (`@loft/react-loft`) — nunca `<h1>`/`<p>` cru com tamanho de fonte próprio. Cada `textStyle` já embute os tamanhos desktop/mobile (breakpoint `md`=768px); não existe prop de override por breakpoint.

| textStyle | Desktop | Mobile | Peso |
|---|---:|---:|---:|
| `hero` | 64px / lh 80px | 48px / lh 60px | 700 |
| `h1` | 56px / lh 68px | 40px / lh 48px | 700 |
| `h2` | 48px / lh 60px | 32px / lh 40px | 700 |
| `h3` | 32px / lh 40px | 24px / lh 32px | 700 |
| `h4` | 24px / lh 32px | 18px / lh 28px | 700 |
| `subtitle` | 18px / lh 28px | 16px / lh 24px | 700 |
| `paragraph-lg` / `-bold` | 18px / lh 28px | 16px / lh 24px | 400 / 700 |
| `paragraph-md` / `-bold` | 16px / lh 24px | 14px / lh 24px | 400 / 700 |
| `paragraph-sm` / `-bold` | 14px / lh 24px | 12px / lh 20px | 400 / 700 |
| `caption` | 12px / lh 20px | 12px / lh 20px | 400 |
| `overline` | 10px / lh 16px, uppercase | 10px / lh 16px | 700 |
| `label-sm` | 14px / lh 24px | 14px / lh 24px | 400 |
| `label-md` | 16px / lh 24px | 16px / lh 24px | 400 |

Fonte: `Inter, Arial, sans-serif` (mesma em todos os `textStyle`).

---

# 13. Headings

| Elemento | textStyle (Copan) | Tamanho desktop |
|---|---|---:|
| H1 (título de página) | `h1` | 56px |
| H2 (seções principais) | `h2` | 48px |
| H3 (subseções) | `h3` | 32px |
| H4 (agrupamentos menores) | `h4` | 24px |

```tsx
<Typography textStyle="h1" as="h1">Usuários</Typography>
```

Use `as` para manter a tag semântica correta (`h1`/`h2`/...) independente do `textStyle` visual escolhido. Não utilizar headings apenas para obter um tamanho de fonte específico.

---

# 14. Body

Texto padrão: `<Typography textStyle="paragraph-md">` (16px desktop / 14px mobile). Texto auxiliar: `paragraph-sm` (14px desktop / 12px mobile).

O texto padrão da aplicação deve ser confortável para leitura e compatível com interfaces corporativas densas.

---

# 15. Font Weight

O Copan só documenta dois pesos nos `textStyle`:

```text
400 → paragraph-*, caption, label-sm, label-md
700 → hero, h1-h4, subtitle, paragraph-*-bold, overline
```

Não existem pesos intermediários (500/600) nos tokens de tipografia — usar a variante `-bold` do `textStyle` (ex.: `paragraph-md-bold`) em vez de aplicar `font-weight` customizado.

---

# 16. Spacing

Dois namespaces reais em `spacing` (`@loft/tokens-loft`), com bases e passos diferentes:

```text
spacing.inner.*   (base 4px — padding/gap DENTRO de componentes)
  base    4px    base05  20px   base12  48px
  base02  8px    base06  24px   base14  56px
  base03  12px   base08  32px
  base04  16px   base10  40px

spacing.layout.*  (base 8px — espaço ENTRE blocos de layout)
  base    8px    base05  40px   base10   80px
  base02  16px   base06  48px   base12   96px
  base03  24px   base07  56px   base15  120px
  base04  32px   base08  64px
```

Não existe `base01` em nenhum dos dois namespaces, nem passos acima de `base14` (inner) / `base15` (layout) — não inventar `base16`/`base24`.

Em props de componente, os tokens aparecem como string camelCase (`"base02"`, `"innerBase04"`, `"layoutBase03"` conforme o componente — ver `UISpacer`/`Flex`/`Table` no Component Catalog). Valores arbitrários (`margin: 13`) devem ser evitados — sempre o token mais próximo.

---

# 17. Border Radius

`border.radius.*` (`@loft/tokens-loft`):

```text
none    0
xs      4px
sm      8px
md      12px
lg      24px
pill    999px
circle  50%
```

Padrão para a maioria dos componentes (inputs, buttons, cards): `sm` (8px). Modais e superfícies maiores tendem a `md`/`lg` conforme o componente Copan usado — nunca hardcode `border-radius: 8` em CSS local quando o componente já aplica o token internamente.

---

# 18. Elevation

A interface deve utilizar elevação de forma moderada.

Hierarquia:

```text
Page
  ↓
Card
  ↓
Dropdown
  ↓
Modal
```

Evitar múltiplas sombras fortes na mesma tela.

---

# 19. Z-Index

`zindex.*` real do Copan (`@loft/tokens-loft`) — já reflete a ordem de empilhamento dos próprios componentes, não precisa ser recriado:

```text
zindex.fab           100
zindex.navigation    200
zindex.popover       300
zindex.backdrop      500
zindex.drawer        510
zindex.modal         520
zindex.dialog        530
zindex.modalContent  550
zindex.snackbar      600
zindex.tooltip       700
zindex.aboveAll      1000
```

Os componentes Copan (`Modal`, `Drawer`, `Dialog`, `SnackBar`, `Tooltip`, `DropdownMenu`/`Popover`) já aplicam esses valores internamente — só usar `zindex.aboveAll` diretamente ao posicionar algo manualmente acima de tudo.

---

# 20. Consumindo Tokens Copan

Não há `ConfigProvider`/tema global no Copan — os tokens são importados diretamente de `@loft/tokens-loft` e passados como props/valores de estilo onde o próprio componente não já resolve isso sozinho (a maioria resolve: `<Button variant="primary">` já aplica a cor de marca, `<Typography textStyle="h1">` já aplica a tipografia).

```tsx
import { color, spacing } from '@loft/tokens-loft';

// Caso raro em que um componente Copan expõe `color`/`style` diretamente
// (a maioria dos componentes resolve isso via props semânticas como
// variant/state/modifier, sem precisar importar o token manualmente):
<TrashIcon size="md" color={color.icon.primary} />
```

Setup de projeto (uma vez): `.npmrc` com `NPM_TOKEN` para o escopo `@loft`, e fonte `Inter` carregada via Google Fonts ou self-host, conforme a documentação oficial (copan-loft.loft.technology).

---

# 21. Component Philosophy

O Copan (`@loft/react-loft`) é a biblioteca base.

A regra é:

```text
Copan
    ↓
Configuração via props semânticas (variant/state/modifier) + tokens
    ↓
Composição
    ↓
Wrapper somente quando necessário
```

Não:

```text
Copan
    ↓
Copiar só a paleta de cores
    ↓
Reescrever tudo em Ant Design/outra lib
    ↓
Criar Design System paralelo
```

---

# 22. Component Mapping (Copan real, `@loft/react-loft`)

| Necessidade | Componente | Nota |
|---|---|---|
| Button | `Button` | `variant="primary"/"secondary"`, sem `type`/`danger` |
| Input (texto) | `TextField` | |
| Input (máscara: CPF/CEP/telefone) | `PatternField` | |
| Input (numérico/moeda) | `NumericField` | |
| Textarea | `TextArea` | |
| Select | `Select` + `Option` | |
| Checkbox | `Checkbox` | |
| Radio | `Radio` | |
| Switch | `Switch` | |
| Date | — | sem `DatePicker` confirmado — verificar doc oficial antes de usar |
| Form | — | sem wrapper `Form` — usar `react-hook-form` em cima dos campos Copan |
| Modal | `Modal` | sem prop `styles`/`centered` — ver regra de contenção de scroll |
| Dialog (confirmação) | `Dialog` | `actions={{ primary, secondary }}`, `warning` |
| Drawer | `Drawer` | `placement="left"/"right"` |
| Alert / banner persistente | `FeedbackBanner` | `state`, não `type` |
| Notification / Message | `SnackBar` | `state`, `timeout` |
| Tooltip | `Tooltip` | `title` = conteúdo |
| Popover | `Popover` | `content`, child = anchor |
| Table | `Table` + `TableHead/Body/Row/Header/Data` | |
| Tabs | `Tabs` | `tabs: TabEntity[]`, não children |
| Pagination | — | sem componente dedicado — compor com `Button` + `Typography` |
| Dropdown (menu de ações) | `DropdownMenu` | `menuItems`, trigger = `ActionButton` |
| Tag | `Tag` | `state`, `modifier`, `icon` |
| Badge | — | sem componente dedicado — compor com `Tag` |
| Avatar | `Avatar` | `name` (fallback de iniciais) |
| Card | `Card` | |
| Collapse | `Collapse` / `Accordion` | `Accordion` já tem header embutido |
| Breadcrumb | `Breadcrumbs` | `items: {text, href?}[]` |
| Empty | — | sem componente dedicado — compor com `Typography` (ver `EmptyState` no Catalog) |
| Loading | `CircularLoader` | sem `Skeleton`/`Spin` confirmado |
| Result | — | sem componente dedicado — compor com `FeedbackBanner` + `Typography` + `Button` |

Itens marcados "—" não têm componente dedicado documentado no Copan — isso é uma composição do Loft Component Catalog (Volume III), não uma lacuna a preencher com Ant Design.

---

# 23. Button

O `Button` do Copan tem apenas duas `variant` (`primary`/`secondary`) e três `modifier` (`none`/`inverted`/`premium`) — não existe variant `danger`/`link`/`text`/`default`. Não inventar essas props.

## variant="primary"

Utilizar para: ação principal, submit principal, criação, confirmação.

```tsx
<Button variant="primary">Criar usuário</Button>
```

---

## variant="secondary"

Utilizar para: ações secundárias, cancelar, alternativas.

---

## Navegação / ação terciária

Para links e ações de baixa prioridade, usar o componente `Link` (não uma variant de `Button`):

```tsx
<Link href="/perfil" variant="primary" textStyle="paragraph-md">Ver perfil</Link>
```

---

## Ações destrutivas

Não existe um `Button` "danger". A confirmação explícita é que sinaliza o risco — abrir um `Dialog` com `warning` antes de executar (ver `17.4 ConfirmAction` no Component Catalog):

```tsx
<Button variant="primary" onClick={() => setConfirmOpen(true)}>Excluir</Button>

<Dialog
  id="dialog-excluir"
  open={confirmOpen}
  title="Excluir permanentemente?"
  warning
  onDismiss={() => setConfirmOpen(false)}
  actions={{
    primary: { children: 'Excluir', onClick: handleDelete },
    secondary: { children: 'Cancelar', onClick: () => setConfirmOpen(false) },
  }}
/>
```

Nunca utilizar essa confirmação apenas para chamar atenção em ações não destrutivas.

---

# 24. Button Rules

Altura padrão:

```text
40px
```

Texto:

```text
verbo + objeto
```

Preferir:

```text
Criar usuário
Salvar alterações
Exportar relatório
```

Evitar:

```text
OK
Enviar
Clique aqui
```

quando houver contexto mais claro.

---

# 25. Inputs

Todos os inputs devem possuir:

```text
Label
Input
Helper/Error
```

Exemplo:

```text
Nome completo *

[________________________]

Informe o nome completo.
```

---

# 26. Input States

Todo input deve considerar:

```text
Default
Hover
Focus
Filled
Error
Disabled
Read-only
```

O estado de erro deve ser acompanhado de mensagem textual.

Não comunicar erro apenas pela cor.

---

# 27. Forms

Formulários devem seguir:

```text
Título
Descrição
──────
Campo
Campo
Campo
──────
Ações
```

Preferência:

```text
1 coluna
```

para formulários comuns.

Utilizar múltiplas colunas somente quando houver ganho real de compreensão ou eficiência.

---

# 28. Form Actions

Ações devem ficar preferencialmente no final do formulário.

Exemplo:

```text
                    [ Cancelar ] [ Salvar ]
```

A ação principal deve possuir maior destaque visual.

---

# 29. Modal & Dialog Overlays

### Diretrizes Fundamentais de Modais

1. **Dialog para confirmação, Modal para conteúdo customizado**:
   O `Modal` do Copan (`@loft/react-loft`) tem props `open`, `onDismiss`, `width`, `padding`, `dismissProps` — não tem `centered`/`styles`. Para confirmações/alertas simples, usar `Dialog` (já centralizado, com `title`/`warning`/`actions`), não um `Modal` customizado.

2. **Contenção de Rolagem Interna**:
   O `Modal` do Copan não expõe uma prop para limitar a altura do corpo — a contenção de scroll é feita no wrapper interno do conteúdo, não no componente:
   ```tsx
   <Modal open={open} onDismiss={onDismiss} width={900}>
     <Flex
       flexDirection="column"
       style={{ maxHeight: 'calc(85vh - 140px)', overflowY: 'auto' }}
     >
       {content}
     </Flex>
   </Modal>
   ```

3. **Hierarquia de Larguras Padronizadas** (prop `width`, em px):
   - `520` → Diálogos de confirmação, exclusão ou alertas curtos (geralmente via `Dialog`, que já centraliza).
   - `800` → Formulários médios, histórico de versões (`EntityVersionModal`), inspeção de regras.
   - `900` a `1000` → Visualizadores de especificação técnica (SDD Viewer), editores de código/markdown e comparadores de diff.

Utilizar Modal para:
- confirmação e alertas transacionais;
- visualização rápida de especificações técnicas e regras;
- histórico de versionamento e auditoria;
- edição curta e criação simples.

Não utilizar Modal para:
- fluxos longos de múltiplos passos;
- workshops de criação de blueprints e composições de arquitetura;
- formulários corporativos extensos com mais de 8 campos complexos.

Para fluxos complexos, utilizar **Páginas de Edição Ricas (Padrão Workshop Studio)** ou **Drawers** laterais com persistência de estado.

---

# 30. Padrão de Telas de Edição Ricas (Workshop / Studio Grade)

Para edição de recursos estruturais (Blueprints, Templates, Políticas IAM, Módulos), a interface deve adotar o **Padrão de Workshop Visual**:

1. **Header Contextual**:
   - Título claro, Breadcrumb de navegação, Badge de status e grupo de ações fixas no topo (Salvar Rascunho, Validar, Publicar, Cancelar).

2. **Card de Pré-Carregamento Inteligente (Pre-fill)**:
   - Seletor duplo: **Template Canônico Loft** (carrega módulos, componentes e regras) vs **Blueprint Existente** (clonagem/refatoração).
   - Campos de Nome e Descrição com validação obrigatória destacada.

3. **Composição em Abas / Grid Visual**:
   - Seleção de Arquitetura em cards visuais.
   - Módulos e Componentes exibidos em grade com badges de tecnologia, tags e filtros de busca.
   - Validação em tempo real (Painel lateral ou Drawer com checagem de Golden Rules e bloqueio de publicação preventiva em caso de regras críticas violadas).

---

# 30.1 Modal Confirmation

Operações críticas devem utilizar confirmação centralizada.

Exemplo:

```text
Excluir usuário?

Esta ação não poderá ser desfeita.

[ Cancelar ] [ Excluir ]
```

Implementar como `Dialog` com `warning` (ver seção 23) — o risco é sinalizado pela própria confirmação, não por uma cor "danger" no botão (que não existe no Copan).

---

# 31. Drawer

Utilizar Drawer quando o usuário precisa manter o contexto da página principal.

Casos:

- detalhes;
- edição contextual;
- filtros;
- informações adicionais.

---

# 32. Tables

Tabelas são elementos centrais de aplicações corporativas.

Devem possuir:

```text
Header
Rows
Loading
Empty
Error
Pagination
Actions
```

---

# 33. Table Rules

Ações devem ficar preferencialmente à direita.

Exemplo:

```text
Nome       Status       Criado em       Ações
João       Ativo        10/08/2026      ...
Maria      Ativo        12/08/2026      ...
```

Evitar mais de três ações visíveis por linha.

Quando necessário, agrupar ações em:

```text
Dropdown
```

---

# 34. Table Density

A densidade deve ser adequada ao volume de informação.

### Default

Uso geral.

### Compact

Uso em:

- dashboards;
- grandes tabelas;
- operações administrativas.

### Spacious

Uso quando leitura é mais importante que densidade.

---

# 35. Cards

Cards devem agrupar informações relacionadas.

Usar para:

- KPIs;
- resumo;
- entidades;
- informações contextuais;
- agrupamentos funcionais.

Evitar transformar toda seção da aplicação em um card.

---

# 36. Page Layout

Estrutura recomendada:

```text
┌──────────────────────────────────────┐
│ Page Header                          │
│ Título                               │
│ Descrição                            │
│                         [Ação]       │
├──────────────────────────────────────┤
│                                      │
│ Conteúdo                             │
│                                      │
└──────────────────────────────────────┘
```

Padding padrão:

```text
32px
```

Aplicações mais densas podem utilizar:

```text
24px
```

---

# 37. Page Header

Um Page Header deve possuir:

```text
Título
Descrição opcional
Breadcrumb opcional
Ações principais
```

Exemplo:

```text
Usuários
Gerencie usuários e permissões da organização.

                              [ + Criar usuário ]
```

---

# 38. Sidebar

Sidebar deve:

- possuir navegação hierárquica;
- indicar item ativo;
- possuir agrupamento lógico;
- permitir colapso quando necessário;
- respeitar permissões.

Não esconder funcionalidades críticas apenas por falta de espaço.

---

# 39. Navigation

Itens de navegação devem possuir:

```text
Ícone + Label
```

Ícones devem reforçar a compreensão, não substituir labels em navegação principal.

---

# 40. Breadcrumb

Utilizar Breadcrumb quando:

- houver hierarquia;
- existirem múltiplos níveis;
- o usuário precisar voltar ao contexto anterior.

Evitar breadcrumbs em aplicações extremamente rasas.

---

# 41. Tabs

Tabs devem ser utilizadas para alternar entre conteúdos relacionados.

Não utilizar Tabs para substituir:

- navegação;
- etapas complexas;
- filtros;
- páginas independentes.

---

# 42. Feedback

## Success

Indicar:

- operação concluída;
- processamento finalizado;
- estado positivo.

---

## Warning

Indicar:

- atenção;
- risco;
- situação incompleta.

---

## Error

Indicar:

- falha;
- operação não concluída;
- problema crítico.

---

## Info

Indicar:

- informação contextual;
- orientação;
- novidade relevante.

---

# 43. Notifications

Utilizar Notification para eventos que precisam chamar atenção sem interromper o fluxo.

Exemplo:

```text
Relatório exportado
O arquivo foi gerado com sucesso.
```

---

# 44. Empty State

Toda coleção deve possuir Empty State.

Estrutura:

```text
[ Ícone/ilustração ]

Nenhum usuário encontrado

Cadastre o primeiro usuário para começar.

[ Criar usuário ]
```

Empty State deve explicar:

1. o que aconteceu;
2. o que o usuário pode fazer.

---

# 45. Loading State

O Copan não documenta um componente "Skeleton" — usar `CircularLoader` (`@loft/react-loft`) tanto para carregamentos estruturais quanto para operações pontuais. Se um placeholder estrutural for realmente necessário, confirmar com o time de design system antes de criar um substituto local — não inventar essa API.

---

# 46. Error State

Erro de carregamento deve possuir:

```text
Título
Descrição
Ação
```

Exemplo:

```text
Não foi possível carregar os dados.

Ocorreu um problema ao consultar o servidor.

[ Tentar novamente ]
```

---

# 47. Permission State

Quando o usuário não possuir permissão:

```text
Acesso restrito

Você não possui permissão para visualizar este conteúdo.
```

Não exibir dados e depois esconder apenas ações.

A UI deve refletir a autorização disponível.

---

# 48. Icons

Biblioteca:

```text
@loft/react-icons
```

Não há componente genérico `Icon` — importar o ícone nomeado específico (ex.: `TrashIcon`, `SearchIcon`, `PencilIcon`).

Regras:

- `size="md"` padrão, `size="lg"`/`"xl"` para ações importantes (`size`: `sm`/`md`/`lg`/`xl`);
- `color` sempre de `color.icon.*` (`@loft/tokens-loft`) — nunca hex/`currentColor` literal;
- não utilizar ícones de outras bibliotecas (`@ant-design/icons`, `lucide-react`, etc.);
- ícones isolados devem possuir tooltip ou `aria-label` (`ActionButton` exige `aria-label`).

---

# 49. Icon Buttons

Botões somente com ícone devem possuir:

```text
Tooltip
```

quando o significado não for universal.

Exemplo:

```text
[ 🗑 ]
```

deve possuir:

```text
Excluir
```

como tooltip/acessibilidade.

---

# 50. Accessibility

Acessibilidade é requisito do Design System.

Obrigatório:

- contraste WCAG AA;
- foco visível;
- teclado;
- labels;
- mensagens de erro;
- semântica adequada;
- ARIA quando necessário;
- tamanho adequado de áreas clicáveis.

---

# 51. Responsive Design

Breakpoints reais do Copan (usar os tokens, nunca media queries arbitrárias):

```text
xs   0px      (alvo mínimo: 320px)
sm   576px
md   768px
lg   960px
xl   1200px
xxl  1440px
```

Em props de componente: `GridItem xs={12} md={6}` (número de colunas por breakpoint), ou sufixos `-up`/`-down` (`fullWidth="md-down"` em `Button`/`TextField`).

A interface deve considerar:

```text
Desktop
Tablet
Mobile
```

quando aplicável.

Não simplesmente reduzir tudo proporcionalmente.

Em telas pequenas:

```text
Sidebar
↓
Navigation compacta

Table
↓
Responsive / Card / horizontal scroll

Form
↓
Single column
```

---

# 52. Motion

Animações devem ser discretas.

Utilizar para:

- transições;
- feedback;
- abertura/fechamento;
- mudança de estado.

Evitar:

- animações permanentes;
- efeitos decorativos;
- excesso de movimento.

Respeitar:

```text
prefers-reduced-motion
```

---

# 53. Content Guidelines

Textos de interface devem ser:

- claros;
- curtos;
- objetivos;
- acionáveis.

Preferir:

```text
Salvar alterações
```

a:

```text
Clique aqui para salvar as alterações realizadas
```

---

# 54. Labels

Labels devem descrever o dado esperado.

Preferir:

```text
Nome completo
E-mail
Data de nascimento
```

Evitar:

```text
Digite aqui
Informe algo
Campo
```

---

# 55. Error Messages

Mensagens de erro devem explicar:

```text
O que aconteceu
+
Como corrigir
```

Preferir:

```text
Informe um e-mail válido.
```

a:

```text
Erro de validação.
```

---

# 56. Destructive Actions

Ações destrutivas devem:

- possuir confirmação quando necessário (via `Dialog` `warning`, não uma cor "danger" no `Button` — ver seção 23);
- utilizar linguagem explícita;
- informar consequências.

Exemplo:

```text
Excluir campanha?

Todos os dados associados serão removidos.

[ Cancelar ] [ Excluir campanha ]
```

---

# 57. Do / Don't

## Fazer

```text
Copan (@loft/react-loft)
Tokens (@loft/tokens-loft)
Composição
Hierarquia
Espaçamento
Estados
Acessibilidade
```

## Não fazer

```text
Hardcoded colors
UI inconsistente
Excesso de sombras
Excesso de cores
Ícones aleatórios
Modal para tudo
Texto excessivo
Componentes duplicados
```

---

# 58. Componentes Customizados

Componentes customizados são permitidos quando:

1. o Copan não possui solução adequada;
2. a composição de componentes existentes não resolve;
3. existe uma necessidade recorrente do domínio.

Exemplo:

```text
PropertyCard
LeadTimeline
KPIWidget
PermissionMatrix
```

Esses componentes devem utilizar os componentes e tokens existentes.

Não criar um novo sistema visual.

---

# 59. Component Anatomy

Componentes customizados devem documentar:

```text
Purpose
Props
States
Variants
Interactions
Accessibility
Responsive behavior
```

Exemplo:

```text
PropertyCard

Purpose:
Representar uma propriedade.

States:
- default
- loading
- unavailable

Actions:
- visualizar
- editar
- favoritar
```

---

# 60. Variants

Preferir variants semânticas.

Exemplo:

```tsx
<Button variant="primary" />
<Button variant="secondary" />
```

Evitar:

```tsx
<Button style={{ background: '#FF774A' }} />
```

O componente deve consumir tokens.

---

# 61. Hardcoded Values

Não utilizar:

```tsx
style={{
  color: '#FF774A',
  borderRadius: 8,
}}
```

quando o valor fizer parte do Design System.

Preferir tokens do tema.

Valores locais são aceitáveis apenas quando são específicos do layout e não representam um token global.

---

# 62. Theme Structure

Estrutura recomendada:

```text
src/
└── theme/
    ├── index.ts
    └── tokens.ts   (re-exporta color/spacing/typography/border de @loft/tokens-loft)
```

Não há arquivo de configuração "por componente" (não existe `ConfigProvider`) — cada componente já aplica os tokens Copan internamente via suas próprias props.

---

# 63. Component Tokens

O Copan não tem um objeto de "tokens por componente" configurável globalmente — cada componente já vem estilado com os tokens corretos (altura de controle, radius, cor de header de tabela etc.) sem necessidade de override. Quando uma variação real for necessária, usar as props do próprio componente (`spacing` em `Table`, `variant`/`modifier` em `Button`/`Tag`) antes de recorrer a CSS customizado.

---

# 64. Dark Mode

Dark mode pode ser implementado quando houver requisito de produto.

Não criar um segundo conjunto arbitrário de cores.

Utilizar semantic tokens:

```text
background.page
background.secondary
text.primary
text.secondary
border.default
```

e mapear os valores para o tema correspondente.

O código dos componentes não deve depender diretamente de hexadecimais.

---

# 65. Internationalization

Quando i18n for necessário:

```text
pt-BR
en-US
es
```

Strings de UI devem ser externalizadas.

Exemplo:

```text
users.create
users.delete
users.empty
users.error
```

---

# 66. Data Visualization

Dashboards devem manter consistência visual.

Gráficos devem:

- utilizar paleta controlada;
- possuir legendas;
- utilizar unidades;
- evitar excesso de cores;
- destacar apenas informações relevantes.

A cor deve possuir significado consistente.

---

# 67. Status

Status devem utilizar componentes semânticos.

Exemplo:

```text
Ativo      → success
Pendente   → warning
Erro       → error
Informativo → info
```

Utilizar:

```text
Tag              (estado pontual, ex.: linha de tabela)
FeedbackBanner    (aviso persistente de seção)
StatusLight       (indicador compacto, dot + texto)
```

conforme o contexto. Não existe `Badge` dedicado no Copan — compor com `Tag` quando necessário.

---

# 68. Dashboard

Dashboards devem seguir hierarquia:

```text
Page Header
     ↓
KPIs
     ↓
Principais indicadores
     ↓
Detalhamento
     ↓
Dados operacionais
```

Evitar dashboard composto apenas por cards.

---

# 69. Filters

Filtros devem ser claramente separados do conteúdo.

Exemplo:

```text
Filtros

[ Status ] [ Período ] [ Responsável ]

[ Aplicar ] [ Limpar ]
```

Filtros complexos podem utilizar Drawer.

---

# 70. Search

Busca deve possuir:

- placeholder claro;
- debounce quando necessário;
- estado de loading;
- empty state;
- possibilidade de limpar.

Preferir:

```text
Buscar usuário...
```

a:

```text
Digite aqui...
```

---

# 71. Pagination

Paginação deve indicar:

- página atual;
- total;
- tamanho da página quando aplicável.

Para grandes volumes, preferir paginação server-side.

---

# 72. Date & Time

Datas devem ser apresentadas de forma consistente.

Exemplo:

```text
25/08/2026
```

Data e hora:

```text
25/08/2026 às 14:32
```

A aplicação deve possuir timezone definido.

---

# 73. File Upload

Upload deve informar:

```text
Tipos permitidos
Tamanho máximo
Progresso
Sucesso
Erro
```

Não depender apenas do backend para informar ao usuário que um arquivo é inválido.

---

# 74. Responsive Tables

Quando uma tabela não couber:

Prioridade:

```text
1. Reduzir colunas secundárias
2. Ocultar informações não essenciais
3. Horizontal scroll
4. Layout alternativo para mobile
```

Não reduzir texto a ponto de prejudicar legibilidade.

---

# 75. Accessibility Checklist

Antes de finalizar uma tela:

- [ ] Todos os campos possuem labels
- [ ] Foco é visível
- [ ] Navegação por teclado funciona
- [ ] Ícones isolados possuem descrição
- [ ] Contraste AA
- [ ] Erros possuem mensagem textual
- [ ] Não depende somente de cor
- [ ] Modal possui foco adequado
- [ ] Elementos interativos possuem área adequada
- [ ] Respeita reduced motion

---

# 76. Visual Quality Checklist

Antes de finalizar:

- [ ] Inter aplicada
- [ ] Grid de 8px respeitado
- [ ] Radius padrão utilizado
- [ ] Tokens utilizados
- [ ] Primary Orange utilizado corretamente
- [ ] Premium Gold utilizado somente em contexto premium
- [ ] Hierarquia tipográfica clara
- [ ] Espaçamento consistente
- [ ] Sem excesso de sombras
- [ ] Sem cores arbitrárias
- [ ] Ícones consistentes
- [ ] Estados completos
- [ ] Responsividade validada

---

# 77. AI Generation Rules

Ao utilizar Cursor, Lovable, Figma Make ou outra ferramenta de IA:

> Este projeto utiliza o Loft Design System como fonte oficial de identidade visual.

> Utilize Copan (`@loft/react-loft`) como biblioteca de componentes — é dependência real e mandatória, não uma referência visual a copiar.

> Utilize `@loft/react-icons` para ícones e `@loft/tokens-loft` para tokens de cor/espaçamento/tipografia.

> Os pacotes `@loft/*` são privados — requerem `NPM_TOKEN` configurado no `.npmrc`; isso é esperado em qualquer aplicação padrão Loft.

> Não invente novos padrões visuais quando existir um componente equivalente no Copan.

> Utilize os tokens definidos neste documento (agora espelhando `@loft/tokens-loft` real).

> Não utilizar cores hardcoded fora dos tokens.

> Não criar gradientes ou efeitos visuais sem requisito explícito.

> Não criar uma nova biblioteca visual (Ant Design, MUI, Chakra, Bootstrap, styled-components).

> Não substituir Copan por outra biblioteca visual.

> Todo componente deve possuir estados relevantes.

> Toda interface deve considerar loading, empty, error e disabled quando aplicável.

> Todos os formulários devem possuir labels, validação e mensagens de erro.

> Priorize composição de componentes existentes.

> Componentes customizados devem utilizar tokens e componentes do Design System.

> Acessibilidade é obrigatória.

> O resultado deve parecer parte do mesmo produto, mesmo quando desenvolvido por equipes ou ferramentas diferentes.

---

# 78. Relationship With Frontend Foundation

Os dois documentos são complementares.

```text
LOFT FRONTEND FOUNDATION
        │
        ├── React
        ├── TypeScript
        ├── Vite
        ├── TanStack Router
        ├── TanStack Query
        ├── Zustand
        ├── React Hook Form
        ├── Zod
        ├── Testing
        └── Architecture
                 │
                 ▼
        LOFT DESIGN SYSTEM
                 │
                 ├── Tokens
                 ├── Typography
                 ├── Colors
                 ├── Spacing
                 ├── Components
                 ├── Layout
                 ├── Accessibility
                 └── Interaction
```

---

# 79. Source of Truth

A prioridade das decisões visuais deve ser:

```text
1. Loft Design System
2. Copan (@loft/react-loft)
3. Requisitos específicos do produto
4. Customização local
```

Nunca:

```text
Preferência individual
        ↓
Novo componente
        ↓
Novo padrão
```

---

# 80. Regra de Exceção

Uma exceção ao Design System pode existir quando houver:

- requisito de negócio;
- requisito de acessibilidade;
- limitação técnica;
- necessidade de domínio;
- requisito regulatório.

A exceção deve ser:

```text
explícita
documentada
isolada
reutilizável quando aplicável
```

Evitar exceções visuais locais que criem inconsistência sistêmica.

---

# 81. Definition of Done — UI

Uma interface está pronta quando:

```text
Visual
 ├── Tokens aplicados
 ├── Tipografia correta
 ├── Espaçamento consistente
 └── Hierarquia clara

Componentes
 ├── Copan (@loft/react-loft) utilizado
 ├── Variants corretas
 └── Estados completos

Interação
 ├── Loading
 ├── Success
 ├── Empty
 ├── Error
 └── Disabled

Acessibilidade
 ├── Keyboard
 ├── Focus
 ├── Contrast
 └── Labels

Responsividade
 ├── Desktop
 ├── Tablet
 └── Mobile quando aplicável
```

---

# 82. Princípio Final

O Loft Design System não deve tentar ser um framework proprietário paralelo ao Copan.

Ele deve funcionar como uma **camada de convenções sobre o Copan real**, não uma referência visual copiada sobre outra biblioteca.

A regra central é:

```text
COPAN (@loft/react-loft + @loft/tokens-loft)
    +
LOFT CONVENTIONS
    =
LOFT UI
```

O objetivo não é fazer cada aplicação parecer diferente de acordo com o desenvolvedor.

O objetivo é permitir que diferentes equipes, produtos e ferramentas produzam interfaces que pareçam pertencer ao mesmo ecossistema.

---

# 83. Resumo

### Foundation

```text
React
TypeScript
Vite
TanStack
React Hook Form
Zod
Zustand
Vitest
Playwright
```

### Design

```text
@loft/react-loft (Copan)
@loft/react-icons
@loft/tokens-loft
Inter
Loft UI Patterns
```

### Resultado

```text
                    LOFT
                      │
          ┌───────────┴───────────┐
          │                       │
      FOUNDATION              DESIGN SYSTEM
          │                       │
      Arquitetura               Visual
      Estado                    Tokens
      API                       Componentes
      Testes                    UX
      Segurança                 A11y
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
               LOFT FRONTEND
```

**Este documento é a referência oficial para identidade visual e comportamento de interface das aplicações frontend padrão Loft.**